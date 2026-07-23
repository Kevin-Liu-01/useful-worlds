import trainerRosterData from "../../data/genVTrainerRoster.json";

export type TrainerPose = "idle" | "commanding" | "win" | "lose";
export type TrainerRenderMode = "battle" | "chibi";
export type TrainerId = string;
export type TrainerGameCode = "BW" | "B2W2";
export type TrainerView = "front" | "back";

export type ArenaTrainer = {
  id: TrainerId;
  name: string;
  title: string;
  description: string;
  accent: string;
  battleSprite: string;
  chibiSprite: string;
  hasChibi: boolean;
  game: "Black / White" | "Black 2 / White 2";
  gameCode: TrainerGameCode;
  view: TrainerView;
  source: "Bulbagarden Generation V Trainer sprites";
  sourceFile: string;
  sourceUrl: string;
  chibiSourceFile: string | null;
};

const FEATURED_OVERRIDES: Partial<
  Record<TrainerId, Pick<ArenaTrainer, "title" | "description">>
> = {
  hilbert: {
    title: "Unova trainer",
    description:
      "A direct, balanced trainer built for adaptable project teams.",
  },
  hilda: {
    title: "Unova trainer",
    description:
      "Fast, confident, and happiest when priority decides the turn.",
  },
  cheren: {
    title: "Rival strategist",
    description:
      "A disciplined tactician who reads speed and defensive stages.",
  },
  bianca: {
    title: "Research aide",
    description: "An expressive trainer who favors recovery and smart pivots.",
  },
  n: {
    title: "Plasma king",
    description:
      "An unpredictable rival who turns matchup pressure into tempo.",
  },
  ghetsis: {
    title: "Plasma sage",
    description: "A punishing opponent who leans into status and finishers.",
  },
  elesa: {
    title: "Nimbasa leader",
    description: "A high-tempo specialist with a taste for clean switches.",
  },
  cynthia: {
    title: "Sinnoh champion",
    description:
      "A composed champion who punishes weak matchups and repetition.",
  },
};

export const TRAINER_ROSTER = (trainerRosterData as ArenaTrainer[]).map(
  (trainer) => ({ ...trainer, ...FEATURED_OVERRIDES[trainer.id] })
);

const FALLBACK_TRAINER: ArenaTrainer = {
  id: "hilbert",
  name: "Hilbert",
  title: "Unova trainer",
  description: "A balanced Generation V trainer.",
  accent: "#41d9ff",
  battleSprite: "/images/trainers/gen-v/battle/hilbert.png",
  chibiSprite: "/images/trainers/gen-v/chibi/hilbert-od.png",
  hasChibi: true,
  game: "Black 2 / White 2",
  gameCode: "B2W2",
  view: "front",
  source: "Bulbagarden Generation V Trainer sprites",
  sourceFile: "Spr B2W2 Hilbert.png",
  sourceUrl: "https://archives.bulbagarden.net/wiki/File:Spr_B2W2_Hilbert.png",
  chibiSourceFile: "Hilbert OD.png",
};

export const getTrainer = (id: TrainerId) =>
  TRAINER_ROSTER.find((trainer) => trainer.id === id) ??
  TRAINER_ROSTER[0] ??
  FALLBACK_TRAINER;

export const getTrainerSpriteSrc = (id: TrainerId, mode: TrainerRenderMode) => {
  const trainer = getTrainer(id);
  return mode === "chibi" && trainer.hasChibi
    ? trainer.chibiSprite
    : trainer.battleSprite;
};
