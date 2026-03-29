import { useQuery } from "@tanstack/react-query";
import { Camera, TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PhotoAnalysis } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ProgressPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const { data: analyses } = useQuery<PhotoAnalysis[]>({
    queryKey: ["analyses", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserAnalyses(identity.getPrincipal());
    },
    enabled: !!actor && !!identity,
  });

  const chartData = (analyses ?? []).map((a, i) => ({
    scan: `Scan ${i + 1}`,
    Skin: Number(a.skinScore) / 10,
    Hair: Number(a.hairScore) / 10,
    Symmetry: Number(a.symmetryScore) / 10,
    Style: Number(a.styleScore) / 10,
    Overall: Number(a.overallScore) / 10,
  }));

  const hasData = chartData.length > 0;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-center pt-4">
        <h2 className="text-2xl font-bold text-white">Progress Tracking</h2>
        <p className="text-white/60 text-sm mt-1">
          Watch your glow-up journey unfold
        </p>
      </div>

      {/* Stats */}
      {hasData && (
        <div className="grid grid-cols-3 gap-3">
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{analyses!.length}</p>
            <p className="text-white/50 text-xs">Total Scans</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-white">
              {(
                Number(analyses![analyses!.length - 1].overallScore) / 10
              ).toFixed(1)}
            </p>
            <p className="text-white/50 text-xs">Latest Score</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <p className="text-2xl font-bold text-white">
              {analyses!.length > 1
                ? `+${((Number(analyses![analyses!.length - 1].overallScore) - Number(analyses![0].overallScore)) / 10).toFixed(1)}`
                : "—"}
            </p>
            <p className="text-white/50 text-xs">Improvement</p>
          </div>
        </div>
      )}

      {/* Chart */}
      {hasData ? (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-bold">Score History</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="scan"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,10,40,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "white",
                }}
              />
              <Legend
                wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="Overall"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: "#a855f7" }}
              />
              <Line
                type="monotone"
                dataKey="Skin"
                stroke="#60a5fa"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Hair"
                stroke="#f472b6"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Symmetry"
                stroke="#34d399"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Style"
                stroke="#fbbf24"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-purple-pink mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <p className="text-white font-medium mb-1">No scans yet</p>
          <p className="text-white/50 text-sm">
            Complete your first scan to start tracking progress
          </p>
        </div>
      )}

      {/* Individual scan list */}
      {hasData && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-white font-bold mb-3">Scan History</h3>
          <div className="space-y-2">
            {[...(analyses ?? [])].reverse().map((a, i) => (
              <div
                key={`${a.photoId}-${i}`}
                className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    Scan #{(analyses?.length ?? 0) - i}
                  </p>
                  <p className="text-white/40 text-xs">
                    {new Date(
                      Number(a.timestamp) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">
                    {(Number(a.overallScore) / 10).toFixed(1)}
                  </p>
                  <p className="text-white/40 text-xs">Overall</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
