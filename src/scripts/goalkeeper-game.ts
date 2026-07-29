type GameState = "idle" | "starting" | "playing" | "paused" | "resolved";
type InputType = "mouse" | "touch" | "keyboard";
type PauseReason = "pointer" | "manual" | "viewport" | "hidden" | "resize";
type ShotOutcome = "save" | "goal";

type Point = {
  x: number;
  y: number;
};

type LayoutBounds = {
  surfaceWidth: number;
  surfaceHeight: number;
  goalLeft: number;
  goalTop: number;
  goalWidth: number;
  goalHeight: number;
  goalRight: number;
  goalBottom: number;
  shotOriginX: number;
  shotOriginY: number;
  gloveWidth: number;
  gloveHeight: number;
  ballBaseRadius: number;
};

type Shot = {
  origin: Point;
  target: Point;
  control: Point;
  startAt: number;
  travelDuration: number;
  resolvedAt: number | null;
  feedbackDuration: number;
  nextDelay: number;
  outcome: ShotOutcome | null;
  currentPosition: Point;
  currentScale: number;
  bounceVector: Point;
};

type HitEllipse = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

type DebugShot = {
  targetX: number;
  targetY: number;
  travelDuration: number;
  prepDelay: number;
  nextDelay: number;
  outcome: ShotOutcome;
};

type GameElement = HTMLElement & {
  __goalkeeperMiniGame?: GoalkeeperGameController;
};

const GLOVE_IMAGE_WIDTH = 512;
const GLOVE_IMAGE_HEIGHT = 342;
const GLOVE_RATIO = GLOVE_IMAGE_HEIGHT / GLOVE_IMAGE_WIDTH;
const HITBOXES: ReadonlyArray<HitEllipse> = [
  { cx: 127.57 / GLOVE_IMAGE_WIDTH, cy: 170.91 / GLOVE_IMAGE_HEIGHT, rx: 68 / GLOVE_IMAGE_WIDTH, ry: 102 / GLOVE_IMAGE_HEIGHT },
  { cx: 383.62 / GLOVE_IMAGE_WIDTH, cy: 170.82 / GLOVE_IMAGE_HEIGHT, rx: 68 / GLOVE_IMAGE_WIDTH, ry: 102 / GLOVE_IMAGE_HEIGHT },
];

const PREP_RANGE: readonly [number, number] = [400, 700];
const TRAVEL_RANGE: readonly [number, number] = [900, 1450];
const RESULT_RANGE: readonly [number, number] = [350, 550];
const NEXT_RANGE: readonly [number, number] = [450, 850];
const TOUCH_GLOVE_OFFSET = 42;
const VISIBILITY_THRESHOLD = 0.55;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const lerp = (start: number, end: number, progress: number): number => start + (end - start) * progress;
const randomBetween = (min: number, max: number): number => lerp(min, max, Math.random());
const easeOutCubic = (progress: number): number => 1 - (1 - progress) ** 3;

const quadraticPoint = (origin: Point, control: Point, target: Point, progress: number): Point => {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * origin.x + 2 * inverse * progress * control.x + progress * progress * target.x,
    y: inverse * inverse * origin.y + 2 * inverse * progress * control.y + progress * progress * target.y,
  };
};

class GoalkeeperGameController {
  private readonly root: GameElement;
  private readonly controls: HTMLElement;
  private readonly surface: HTMLElement;
  private readonly goal: HTMLElement;
  private readonly gloves: HTMLImageElement;
  private readonly ball: HTMLElement;
  private readonly impact: HTMLElement;
  private readonly feedback: HTMLElement;
  private readonly overlay: HTMLElement;
  private readonly overlayText: HTMLElement;
  private readonly status: HTMLElement;
  private readonly liveRegion: HTMLElement;
  private readonly savesValue: HTMLElement;
  private readonly goalsValue: HTMLElement;
  private readonly startButton: HTMLButtonElement;
  private readonly pauseButton: HTMLButtonElement;
  private readonly resumeButton: HTMLButtonElement;
  private readonly finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  private readonly reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  private readonly timeouts = new Set<number>();
  private readonly abortController = new AbortController();
  private readonly debugShots: DebugShot[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private rafId: number | null = null;
  private layout: LayoutBounds | null = null;
  private shot: Shot | null = null;
  private state: GameState = "idle";
  private pauseReason: PauseReason | null = null;
  private inputType: InputType | null = null;
  private activePointerId: number | null = null;
  private sessionActive = false;
  private sectionVisible = true;
  private manualMode = false;
  private reducedMotion = false;
  private saves = 0;
  private concededGoals = 0;
  private gloveNormalized = { x: 0.5, y: 0.82 };
  private lastPrepDelay = 0;

  constructor(root: GameElement) {
    const meta = root.previousElementSibling;
    const controls = meta?.querySelector<HTMLElement>("[data-game-controls]");
    const surface = root.querySelector<HTMLElement>("[data-game-surface]");
    const goal = root.querySelector<HTMLElement>("[data-game-goal]");
    const gloves = root.querySelector<HTMLImageElement>("[data-game-gloves]");
    const ball = root.querySelector<HTMLElement>("[data-game-ball]");
    const impact = root.querySelector<HTMLElement>("[data-game-impact]");
    const feedback = root.querySelector<HTMLElement>("[data-game-feedback]");
    const overlay = root.querySelector<HTMLElement>("[data-game-overlay]");
    const overlayText = root.querySelector<HTMLElement>("[data-game-overlay-text]");
    const status = meta?.querySelector<HTMLElement>("[data-game-status]");
    const liveRegion = meta?.querySelector<HTMLElement>("[data-game-live]");
    const savesValue = meta?.querySelector<HTMLElement>("[data-game-saves]");
    const goalsValue = meta?.querySelector<HTMLElement>("[data-game-goals]");
    const startButton = meta?.querySelector<HTMLButtonElement>("[data-game-start]");
    const pauseButton = meta?.querySelector<HTMLButtonElement>("[data-game-pause]");
    const resumeButton = meta?.querySelector<HTMLButtonElement>("[data-game-resume]");

    if (
      !(meta instanceof HTMLElement) ||
      !controls ||
      !surface ||
      !goal ||
      !gloves ||
      !ball ||
      !impact ||
      !feedback ||
      !overlay ||
      !overlayText ||
      !status ||
      !liveRegion ||
      !savesValue ||
      !goalsValue ||
      !startButton ||
      !pauseButton ||
      !resumeButton
    ) {
      throw new Error("Goalkeeper mini game: missing required elements.");
    }

    this.root = root;
    this.controls = controls;
    this.surface = surface;
    this.goal = goal;
    this.gloves = gloves;
    this.ball = ball;
    this.impact = impact;
    this.feedback = feedback;
    this.overlay = overlay;
    this.overlayText = overlayText;
    this.status = status;
    this.liveRegion = liveRegion;
    this.savesValue = savesValue;
    this.goalsValue = goalsValue;
    this.startButton = startButton;
    this.pauseButton = pauseButton;
    this.resumeButton = resumeButton;

    this.setup();
  }

  getDebugState(): { state: GameState; saves: number; concededGoals: number; shots: DebugShot[] } {
    return {
      state: this.state,
      saves: this.saves,
      concededGoals: this.concededGoals,
      shots: [...this.debugShots],
    };
  }

  private setup(): void {
    this.root.dataset.enhanced = "true";
    this.applyControlMode();
    this.syncLayout();
    this.renderGloves();
    this.updateScoreboard();
    this.updateUi();

    this.surface.addEventListener("pointerenter", this.onPointerEnter, { signal: this.abortController.signal });
    this.surface.addEventListener("pointerleave", this.onPointerLeave, { signal: this.abortController.signal });
    this.surface.addEventListener("pointerdown", this.onPointerDown, { signal: this.abortController.signal });
    this.surface.addEventListener("pointermove", this.onPointerMove, { signal: this.abortController.signal });
    this.surface.addEventListener("pointerup", this.onPointerUp, { signal: this.abortController.signal });
    this.surface.addEventListener("pointercancel", this.onPointerUp, { signal: this.abortController.signal });
    this.surface.addEventListener("keydown", this.onKeyDown, { signal: this.abortController.signal });
    this.surface.addEventListener("focusout", this.onFocusOut, { signal: this.abortController.signal });

    this.startButton.addEventListener("click", () => {
      this.startSession(this.manualMode && !this.finePointerQuery.matches ? "touch" : "mouse");
    }, { signal: this.abortController.signal });

    this.pauseButton.addEventListener("click", () => {
      this.pauseGame("manual");
    }, { signal: this.abortController.signal });

    this.resumeButton.addEventListener("click", () => {
      this.startSession(this.inputType ?? (this.manualMode && !this.finePointerQuery.matches ? "touch" : "mouse"));
    }, { signal: this.abortController.signal });

    document.addEventListener("visibilitychange", this.onVisibilityChange, { signal: this.abortController.signal });
    window.addEventListener("pagehide", this.onPageHide, { signal: this.abortController.signal });

    this.finePointerQuery.addEventListener("change", this.onModeMediaChange, { signal: this.abortController.signal });
    this.reducedMotionQuery.addEventListener("change", this.onModeMediaChange, { signal: this.abortController.signal });

    window.addEventListener("resize", this.onWindowResize, { signal: this.abortController.signal });

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.syncLayout();
        this.renderGloves();
        if (this.state === "starting" || this.state === "playing" || this.state === "resolved") {
          this.pauseGame("resize");
        }
      });
      this.resizeObserver.observe(this.surface);
    }

    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          this.sectionVisible = entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD;
          if (!this.sectionVisible && this.sessionActive) {
            this.pauseGame("viewport");
          }
          this.updateUi();
        },
        {
          threshold: [0, VISIBILITY_THRESHOLD, 1],
        }
      );
      this.intersectionObserver.observe(this.root);
    }

    Object.defineProperty(this.root, "__goalkeeperMiniGame", {
      value: this,
      configurable: true,
    });
  }

  private readonly onWindowResize = (): void => {
    this.syncLayout();
    this.renderGloves();
    if (this.state === "starting" || this.state === "playing" || this.state === "resolved") {
      this.pauseGame("resize");
    }
  };

  private readonly onModeMediaChange = (): void => {
    this.applyControlMode();
    if (this.state === "starting" || this.state === "playing" || this.state === "resolved") {
      this.pauseGame("manual");
    } else {
      this.updateUi();
    }
  };

  private readonly onVisibilityChange = (): void => {
    if (document.hidden && this.sessionActive) {
      this.pauseGame("hidden");
    }
  };

  private readonly onPageHide = (): void => {
    this.pauseGame("hidden");
    this.destroy();
  };

  private readonly onPointerEnter = (event: PointerEvent): void => {
    if (event.pointerType !== "mouse") {
      return;
    }
    this.inputType = "mouse";
    this.surface.focus({ preventScroll: true });
    this.updateGlovesFromPoint(event.clientX, event.clientY, false);
    if (!this.manualMode) {
      this.startSession("mouse");
    } else {
      this.updateUi();
    }
  };

  private readonly onPointerLeave = (event: PointerEvent): void => {
    if (event.pointerType !== "mouse") {
      return;
    }
    if (this.sessionActive) {
      this.pauseGame("pointer");
    } else {
      this.updateUi();
    }
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    this.surface.focus({ preventScroll: true });
    if (event.pointerType === "mouse") {
      this.inputType = "mouse";
      this.updateGlovesFromPoint(event.clientX, event.clientY, false);
      if (this.manualMode && !this.sessionActive) {
        this.startSession("mouse");
      }
      return;
    }

    this.inputType = "touch";
    this.activePointerId = event.pointerId;
    if ("setPointerCapture" in this.surface) {
      this.surface.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    this.updateGlovesFromPoint(event.clientX, event.clientY, true);
    if (!this.sessionActive) {
      this.startSession("touch");
    }
  };

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "mouse") {
      this.updateGlovesFromPoint(event.clientX, event.clientY, false);
      return;
    }

    if (this.activePointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    this.updateGlovesFromPoint(event.clientX, event.clientY, true);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (event.pointerType === "mouse") {
      return;
    }

    if (this.activePointerId !== event.pointerId) {
      return;
    }

    if ("hasPointerCapture" in this.surface && this.surface.hasPointerCapture(event.pointerId)) {
      this.surface.releasePointerCapture(event.pointerId);
    }
    this.activePointerId = null;
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if (key === " " || key === "spacebar") {
      event.preventDefault();
      if (this.sessionActive) {
        this.pauseGame("manual");
      } else {
        this.startSession("keyboard");
      }
      return;
    }

    const moveStep = 0.055;
    let deltaX = 0;
    let deltaY = 0;

    if (key === "arrowleft" || key === "a") {
      deltaX = -moveStep;
    } else if (key === "arrowright" || key === "d") {
      deltaX = moveStep;
    } else if (key === "arrowup" || key === "w") {
      deltaY = -moveStep;
    } else if (key === "arrowdown" || key === "s") {
      deltaY = moveStep;
    } else {
      return;
    }

    event.preventDefault();
    this.inputType = "keyboard";
    this.setGloveNormalized(this.gloveNormalized.x + deltaX, this.gloveNormalized.y + deltaY);
  };

  private readonly onFocusOut = (event: FocusEvent): void => {
    if (this.inputType !== "keyboard") {
      return;
    }
    const related = event.relatedTarget;
    if (related instanceof Node && this.surface.contains(related)) {
      return;
    }
    if (this.sessionActive) {
      this.pauseGame("manual");
    }
  };

  private applyControlMode(): void {
    this.reducedMotion = this.reducedMotionQuery.matches;
    this.manualMode = this.reducedMotion || !this.finePointerQuery.matches;
    this.root.dataset.controlMode = this.manualMode ? "manual" : "hover";
    this.root.dataset.reducedMotion = this.reducedMotion ? "true" : "false";
  }

  private syncLayout(): void {
    const surfaceRect = this.surface.getBoundingClientRect();
    const goalRect = this.goal.getBoundingClientRect();
    const goalLeft = goalRect.left - surfaceRect.left;
    const goalTop = goalRect.top - surfaceRect.top;
    const goalWidth = goalRect.width;
    const goalHeight = goalRect.height;
    const goalBottom = goalTop + goalHeight;
    const surfaceHeight = surfaceRect.height;
    const gloveWidth = clamp(goalWidth * (surfaceRect.width < 768 ? 0.3 : 0.245), 92, 176);
    const gloveHeight = gloveWidth * GLOVE_RATIO;
    const ballBaseRadius = clamp(goalWidth * 0.05, 12, 18);

    this.layout = {
      surfaceWidth: surfaceRect.width,
      surfaceHeight,
      goalLeft,
      goalTop,
      goalWidth,
      goalHeight,
      goalRight: goalLeft + goalWidth,
      goalBottom,
      shotOriginX: surfaceRect.width / 2,
      shotOriginY: surfaceHeight - clamp(surfaceHeight * 0.09, 48, 72),
      gloveWidth,
      gloveHeight,
      ballBaseRadius,
    };
  }

  private setGloveNormalized(x: number, y: number): void {
    this.gloveNormalized = {
      x: clamp(x, 0, 1),
      y: clamp(y, 0, 1),
    };
    this.renderGloves();
  }

  private renderGloves(): void {
    if (!this.layout) {
      return;
    }

    const { goalLeft, goalTop, goalWidth, goalHeight, gloveWidth, gloveHeight } = this.layout;
    const x = goalLeft + this.gloveNormalized.x * (goalWidth - gloveWidth);
    const y = goalTop + this.gloveNormalized.y * (goalHeight - gloveHeight);

    this.gloves.style.width = `${gloveWidth}px`;
    this.gloves.style.height = `${gloveHeight}px`;
    this.gloves.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  private updateGlovesFromPoint(clientX: number, clientY: number, touchOffset: boolean): void {
    if (!this.layout) {
      return;
    }

    const surfaceRect = this.surface.getBoundingClientRect();
    const localX = clientX - surfaceRect.left;
    const localY = clientY - surfaceRect.top - (touchOffset ? TOUCH_GLOVE_OFFSET : 0);
    const maxX = this.layout.goalWidth - this.layout.gloveWidth;
    const maxY = this.layout.goalHeight - this.layout.gloveHeight;
    const relativeX = clamp(localX - this.layout.goalLeft - this.layout.gloveWidth / 2, 0, maxX);
    const relativeY = clamp(localY - this.layout.goalTop - this.layout.gloveHeight / 2, 0, maxY);

    this.setGloveNormalized(
      maxX > 0 ? relativeX / maxX : 0.5,
      maxY > 0 ? relativeY / maxY : 0.5
    );
  }

  private startSession(inputType: InputType): void {
    if (!this.layout || !this.sectionVisible) {
      return;
    }

    this.inputType = inputType;
    this.sessionActive = true;
    this.pauseReason = null;
    this.clearCycle();
    this.scheduleNextShot();
    this.updateUi();
  }

  private scheduleNextShot(): void {
    if (!this.sessionActive) {
      return;
    }

    this.state = "starting";
    this.lastPrepDelay = Math.round(randomBetween(PREP_RANGE[0], PREP_RANGE[1]));
    this.updateUi();

    this.scheduleTimeout(() => {
      if (!this.sessionActive || !this.layout || !this.sectionVisible) {
        return;
      }
      this.beginShot(performance.now());
    }, this.lastPrepDelay);
  }

  private beginShot(now: number): void {
    if (!this.layout) {
      return;
    }

    const safeMargin = this.layout.ballBaseRadius * 1.15 + 6;
    const targetX = this.layout.goalLeft + safeMargin + Math.random() * (this.layout.goalWidth - safeMargin * 2);
    const targetY = this.layout.goalTop + safeMargin + Math.random() * (this.layout.goalHeight - safeMargin * 2);
    const origin = {
      x: this.layout.shotOriginX + randomBetween(-this.layout.goalWidth * 0.045, this.layout.goalWidth * 0.045),
      y: this.layout.shotOriginY,
    };
    const control = {
      x: clamp(
        lerp(origin.x, targetX, 0.42) + randomBetween(-this.layout.goalWidth * 0.12, this.layout.goalWidth * 0.12),
        this.layout.ballBaseRadius,
        this.layout.surfaceWidth - this.layout.ballBaseRadius
      ),
      y: clamp(
        lerp(origin.y, targetY, 0.42) - randomBetween(this.layout.goalHeight * 0.08, this.layout.goalHeight * 0.18),
        this.layout.ballBaseRadius,
        this.layout.surfaceHeight - this.layout.ballBaseRadius
      ),
    };
    const travelDuration = Math.round(randomBetween(TRAVEL_RANGE[0], TRAVEL_RANGE[1]));
    const feedbackDuration = Math.round(randomBetween(RESULT_RANGE[0], RESULT_RANGE[1]));
    const nextDelay = Math.round(randomBetween(NEXT_RANGE[0], NEXT_RANGE[1]));

    this.state = "playing";
    this.feedback.hidden = true;
    this.impact.hidden = true;
    this.ball.hidden = false;
    this.goal.classList.remove("is-goal-hit");
    this.shot = {
      origin,
      target: { x: targetX, y: targetY },
      control,
      startAt: now,
      travelDuration,
      resolvedAt: null,
      feedbackDuration,
      nextDelay,
      outcome: null,
      currentPosition: origin,
      currentScale: 0.74,
      bounceVector: { x: 0, y: 0 },
    };
    this.renderBall(origin, 0.74);
    this.startAnimation();
    this.updateUi();
  }

  private startAnimation(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(this.onAnimationFrame);
  }

  private readonly onAnimationFrame = (timestamp: number): void => {
    const shot = this.shot;
    if (!shot || !this.layout) {
      this.rafId = null;
      return;
    }

    if (shot.outcome && shot.resolvedAt !== null) {
      const progress = clamp((timestamp - shot.resolvedAt) / shot.feedbackDuration, 0, 1);
      if (shot.outcome === "save") {
        const eased = easeOutCubic(progress);
        const position = {
          x: shot.currentPosition.x + shot.bounceVector.x * eased,
          y: shot.currentPosition.y + shot.bounceVector.y * eased,
        };
        const scale = shot.currentScale - 0.12 * eased;
        this.renderBall(position, scale);
      } else {
        this.renderBall(shot.currentPosition, shot.currentScale + (this.reducedMotion ? 0 : 0.05 * progress));
      }

      if (progress >= 1) {
        this.finishShot();
        return;
      }

      this.rafId = requestAnimationFrame(this.onAnimationFrame);
      return;
    }

    const progress = clamp((timestamp - shot.startAt) / shot.travelDuration, 0, 1);
    const position = quadraticPoint(shot.origin, shot.control, shot.target, progress);
    const scale = lerp(0.74, 1.1, progress);
    const radius = this.layout.ballBaseRadius * scale;

    shot.currentPosition = position;
    shot.currentScale = scale;
    this.renderBall(position, scale);

    if (this.detectCollision(position, radius)) {
      this.resolveShot("save", timestamp);
      return;
    }

    if (progress >= 1) {
      this.resolveShot("goal", timestamp);
      return;
    }

    this.rafId = requestAnimationFrame(this.onAnimationFrame);
  };

  private detectCollision(ballCenter: Point, ballRadius: number): boolean {
    if (!this.layout) {
      return false;
    }

    const gloveX = this.layout.goalLeft + this.gloveNormalized.x * (this.layout.goalWidth - this.layout.gloveWidth);
    const gloveY = this.layout.goalTop + this.gloveNormalized.y * (this.layout.goalHeight - this.layout.gloveHeight);

    return HITBOXES.some((ellipse) => {
      const cx = gloveX + this.layout!.gloveWidth * ellipse.cx;
      const cy = gloveY + this.layout!.gloveHeight * ellipse.cy;
      const rx = this.layout!.gloveWidth * ellipse.rx + ballRadius;
      const ry = this.layout!.gloveHeight * ellipse.ry + ballRadius;
      const dx = ballCenter.x - cx;
      const dy = ballCenter.y - cy;
      return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
    });
  }

  private resolveShot(outcome: ShotOutcome, timestamp: number): void {
    if (!this.shot || this.shot.outcome) {
      return;
    }

    const shot = this.shot;
    shot.outcome = outcome;
    shot.resolvedAt = timestamp;
    this.state = "resolved";

    if (outcome === "save") {
      this.saves += 1;
      const angle = Math.atan2(shot.currentPosition.y - (this.layout?.shotOriginY ?? shot.origin.y), shot.currentPosition.x - (this.layout?.shotOriginX ?? shot.origin.x));
      shot.bounceVector = this.reducedMotion
        ? { x: 0, y: 0 }
        : {
            x: Math.cos(angle) * 42,
            y: -Math.abs(Math.sin(angle) * 34) - 18,
          };
      this.showImpact(shot.currentPosition);
      this.showFeedback("ODBRANA", "save");
      this.liveRegion.textContent = `ODBRANA. Ukupno odbrane: ${this.saves}.`;
    } else {
      this.concededGoals += 1;
      this.goal.classList.add("is-goal-hit");
      this.showFeedback("GOL", "goal");
      this.liveRegion.textContent = `GOL. Primljeni golovi: ${this.concededGoals}.`;
    }

    this.debugShots.push({
      targetX: Math.round(shot.target.x),
      targetY: Math.round(shot.target.y),
      travelDuration: shot.travelDuration,
      prepDelay: this.lastPrepDelay,
      nextDelay: shot.nextDelay,
      outcome,
    });
    if (this.debugShots.length > 40) {
      this.debugShots.shift();
    }

    this.updateScoreboard();
    this.updateUi();
    this.startAnimation();
  }

  private finishShot(): void {
    const finishedShot = this.shot;
    this.clearAnimation();
    this.ball.hidden = true;
    this.feedback.hidden = true;
    this.impact.hidden = true;
    this.goal.classList.remove("is-goal-hit");
    this.shot = null;

    if (!this.sessionActive || !finishedShot) {
      this.state = this.sessionActive ? "paused" : "paused";
      this.updateUi();
      return;
    }

    this.state = "starting";
    this.updateUi();
    this.scheduleTimeout(() => {
      if (!this.sessionActive || !this.sectionVisible) {
        return;
      }
      this.beginShot(performance.now());
    }, finishedShot.nextDelay);
  }

  private pauseGame(reason: PauseReason): void {
    this.sessionActive = false;
    this.pauseReason = reason;
    this.clearCycle();
    this.goal.classList.remove("is-goal-hit");
    this.ball.hidden = true;
    this.feedback.hidden = true;
    this.impact.hidden = true;
    this.shot = null;
    this.state = this.state === "idle" ? "idle" : "paused";
    this.updateUi();
  }

  private clearCycle(): void {
    this.clearAnimation();
    this.timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    this.timeouts.clear();
  }

  private clearAnimation(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private scheduleTimeout(callback: () => void, delay: number): void {
    const timeoutId = window.setTimeout(() => {
      this.timeouts.delete(timeoutId);
      callback();
    }, delay);
    this.timeouts.add(timeoutId);
  }

  private showImpact(point: Point): void {
    if (this.reducedMotion) {
      this.impact.hidden = true;
      return;
    }

    this.impact.hidden = false;
    this.impact.classList.remove("is-active");
    this.impact.style.transform = `translate3d(${point.x - 22}px, ${point.y - 22}px, 0)`;
    void this.impact.offsetWidth;
    this.impact.classList.add("is-active");
  }

  private showFeedback(label: string, outcome: ShotOutcome): void {
    this.feedback.hidden = false;
    this.feedback.dataset.outcome = outcome;
    this.feedback.textContent = label;
  }

  private renderBall(position: Point, scale: number): void {
    if (!this.layout) {
      return;
    }

    const baseSize = this.layout.ballBaseRadius * 2;
    this.ball.style.width = `${baseSize}px`;
    this.ball.style.height = `${baseSize}px`;
    this.ball.style.transform = `translate3d(${position.x - this.layout.ballBaseRadius}px, ${position.y - this.layout.ballBaseRadius}px, 0) scale(${scale})`;
  }

  private updateScoreboard(): void {
    this.savesValue.textContent = String(this.saves);
    this.savesValue.setAttribute("aria-label", `Odbrane: ${this.saves}`);
    this.goalsValue.textContent = String(this.concededGoals);
    this.goalsValue.setAttribute("aria-label", `Primljeni golovi: ${this.concededGoals}`);
  }

  private updateUi(): void {
    const statusMessage = this.getStatusMessage();
    this.status.textContent = statusMessage;
    this.overlayText.textContent = statusMessage;

    const showOverlay = this.state === "idle" || this.state === "paused";
    this.overlay.classList.toggle("is-hidden", !showOverlay);

    const showControls = this.manualMode;
    this.controls.hidden = !showControls;
    this.startButton.hidden = !(showControls && this.state === "idle");
    this.pauseButton.hidden = !(showControls && (this.state === "starting" || this.state === "playing" || this.state === "resolved"));
    this.resumeButton.hidden = !(showControls && this.state === "paused");

    this.root.dataset.state = this.state;
    this.root.dataset.input = this.inputType ?? "";
  }

  private getStatusMessage(): string {
    const isTouchLike = this.manualMode && !this.finePointerQuery.matches;
    const isPointerHoverMode = !this.manualMode && this.finePointerQuery.matches;

    if (this.state === "paused") {
      if (this.pauseReason === "pointer" && isPointerHoverMode) {
        return "Vrati kursor u teren za nastavak";
      }
      if (isPointerHoverMode) {
        return "Vrati kursor u teren za nastavak";
      }
      return "Igra je pauzirana";
    }

    if (this.state === "starting" || this.state === "playing" || this.state === "resolved") {
      return this.manualMode ? "Igra je aktivna" : "Rukavice prate kursor unutar gola";
    }

    if (isTouchLike) {
      return "Dodirni teren, zatim pomeraj rukavice prstom.";
    }

    if (this.manualMode) {
      return "Pokreni igru pa pomeraj rukavice unutar gola.";
    }

    return "Uđi kursorom u teren i pomeraj rukavice.";
  }

  destroy(): void {
    this.clearCycle();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.abortController.abort();
    delete this.root.__goalkeeperMiniGame;
  }
}

const initializeGoalkeeperMiniGame = (): void => {
  document.querySelectorAll<GameElement>("[data-goalkeeper-mini-game]").forEach((root) => {
    if (root.__goalkeeperMiniGame) {
      return;
    }
    new GoalkeeperGameController(root);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGoalkeeperMiniGame, { once: true });
} else {
  initializeGoalkeeperMiniGame();
}
