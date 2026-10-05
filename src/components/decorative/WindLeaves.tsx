import * as React from "react";

/**
 * Folhas levadas pelo vento, em canvas puro, um único <canvas> para todas as
 * folhas e rastros. Movimento por física (velocidade + arrasto + ruído tipo
 * Perlin), não por ondas senoidais empilhadas nem por Math.random() por
 * frame — isso é o que dá a sensação de vento real em vez de mecânico.
 *
 * Só roda na seção em que é montado, só enquanto ela está visível
 * (IntersectionObserver liga/desliga o loop), e nunca quando o visitante
 * prefere menos movimento (prefers-reduced-motion).
 *
 * Todos os parâmetros de ajuste ficam aqui embaixo.
 */

// ---- Imagens (public/folhas) ----
const LEAF_SOURCES = [
  "/folhas/folha1.webp",
  "/folhas/folha2.webp",
  "/folhas/folha3.webp",
  "/folhas/folha4.webp",
];

// ---- Quantidade ----
const MAX_LEAVES_DESKTOP = 8;
const MAX_LEAVES_MOBILE = 7;
const MOBILE_BREAKPOINT = 768;

// ---- Só no mobile: a tela é estreita e a seção é bem mais alta (cards
// empilhados), então as folhas passam rápido e a maioria nasceria fora da
// vista. Compensação: rajadas mais frequentes e folhas nascendo na faixa da
// seção que está visível na tela. O desktop não é afetado.
const MOBILE_GUST_INTERVAL_FACTOR = 0.5; // intervalos entre rajadas pela metade
const MOBILE_VIEW_BAND_TOP = 0.05; // nasce entre 5% e 70% da parte visível
const MOBILE_VIEW_BAND_BOTTOM = 0.7;

// ---- Rajadas (grupos de folhas entrando juntas pela esquerda) ----
// Cada seção pode ter seu próprio ritmo, para as folhas não parecerem
// sincronizadas entre blocos. A física (velocidade, queda, giro) é a mesma.
export interface GustRhythm {
  firstGustMinMs: number; // atraso da primeira rajada
  firstGustMaxMs: number;
  sizeMin: number; // folhas por rajada
  sizeMax: number;
  intervalMinMs: number; // tempo entre rajadas
  intervalMaxMs: number;
  staggerMs: number; // atraso entre folhas da mesma rajada
}

export const RHYTHM_A: GustRhythm = {
  firstGustMinMs: 500,
  firstGustMaxMs: 2000,
  sizeMin: 2,
  sizeMax: 4,
  intervalMinMs: 4000,
  intervalMaxMs: 8000,
  staggerMs: 400,
};

// Mais espaçado: começa depois, rajadas menores e folhas mais separadas.
export const RHYTHM_B: GustRhythm = {
  firstGustMinMs: 2500,
  firstGustMaxMs: 4500,
  sizeMin: 1,
  sizeMax: 3,
  intervalMinMs: 5500,
  intervalMaxMs: 9500,
  staggerMs: 900,
};

// Intermediário e irregular: começa no meio-termo, rajadas curtas de 1–2
// folhas com intervalos bem variados (nem o compasso de A nem o espaçado de B).
export const RHYTHM_C: GustRhythm = {
  firstGustMinMs: 1200,
  firstGustMaxMs: 3200,
  sizeMin: 1,
  sizeMax: 2,
  intervalMinMs: 3000,
  intervalMaxMs: 10000,
  staggerMs: 650,
};

// Seção "Sobre": calmo e esparso, combina com o texto longo. Começa cedo,
// mas com rajadas pequenas e espaçadas (nem igual a A, B ou C).
export const RHYTHM_D: GustRhythm = {
  firstGustMinMs: 800,
  firstGustMaxMs: 2400,
  sizeMin: 1,
  sizeMax: 3,
  intervalMinMs: 5000,
  intervalMaxMs: 8500,
  staggerMs: 1100,
};

// ---- Deslocamento horizontal: sempre para a direita, nunca parada ----
const SPEED_X_MIN = 40; // px/s
const SPEED_X_MAX = 90; // px/s
const WIND_NOISE_VARIATION = 12; // px/s, quanto o vento acelera/freia em torno da velocidade base
const WIND_NOISE_FREQ = 0.08; // Hz, bem baixo — vento muda devagar
const VELOCITY_SMOOTHING = 1.5; // 1/s, velocidade de lerp da velocidade até o alvo

// ---- Queda lenta + ondulação vertical pequena (sem quique) ----
const FALL_SPEED_MIN = 10; // px/s, tendência geral de descer
const FALL_SPEED_MAX = 25;
const SWAY_AMPLITUDE_MIN = 15; // px
const SWAY_AMPLITUDE_MAX = 30;
const SWAY_PERIOD_MIN = 3; // s por ciclo
const SWAY_PERIOD_MAX = 5;

// ---- Giro lento, tipo pêndulo: inclina para onde está indo ----
const ROT_MAX_SPEED = 30; // graus/s, teto absoluto de giro
const ROT_SMOOTHING = 2; // 1/s, velocidade de lerp do ângulo até o alvo
const TILT_FACTOR = 0.8; // quanto o ângulo acompanha a direção do movimento

// ---- "Capotar" devagar ----
const TUMBLE_PERIOD_MIN = 2; // s por ciclo
const TUMBLE_PERIOD_MAX = 4;
const TUMBLE_MIN_SCALE = 0.4;

// ---- Profundidade (a maioria fica ao fundo, embaçada; poucas em destaque) ----
const DEPTH_BIAS = 1.7; // >1 puxa a distribuição de profundidade para "longe"
const DEPTH_SIZE_MIN = 22; // px, folha ao fundo
const DEPTH_SIZE_MAX = 44; // px, folha em primeiro plano
const DEPTH_BLUR_FAR = 2.6; // px, folhas bem ao fundo (pré-renderizado)
const DEPTH_BLUR_MID = 1.3; // px, folhas a meia distância (pré-renderizado)
const DEPTH_ALPHA_MIN = 0.35;
const DEPTH_ALPHA_MAX = 0.85;
const DEPTH_SPEED_WEIGHT = 0.6; // quanto a profundidade define a velocidade (resto é aleatório)

// ---- Rastro (fino, dourado claro, some aos poucos) ----
const TRAIL_LENGTH = 9; // posições guardadas por folha
const TRAIL_SAMPLE_MS = 60;
const TRAIL_COLOR_RGB = "255, 226, 173";
const TRAIL_MAX_ALPHA = 0.14;
const TRAIL_WIDTH = 1.4;

const SPAWN_MARGIN = 70; // px fora da tela, entrada/saída

// ---- Bordas de cima/baixo da seção ----
// A camada de folhas termina no limite da seção; uma folha que chegasse lá
// seria cortada numa linha reta e "denunciaria" a divisão entre seções.
// Então ela esmaece nessa faixa e some antes de encostar na borda.
const EDGE_FADE_PX = 90;
// E nasce longe da borda de baixo, com espaço para atravessar a tela descendo.
const SPAWN_BOTTOM_CLEARANCE = 240;
const SPAWN_Y_MAX_FRACTION = 0.6; // nasce no topo/meio, já que vai descendo
const BLUR_REF_SIZE = DEPTH_SIZE_MAX; // tamanho de referência usado ao pré-renderizar o blur

// ---- Ruído 1D tipo Perlin (contínuo, sem tremidas) ----
function createNoise1D(seed: number) {
  let s = seed >>> 0 || 1;
  const rand = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967295;
  };
  const perm = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const grad = (hash: number, x: number) => ((hash & 1) === 0 ? x : -x);

  return function noise1D(x: number): number {
    const xi = Math.floor(x) & 255;
    const xf = x - Math.floor(x);
    const u = fade(xf);
    const a = perm[xi];
    const b = perm[xi + 1];
    return lerp(grad(a, xf), grad(b, xf - 1), u);
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function randInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

interface BlurVariant {
  canvas: HTMLCanvasElement;
  refSize: number;
}

function buildBlurVariant(img: HTMLImageElement, blurPx: number): BlurVariant {
  const padding = Math.ceil(blurPx * 3);
  const canvas = document.createElement("canvas");
  canvas.width = BLUR_REF_SIZE + padding * 2;
  canvas.height = BLUR_REF_SIZE + padding * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(img, padding, padding, BLUR_REF_SIZE, BLUR_REF_SIZE);
  return { canvas, refSize: BLUR_REF_SIZE };
}

interface ImageVariants {
  raw: HTMLImageElement;
  far: BlurVariant;
  mid: BlurVariant;
}

function buildVariants(images: HTMLImageElement[]): ImageVariants[] {
  return images.map((raw) => ({
    raw,
    far: buildBlurVariant(raw, DEPTH_BLUR_FAR),
    mid: buildBlurVariant(raw, DEPTH_BLUR_MID),
  }));
}

interface TrailPoint {
  x: number;
  y: number;
}

/** De onde a folha entra: esquerda (vai para a direita), noroeste (canto de
 * cima à esquerda, desce para a direita) ou nordeste (canto de cima à
 * direita, desce para a esquerda). */
export type LeafOrigin = "left" | "nw" | "ne";

/** Modo sequência: uma folha por vez, seguindo a ordem de origens. */
export interface LeafSequence {
  order: LeafOrigin[];
  intervalMs: number; // tempo entre uma folha e a próxima
  firstDelayMs?: number;
  speedFactor?: number; // 1 = velocidade padrão; menor = mais lenta
  alphaFactor?: number; // 1 = opacidade padrão; menor = mais apagada
}

interface Leaf {
  variants: ImageVariants;
  dirX: 1 | -1; // sentido horizontal
  speedFactor: number;
  depthBucket: "far" | "mid" | "near";
  x: number;
  y: number;
  vx: number;
  vy: number;
  tSec: number;
  depth: number;
  size: number;
  alpha: number;
  baseSpeedX: number;
  fallSpeed: number;
  swayAmplitude: number;
  swayPeriod: number;
  swayPhase: number;
  noiseX: (t: number) => number;
  restAngle: number; // orientação própria da imagem
  rotation: number;
  tumblePeriod: number;
  tumblePhase: number;
  scaleX: number;
  trail: TrailPoint[];
  lastTrailSampleAt: number;
  edgeAlpha: number; // 0–1, esmaecimento perto das bordas da seção
  done: boolean;
}

let noiseSeedCounter = 1;

// Folhas que entram por cima descem mais (trajetória diagonal).
const TOP_ENTRY_FALL_MIN = 22; // px/s
const TOP_ENTRY_FALL_MAX = 38;

function spawnLeaf(
  variantsPool: ImageVariants[],
  yMin: number,
  yMax: number,
  opts: { origin?: LeafOrigin; width?: number; speedFactor?: number; alphaFactor?: number } = {},
): Leaf {
  const origin = opts.origin ?? "left";
  const speedFactor = opts.speedFactor ?? 1;
  const alphaFactor = opts.alphaFactor ?? 1;
  const width = opts.width ?? 0;
  const dirX: 1 | -1 = origin === "ne" ? -1 : 1;
  const depth = Math.pow(Math.random(), DEPTH_BIAS); // maioria puxada para "longe"
  const depthBucket: Leaf["depthBucket"] = depth < 0.35 ? "far" : depth < 0.65 ? "mid" : "near";
  const speedT = DEPTH_SPEED_WEIGHT * depth + (1 - DEPTH_SPEED_WEIGHT) * Math.random();
  const baseSpeedX = lerp(SPEED_X_MIN, SPEED_X_MAX, speedT);
  const fallSpeed =
    (origin === "left"
      ? randRange(FALL_SPEED_MIN, FALL_SPEED_MAX)
      : randRange(TOP_ENTRY_FALL_MIN, TOP_ENTRY_FALL_MAX)) * speedFactor;
  const swayAmplitude = randRange(SWAY_AMPLITUDE_MIN, SWAY_AMPLITUDE_MAX);
  const swayPeriod = randRange(SWAY_PERIOD_MIN, SWAY_PERIOD_MAX);
  const swayPhase = Math.random() * Math.PI * 2;
  const restAngle = Math.random() * 360;
  const vy = targetVy(fallSpeed, swayAmplitude, swayPeriod, swayPhase, 0);

  return {
    variants: variantsPool[Math.floor(Math.random() * variantsPool.length)],
    depthBucket,
    x:
      origin === "left"
        ? -SPAWN_MARGIN
        : origin === "nw"
          ? randRange(0.05, 0.35) * width
          : randRange(0.65, 0.95) * width,
    y: origin === "left" ? randRange(yMin, yMax) : -SPAWN_MARGIN,
    vx: baseSpeedX * speedFactor * dirX,
    dirX,
    speedFactor,
    vy,
    tSec: 0,
    depth,
    size: lerp(DEPTH_SIZE_MIN, DEPTH_SIZE_MAX, depth),
    alpha: lerp(DEPTH_ALPHA_MIN, DEPTH_ALPHA_MAX, depth) * alphaFactor,
    baseSpeedX,
    fallSpeed,
    swayAmplitude,
    swayPeriod,
    swayPhase,
    noiseX: createNoise1D(noiseSeedCounter++),
    restAngle,
    rotation: targetRotation(restAngle, baseSpeedX * dirX, vy),
    tumblePeriod: randRange(TUMBLE_PERIOD_MIN, TUMBLE_PERIOD_MAX),
    tumblePhase: Math.random() * Math.PI * 2,
    scaleX: 1,
    trail: [],
    lastTrailSampleAt: 0,
    edgeAlpha: 1,
    done: false,
  };
}

// Velocidade vertical alvo: queda constante + derivada de uma senoide lenta.
// Integrada, dá y = queda·t + A·sin(ωt), ou seja, ondula no máximo ±A px.
function targetVy(fall: number, amp: number, period: number, phase: number, t: number) {
  const omega = (2 * Math.PI) / period;
  return fall + amp * omega * Math.cos(omega * t + phase);
}

// Pêndulo: o ângulo acompanha a direção do movimento.
function targetRotation(restAngle: number, vx: number, vy: number) {
  // Espelhado para folhas indo à esquerda (inclina para onde vai).
  const dir = vx < 0 ? -1 : 1;
  return restAngle + dir * ((Math.atan2(vy, Math.abs(vx)) * 180) / Math.PI) * TILT_FACTOR;
}

// Fator de lerp independente do frame rate.
function smoothing(rate: number, dt: number) {
  return 1 - Math.exp(-rate * dt);
}

function updateLeaf(leaf: Leaf, dt: number, now: number, sectionWidth: number, sectionHeight: number) {
  leaf.tSec += dt;

  const windX = leaf.baseSpeedX + leaf.noiseX(leaf.tSec * WIND_NOISE_FREQ) * WIND_NOISE_VARIATION;
  const targetVx =
    Math.min(SPEED_X_MAX, Math.max(SPEED_X_MIN, windX)) * leaf.speedFactor * leaf.dirX;
  const tVy = targetVy(leaf.fallSpeed, leaf.swayAmplitude, leaf.swayPeriod, leaf.swayPhase, leaf.tSec);
  const k = smoothing(VELOCITY_SMOOTHING, dt);
  leaf.vx = lerp(leaf.vx, targetVx, k);
  leaf.vy = lerp(leaf.vy, tVy, k);
  leaf.x += leaf.vx * dt;
  leaf.y += leaf.vy * dt;

  const tRot = targetRotation(leaf.restAngle, leaf.vx, leaf.vy);
  const maxStep = ROT_MAX_SPEED * dt;
  const step = (tRot - leaf.rotation) * smoothing(ROT_SMOOTHING, dt);
  leaf.rotation += Math.max(-maxStep, Math.min(maxStep, step));

  const tumble = Math.cos(((2 * Math.PI) / leaf.tumblePeriod) * leaf.tSec + leaf.tumblePhase);
  leaf.scaleX = TUMBLE_MIN_SCALE + (1 - TUMBLE_MIN_SCALE) * (0.5 + 0.5 * tumble);

  if (now - leaf.lastTrailSampleAt > TRAIL_SAMPLE_MS) {
    leaf.trail.push({ x: leaf.x, y: leaf.y });
    if (leaf.trail.length > TRAIL_LENGTH) leaf.trail.shift();
    leaf.lastTrailSampleAt = now;
  }

  // Distância até as bordas, descontando o "raio" da folha (girada ocupa mais).
  const reach = leaf.size * 0.75;
  const distBottom = sectionHeight - leaf.y - reach;
  const distTop = leaf.y - reach;
  leaf.edgeAlpha = Math.min(1, Math.max(0, Math.min(distBottom, distTop) / EDGE_FADE_PX));

  if (leaf.x > sectionWidth + SPAWN_MARGIN || leaf.x < -SPAWN_MARGIN * 1.5 || distBottom <= 0) {
    leaf.done = true;
  }
}

function drawTrail(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  if (leaf.trail.length < 2) return;
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 1; i < leaf.trail.length; i++) {
    const p0 = leaf.trail[i - 1];
    const p1 = leaf.trail[i];
    const t = i / (leaf.trail.length - 1);
    ctx.strokeStyle = `rgba(${TRAIL_COLOR_RGB}, ${TRAIL_MAX_ALPHA * t * leaf.alpha * leaf.edgeAlpha})`;
    ctx.lineWidth = TRAIL_WIDTH * (0.6 + 0.4 * leaf.depth);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  ctx.save();
  ctx.globalAlpha = leaf.alpha * leaf.edgeAlpha;
  ctx.translate(leaf.x, leaf.y);
  ctx.rotate((leaf.rotation * Math.PI) / 180);
  ctx.scale(leaf.scaleX, 1);

  if (leaf.depthBucket === "near") {
    const half = leaf.size / 2;
    ctx.drawImage(leaf.variants.raw, -half, -half, leaf.size, leaf.size);
  } else {
    const variant = leaf.depthBucket === "far" ? leaf.variants.far : leaf.variants.mid;
    const scale = leaf.size / variant.refSize;
    const w = variant.canvas.width * scale;
    const h = variant.canvas.height * scale;
    ctx.drawImage(variant.canvas, -w / 2, -h / 2, w, h);
  }
  ctx.restore();
}

export function WindLeaves({
  rhythm = RHYTHM_A,
  maxLeaves: maxLeavesProp,
  sequence,
}: {
  rhythm?: GustRhythm;
  /** Se informado, substitui as rajadas: uma folha por vez, nas origens da ordem. */
  sequence?: LeafSequence;
  /** Limite de folhas por seção. Sem a prop, usa o padrão da home (8 desktop / 7 mobile). */
  maxLeaves?: { desktop: number; mobile: number };
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrapper || !canvas || !ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssWidth = 0;
    let cssHeight = 0;

    function resize() {
      const rect = wrapper!.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      canvas!.width = Math.round(cssWidth * dpr);
      canvas!.height = Math.round(cssHeight * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const maxLeaves = isMobile
      ? (maxLeavesProp?.mobile ?? MAX_LEAVES_MOBILE)
      : (maxLeavesProp?.desktop ?? MAX_LEAVES_DESKTOP);
    const intervalFactor = isMobile ? MOBILE_GUST_INTERVAL_FACTOR : 1;

    // Faixa vertical (em px da seção) onde a folha nasce.
    function spawnBand(): [number, number] {
      let [min, max] = rawSpawnBand();
      // Longe das bordas: sem esmaecer logo ao nascer e sem chegar ao fim da seção.
      min = Math.max(min, EDGE_FADE_PX + DEPTH_SIZE_MAX);
      max = Math.min(max, cssHeight - SPAWN_BOTTOM_CLEARANCE);
      if (max < min) max = min;
      return [min, max];
    }
    function rawSpawnBand(): [number, number] {
      if (!isMobile) return [0, cssHeight * SPAWN_Y_MAX_FRACTION];
      const rect = wrapper!.getBoundingClientRect();
      const visTop = Math.max(0, -rect.top);
      const visBottom = Math.min(cssHeight, window.innerHeight - rect.top);
      if (visBottom <= visTop) return [0, cssHeight * SPAWN_Y_MAX_FRACTION];
      const h = visBottom - visTop;
      return [visTop + h * MOBILE_VIEW_BAND_TOP, visTop + h * MOBILE_VIEW_BAND_BOTTOM];
    }

    let variantsPool: ImageVariants[] = [];
    let leaves: Leaf[] = [];
    let rafId = 0;
    let running = false;
    let lastTime = performance.now();
    let nextGustAt =
      performance.now() +
      (sequence
        ? (sequence.firstDelayMs ?? 500)
        : randRange(rhythm.firstGustMinMs, rhythm.firstGustMaxMs));
    let seqIndex = 0;
    const pendingTimeouts: number[] = [];

    function maybeSpawnGust(now: number) {
      if (variantsPool.length === 0) {
        nextGustAt = now + 300;
        return;
      }
      if (now < nextGustAt) return;
      if (leaves.length >= maxLeaves) {
        nextGustAt = now + 1000;
        return;
      }
      if (sequence) {
        const origin = sequence.order[seqIndex++ % sequence.order.length];
        leaves.push(
          spawnLeaf(variantsPool, ...spawnBand(), {
            origin,
            width: cssWidth,
            speedFactor: sequence.speedFactor,
            alphaFactor: sequence.alphaFactor,
          }),
        );
        nextGustAt = now + sequence.intervalMs;
        return;
      }
      const gustSize = Math.min(randInt(rhythm.sizeMin, rhythm.sizeMax), maxLeaves - leaves.length);
      for (let i = 0; i < gustSize; i++) {
        const id = window.setTimeout(() => {
          if (running) leaves.push(spawnLeaf(variantsPool, ...spawnBand()));
        }, i * rhythm.staggerMs);
        pendingTimeouts.push(id);
      }
      nextGustAt =
        now + randRange(rhythm.intervalMinMs, rhythm.intervalMaxMs) * intervalFactor;
    }

    function loop(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      maybeSpawnGust(now);
      ctx!.clearRect(0, 0, cssWidth, cssHeight);

      for (const leaf of leaves) updateLeaf(leaf, dt, now, cssWidth, cssHeight);
      leaves = leaves.filter((leaf) => !leaf.done);
      leaves.sort((a, b) => a.depth - b.depth);

      for (const leaf of leaves) drawTrail(ctx!, leaf);
      for (const leaf of leaves) drawLeaf(ctx!, leaf);

      rafId = requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
      pendingTimeouts.forEach((id) => clearTimeout(id));
      pendingTimeouts.length = 0;
    }

    let cancelled = false;
    Promise.all(LEAF_SOURCES.map(loadImage))
      .then((images) => {
        if (cancelled) return;
        variantsPool = buildVariants(images);
      })
      .catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    observer.observe(wrapper);

    return () => {
      cancelled = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
    };
    // sequence é uma constante de módulo na página (não muda entre renders).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rhythm, maxLeavesProp?.desktop, maxLeavesProp?.mobile, sequence]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      // Sempre ATRÁS do conteúdo (desktop e mobile). No mobile chegou a ficar
      // na frente dos cards e foi descartado: atrapalhava a leitura.
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
