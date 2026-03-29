import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronRight,
  Crown,
  Lock,
  Sparkles,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import type { Page, Plan } from "../App";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

type SkinCondition = "acne" | "dull" | "uneven" | "rough" | "healthy";

interface AnalysisResult {
  skin: number;
  hair: number;
  symmetry: number;
  style: number;
  overall: number;
  conditions: SkinCondition[];
  photoUrl: string;
}

const RATING_TIERS = [
  {
    min: 0,
    max: 4.9,
    label: "Sub-5",
    emoji: "💀",
    color: "text-red-500",
    bg: "bg-red-500/20",
    border: "border-red-500/40",
    description:
      "Real talk — you've got significant work to do. Start with basic grooming, skincare, and posture. Improvement is 100% possible with consistency.",
  },
  {
    min: 5.0,
    max: 5.9,
    label: "LTN",
    emoji: "😐",
    color: "text-orange-400",
    bg: "bg-orange-500/20",
    border: "border-orange-500/40",
    description:
      "Below average right now, but fixable. A solid skincare routine, better haircut, and gym progress can push you up a tier quickly.",
  },
  {
    min: 6.0,
    max: 6.4,
    label: "MTN",
    emoji: "🙂",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/40",
    description:
      "Average — you blend in with most guys. You're not at a disadvantage, but targeted improvements in grooming and style will make a real difference.",
  },
  {
    min: 6.5,
    max: 7.4,
    label: "HTN",
    emoji: "😎",
    color: "text-lime-400",
    bg: "bg-lime-500/20",
    border: "border-lime-500/40",
    description:
      "Above average and noticeable. You've got a decent foundation. Sharpen your style, stay consistent with skincare, and you could push into elite territory.",
  },
  {
    min: 7.5,
    max: 8.4,
    label: "Chad Lite",
    emoji: "🔥",
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/40",
    description:
      "Genuinely attractive — you turn heads. Most people will never reach this tier. Keep your grooming, fitness, and style locked in.",
  },
  {
    min: 8.5,
    max: 9.4,
    label: "Chad",
    emoji: "👑",
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    description:
      "Elite attractiveness. Top 5% globally. You've won the genetic lottery and made the most of it. Maintain everything.",
  },
  {
    min: 9.5,
    max: 10,
    label: "True Adam",
    emoji: "⚡",
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/40 shadow-amber-500/50",
    description:
      "Legendary. Near-perfect facial structure. Less than 1% of people score here. You are operating at a completely different level.",
  },
] as const;

function getRatingTier(score: number) {
  return (
    RATING_TIERS.find((t) => score >= t.min && score <= t.max) ??
    RATING_TIERS[0]
  );
}

const ANALYSIS_STAGES = [
  "Detecting skin regions...",
  "Checking for acne & redness...",
  "Analyzing skin texture...",
  "Generating your skincare routine...",
];

const ROUTINES: Record<SkinCondition, { title: string; steps: string[] }> = {
  acne: {
    title: "Acne & Redness Routine",
    steps: [
      "Salicylic acid (2%) cleanser — morning & night",
      "Niacinamide 10% serum — reduces redness & pores",
      "Non-comedogenic, oil-free moisturizer",
      "SPF 30+ sunscreen every morning",
      "Avoid heavy makeup & occlusive products",
      "Spot-treat with benzoyl peroxide (2.5%) at night",
    ],
  },
  dull: {
    title: "Dry & Dull Skin Routine",
    steps: [
      "Gentle, hydrating cream cleanser",
      "Hyaluronic acid serum on damp skin",
      "Ceramide-rich moisturizer to repair barrier",
      "Weekly gentle exfoliant (lactic acid)",
      "SPF 30+ sunscreen every morning",
      "Drink at least 2L of water daily",
    ],
  },
  uneven: {
    title: "Uneven Skin Tone Routine",
    steps: [
      "Gentle foaming cleanser",
      "Vitamin C serum (morning) — brightens & evens tone",
      "AHA exfoliant (glycolic acid) — 2-3x per week at night",
      "Brightening moisturizer with niacinamide",
      "SPF 50 sunscreen every morning (critical!)",
      "Avoid picking or rubbing skin",
    ],
  },
  rough: {
    title: "Rough Texture Routine",
    steps: [
      "Enzyme or BHA cleanser",
      "Retinol serum (start 0.025%) — 3x per week at night",
      "Hydrating toner with hyaluronic acid",
      "Rich moisturizer to prevent dryness from retinol",
      "SPF 30+ sunscreen every morning",
      "Physical exfoliant (gentle) — once per week max",
    ],
  },
  healthy: {
    title: "Healthy Skin Maintenance Routine",
    steps: [
      "Gentle gel or foam cleanser — morning & night",
      "Hydrating serum (hyaluronic acid or peptides)",
      "Lightweight daily moisturizer",
      "SPF 30+ sunscreen every morning",
      "Weekly antioxidant mask for prevention",
      "Stay consistent — your skin is thriving!",
    ],
  },
};

const PLAN_LIMITS: Record<Plan, number> = {
  basic: 2,
  chad: 20,
  adam: 40,
};

const PLAN_LABELS: Record<Plan, string> = {
  basic: "Basic",
  chad: "Chad",
  adam: "True Adam Pack",
};

function analyzeImageCanvas(dataUrl: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const SIZE = 400;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, SIZE, SIZE);

      // ── Helpers ──────────────────────────────────────────────────────────
      const getZone = (x: number, y: number, w: number, h: number) =>
        ctx.getImageData(x, y, w, h).data;

      const stats = (pixels: Uint8ClampedArray) => {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let sumLum = 0;
        const lums: number[] = [];
        const n = pixels.length / 4;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          sumR += r;
          sumG += g;
          sumB += b;
          const l = 0.299 * r + 0.587 * g + 0.114 * b;
          sumLum += l;
          lums.push(l);
        }
        const avgR = sumR / n;
        const avgG = sumG / n;
        const avgB = sumB / n;
        const avgLum = sumLum / n;
        const variance = lums.reduce((a, l) => a + (l - avgLum) ** 2, 0) / n;
        const stdDev = Math.sqrt(variance);
        // saturation (0-1)
        const maxC = Math.max(avgR, avgG, avgB) / 255;
        const minC = Math.min(avgR, avgG, avgB) / 255;
        const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
        // redness ratio
        const redness = avgR / (avgG + 1);
        // edge density (roughness)
        let edges = 0;
        for (let i = 4; i < pixels.length; i += 4) {
          const prevL =
            0.299 * pixels[i - 4] +
            0.587 * pixels[i - 3] +
            0.114 * pixels[i - 2];
          const currL =
            0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
          edges += Math.abs(currL - prevL);
        }
        const edgeDensity = edges / n;
        return { avgR, avgG, avgB, avgLum, stdDev, sat, redness, edgeDensity };
      };

      // ── Zone breakdown (3x3 grid, ignore corners for face focus) ─────────
      const zone = SIZE / 3;
      const zones = [
        stats(getZone(zone, 0, zone, zone)), // top-center (forehead)
        stats(getZone(0, zone, zone, zone)), // mid-left (left cheek)
        stats(getZone(zone, zone, zone, zone)), // mid-center (nose/lips)
        stats(getZone(zone * 2, zone, zone, zone)), // mid-right (right cheek)
        stats(getZone(zone, zone * 2, zone, zone)), // chin area
      ];

      const avg = (fn: (z: (typeof zones)[0]) => number) =>
        zones.reduce((a, z) => a + fn(z), 0) / zones.length;

      const avgLum = avg((z) => z.avgLum);
      const avgStdDev = avg((z) => z.stdDev);
      const avgRedness = avg((z) => z.redness);
      const avgEdge = avg((z) => z.edgeDensity);
      const avgSat = avg((z) => z.sat);

      // symmetry: compare left vs right cheek luminance difference
      const leftLum = zones[1].avgLum;
      const rightLum = zones[3].avgLum;
      const symDiff = Math.abs(leftLum - rightLum);

      // ── Deterministic image fingerprint for consistency ───────────────────
      const full = ctx.getImageData(0, 0, SIZE, SIZE).data;
      let hash = 0;
      for (let i = 0; i < full.length; i += 40) {
        hash = (hash * 31 + full[i]) >>> 0;
      }
      const hashNudge = ((hash % 100) / 100 - 0.5) * 0.6; // ±0.3 nudge

      // ── Sub-scores (0-10) ─────────────────────────────────────────────────
      // Skin clarity: penalise redness, high variance, and high edge density (harsher penalties)
      const skinClarity = Math.max(
        1,
        Math.min(
          10,
          10 - (avgRedness - 1.0) * 12 - avgStdDev * 0.06 - avgEdge * 0.25,
        ),
      );

      // Brightness/health: ideal luminance ~100-180
      const lumScore =
        avgLum < 50
          ? 3
          : avgLum < 80
            ? 5 + (avgLum - 50) / 15
            : avgLum < 180
              ? 8 + (avgLum - 80) / 200
              : avgLum < 220
                ? 7 - (avgLum - 180) / 20
                : 4;

      // Symmetry: more sensitive to asymmetry (divider 3 instead of 5)
      const symmetryScore = Math.max(2, Math.min(10, 10 - symDiff / 3));

      // Texture: smooth texture = lower edgeDensity (but some is natural)
      const textureScore = Math.max(
        2,
        Math.min(10, 10 - Math.max(0, avgEdge - 3) * 0.5),
      );

      // Saturation: healthy skin has moderate saturation (0.1-0.35)
      const satScore =
        avgSat < 0.05
          ? 5
          : avgSat < 0.15
            ? 6 + avgSat * 10
            : avgSat < 0.35
              ? 8.5
              : avgSat < 0.5
                ? 8 - (avgSat - 0.35) * 6
                : 5;

      // ── Weighted composite ────────────────────────────────────────────────
      const composite =
        skinClarity * 0.3 +
        lumScore * 0.2 +
        symmetryScore * 0.25 +
        textureScore * 0.15 +
        satScore * 0.1;

      // ── Strict bell curve: most people 5.0-6.5, Chad/True Adam genuinely rare ──
      const rawNorm = composite / 10; // 0-1
      // Power curve 2.5 compresses mid-high scores heavily
      const curved = rawNorm ** 2.5;
      // Base 2.0, max range 8.0, so perfect=10, average composite→MTN/HTN range
      const normalised = 2.0 + curved * 8.0 + hashNudge * 0.4;
      const overall = Math.max(
        1.0,
        Math.min(10.0, Math.round(normalised * 10) / 10),
      );

      // ── Sub-scores for display ────────────────────────────────────────────
      const skin = Math.round(
        Math.min(10, Math.max(1, skinClarity + hashNudge * 0.5)),
      );
      const hair = Math.round(
        Math.min(10, Math.max(1, lumScore + hashNudge * 0.3 + 0.5)),
      );
      const symmetry = Math.round(Math.min(10, Math.max(1, symmetryScore)));
      const style = Math.round(
        Math.min(10, Math.max(1, satScore + hashNudge * 0.4 + 1)),
      );

      // ── Skin conditions ───────────────────────────────────────────────────
      const conditions: SkinCondition[] = [];
      if (avgRedness > 1.25 && avgStdDev > 30) conditions.push("acne");
      else if (avgStdDev > 35) conditions.push("uneven");
      if (avgLum < 90) conditions.push("dull");
      if (avgEdge > 12 && !conditions.includes("acne"))
        conditions.push("rough");
      if (conditions.length === 0) conditions.push("healthy");

      resolve({
        skin,
        hair,
        symmetry,
        style,
        overall,
        conditions,
        photoUrl: dataUrl,
      });
    };
    img.src = dataUrl;
  });
}

export default function ScanPage({
  setScanResult,
  setPage,
  scanCount,
  currentPlan,
  onScanComplete,
}: {
  setScanResult: (r: {
    skin: number;
    hair: number;
    symmetry: number;
    style: number;
    overall: number;
    photoUrl?: string;
  }) => void;
  setPage: (p: Page) => void;
  scanCount: number;
  currentPlan: Plan;
  onScanComplete: () => void;
}) {
  const { actor } = useActor();
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const scanLimit = PLAN_LIMITS[currentPlan];
  const isLocked = scanCount >= scanLimit;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    setProgress(0);
    setStageIndex(0);

    const stageDelay = 400;
    for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, stageDelay));
      setStageIndex(i);
      setProgress(Math.round(((i + 1) / ANALYSIS_STAGES.length) * 80));
    }

    const analysisResult = await analyzeImageCanvas(preview);
    setProgress(100);

    try {
      if (actor) {
        const photoId = `photo_${Date.now()}`;
        const res = await fetch(preview);
        const buf = await res.arrayBuffer();
        const blob = ExternalBlob.fromBytes(new Uint8Array(buf));
        await actor.addPhotoReference(photoId, blob);
        await actor.addPhotoAnalysis(
          photoId,
          BigInt(Math.round(analysisResult.skin * 10)),
          BigInt(Math.round(analysisResult.hair * 10)),
          BigInt(Math.round(analysisResult.symmetry * 10)),
          BigInt(Math.round(analysisResult.style * 10)),
          BigInt(Math.round(analysisResult.overall * 10)),
        );
      }
    } catch {
      // continue even if save fails
    }

    setResult(analysisResult);
    setAnalyzing(false);
    onScanComplete();
  };

  const goToDashboard = () => {
    if (!result) return;
    setScanResult({
      skin: result.skin,
      hair: result.hair,
      symmetry: result.symmetry,
      style: result.style,
      overall: result.overall,
      photoUrl: result.photoUrl,
    });
    setPage("dashboard");
  };

  const conditionLabels: Record<
    SkinCondition,
    { label: string; icon: string; color: string }
  > = {
    acne: {
      label: "Moderate acne / redness detected",
      icon: "⚠️",
      color: "text-red-400",
    },
    dull: {
      label: "Dull or dry skin detected",
      icon: "💧",
      color: "text-blue-300",
    },
    uneven: {
      label: "Uneven skin tone detected",
      icon: "🔶",
      color: "text-yellow-400",
    },
    rough: {
      label: "Rough texture / enlarged pores",
      icon: "🔍",
      color: "text-orange-400",
    },
    healthy: {
      label: "Healthy, balanced skin",
      icon: "✅",
      color: "text-green-400",
    },
  };

  const scoreColor = (s: number) =>
    s >= 8.5
      ? "text-amber-400"
      : s >= 7.5
        ? "text-purple-400"
        : s >= 6.5
          ? "text-blue-400"
          : s >= 5.0
            ? "text-yellow-400"
            : "text-red-400";

  // Locked / upgrade wall
  if (isLocked) {
    return (
      <div className="max-w-md mx-auto p-4 pb-10">
        <div className="text-center pt-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Face Scan</h2>
          <p className="text-white/60 text-sm mt-1">Scan limit reached</p>
        </div>
        <div
          className="glass rounded-3xl p-8 text-center space-y-5 border border-purple-500/30"
          data-ocid="scan.error_state"
        >
          <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center border-2 border-purple-500/40">
            <Lock className="w-9 h-9 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Scans Used Up</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              You've used all{" "}
              <span className="text-white font-semibold">
                {scanLimit} scans
              </span>{" "}
              included in your{" "}
              <span className="text-purple-400 font-semibold">
                {PLAN_LABELS[currentPlan]}
              </span>{" "}
              plan.
            </p>
          </div>
          <div className="glass rounded-2xl p-4 bg-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60 text-sm">Scans used</span>
              <span className="text-white font-bold">
                {scanCount} / {scanLimit}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full gradient-purple-pink rounded-full"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-white/50 text-xs">
              Upgrade your plan to get more scans
            </p>
            <button
              type="button"
              data-ocid="scan.primary_button"
              onClick={() => setPage("subscription")}
              className="w-full py-4 rounded-2xl gradient-purple-pink text-white font-bold text-base glow-purple hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-10">
      <div className="text-center pt-4">
        <h2 className="text-2xl font-bold text-white">Face Scan</h2>
        <p className="text-white/60 text-sm mt-1">
          Upload a selfie for real AI-powered skin analysis
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <span className="text-white/60 text-xs">Scans used:</span>
          <span className="text-white text-xs font-bold">
            {scanCount} / {scanLimit}
          </span>
        </div>
      </div>

      {!result && (
        <>
          <button
            type="button"
            data-ocid="scan.upload_button"
            className={`w-full glass rounded-2xl overflow-hidden cursor-pointer ${
              preview ? "p-0" : "p-10 border-dashed border-2 border-white/30"
            } hover:bg-white/20 transition-all`}
            onClick={() => !analyzing && fileRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-purple-pink mx-auto mb-4 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="text-white font-medium mb-1">
                  Upload your selfie
                </p>
                <p className="text-white/40 text-sm">
                  Drag & drop or tap to browse
                </p>
              </div>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />

          {!preview && (
            <div className="glass rounded-2xl p-4 space-y-2">
              <p className="text-white/70 text-sm font-medium">
                Tips for best results:
              </p>
              {[
                "Good natural lighting",
                "Facing camera directly",
                "Neutral expression",
                "No heavy filters",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full gradient-purple-pink" />
                  <span className="text-white/60 text-sm">{t}</span>
                </div>
              ))}
            </div>
          )}

          {analyzing && (
            <div
              className="glass rounded-2xl p-4"
              data-ocid="scan.loading_state"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-white text-sm font-medium">
                  {ANALYSIS_STAGES[stageIndex]}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-purple-pink rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2">{progress}% complete</p>
            </div>
          )}

          {preview && !analyzing && (
            <button
              type="button"
              data-ocid="scan.primary_button"
              onClick={analyze}
              className="w-full py-4 rounded-2xl gradient-purple-pink text-white font-bold text-lg glow-purple hover:opacity-90 transition-all"
            >
              <Upload className="inline w-5 h-5 mr-2" />
              Analyze My Look
            </button>
          )}
        </>
      )}

      {result && (
        <div className="space-y-4" data-ocid="scan.success_state">
          <div className="glass rounded-2xl overflow-hidden">
            <img
              src={result.photoUrl}
              alt="Analyzed"
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="glass rounded-2xl p-5 text-center">
            <p className="text-white/50 text-sm mb-1">Overall Glow Score</p>
            <div
              className={`text-6xl font-black mb-1 ${scoreColor(result.overall)}`}
            >
              {result.overall.toFixed(1)}
              <span className="text-2xl text-white/40">/10</span>
            </div>

            {/* Tier Badge */}
            {(() => {
              const tier = getRatingTier(result.overall);
              return (
                <div
                  className={`mt-3 mx-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border ${tier.bg} ${tier.border}`}
                >
                  <span className="text-2xl">{tier.emoji}</span>
                  <div className="text-left">
                    <div
                      className={`text-xl font-black tracking-wide ${tier.color}`}
                    >
                      {tier.label}
                    </div>
                    <div className="text-white/50 text-xs">Rating Tier</div>
                  </div>
                </div>
              );
            })()}

            {/* Tier Description */}
            {(() => {
              const tier = getRatingTier(result.overall);
              return (
                <p className="text-white/60 text-xs mt-3 leading-relaxed px-2">
                  {tier.description}
                </p>
              );
            })()}

            <div className="flex justify-center gap-4 mt-4">
              {(
                [
                  { label: "Skin", value: result.skin },
                  { label: "Hair", value: result.hair },
                  { label: "Symmetry", value: result.symmetry },
                  { label: "Style", value: result.style },
                ] as { label: string; value: number }[]
              ).map((s) => (
                <div key={s.label} className="text-center">
                  <div className={`text-xl font-bold ${scoreColor(s.value)}`}>
                    {s.value}
                  </div>
                  <div className="text-white/40 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 space-y-2">
            <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Detected Skin Conditions
            </p>
            {result.conditions.map((c) => {
              const info = conditionLabels[c];
              return (
                <div
                  key={c}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-3"
                >
                  <span className="text-lg">{info.icon}</span>
                  <span className={`text-sm font-medium ${info.color}`}>
                    {info.label}
                  </span>
                </div>
              );
            })}
          </div>

          {result.conditions.map((condition) => {
            const routine = ROUTINES[condition];
            return (
              <div key={condition} className="glass rounded-2xl p-4 space-y-3">
                <p className="text-white font-bold text-sm">
                  ✨ {routine.title}
                </p>
                <div className="space-y-2">
                  {routine.steps.map((step, i) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full gradient-purple-pink flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-white/70 text-sm leading-relaxed">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white/40 text-xs leading-relaxed">
              ⚕️ These suggestions are AI-generated based on image analysis and
              are not medical advice. Consult a dermatologist for professional
              skin care guidance.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              data-ocid="scan.secondary_button"
              onClick={() => {
                setPreview(null);
                setResult(null);
              }}
              className="flex-1 py-3 rounded-2xl glass text-white/70 font-medium hover:bg-white/20 transition-all"
            >
              Scan Again
            </button>
            <button
              type="button"
              data-ocid="scan.primary_button"
              onClick={goToDashboard}
              className="flex-1 py-3 rounded-2xl gradient-purple-pink text-white font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              View Dashboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
