import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  useMemo,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  portfolioMonData,
  initialInventory,
  getTypeEffectiveness,
  getStatMultiplier,
} from "../context/gameContext";
import type {
  PortfolioMon,
  BattleReadyMon,
  BattleReadyMove,
  StatusEffect,
  AnimationState,
  TrainerState,
  DialogueState,
  PlayerInventory,
  NotificationType,
  NotificationItem,
  StatModifiers,
  BattleEffect,
} from "../context/gameContext";

// --- BATTLE BACKGROUNDS ---
const TOTAL_BACKGROUNDS = 6; // Set this to the number of background images you have

// --- TYPE FOR BATTLE STATS ---
export interface BattleStats {
  damageDealt: number;
  critsLanded: number;
  superEffectiveHits: number;
  statusEffectsInflicted: number;
}

const initialStats: BattleStats = {
  damageDealt: 0,
  critsLanded: 0,
  superEffectiveHits: 0,
  statusEffectsInflicted: 0,
};

// --- TYPE FOR CONTEXT VALUE ---
interface IGameContext {
  gameState:
  | "teamSelect"
  | "teamPreview"
  | "fight"
  | "gameOver"
  | "forcedSwitch";
  playerTeam: PortfolioMon[];
  playerTeamState: BattleReadyMon[];
  cpuTeamState: BattleReadyMon[];
  activePlayerIndex: number;
  activeCpuIndex: number;
  battleLog: string[];
  isPlayerTurn: boolean;
  winner: "Player" | "CPU" | null;
  inventory: PlayerInventory;
  playerAnimation: AnimationState;
  cpuAnimation: AnimationState;
  dialogue: DialogueState;
  playerTrainerState: TrainerState;
  gruntTrainerState: TrainerState;
  turnCount: number;
  notification: NotificationItem | null;
  isAutoBattleActive: boolean;
  playerStats: BattleStats;
  cpuStats: BattleStats;
  background: number;
  lastMoveType: string | null;
  activeBattleEffect: BattleEffect | null;
  handleTeamSelect: (mon: PortfolioMon) => void;
  handleConfirmTeam: () => void;
  handleClearTeam: () => void;
  startBattle: () => void;
  handleMoveSelect: (move: BattleReadyMove) => Promise<void>;
  handleSwitchSelect: (index: number) => Promise<void>;
  handleItemUse: (itemName: string, targetIndex: number) => Promise<void>;
  handleRun: () => void;
  handleReset: () => void;
  toggleAutoBattle: () => void;
  cycleBackground: () => void;
  getTypeEffectiveness: typeof getTypeEffectiveness;
}

const GameContext = createContext<IGameContext | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

// --- UTILITY & DIALOGUE ---
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const playerDialogueOptions = {
  attack: [
    "Go, {mon}! Use {move}!",
    "{mon}, now's our chance! {move}!",
    "Let's show them our power, {mon}! Use {move}!",
    "Alright, {mon}! {move}, let's go!",
  ],
  switch: [
    "You did great, {oldMon}! Come back!",
    "Time for a change! Go, {newMon}!",
    "Let's switch it up! Get in there, {newMon}!",
  ],
};
const cpuDialogueOptions = {
  attack: [
    "Grr... {mon}, use {move}!",
    "Don't let up, {mon}! {move}!",
    "Crush them! {mon}, {move}!",
    "Heh... too easy. {mon}, use {move}!",
  ],
  switch: [
    "Hmph. You're useless, {oldMon}!",
    "A better matchup... Go, {newMon}!",
    "Get out there, {newMon}!",
  ],
};
function getRandomDialogue(
  type: "attack" | "switch",
  who: "player" | "cpu",
  context: { mon?: string; move?: string; oldMon?: string; newMon?: string }
): string {
  const options =
    who === "player" ? playerDialogueOptions[type] : cpuDialogueOptions[type];
  let dialogue = options[Math.floor(Math.random() * options.length)];
  if (context.mon) dialogue = dialogue.replace("{mon}", context.mon);
  if (context.move) dialogue = dialogue.replace("{move}", context.move);
  if (context.oldMon) dialogue = dialogue.replace("{oldMon}", context.oldMon);
  if (context.newMon) dialogue = dialogue.replace("{newMon}", context.newMon);
  return dialogue;
}

// --- PROVIDER COMPONENT ---
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<
    "teamSelect" | "teamPreview" | "fight" | "gameOver" | "forcedSwitch"
  >("teamSelect");
  const [playerTeam, setPlayerTeam] = useState<PortfolioMon[]>([]);
  const [playerTeamState, setPlayerTeamState] = useState<BattleReadyMon[]>([]);
  const [cpuTeamState, setCpuTeamState] = useState<BattleReadyMon[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [activeCpuIndex, setActiveCpuIndex] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>([
    "Select your team to begin!",
  ]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<"Player" | "CPU" | null>(null);
  const [inventory, setInventory] = useState<PlayerInventory>(initialInventory);
  const [playerAnimation, setPlayerAnimation] =
    useState<AnimationState>("idle");
  const [cpuAnimation, setCpuAnimation] = useState<AnimationState>("idle");
  const [dialogue, setDialogue] = useState<DialogueState>({
    player: "",
    cpu: "",
  });
  const [playerTrainerState, setPlayerTrainerState] =
    useState<TrainerState>("idle");
  const [gruntTrainerState, setGruntTrainerState] =
    useState<TrainerState>("idle");
  const [turnCount, setTurnCount] = useState(1);
  const [notification, setNotification] = useState<NotificationItem | null>(
    null
  );
  const [notificationQueue, setNotificationQueue] = useState<
    NotificationItem[]
  >([]);
  const [playerStats, setPlayerStats] = useState<BattleStats>(initialStats);
  const [cpuStats, setCpuStats] = useState<BattleStats>(initialStats);
  const [isAutoBattleActive, setIsAutoBattleActive] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [background, setBackground] = useLocalStorage<number>("arena-background", 1);
  const [playerDidSwitchLastTurn, setPlayerDidSwitchLastTurn] = useState(false);
  const [cpuDidSwitchLastTurn, setCpuDidSwitchLastTurn] = useState(false);
  const [lastMoveType, setLastMoveType] = useState<string | null>(null);
  const [activeBattleEffect, setActiveBattleEffect] = useState<BattleEffect | null>(null);

  // --- REFS FOR MANAGING ASYNC OPERATIONS SAFELY ---
  const battleStateRef = useRef({
    gameState,
    playerTeamState,
    cpuTeamState,
    activePlayerIndex,
    activeCpuIndex,
  });
  useEffect(() => {
    battleStateRef.current = {
      gameState,
      playerTeamState,
      cpuTeamState,
      activePlayerIndex,
      activeCpuIndex,
    };
  }, [
    gameState,
    playerTeamState,
    cpuTeamState,
    activePlayerIndex,
    activeCpuIndex,
  ]);

  const autoBattleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const statusVerbs: { [key in StatusEffect & string]: string } = {
    burn: "burned",
    poison: "poisoned",
    sleep: "asleep",
    stun: "stunned",
  };

  const showNotification = useCallback(
    (message: string, type: NotificationType) => {
      setNotificationQueue((prev) => [
        ...prev,
        { message, type, id: Date.now() },
      ]);
    },
    []
  );

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (!notification && notificationQueue.length > 0) {
      const next = notificationQueue[0];
      setNotification(next);
      setNotificationQueue((prev) => prev.slice(1));
    }
  }, [notification, notificationQueue]);

  useEffect(() => {
    if (winner) {
      setPlayerTrainerState(winner === "Player" ? "win" : "lose");
      setGruntTrainerState(winner === "CPU" ? "win" : "lose");
      setIsAutoBattleActive(false);
    }
  }, [winner]);

  const addToLog = useCallback((message: string) => {
    setBattleLog((prev) => [...prev, message]);
  }, []);

  const DEFAULT_STAT_MODS: StatModifiers = { atk: 0, def: 0, spd: 0 };

  const createBattleReadyTeam = (team: PortfolioMon[]): BattleReadyMon[] => {
    return team.map((mon) => {
      let resolvedName = mon.name;
      let resolvedImage = mon.image;
      if (mon.variants && mon.variants.length > 0) {
        const picked = mon.variants[Math.floor(Math.random() * mon.variants.length)]!;
        resolvedImage = picked.image;
        resolvedName = `${mon.name}: ${picked.nameSuffix}`;
      }
      return {
        ...mon,
        name: resolvedName,
        image: resolvedImage,
        currentHp: mon.hp,
        status: null,
        statusTurns: 0,
        moves: mon.moves.map((move) => ({ ...move, currentPp: move.pp })),
        statModifiers: { ...DEFAULT_STAT_MODS },
      };
    });
  };

  const updateMonState = useCallback(
    (
      team: "player" | "cpu",
      index: number,
      updates: Partial<Omit<BattleReadyMon, "moves">> & {
        moves?: BattleReadyMove[];
      }
    ) => {
      const updater = team === "player" ? setPlayerTeamState : setCpuTeamState;
      updater((prev) =>
        prev.map((mon, i) => (i === index ? { ...mon, ...updates } : mon))
      );
    },
    []
  );

  const handleTeamSelect = useCallback((mon: PortfolioMon) => {
    setPlayerTeam((prev) => {
      const isOnTeam = prev.some((p) => p.id === mon.id);
      if (isOnTeam) {
        return prev.filter((p) => p.id !== mon.id);
      } else {
        if (prev.length < 3) {
          return [...prev, mon];
        }
        return prev;
      }
    });
  }, []);

  const handleClearTeam = useCallback(() => {
    setPlayerTeam([]);
  }, []);

  const handleConfirmTeam = useCallback(() => {
    if (playerTeam.length === 3) {
      const remainingMons = portfolioMonData.filter(
        (p) => !playerTeam.find((pt) => pt.id === p.id)
      );
      const cpuSelectedTeam = remainingMons
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setPlayerTeamState(createBattleReadyTeam(playerTeam));
      setCpuTeamState(createBattleReadyTeam(cpuSelectedTeam));
      setGameState("teamPreview");
    }
  }, [playerTeam]);

  const startBattle = useCallback(async () => {
    setBattleLog([`--- Turn 1 ---`]);
    showNotification("Your Turn", "turn");
    addToLog(`${playerTeamState[0]!.name} vs ${cpuTeamState[0]!.name}!`);
    setGameState("fight");
    setPlayerAnimation("switchIn");
    setCpuAnimation("switchIn");
    await sleep(800);
    setPlayerAnimation("idle");
    setCpuAnimation("idle");
    setPlayerTrainerState("idle");
    setGruntTrainerState("idle");
  }, [playerTeamState, cpuTeamState, addToLog, showNotification]);

  const handleFaint = useCallback(
    async (faintedTeam: "player" | "cpu", faintedMonIndex: number) => {
      const isPlayerFaint = faintedTeam === "player";
      const { playerTeamState, cpuTeamState } = battleStateRef.current;
      const victor = isPlayerFaint ? "CPU" : "Player";
      const teamState = isPlayerFaint ? playerTeamState : cpuTeamState;

      const remaining = teamState.filter((p) => p.currentHp > 0);
      if (remaining.length === 0) {
        setWinner(victor);
        await sleep(1500);
        setGameState("gameOver");
        setIsProcessingTurn(false);
        return;
      }

      if (isPlayerFaint) {
        setGameState("forcedSwitch");
        setIsPlayerTurn(true);
        showNotification("Choose your next Project!", "turn");
        setIsProcessingTurn(false);
      } else {
        const nextIndex = cpuTeamState.findIndex((p) => p.currentHp > 0);
        if (nextIndex !== -1) {
          setGruntTrainerState("commanding");
          await sleep(100);
          const oldMonName = cpuTeamState[faintedMonIndex]!.name;
          const newMonName = cpuTeamState[nextIndex]!.name;
          const dialogueText = getRandomDialogue("switch", "cpu", {
            oldMon: oldMonName,
            newMon: newMonName,
          });
          setDialogue({ player: "", cpu: dialogueText });
          setTimeout(() => setDialogue((d) => ({ ...d, cpu: "" })), 3000);
          addToLog(`CPU sent out ${newMonName}!`);
          await sleep(500);
          setCpuAnimation("switchIn");
          setActiveCpuIndex(nextIndex);
          await sleep(600);
          setCpuAnimation("idle");
          setGruntTrainerState("idle");
          setIsPlayerTurn(true);
          setIsProcessingTurn(false);
        }
      }
    },
    [showNotification, addToLog]
  );

  const applyEndOfTurnStatusEffects = useCallback(
    async (team: "player" | "cpu"): Promise<boolean> => {
      const {
        playerTeamState,
        cpuTeamState,
        activePlayerIndex,
        activeCpuIndex,
      } = battleStateRef.current;
      const mon =
        team === "player"
          ? playerTeamState[activePlayerIndex]
          : cpuTeamState[activeCpuIndex];
      const monIndex = team === "player" ? activePlayerIndex : activeCpuIndex;
      if (
        !mon ||
        mon.currentHp <= 0 ||
        (mon.status !== "burn" && mon.status !== "poison")
      ) {
        return false;
      }
      let damage = 0;
      let message = "";
      if (mon.status === "burn") {
        damage = Math.floor(mon.hp / 16);
        message = `${mon.name} was hurt by its burn!`;
      } else if (mon.status === "poison") {
        damage = Math.floor(mon.hp / 8);
        message = `${mon.name} was hurt by poison!`;
      }

      const newTurns = mon.statusTurns - 1;
      if (damage > 0) {
        const setAnimation =
          team === "player" ? setPlayerAnimation : setCpuAnimation;
        setAnimation("hit");
        await sleep(500);
        addToLog(message);
        showNotification(message, "status");
        const newHp = Math.max(0, mon.currentHp - damage);
        updateMonState(team, monIndex, {
          currentHp: newHp,
          statusTurns: newTurns <= 0 ? 0 : newTurns,
        });
        await sleep(500);
        setAnimation("idle");
        if (newHp <= 0) {
          setAnimation("faint");
          addToLog(`${mon.name} fainted!`);
          await sleep(1500);
          await handleFaint(team, monIndex);
          return true;
        }
      }
      if (newTurns <= 0 && mon.status) {
        await sleep(1000);
        updateMonState(team, monIndex, { status: null, statusTurns: 0 });
        const recoveryMessage =
          mon.status === "burn"
            ? `${mon.name}'s burn was healed!`
            : `${mon.name} was cured of poison!`;
        addToLog(recoveryMessage);
        showNotification(recoveryMessage, "info");
      }
      return false;
    },
    [handleFaint, showNotification, addToLog, updateMonState]
  );

  const processTurn = useCallback(
    async (
      attacker: BattleReadyMon,
      defender: BattleReadyMon,
      move: BattleReadyMove,
      attackerTeam: "player" | "cpu"
    ): Promise<boolean> => {
      const setAttackerStats =
        attackerTeam === "player" ? setPlayerStats : setCpuStats;
      const defenderTeam = attackerTeam === "player" ? "cpu" : "player";
      const attackerIndex =
        attackerTeam === "player"
          ? battleStateRef.current.activePlayerIndex
          : battleStateRef.current.activeCpuIndex;
      const defenderIndex =
        defenderTeam === "player"
          ? battleStateRef.current.activePlayerIndex
          : battleStateRef.current.activeCpuIndex;
      const setAttackerAnimation =
        attackerTeam === "player" ? setPlayerAnimation : setCpuAnimation;
      const setDefenderAnimation =
        attackerTeam === "player" ? setCpuAnimation : setPlayerAnimation;

      if (attacker.status === "sleep") {
        const newTurns = attacker.statusTurns - 1;
        updateMonState(attackerTeam, attackerIndex, {
          statusTurns: newTurns <= 0 ? 0 : newTurns,
        });
        addToLog(`${attacker.name} is asleep and can't move!`);
        showNotification(`${attacker.name} is asleep!`, "status");
        if (attackerTeam === "player") {
          setDialogue((d) => ({ ...d, player: "" }));
          setPlayerTrainerState("idle");
        } else {
          setGruntTrainerState("idle");
        }
        if (newTurns <= 0) {
          await sleep(1000);
          updateMonState(attackerTeam, attackerIndex, {
            status: null,
            statusTurns: 0,
          });
          addToLog(`${attacker.name} woke up!`);
        }
        return false;
      }

      if (attacker.status === "stun") {
        const newTurns = attacker.statusTurns - 1;
        const stunExpired = newTurns <= 0;
        updateMonState(attackerTeam, attackerIndex, {
          statusTurns: stunExpired ? 0 : newTurns,
          ...(stunExpired ? { status: null } : {}),
        });
        if (stunExpired) {
          await sleep(500);
          const recoveryMsg = `${attacker.name} is no longer stunned!`;
          addToLog(recoveryMsg);
          showNotification(recoveryMsg, "info");
        } else if (Math.random() < 0.25) {
          addToLog(`${attacker.name} is stunned and can't move!`);
          showNotification(`${attacker.name} is stunned!`, "status");
          if (attackerTeam === "player") {
            setDialogue((d) => ({ ...d, player: "" }));
            setPlayerTrainerState("idle");
          } else {
            setGruntTrainerState("idle");
          }
          return false;
        }
      }

      const newMoves = attacker.moves.map((m) =>
        m.name === move.name ? { ...m, currentPp: m.currentPp - 1 } : m
      );
      updateMonState(attackerTeam, attackerIndex, { moves: newMoves });

      if (attackerTeam === "cpu") {
        const dialogueText = getRandomDialogue("attack", "cpu", {
          mon: attacker.name,
          move: move.name,
        });
        setDialogue({ player: "", cpu: dialogueText });
        setTimeout(() => setDialogue((d) => ({ ...d, cpu: "" })), 3000);
      }

      addToLog(`${attacker.name} used ${move.name}!`);
      setLastMoveType(move.type);
      setAttackerAnimation("attack");
      await sleep(500);

      if (Math.random() < move.accuracy) {
        let damage = 0;
        if (move.power > 0) {
          const effectiveness = getTypeEffectiveness(move.type, defender);
          if (effectiveness.multiplier > 1) {
            setAttackerStats((prev) => ({
              ...prev,
              superEffectiveHits: prev.superEffectiveHits + 1,
            }));
          }
          const atkMod = getStatMultiplier(attacker.statModifiers.atk);
          const defMod = getStatMultiplier(defender.statModifiers.def);
          const baseDamage =
            (move.power * ((attacker.stats.atk * atkMod) / (defender.stats.def * defMod))) / 5 + 2;
          damage = Math.floor(baseDamage * (Math.random() * 0.15 + 0.85));
          damage = Math.floor(damage * effectiveness.multiplier);

          const isCrit = move.critChance && Math.random() < move.critChance;
          if (isCrit) {
            damage = Math.floor(damage * 1.5);
            showNotification("A critical hit!", "critical");
            addToLog("A critical hit!");
            setAttackerStats((prev) => ({
              ...prev,
              critsLanded: prev.critsLanded + 1,
            }));
          }
          setAttackerStats((prev) => ({
            ...prev,
            damageDealt: prev.damageDealt + damage,
          }));

          if (effectiveness.message) {
            showNotification(effectiveness.message, "effectiveness");
            addToLog(effectiveness.message);
          }
        }
        setDefenderAnimation("hit");
        const newHp = Math.max(0, defender.currentHp - damage);
        updateMonState(defenderTeam, defenderIndex, { currentHp: newHp });
        await sleep(500);

        // --- SELF EFFECTS (drain, recoil, stat boosts, heal) ---
        if (move.selfEffect && Math.random() < move.selfEffect.chance) {
          const se = move.selfEffect;
          setActiveBattleEffect({ type: se.type, target: attackerTeam });
          if (se.type === "drain" && damage > 0) {
            const healAmt = Math.floor(damage * se.amount);
            const drainHp = Math.min(attacker.hp, attacker.currentHp + healAmt);
            updateMonState(attackerTeam, attackerIndex, { currentHp: drainHp });
            const msg = `${attacker.name} drained ${healAmt} HP!`;
            addToLog(msg);
            showNotification(msg, "drain");
          } else if (se.type === "recoil" && damage > 0) {
            const recoilDmg = Math.floor(damage * se.amount);
            const recoilHp = Math.max(0, attacker.currentHp - recoilDmg);
            updateMonState(attackerTeam, attackerIndex, { currentHp: recoilHp });
            const msg = `${attacker.name} took ${recoilDmg} recoil damage!`;
            addToLog(msg);
            showNotification(msg, "status");
          } else if (se.type === "heal") {
            const healAmt = Math.min(se.amount, attacker.hp - attacker.currentHp);
            if (healAmt > 0) {
              updateMonState(attackerTeam, attackerIndex, {
                currentHp: attacker.currentHp + healAmt,
              });
              const msg = `${attacker.name} recovered ${healAmt} HP!`;
              addToLog(msg);
              showNotification(msg, "heal");
            }
          } else if (
            se.type === "atkUp" ||
            se.type === "defUp" ||
            se.type === "spdUp"
          ) {
            const statKey = se.type === "atkUp" ? "atk" : se.type === "defUp" ? "def" : "spd";
            const currentStage = attacker.statModifiers[statKey];
            if (currentStage < 3) {
              const newStage = Math.min(3, currentStage + se.amount);
              updateMonState(attackerTeam, attackerIndex, {
                statModifiers: { ...attacker.statModifiers, [statKey]: newStage },
              });
              const statName = statKey.toUpperCase();
              const msg = `${attacker.name}'s ${statName} rose!`;
              addToLog(msg);
              showNotification(msg, "boost");
            }
          }
          await sleep(800);
          setActiveBattleEffect(null);
        }

        // --- STATUS EFFECTS ON DEFENDER ---
        if (
          move.effect &&
          Math.random() < move.effect.chance &&
          defender.status === null &&
          newHp > 0
        ) {
          await sleep(500);
          const statusType = move.effect.type;
          const turns = statusType === "sleep" || statusType === "stun" ? 3 : 4;
          updateMonState(defenderTeam, defenderIndex, {
            status: statusType,
            statusTurns: turns,
          });
          const verb =
            statusType === "sleep"
              ? "fell asleep"
              : `was ${statusVerbs[statusType]}`;
          const message = `${defender.name} ${verb}!`;
          addToLog(message);
          showNotification(message, "status");
          setAttackerStats((prev) => ({
            ...prev,
            statusEffectsInflicted: prev.statusEffectsInflicted + 1,
          }));
        }
        await sleep(500);
        if (newHp <= 0) {
          setDefenderAnimation("faint");
          addToLog(`${defender.name} fainted!`);
          setAttackerAnimation("idle");
          if (attackerTeam === "player") {
            setPlayerTrainerState("idle");
          } else {
            setGruntTrainerState("idle");
          }
          await sleep(1500);
          await handleFaint(defenderTeam, defenderIndex);
          return true;
        }
      } else {
        addToLog(`${attacker.name}'s attack missed!`);
        showNotification("Attack missed!", "miss");
        await sleep(1000);
      }

      setAttackerAnimation("idle");
      setDefenderAnimation("idle");
      if (attackerTeam === "player") {
        setPlayerTrainerState("idle");
      } else {
        setGruntTrainerState("idle");
      }
      return false;
    },
    [addToLog, handleFaint, showNotification, statusVerbs, updateMonState]
  );

  const calculateMoveScore = useCallback(
    (
      move: BattleReadyMove,
      attacker: BattleReadyMon,
      defender: BattleReadyMon
    ): number => {
      const effectiveness = getTypeEffectiveness(
        move.type,
        defender
      ).multiplier;
      const isStab =
        attacker.type1 === move.type || attacker.type2 === move.type;
      const stabBonus = isStab ? 1.5 : 1;

      let score =
        move.power *
        (attacker.stats.atk / defender.stats.def) *
        stabBonus *
        effectiveness;

      if (move.effect && defender.status === null) {
        score += 45 * move.effect.chance;
      }

      score *= move.accuracy;
      if (score >= defender.currentHp) {
        score *= 1.5;
      }

      return score;
    },
    []
  );

  const calculateSwitchScore = useCallback(
    (
      switchToMon: BattleReadyMon,
      currentMon: BattleReadyMon,
      opponentMon: BattleReadyMon
    ): number => {
      let score = 0;
      const eff1 = getTypeEffectiveness(
        opponentMon.type1,
        switchToMon
      ).multiplier;
      const eff2 = opponentMon.type2
        ? getTypeEffectiveness(opponentMon.type2, switchToMon).multiplier
        : 1;
      const opponentDamageMultiplier = Math.max(eff1, eff2);

      if (opponentDamageMultiplier < 1) score += 60;
      if (opponentDamageMultiplier > 1) score -= 60;

      const bestMoveVsOpponent = switchToMon.moves
        .map((move) => calculateMoveScore(move, switchToMon, opponentMon))
        .reduce((max, current) => Math.max(max, current), 0);
      score += bestMoveVsOpponent;

      score *= switchToMon.currentHp / switchToMon.hp;

      if (currentMon.currentHp / currentMon.hp < 0.25) {
        score += 50;
      }

      return score;
    },
    [calculateMoveScore]
  );

  const chooseAiAction = (
    mon: BattleReadyMon,
    opponent: BattleReadyMon,
    team: BattleReadyMon[],
    activeIndex: number,
    didSwitchLastTurn: boolean
  ) => {
    const availableMoves = mon.moves.filter((m) => m.currentPp > 0);
    const availableSwitches = team
      .map((m, index) => ({ mon: m, index }))
      .filter((item) => item.mon.currentHp > 0 && item.index !== activeIndex);

    const moveOptions = availableMoves.map((move) => ({
      type: "move" as const,
      move,
      score: calculateMoveScore(move, mon, opponent),
    }));

    const switchOptions = !didSwitchLastTurn
      ? availableSwitches.map((item) => ({
        type: "switch" as const,
        index: item.index,
        score: calculateSwitchScore(item.mon, mon, opponent),
      }))
      : [];

    const allOptions = [...moveOptions, ...switchOptions];
    if (allOptions.length === 0) return null;

    allOptions.sort((a, b) => b.score - a.score);

    if (allOptions[0].score <= 0) {
      return allOptions[0];
    }

    const bestScore = allOptions[0].score;
    let candidatePool = allOptions.filter(
      (option) => option.score >= bestScore * 0.85
    );

    if (candidatePool.length < 4) {
      const numToTake = Math.min(4, allOptions.length);
      candidatePool = allOptions.slice(0, numToTake);
    }

    const randomIndex = Math.floor(Math.random() * candidatePool.length);
    return candidatePool[randomIndex];
  };

  const endPlayerTurn = useCallback(async () => {
    showNotification("Opponent's Turn", "turn");
    await sleep(1500);

    const {
      cpuTeamState: currentCpuTeamState,
      playerTeamState: currentPlayerTeamState,
      activeCpuIndex: currentActiveCpuIndex,
      activePlayerIndex: currentActivePlayerIndex,
      gameState: currentGameState,
    } = battleStateRef.current;

    const cpuMon = currentCpuTeamState[currentActiveCpuIndex]!;
    const playerMon = currentPlayerTeamState[currentActivePlayerIndex]!;

    let faintedDuringTurn = false;

    if (
      cpuMon?.currentHp > 0 &&
      playerMon?.currentHp > 0 &&
      currentGameState === "fight"
    ) {
      const chosenAction = chooseAiAction(
        cpuMon,
        playerMon,
        currentCpuTeamState,
        currentActiveCpuIndex,
        cpuDidSwitchLastTurn
      );

      if (chosenAction?.type === "switch") {
        setCpuDidSwitchLastTurn(true);
        setGruntTrainerState("commanding");
        await sleep(100);
        const oldCpuMonName = cpuMon.name;
        const newCpuMon = currentCpuTeamState[chosenAction.index]!;
        const dialogueText = getRandomDialogue("switch", "cpu", {
          oldMon: oldCpuMonName,
          newMon: newCpuMon.name,
        });
        setDialogue({ player: "", cpu: dialogueText });
        setTimeout(() => setDialogue((d) => ({ ...d, cpu: "" })), 3000);

        addToLog(`CPU switched from ${oldCpuMonName} to ${newCpuMon.name}!`);
        setCpuAnimation("switchOut");
        await sleep(500);
        updateMonState("cpu", currentActiveCpuIndex, {
          statModifiers: { ...DEFAULT_STAT_MODS },
        });
        setActiveCpuIndex(chosenAction.index);
        setCpuAnimation("switchIn");
        await sleep(700);
        setCpuAnimation("idle");
        setGruntTrainerState("idle");
      } else if (chosenAction?.type === "move") {
        setCpuDidSwitchLastTurn(false);
        setGruntTrainerState("commanding");
        await sleep(100);
        faintedDuringTurn = await processTurn(
          cpuMon,
          playerMon,
          chosenAction.move,
          "cpu"
        );
      } else {
        addToLog(`${cpuMon.name} has no moves left!`);
      }

      if (!faintedDuringTurn && battleStateRef.current.gameState === "fight") {
        await applyEndOfTurnStatusEffects("cpu");
      }
    }

    if (
      battleStateRef.current.gameState === "fight" ||
      battleStateRef.current.gameState === "forcedSwitch"
    ) {
      setTurnCount((prev) => {
        const newTurn = prev + 1;
        addToLog(`--- Turn ${newTurn} ---`);
        return newTurn;
      });
      showNotification("Your Turn", "turn");
      setIsPlayerTurn(true);
    }
    setIsProcessingTurn(false);
  }, [
    processTurn,
    applyEndOfTurnStatusEffects,
    showNotification,
    addToLog,
    calculateMoveScore,
    calculateSwitchScore,
    cpuDidSwitchLastTurn,
  ]);

  const handleMoveSelect = useCallback(
    async (move: BattleReadyMove) => {
      if (!isPlayerTurn || isProcessingTurn) return;
      if (isAutoBattleActive) setPlayerDidSwitchLastTurn(false);

      setIsProcessingTurn(true);
      const playerMon = playerTeamState[activePlayerIndex]!;
      if (
        playerMon.moves.find((m) => m.name === move.name)!.currentPp <= 0 &&
        !(playerMon.status === "sleep" || playerMon.status === "stun")
      ) {
        addToLog(`There's no PP left for ${move.name}!`);
        setIsProcessingTurn(false);
        return;
      }
      setIsPlayerTurn(false);
      setPlayerTrainerState("commanding");
      await sleep(100);
      const dialogueText = getRandomDialogue("attack", "player", {
        mon: playerMon.name,
        move: move.name,
      });
      setDialogue({ player: dialogueText, cpu: "" });
      setTimeout(() => setDialogue((d) => ({ ...d, player: "" })), 3000);
      const cpuMon = cpuTeamState[activeCpuIndex]!;
      const didFaintFromMove = await processTurn(
        playerMon,
        cpuMon,
        move,
        "player"
      );
      if (!didFaintFromMove && battleStateRef.current.gameState === "fight") {
        const didFaintFromStatus = await applyEndOfTurnStatusEffects("player");
        if (
          !didFaintFromStatus &&
          battleStateRef.current.gameState === "fight"
        ) {
          await endPlayerTurn();
        }
      } else {
        setIsProcessingTurn(false);
      }
    },
    [
      isPlayerTurn,
      isProcessingTurn,
      playerTeamState,
      activePlayerIndex,
      cpuTeamState,
      activeCpuIndex,
      addToLog,
      processTurn,
      applyEndOfTurnStatusEffects,
      endPlayerTurn,
      isAutoBattleActive,
    ]
  );

  const handleSwitchSelect = useCallback(
    async (index: number) => {
      if (
        !isPlayerTurn ||
        isProcessingTurn ||
        playerTeamState[index]!.currentHp <= 0 ||
        index === activePlayerIndex
      )
        return;

      if (isAutoBattleActive) setPlayerDidSwitchLastTurn(true);
      setIsProcessingTurn(true);
      setIsPlayerTurn(false);
      setPlayerTrainerState("commanding");
      await sleep(100);
      setPlayerAnimation("switchOut");
      await sleep(500);
      updateMonState("player", activePlayerIndex, {
        statModifiers: { ...DEFAULT_STAT_MODS },
      });
      const oldPlayerMonName = playerTeamState[activePlayerIndex]!.name;
      const newPlayerMon = playerTeamState[index]!;
      const dialogueText = getRandomDialogue("switch", "player", {
        oldMon: oldPlayerMonName,
        newMon: newPlayerMon.name,
      });
      setDialogue({ player: dialogueText, cpu: "" });
      setTimeout(() => setDialogue((d) => ({ ...d, player: "" })), 3000);
      addToLog(
        `You switched from ${oldPlayerMonName} to ${newPlayerMon.name}!`
      );
      setActivePlayerIndex(index);
      setPlayerAnimation("switchIn");
      await sleep(700);
      setPlayerAnimation("idle");
      setPlayerTrainerState("idle");

      if (gameState === "forcedSwitch") {
        setGameState("fight");
        setIsPlayerTurn(true);
        showNotification("Your Turn", "turn");
        setIsProcessingTurn(false);
        return;
      }
      await endPlayerTurn();
    },
    [
      isPlayerTurn,
      isProcessingTurn,
      playerTeamState,
      activePlayerIndex,
      gameState,
      addToLog,
      endPlayerTurn,
      showNotification,
      isAutoBattleActive,
    ]
  );

  const handleItemUse = useCallback(
    async (itemName: string, targetIndex: number) => {
      if (!isPlayerTurn || isProcessingTurn) return;
      setPlayerDidSwitchLastTurn(false);
      const itemInInventory = inventory[itemName];
      if (!itemInInventory || itemInInventory.quantity <= 0) return;

      setIsProcessingTurn(true);
      const targetMon = playerTeamState[targetIndex]!;
      const eff = itemInInventory.item.effect;
      let actionTaken = false;

      if (eff.type === "heal") {
        if (targetMon.currentHp < targetMon.hp && targetMon.currentHp > 0) {
          const newHp = Math.min(targetMon.hp, targetMon.currentHp + eff.amount);
          updateMonState("player", targetIndex, { currentHp: newHp });
          setActiveBattleEffect({ type: "heal", target: "player" });
          actionTaken = true;
        } else {
          addToLog(`${targetMon.name}'s HP is already full!`);
        }
      } else if (eff.type === "cureStatus") {
        if (targetMon.status) {
          updateMonState("player", targetIndex, { status: null, statusTurns: 0 });
          actionTaken = true;
        } else {
          addToLog(`${targetMon.name} has no status condition!`);
        }
      } else if (eff.type === "boostAtk" || eff.type === "boostDef" || eff.type === "boostSpd") {
        const statKey = eff.type === "boostAtk" ? "atk" : eff.type === "boostDef" ? "def" : "spd";
        const effectType = eff.type === "boostAtk" ? "atkUp" : eff.type === "boostDef" ? "defUp" : "spdUp";
        const currentStage = targetMon.statModifiers[statKey];
        if (currentStage < 3 && targetMon.currentHp > 0) {
          const newStage = Math.min(3, currentStage + eff.stages);
          updateMonState("player", targetIndex, {
            statModifiers: { ...targetMon.statModifiers, [statKey]: newStage },
          });
          const statName = statKey.toUpperCase();
          showNotification(`${targetMon.name}'s ${statName} sharply rose!`, "boost");
          setActiveBattleEffect({ type: effectType, target: "player" });
          actionTaken = true;
        } else if (currentStage >= 3) {
          addToLog(`${targetMon.name}'s ${statKey.toUpperCase()} can't go any higher!`);
        }
      } else if (eff.type === "revive") {
        if (targetMon.currentHp <= 0) {
          const reviveHp = Math.floor(targetMon.hp * eff.hpFraction);
          updateMonState("player", targetIndex, {
            currentHp: reviveHp,
            status: null,
            statusTurns: 0,
            statModifiers: { ...DEFAULT_STAT_MODS },
          });
          showNotification(`${targetMon.name} was revived!`, "heal");
          setActiveBattleEffect({ type: "heal", target: "player" });
          actionTaken = true;
        } else {
          addToLog(`${targetMon.name} doesn't need reviving!`);
        }
      }

      if (actionTaken) {
        setIsPlayerTurn(false);
        setPlayerTrainerState("commanding");
        await sleep(100);
        addToLog(`Used ${itemInInventory.item.name} on ${targetMon.name}.`);
        await sleep(700);
        setActiveBattleEffect(null);
        setPlayerTrainerState("idle");
        setInventory((prev) => ({
          ...prev,
          [itemName]: {
            ...prev[itemName]!,
            quantity: prev[itemName]!.quantity - 1,
          },
        }));
        await endPlayerTurn();
      } else {
        setIsProcessingTurn(false);
      }
    },
    [
      isPlayerTurn,
      isProcessingTurn,
      inventory,
      playerTeamState,
      addToLog,
      endPlayerTurn,
      updateMonState,
    ]
  );

  const handleRun = useCallback(() => {
    if (!isPlayerTurn || isProcessingTurn) return;
    addToLog("You ran away from the battle...");
    setWinner("CPU");
    setTimeout(() => setGameState("gameOver"), 1000);
  }, [isPlayerTurn, isProcessingTurn, addToLog]);

  const handleReset = useCallback(() => {
    if (autoBattleTimerRef.current) {
      clearTimeout(autoBattleTimerRef.current);
      autoBattleTimerRef.current = null;
    }
    setGameState("teamSelect");
    setPlayerTeam([]);
    setWinner(null);
    setActivePlayerIndex(0);
    setActiveCpuIndex(0);
    setBattleLog(["Select your team to begin!"]);
    setIsPlayerTurn(true);
    setPlayerTrainerState("idle");
    setGruntTrainerState("idle");
    setInventory(initialInventory);
    setTurnCount(1);
    setNotification(null);
    setNotificationQueue([]);
    setPlayerStats(initialStats);
    setCpuStats(initialStats);
    setIsAutoBattleActive(false);
    setIsProcessingTurn(false);
    setPlayerDidSwitchLastTurn(false);
    setCpuDidSwitchLastTurn(false);
  }, []);

  const toggleAutoBattle = useCallback(() => {
    if (autoBattleTimerRef.current) {
      clearTimeout(autoBattleTimerRef.current);
      autoBattleTimerRef.current = null;
    }
    setIsAutoBattleActive((prev) => {
      const newState = !prev;
      addToLog(`Auto-Battle ${newState ? "Enabled" : "Disabled"}.`);
      showNotification(`Auto-Battle ${newState ? "ON" : "OFF"}`, "info");
      return newState;
    });
  }, [addToLog, showNotification]);

  const cycleBackground = useCallback(() => {
    setBackground((prev) => {
      const next = prev + 1;
      return next > TOTAL_BACKGROUNDS ? 1 : next;
    });
  }, [setBackground]);

  useEffect(() => {
    if (autoBattleTimerRef.current) {
      clearTimeout(autoBattleTimerRef.current);
      autoBattleTimerRef.current = null;
    }
    if (!isAutoBattleActive || !isPlayerTurn || isProcessingTurn) return;

    const performAutoAction = () => {
      const {
        gameState,
        playerTeamState,
        cpuTeamState,
        activePlayerIndex,
        activeCpuIndex,
      } = battleStateRef.current;

      if (gameState === "fight") {
        const playerMon = playerTeamState[activePlayerIndex];
        const cpuMon = cpuTeamState[activeCpuIndex];
        if (!playerMon || playerMon.currentHp <= 0 || !cpuMon) return;

        const chosenAction = chooseAiAction(
          playerMon,
          cpuMon,
          playerTeamState,
          activePlayerIndex,
          playerDidSwitchLastTurn
        );

        if (chosenAction?.type === "switch") {
          void handleSwitchSelect(chosenAction.index);
        } else if (chosenAction?.type === "move") {
          void handleMoveSelect(chosenAction.move);
        } else {
          addToLog(`${playerMon.name} is out of options!`);
        }
      } else if (gameState === "forcedSwitch") {
        const availableSwitches = playerTeamState
          .map((mon, index) => ({ mon, index }))
          .filter((item) => item.mon.currentHp > 0);
        if (availableSwitches.length === 0) return;

        const cpuMon = cpuTeamState[activeCpuIndex];
        const playerMon = playerTeamState[activePlayerIndex];

        const scoredSwitches = availableSwitches.map((item) => ({
          index: item.index,
          score: calculateSwitchScore(item.mon, playerMon, cpuMon),
        }));

        const bestSwitch = scoredSwitches.reduce((a, b) =>
          a.score > b.score ? a : b
        );
        void handleSwitchSelect(bestSwitch.index);
      }
    };

    autoBattleTimerRef.current = setTimeout(performAutoAction, 1500);

    return () => {
      if (autoBattleTimerRef.current) {
        clearTimeout(autoBattleTimerRef.current);
        autoBattleTimerRef.current = null;
      }
    };
  }, [
    isAutoBattleActive,
    isPlayerTurn,
    gameState,
    isProcessingTurn,
    handleMoveSelect,
    handleSwitchSelect,
    addToLog,
    calculateMoveScore,
    calculateSwitchScore,
    playerDidSwitchLastTurn,
    chooseAiAction,
  ]);

  const value = useMemo(
    () => ({
      gameState,
      playerTeam,
      playerTeamState,
      cpuTeamState,
      activePlayerIndex,
      activeCpuIndex,
      battleLog,
      isPlayerTurn,
      winner,
      inventory,
      playerAnimation,
      cpuAnimation,
      dialogue,
      playerTrainerState,
      gruntTrainerState,
      turnCount,
      notification,
      isAutoBattleActive,
      playerStats,
      cpuStats,
      background,
      lastMoveType,
      activeBattleEffect,
      handleTeamSelect,
      handleConfirmTeam,
      handleClearTeam,
      startBattle,
      handleMoveSelect,
      handleSwitchSelect,
      handleItemUse,
      handleRun,
      handleReset,
      toggleAutoBattle,
      cycleBackground,
      getTypeEffectiveness,
    }),
    [
      gameState,
      playerTeam,
      playerTeamState,
      cpuTeamState,
      activePlayerIndex,
      activeCpuIndex,
      battleLog,
      isPlayerTurn,
      winner,
      inventory,
      playerAnimation,
      cpuAnimation,
      dialogue,
      playerTrainerState,
      gruntTrainerState,
      turnCount,
      notification,
      isAutoBattleActive,
      playerStats,
      cpuStats,
      background,
      lastMoveType,
      activeBattleEffect,
      handleTeamSelect,
      handleConfirmTeam,
      handleClearTeam,
      startBattle,
      handleMoveSelect,
      handleSwitchSelect,
      handleItemUse,
      handleRun,
      handleReset,
      toggleAutoBattle,
      cycleBackground,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
