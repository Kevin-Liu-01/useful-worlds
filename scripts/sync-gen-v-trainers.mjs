import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const API = "https://archives.bulbagarden.net/w/api.php";
const BATTLE_CATEGORY = "Category:Generation V Trainer sprites";
const OVERWORLD_CATEGORY = "Category:Overworld Trainer sprites";
const EXTRA_OVERWORLD_FILES = ["Benga OD.png", "Shadow Triad OD.png"];
const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src/data/genVTrainerRoster.json");
const USER_AGENT =
  "PortfolioMon-Showdown asset sync (non-commercial portfolio; source attribution in repository)";

const LEGACY_IDS = new Map(
  [
    "Hilbert",
    "Hilda",
    "Cheren",
    "Bianca",
    "N",
    "Ghetsis",
    "Elesa",
    "Cynthia",
  ].map((name) => [`Spr B2W2 ${name}.png`, name.toLowerCase()])
);

const PREFERRED_ORDER = [
  "hilbert",
  "hilda",
  "cheren",
  "bianca",
  "n",
  "ghetsis",
  "elesa",
  "cynthia",
];

const ACCENTS = [
  "#41d9ff",
  "#ff4f9a",
  "#d8ff36",
  "#a855f7",
  "#fb923c",
  "#60a5fa",
  "#34d399",
  "#facc15",
];

const OVERWORLD_ALIASES = new Map(
  Object.entries({
    "backers f": "backer f",
    "backers m": "backer m",
    "clerk m a": "clerk m",
    "clerk m b": "clerk m",
    ghetsis: "ghetsiswalkdown",
    "lass beta": "lass",
    "plasma grunt f": "team plasma f",
    "plasma grunt m": "team plasma m",
    rood: "roodwalkdown",
    twins: "twin",
    "brycen man": "brycen",
  })
);

const normalize = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/♀/g, " f ")
    .replace(/♂/g, " m ")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();

const slugify = (value) => normalize(value).replace(/\s+/g, "-");

const requestJson = async (params) => {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    ...params,
  });
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok)
    throw new Error(`${response.status} while requesting ${url}`);
  return response.json();
};

const getCategoryMembers = async (category) => {
  const members = [];
  let continuation = {};
  do {
    const response = await requestJson({
      list: "categorymembers",
      cmtitle: category,
      cmnamespace: "6",
      cmlimit: "max",
      ...continuation,
    });
    members.push(...response.query.categorymembers);
    continuation = response.continue ?? null;
  } while (continuation);
  return members;
};

const chunks = (values, size) => {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
};

const getImageInfo = async (members) => {
  const byPageId = new Map();
  for (const batch of chunks(members, 50)) {
    const response = await requestJson({
      pageids: batch.map((member) => member.pageid).join("|"),
      prop: "imageinfo",
      iiprop: "url|size|mime",
    });
    Object.values(response.query.pages).forEach((page) => {
      const image = page.imageinfo?.[0];
      if (image) byPageId.set(page.pageid, image);
    });
  }
  return byPageId;
};

const getFilesByTitle = async (fileNames) => {
  const response = await requestJson({
    titles: fileNames.map((fileName) => `File:${fileName}`).join("|"),
  });
  return Object.values(response.query.pages).filter((page) => !page.missing);
};

const battleMetadata = (fileName) => {
  const back = / Back\.png$/i.test(fileName);
  const gameCode = /^(?:Spr )?B2W2 /.test(fileName) ? "B2W2" : "BW";
  const game = gameCode === "B2W2" ? "Black 2 / White 2" : "Black / White";
  const name = fileName
    .replace(/\.png$/i, "")
    .replace(/^Spr B2W2 /, "")
    .replace(/^Spr BW /, "")
    .replace(/^B2W2 /, "")
    .replace(/^BW /, "")
    .replace(/ Back$/i, "");
  const matchName = name.replace(/ 2$/i, "");
  return { back, gameCode, game, name, matchName };
};

const overworldBase = (fileName) =>
  fileName
    .replace(/\.png$/i, "")
    .replace(/ (?:II|III|IV|V|VI|VII|HGSS|SM|XY|OR|BW|B2W2|Snow) OD$/i, "")
    .replace(/ OD$/i, "");

const chooseOverworld = (battle, overworldMembers) => {
  const normalizedName = normalize(battle.matchName);
  const target = OVERWORLD_ALIASES.get(normalizedName) ?? normalizedName;
  const matches = overworldMembers.filter((member) => {
    const fileName = member.title.replace(/^File:/, "");
    return normalize(overworldBase(fileName)) === target;
  });
  const score = (member) => {
    const fileName = member.title.replace(/^File:/, "");
    if (battle.gameCode === "BW" && / BW OD\.png$/i.test(fileName)) return 120;
    if (/ V OD\.png$/i.test(fileName)) return 100;
    if (
      / OD\.png$/i.test(fileName) &&
      !/ (?:II|III|IV|VI|VII|HGSS|SM|XY|OR) OD/i.test(fileName)
    )
      return 90;
    return 10;
  };
  return matches.sort((a, b) => score(b) - score(a))[0] ?? null;
};

const colorFor = (value) => {
  let hash = 0;
  for (const character of value)
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return ACCENTS[hash % ACCENTS.length];
};

const sourcePage = (fileName) =>
  `https://archives.bulbagarden.net/wiki/File:${encodeURIComponent(
    fileName
  ).replaceAll("%20", "_")}`;

const fileExists = async (filePath) => {
  try {
    return (await stat(filePath)).size > 0;
  } catch {
    return false;
  }
};

const download = async ({ url, destination }) => {
  if (await fileExists(destination)) return;
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok)
    throw new Error(`${response.status} while downloading ${url}`);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
};

const runPool = async (jobs, concurrency = 8) => {
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      await download(job);
    }
  });
  await Promise.all(workers);
};

const battleMembers = await getCategoryMembers(BATTLE_CATEGORY);
const overworldMembers = [
  ...(await getCategoryMembers(OVERWORLD_CATEGORY)),
  ...(await getFilesByTitle(EXTRA_OVERWORLD_FILES)),
];
const battleInfo = await getImageInfo(battleMembers);
const selectedOverworld = new Map();

const preliminary = battleMembers.map((member) => {
  const fileName = member.title.replace(/^File:/, "");
  const metadata = battleMetadata(fileName);
  const overworld = chooseOverworld(metadata, overworldMembers);
  if (overworld) selectedOverworld.set(overworld.pageid, overworld);
  return { member, fileName, metadata, overworld };
});

const overworldInfo = await getImageInfo([...selectedOverworld.values()]);
const ids = new Set();
const downloads = [];

const roster = preliminary.map(({ member, fileName, metadata, overworld }) => {
  const defaultId = `${metadata.gameCode.toLowerCase()}-${
    metadata.back ? "back-" : ""
  }${slugify(metadata.name)}`;
  const id = LEGACY_IDS.get(fileName) ?? defaultId;
  if (ids.has(id)) throw new Error(`Duplicate trainer id: ${id}`);
  ids.add(id);

  const image = battleInfo.get(member.pageid);
  if (!image) throw new Error(`Missing image information for ${fileName}`);
  const battleRelative = `images/trainers/gen-v/battle/${id}.png`;
  downloads.push({
    url: image.url,
    destination: path.join(ROOT, "public", battleRelative),
  });

  let chibiRelative = battleRelative;
  let chibiSourceFile = null;
  if (overworld) {
    const chibiFileName = overworld.title.replace(/^File:/, "");
    const chibiImage = overworldInfo.get(overworld.pageid);
    if (!chibiImage)
      throw new Error(`Missing image information for ${chibiFileName}`);
    chibiRelative = `images/trainers/gen-v/chibi/${slugify(
      chibiFileName.replace(/\.png$/i, "")
    )}.png`;
    chibiSourceFile = chibiFileName;
    downloads.push({
      url: chibiImage.url,
      destination: path.join(ROOT, "public", chibiRelative),
    });
  }

  return {
    id,
    name: metadata.back ? `${metadata.name} (Back)` : metadata.name,
    title: `${metadata.game} ${metadata.back ? "back pose" : "trainer"}`,
    description: `Original ${metadata.game} ${
      metadata.back ? "back-pose" : "battle"
    } sprite from the complete Generation V trainer archive.`,
    accent: colorFor(id),
    battleSprite: `/${battleRelative}`,
    chibiSprite: `/${chibiRelative}`,
    hasChibi: Boolean(overworld),
    game: metadata.game,
    gameCode: metadata.gameCode,
    view: metadata.back ? "back" : "front",
    source: "Bulbagarden Generation V Trainer sprites",
    sourceFile: fileName,
    sourceUrl: sourcePage(fileName),
    chibiSourceFile,
  };
});

roster.sort((a, b) => {
  const aPreferred = PREFERRED_ORDER.indexOf(a.id);
  const bPreferred = PREFERRED_ORDER.indexOf(b.id);
  if (aPreferred >= 0 || bPreferred >= 0) {
    if (aPreferred < 0) return 1;
    if (bPreferred < 0) return -1;
    return aPreferred - bPreferred;
  }
  return a.name.localeCompare(b.name) || a.gameCode.localeCompare(b.gameCode);
});

const uniqueDownloads = [
  ...new Map(downloads.map((job) => [job.destination, job])).values(),
];
await mkdir(path.dirname(DATA_PATH), { recursive: true });
await runPool(uniqueDownloads);
await writeFile(DATA_PATH, `${JSON.stringify(roster, null, 2)}\n`);

const chibiCount = roster.filter((trainer) => trainer.hasChibi).length;
console.log(
  `Synced ${roster.length} Generation V trainer files and ${chibiCount} overworld matches (${uniqueDownloads.length} local assets).`
);
