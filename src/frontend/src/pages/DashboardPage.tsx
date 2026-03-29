import { Camera, Crown, Sparkles, TrendingUp } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { Page } from "../App";

const DEFAULT_SCORES = {
  skin: 7.2,
  hair: 6.8,
  symmetry: 7.5,
  style: 6.5,
  overall: 7.0,
};

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    scans: "2 Free Scans",
    tag: "Get started",
    borderClass: "border-white/20",
    glowStyle: {},
    tagColor: "text-white/50",
    badgeBg: "bg-white/10",
    priceColor: "text-white",
  },
  {
    id: "chad",
    name: "Chad",
    price: "$20/mo",
    scans: "20 Scans",
    tag: "Most Popular",
    borderClass: "border-violet-500/60",
    glowStyle: {
      boxShadow:
        "0 0 18px rgba(167,139,250,0.4), 0 0 40px rgba(139,92,246,0.2)",
    },
    tagColor: "text-violet-300",
    badgeBg: "bg-violet-500/20",
    priceColor: "text-violet-300",
  },
  {
    id: "trueadam",
    name: "True Adam",
    price: "$50/mo",
    scans: "40 Scans",
    tag: "Elite",
    borderClass: "border-yellow-400/70",
    glowStyle: {
      boxShadow: "0 0 20px rgba(234,179,8,0.5), 0 0 50px rgba(234,179,8,0.2)",
    },
    tagColor: "text-yellow-300",
    badgeBg: "bg-yellow-400/15",
    priceColor: "text-yellow-300",
  },
];

export default function DashboardPage({
  scanResult,
  setPage,
}: {
  scanResult: null | {
    skin: number;
    hair: number;
    symmetry: number;
    style: number;
    overall: number;
    photoUrl?: string;
  };
  setPage: (p: Page) => void;
}) {
  const scores = scanResult ?? DEFAULT_SCORES;
  const radarData = [
    { category: "Skin", score: scores.skin },
    { category: "Hair", score: scores.hair },
    { category: "Symmetry", score: scores.symmetry },
    { category: "Style", score: scores.style },
  ];
  const categories = [
    { label: "Skin", value: scores.skin, color: "from-purple-500 to-pink-500" },
    { label: "Hair", value: scores.hair, color: "from-pink-500 to-rose-500" },
    {
      label: "Symmetry",
      value: scores.symmetry,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Style",
      value: scores.style,
      color: "from-fuchsia-500 to-pink-500",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="glass rounded-2xl p-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs text-white/70 mb-3">
          <Sparkles className="w-3 h-3" />
          {scanResult ? "Your latest analysis" : "Start your first scan"}
        </div>
        <div className="text-7xl font-black text-white mb-1">
          {scores.overall.toFixed(1)}
          <span className="text-3xl text-white/40">/10</span>
        </div>
        <p className="text-white/60 text-sm">Overall Glow Score</p>
        {!scanResult && (
          <p className="text-white/40 text-xs mt-1">
            Demo data — scan your face to get your real score
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ label, value, color }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">{label}</span>
              <span className="text-white font-bold text-lg">
                {value.toFixed(1)}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
                style={{ width: `${value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="text-white/70 text-sm font-medium mb-2 text-center">
          Glow Profile
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPage("scan")}
          data-ocid="dashboard.scan.button"
          className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all"
        >
          <div className="w-10 h-10 rounded-xl gradient-purple-pink flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">New Scan</p>
            <p className="text-white/50 text-xs">Analyze your look</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setPage("progress")}
          data-ocid="dashboard.progress.button"
          className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all"
        >
          <div className="w-10 h-10 rounded-xl gradient-purple-pink flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">Progress</p>
            <p className="text-white/50 text-xs">Track improvement</p>
          </div>
        </button>
      </div>

      {/* Upgrade Plans Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown
              className="w-5 h-5"
              style={{
                color: "#ffd700",
                filter: "drop-shadow(0 0 6px rgba(234,179,8,0.8))",
              }}
            />
            <h3 className="text-white font-bold text-base">
              ✨ Upgrade Your Glow
            </h3>
          </div>
          <button
            type="button"
            data-ocid="dashboard.subscription.button"
            onClick={() => setPage("subscription")}
            className="text-xs font-semibold px-3 py-1 rounded-full border border-yellow-400/50 transition-all animate-gold-glow"
            style={{ color: "#ffd700" }}
          >
            View Plans
          </button>
        </div>

        {/* Horizontal scrollable plan cards */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {plans.map((plan, idx) => (
            <button
              type="button"
              key={plan.id}
              data-ocid={`dashboard.plans.card.${idx + 1}`}
              className={`flex-none w-36 rounded-2xl border p-3 glass snap-start cursor-pointer hover:scale-105 transition-transform text-left ${plan.borderClass}`}
              style={plan.glowStyle}
              onClick={() => setPage("subscription")}
            >
              <div
                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${plan.badgeBg} ${plan.tagColor}`}
              >
                {plan.tag}
              </div>
              <p className="text-white font-bold text-sm leading-tight">
                {plan.name}
              </p>
              <p
                className={`font-black text-xl leading-tight ${plan.priceColor}`}
              >
                {plan.price}
              </p>
              <p className="text-white/50 text-[11px] mt-1">{plan.scans}</p>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-white/30 text-xs pb-4">
        Results are AI-generated suggestions for informational purposes only and
        are not medical advice.
      </p>
    </div>
  );
}
