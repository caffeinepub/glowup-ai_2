import { Camera, Sparkles, TrendingUp } from "lucide-react";
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

      <p className="text-center text-white/30 text-xs pb-4">
        Results are AI-generated suggestions for informational purposes only and
        are not medical advice.
      </p>
    </div>
  );
}
