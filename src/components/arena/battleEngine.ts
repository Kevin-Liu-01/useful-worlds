import {
  type BattleReadyMove,
  type Move,
  type PortfolioMon,
  type SelfEffectType,
  type StatModifiers,
  type StatusEffect,
  type StatusEffectType,
  typeChart,
} from "../../context/gameContext";

export type ArenaFighter = {
  mon: PortfolioMon;
  currentHp: number;
  status: StatusEffect;
  statusTurns: number;
  modifiers: StatModifiers;
  moves: BattleReadyMove[];
  barrier: number;
  critBoost: number;
};

export type ArenaSide = {
  team: ArenaFighter[];
  activeIndex: number;
};

export type ArenaAction =
  | { kind: "move"; moveIndex: number }
  | { kind: "switch"; fighterIndex: number };

export type MoveResolution = {
  attacker: ArenaFighter;
  defender: ArenaFighter;
  move: BattleReadyMove;
  damage: number;
  healing: number;
  recoil: number;
  critical: boolean;
  hitCount: number;
  stab: boolean;
  barrierAbsorbed: number;
  executed: boolean;
  missed: boolean;
  skipped: boolean;
  effectiveness: number;
  inflictedStatus: StatusEffectType | null;
  selfEffect: SelfEffectType | null;
  notes: string[];
};

export type AiMemory = {
  lastMoveName?: string;
  repeatedMoveCount: number;
  observedPlayerTypes: string[];
};

export type BattleItemId =
  | "patch-kit"
  | "full-restore"
  | "focus-lens"
  | "null-shield"
  | "rollback";

export type BattleItem = {
  id: BattleItemId;
  name: string;
  short: string;
  description: string;
  target: "active" | "fainted";
  accent: string;
};

export type BattleInventory = Record<BattleItemId, number>;

export const BATTLE_ITEMS: BattleItem[] = [
  {
    id: "patch-kit",
    name: "Patch Kit",
    short: "+90 HP",
    description: "Restores 90 HP to the active build.",
    target: "active",
    accent: "#d8ff36",
  },
  {
    id: "full-restore",
    name: "Full Restore",
    short: "Cure +45",
    description: "Clears status and restores 45 HP to the active build.",
    target: "active",
    accent: "#41d9ff",
  },
  {
    id: "focus-lens",
    name: "Focus Lens",
    short: "+35% crit",
    description: "Adds 35% critical chance to the next damaging move.",
    target: "active",
    accent: "#c084fc",
  },
  {
    id: "null-shield",
    name: "Null Shield",
    short: "50% guard",
    description: "Cuts the next incoming damaging move in half.",
    target: "active",
    accent: "#60a5fa",
  },
  {
    id: "rollback",
    name: "Rollback",
    short: "45% revive",
    description: "Restores the first offline reserve with 45% HP.",
    target: "fainted",
    accent: "#fb7185",
  },
];

export const createBattleInventory = (): BattleInventory => ({
  "patch-kit": 2,
  "full-restore": 1,
  "focus-lens": 1,
  "null-shield": 1,
  rollback: 1,
});

const clampStage = (value: number) => Math.max(-3, Math.min(3, value));

const stageMultiplier = (stage: number) => {
  const value = clampStage(stage);
  return value >= 0 ? (2 + value) / 2 : 2 / (2 - value);
};

const cloneFighter = (fighter: ArenaFighter): ArenaFighter => ({
  ...fighter,
  mon: fighter.mon,
  modifiers: { ...fighter.modifiers },
  moves: fighter.moves.map((move) => ({ ...move })),
});

export const createArenaFighter = (mon: PortfolioMon): ArenaFighter => ({
  mon,
  currentHp: mon.hp,
  status: null,
  statusTurns: 0,
  modifiers: { atk: 0, def: 0, spd: 0 },
  moves: mon.moves.map((move) => ({ ...move, currentPp: move.pp })),
  barrier: 0,
  critBoost: 0,
});

export const createArenaSide = (mons: PortfolioMon[]): ArenaSide => ({
  team: mons.map(createArenaFighter),
  activeIndex: 0,
});

export const cloneSide = (side: ArenaSide): ArenaSide => ({
  activeIndex: side.activeIndex,
  team: side.team.map(cloneFighter),
});

export const getEffectiveness = (moveType: string, defender: PortfolioMon) => {
  const chart = typeChart[moveType];
  if (!chart) return 1;
  const first = chart[defender.type1] ?? 1;
  const second = defender.type2 ? chart[defender.type2] ?? 1 : 1;
  return first * second;
};

export const effectiveSpeed = (fighter: ArenaFighter) =>
  fighter.mon.stats.spd * stageMultiplier(fighter.modifiers.spd);

export const estimateDamage = (
  attacker: ArenaFighter,
  defender: ArenaFighter,
  move: Move,
  critical = false
) => {
  if (move.power <= 0) return 0;
  const attackStage =
    critical && attacker.modifiers.atk < 0 ? 0 : attacker.modifiers.atk;
  const rawDefenseStage =
    critical && defender.modifiers.def > 0 ? 0 : defender.modifiers.def;
  const defenseStage =
    rawDefenseStage > 0
      ? rawDefenseStage * (1 - (move.piercing ?? 0))
      : rawDefenseStage;
  const attack =
    attacker.mon.stats.atk *
    stageMultiplier(attackStage) *
    (attacker.status === "burn" ? 0.82 : 1);
  const defense = defender.mon.stats.def * stageMultiplier(defenseStage);
  const effectiveness = getEffectiveness(move.type, defender.mon);
  const stab =
    move.type === attacker.mon.type1 || move.type === attacker.mon.type2
      ? 1.2
      : 1;
  const execute =
    move.executeThreshold &&
    defender.currentHp / defender.mon.hp <= move.executeThreshold
      ? 1.3
      : 1;
  const expectedHits = move.hits ? (move.hits.min + move.hits.max) / 2 : 1;
  return Math.max(
    4,
    Math.round(
      move.power *
        expectedHits *
        (attack / Math.max(1, defense)) *
        0.58 *
        effectiveness *
        stab *
        execute
    )
  );
};

const applySelfEffect = (
  attacker: ArenaFighter,
  effect: NonNullable<Move["selfEffect"]>,
  damage: number
) => {
  let healing = 0;
  let recoil = 0;

  if (effect.type === "atkUp") {
    attacker.modifiers.atk = clampStage(attacker.modifiers.atk + effect.amount);
  } else if (effect.type === "defUp") {
    attacker.modifiers.def = clampStage(attacker.modifiers.def + effect.amount);
  } else if (effect.type === "spdUp") {
    attacker.modifiers.spd = clampStage(attacker.modifiers.spd + effect.amount);
  } else if (effect.type === "critUp") {
    attacker.critBoost = Math.max(attacker.critBoost, effect.amount);
  } else if (effect.type === "barrier") {
    attacker.barrier = Math.max(attacker.barrier, effect.amount);
  } else if (effect.type === "heal") {
    healing = Math.max(
      0,
      Math.min(effect.amount, attacker.mon.hp - attacker.currentHp)
    );
    attacker.currentHp += healing;
  } else if (effect.type === "drain") {
    healing = Math.max(
      0,
      Math.min(
        Math.round(damage * effect.amount),
        attacker.mon.hp - attacker.currentHp
      )
    );
    attacker.currentHp += healing;
  } else if (effect.type === "recoil") {
    recoil = Math.min(
      attacker.currentHp,
      Math.max(1, Math.round(damage * effect.amount))
    );
    attacker.currentHp -= recoil;
  }

  return { healing, recoil };
};

export const resolveMove = (
  source: ArenaFighter,
  target: ArenaFighter,
  moveIndex: number,
  random: () => number = Math.random
): MoveResolution => {
  const attacker = cloneFighter(source);
  const defender = cloneFighter(target);
  const selected = attacker.moves[moveIndex] ?? attacker.moves[0];

  if (!selected) {
    throw new Error(`${attacker.mon.name} has no usable moves.`);
  }

  const move = { ...selected };
  const notes: string[] = [];
  let skipped = false;

  if (attacker.status === "sleep") {
    attacker.statusTurns = Math.max(0, attacker.statusTurns - 1);
    if (attacker.statusTurns === 0) {
      attacker.status = null;
      notes.push(`${attacker.mon.name} woke up.`);
    } else {
      skipped = true;
      notes.push(`${attacker.mon.name} is still in sleep mode.`);
    }
  } else if (attacker.status === "stun" && random() < 0.38) {
    skipped = true;
    notes.push(`${attacker.mon.name}'s process stalled.`);
  }

  if (skipped) {
    return {
      attacker,
      defender,
      move,
      damage: 0,
      healing: 0,
      recoil: 0,
      critical: false,
      hitCount: 0,
      stab: false,
      barrierAbsorbed: 0,
      executed: false,
      missed: false,
      skipped: true,
      effectiveness: 1,
      inflictedStatus: null,
      selfEffect: null,
      notes,
    };
  }

  const moveSlot = attacker.moves[moveIndex] ?? attacker.moves[0]!;
  moveSlot.currentPp = Math.max(0, moveSlot.currentPp - 1);

  const missed = random() > move.accuracy;
  if (missed) {
    notes.push(`${move.name} lost its target.`);
    return {
      attacker,
      defender,
      move,
      damage: 0,
      healing: 0,
      recoil: 0,
      critical: false,
      hitCount: 0,
      stab: false,
      barrierAbsorbed: 0,
      executed: false,
      missed: true,
      skipped: false,
      effectiveness: getEffectiveness(move.type, defender.mon),
      inflictedStatus: null,
      selfEffect: null,
      notes,
    };
  }

  const effectiveness = getEffectiveness(move.type, defender.mon);
  const critical =
    move.power > 0 &&
    random() < Math.min(0.8, (move.critChance ?? 0.08) + attacker.critBoost);
  if (move.power > 0) attacker.critBoost = 0;
  const hitCount = move.hits
    ? move.hits.min + Math.floor(random() * (move.hits.max - move.hits.min + 1))
    : 1;
  const stab =
    move.type === attacker.mon.type1 || move.type === attacker.mon.type2;
  const executed = Boolean(
    move.executeThreshold &&
      defender.currentHp / defender.mon.hp <= move.executeThreshold
  );
  const variance = 0.92 + random() * 0.16;
  const averageHits = move.hits ? (move.hits.min + move.hits.max) / 2 : 1;
  let damage = estimateDamage(attacker, defender, move, critical);
  damage = Math.round(
    damage * (hitCount / averageHits) * variance * (critical ? 1.5 : 1)
  );
  const barrierAbsorbed = Math.min(
    damage,
    Math.round(damage * defender.barrier)
  );
  damage -= barrierAbsorbed;
  if (move.power > 0 && defender.barrier > 0) defender.barrier = 0;
  damage = Math.min(defender.currentHp, damage);
  defender.currentHp -= damage;

  if (critical) notes.push("Critical execution path.");
  if (stab) notes.push("Native-type signal amplified the attack.");
  if (hitCount > 1) notes.push(`${hitCount} packets connected.`);
  if (barrierAbsorbed > 0)
    notes.push(`Null Shield absorbed ${barrierAbsorbed} damage.`);
  if (executed) notes.push("Finisher threshold activated.");
  if (move.piercing) notes.push("Armor-piercing command bypassed defense.");
  if (effectiveness > 1) notes.push("Super effective architecture.");
  if (effectiveness < 1) notes.push("The target resisted the pattern.");

  let inflictedStatus: StatusEffectType | null = null;
  if (
    move.effect &&
    defender.currentHp > 0 &&
    !defender.status &&
    random() < move.effect.chance
  ) {
    inflictedStatus = move.effect.type;
    defender.status = move.effect.type;
    defender.statusTurns = move.effect.type === "sleep" ? 2 : 3;
    notes.push(`${defender.mon.name} received ${move.effect.type}.`);
  }

  let healing = 0;
  let recoil = 0;
  let selfEffect: SelfEffectType | null = null;
  if (move.selfEffect && random() < move.selfEffect.chance) {
    selfEffect = move.selfEffect.type;
    const applied = applySelfEffect(attacker, move.selfEffect, damage);
    healing = applied.healing;
    recoil = applied.recoil;
  }

  return {
    attacker,
    defender,
    move,
    damage,
    healing,
    recoil,
    critical,
    hitCount,
    stab,
    barrierAbsorbed,
    executed,
    missed: false,
    skipped: false,
    effectiveness,
    inflictedStatus,
    selfEffect,
    notes,
  };
};

export const applyBattleItem = (source: ArenaSide, itemId: BattleItemId) => {
  const side = cloneSide(source);
  const active = side.team[side.activeIndex]!;
  let target = active;
  let detail = "";
  let success = true;

  if (itemId === "patch-kit") {
    const restored = Math.min(90, active.mon.hp - active.currentHp);
    if (active.currentHp <= 0 || restored <= 0) success = false;
    else {
      active.currentHp += restored;
      detail = `${active.mon.name} restored ${restored} HP.`;
    }
  } else if (itemId === "full-restore") {
    const restored = Math.min(45, active.mon.hp - active.currentHp);
    const cured = active.status;
    if (active.currentHp <= 0 || (!cured && restored <= 0)) success = false;
    else {
      active.currentHp += restored;
      active.status = null;
      active.statusTurns = 0;
      detail = `${active.mon.name} restored ${restored} HP${
        cured ? ` and cleared ${cured}` : ""
      }.`;
    }
  } else if (itemId === "focus-lens") {
    active.critBoost = Math.max(active.critBoost, 0.35);
    detail = `${active.mon.name} focused its next critical path.`;
  } else if (itemId === "null-shield") {
    active.barrier = Math.max(active.barrier, 0.5);
    detail = `${active.mon.name} deployed a 50% damage barrier.`;
  } else {
    const faintedIndex = side.team.findIndex(
      (fighter) => fighter.currentHp <= 0
    );
    if (faintedIndex < 0) success = false;
    else {
      target = side.team[faintedIndex]!;
      target.currentHp = Math.max(1, Math.round(target.mon.hp * 0.45));
      target.status = null;
      target.statusTurns = 0;
      detail = `${target.mon.name} rolled back online at ${target.currentHp} HP.`;
    }
  }

  return { side, success, detail, target };
};

export const applyStatusTick = (source: ArenaFighter) => {
  const fighter = cloneFighter(source);
  let damage = 0;

  if (fighter.status === "burn") {
    damage = Math.max(1, Math.round(fighter.mon.hp * 0.06));
  } else if (fighter.status === "poison") {
    damage = Math.max(1, Math.round(fighter.mon.hp * 0.085));
  }

  damage = Math.min(fighter.currentHp, damage);
  fighter.currentHp -= damage;
  if (fighter.status && fighter.status !== "sleep") {
    fighter.statusTurns = Math.max(0, fighter.statusTurns - 1);
    if (fighter.statusTurns === 0) fighter.status = null;
  }

  return { fighter, damage };
};

const defensiveMatchupScore = (
  candidate: ArenaFighter,
  opponent: ArenaFighter
) => {
  const likelyTypes = [opponent.mon.type1, opponent.mon.type2].filter(
    (type): type is string => Boolean(type)
  );
  const pressure = likelyTypes.reduce(
    (sum, type) => sum + getEffectiveness(type, candidate.mon),
    0
  );
  const health = candidate.currentHp / candidate.mon.hp;
  const speed = candidate.mon.stats.spd / 160;
  return health * 1.5 + speed - pressure * 0.45;
};

export const chooseReplacement = (side: ArenaSide, opponent: ArenaFighter) => {
  const options = side.team
    .map((fighter, index) => ({ fighter, index }))
    .filter(
      ({ fighter, index }) =>
        fighter.currentHp > 0 && index !== side.activeIndex
    )
    .sort(
      (a, b) =>
        defensiveMatchupScore(b.fighter, opponent) -
        defensiveMatchupScore(a.fighter, opponent)
    );
  return options[0]?.index ?? -1;
};

export const chooseAiAction = (
  ai: ArenaSide,
  player: ArenaSide,
  memory: AiMemory,
  random: () => number = Math.random
): ArenaAction => {
  const active = ai.team[ai.activeIndex]!;
  const opponent = player.team[player.activeIndex]!;
  const replacement = chooseReplacement(ai, opponent);
  const currentMatchup = defensiveMatchupScore(active, opponent);

  if (
    replacement >= 0 &&
    (active.currentHp / active.mon.hp < 0.22 ||
      (currentMatchup < -0.25 && random() < 0.42))
  ) {
    return { kind: "switch", fighterIndex: replacement };
  }

  const usable = active.moves
    .map((move, index) => ({ move, index }))
    .filter(({ move }) => move.currentPp > 0);

  if (usable.length === 0 && replacement >= 0) {
    return { kind: "switch", fighterIndex: replacement };
  }

  const scored = usable.map(({ move, index }) => {
    const damage = estimateDamage(active, opponent, move);
    const effectiveness = getEffectiveness(move.type, opponent.mon);
    const finishing = damage >= opponent.currentHp ? 90 : 0;
    const statusValue =
      move.effect && !opponent.status ? move.effect.chance * 42 : 0;
    const buffValue = move.selfEffect
      ? move.selfEffect.type === "heal" || move.selfEffect.type === "drain"
        ? (1 - active.currentHp / active.mon.hp) * 52
        : 18
      : 0;
    const repeatPenalty = memory.lastMoveName === move.name ? 0.72 : 1;
    const observedPressure = memory.observedPlayerTypes.includes(move.type)
      ? 1.08
      : 1;
    const noise = 0.9 + random() * 0.2;
    const score =
      (damage * Math.max(0.5, effectiveness) +
        finishing +
        statusValue +
        buffValue) *
      move.accuracy *
      repeatPenalty *
      observedPressure *
      noise;
    return { index, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return { kind: "move", moveIndex: scored[0]?.index ?? 0 };
};

export const livingCount = (side: ArenaSide) =>
  side.team.filter((fighter) => fighter.currentHp > 0).length;

export const firstLivingIndex = (side: ArenaSide) =>
  side.team.findIndex((fighter) => fighter.currentHp > 0);
