import { Shield, Sparkles, Star } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl gradient-purple-pink mx-auto mb-4 flex items-center justify-center glow-purple">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">GlowUp AI</h1>
          <p className="text-white/60 text-lg">
            Your personal appearance coach
          </p>
          <p className="text-white/50 text-sm mt-1">Made by @lord_ron666</p>
        </div>
        <div className="space-y-3 mb-10">
          {[
            { icon: Star, text: "AI-powered appearance analysis" },
            { icon: Sparkles, text: "Personalized skincare & style tips" },
            { icon: Shield, text: "Private & secure — your data stays yours" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 glass rounded-xl p-4"
            >
              <div className="w-8 h-8 rounded-lg gradient-purple-pink flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/80 text-sm">{text}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="w-full py-4 rounded-2xl gradient-purple-pink text-white font-bold text-lg glow-purple hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isLoggingIn ? "Connecting..." : "Get Started"}
        </button>
        <p className="text-center text-white/40 text-xs mt-4">
          Powered by Internet Identity — no passwords needed
        </p>
      </div>
    </div>
  );
}
