import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Gender } from "../backend";
import { useActor } from "../hooks/useActor";

const GOALS = [
  "Skincare",
  "Fitness",
  "Grooming",
  "Style",
  "Nutrition",
  "Confidence",
];

export default function ProfileSetupPage({ onDone }: { onDone: () => void }) {
  const { actor, isFetching } = useActor();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<
    "male" | "female" | "nonBinary" | "other"
  >("male");
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // After 4 seconds of waiting, stop blocking the button even if actor is still loading
  const [actorTimedOut, setActorTimedOut] = useState(false);

  useEffect(() => {
    if (!actor && isFetching) {
      const t = setTimeout(() => setActorTimedOut(true), 4000);
      return () => clearTimeout(t);
    }
    if (actor) setActorTimedOut(false);
  }, [actor, isFetching]);

  const toggleGoal = (g: string) =>
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );

  const save = async () => {
    if (!username || !age) return;
    if (!actor) {
      toast.error("Still connecting — please try again in a moment.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    try {
      const genderVal: Gender =
        gender === "other"
          ? { __kind__: "other", other: "other" }
          : gender === "nonBinary"
            ? { __kind__: "nonBinary", nonBinary: null }
            : gender === "female"
              ? { __kind__: "female", female: null }
              : { __kind__: "male", male: null };
      await actor.saveCallerUserProfile(
        username,
        BigInt(Number.parseInt(age)),
        genderVal,
        goals,
        "",
      );
      onDone();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setErrorMsg(msg);
      toast.error("Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const missingUsername = !username;
  const missingAge = !age;

  // Only show "Connecting..." if actor is loading AND we haven't timed out
  const showConnecting = !actor && isFetching && !actorTimedOut;
  const isDisabled = saving || showConnecting || missingUsername || missingAge;

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-purple-pink mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Set Up Your Profile</h2>
          <p className="text-white/60 mt-1">Help us personalize your journey</p>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-white/70 text-sm font-medium block mb-1"
            >
              Username
            </label>
            <input
              id="username"
              data-ocid="profile.input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. glowup_alex"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="text-white/70 text-sm font-medium block mb-1"
            >
              Age
            </label>
            <input
              id="age"
              data-ocid="profile.age.input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              min="13"
              max="99"
              placeholder="e.g. 24"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium mb-2">Gender</p>
            <div className="grid grid-cols-2 gap-2">
              {(["male", "female", "nonBinary", "other"] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    gender === g
                      ? "gradient-purple-pink text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {g === "nonBinary"
                    ? "Non-Binary"
                    : g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium mb-2">
              Goals (select all that apply)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => toggleGoal(g)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    goals.includes(g)
                      ? "gradient-purple-pink text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {(missingUsername || missingAge) && (
            <p className="text-yellow-400/80 text-xs text-center">
              {missingUsername && missingAge
                ? "Please enter your username and age to continue."
                : missingUsername
                  ? "Please enter a username to continue."
                  : "Please enter your age to continue."}
            </p>
          )}

          <button
            type="button"
            data-ocid="profile.primary_button"
            onClick={save}
            disabled={isDisabled}
            className="w-full py-4 rounded-2xl gradient-purple-pink text-white font-bold text-lg glow-purple hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : showConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              "Start My Glow-Up Journey ✨"
            )}
          </button>

          {errorMsg && (
            <p
              data-ocid="profile.error_state"
              className="text-red-400 text-sm text-center mt-1"
            >
              ⚠️ {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
