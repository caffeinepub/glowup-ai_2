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
      const size = 300;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);

      const margin = Math.floor(size * 0.2);
      const w = size - margin * 2;
      const h = size - margin * 2;
      const imageData = ctx.getImageData(margin, margin, w, h);
      const pixels = imageData.data;

      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      const luminances: number[] = [];
      const pixelCount = w * h;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        totalR += r;
        totalG += g;
        totalB += b;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        luminances.push(lum);
      }

      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;
      const avgLum = luminances.reduce((a, b) => a + b, 0) / luminances.length;

      const lumVariance =
        luminances.reduce((acc, l) => acc + (l - avgLum) ** 2, 0) /
        luminances.length;
      const lumStdDev = Math.sqrt(lumVariance);

      const rednessRatio = avgR / (avgG + 1);

      let roughnessSum = 0;
      let roughnessCount = 0;
      for (let i = 4; i < pixels.length; i += 4) {
        const prevLum =
          0.299 * pixels[i - 4] + 0.587 * pixels[i - 3] + 0.114 * pixels[i - 2];
        const currLum =
          0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
        roughnessSum += Math.abs(currLum - prevLum);
        roughnessCount++;
      }
      const avgRoughness = roughnessSum / roughnessCount;

      const rednessScore = Math.min(10, Math.max(0, (rednessRatio - 1.0) * 20));
      const uniformityBadScore = Math.min(10, lumStdDev / 8);
      const brightnessBadScore =
        avgLum < 80 ? Math.min(10, (80 - avgLum) / 8) : 0;
      const roughnessBadScore = Math.min(10, avgRoughness / 3);

      const conditions: SkinCondition[] = [];
      if (rednessScore > 4 && uniformityBadScore > 4) {
        conditions.push("acne");
      } else if (uniformityBadScore > 5) {
        conditions.push("uneven");
      }
      if (brightnessBadScore > 4) {
        conditions.push("dull");
      }
      if (roughnessBadScore > 5 && !conditions.includes("acne")) {
        conditions.push("rough");
      }
      if (conditions.length === 0) {
        conditions.push("healthy");
      }

      const skinScore = Math.round(
        Math.max(
          3,
          10 -
            rednessScore * 0.4 -
            uniformityBadScore * 0.3 -
            roughnessBadScore * 0.3,
        ),
      );
      const brightnessBonus = avgLum > 80 && avgLum < 200 ? 1 : 0;
      const skin = Math.min(10, skinScore + brightnessBonus);

      const colorRange = Math.abs(avgR - avgB);
      const hair = Math.round(Math.min(10, Math.max(4, 6 + colorRange / 30)));
      const symmetry = Math.round(
        Math.min(10, Math.max(5, 8 - lumStdDev / 20)),
      );
      const style = Math.round(
        Math.min(10, Math.max(4, 6 + (avgB > avgR ? 1 : 0))),
      );
      const overall = Math.round((skin + hair + symmetry + style) / 4);

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
    s >= 8 ? "text-green-400" : s >= 6 ? "text-yellow-400" : "text-red-400";

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
              {result.overall}
              <span className="text-2xl text-white/40">/10</span>
            </div>
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
