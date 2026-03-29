import { Check, Crown, Info, Salad, Sparkles, X, Zap } from "lucide-react";
import type { Plan } from "../App";

const PLAN_LIMITS: Record<Plan, number> = {
  basic: 2,
  chad: 20,
  adam: 40,
};

interface PlanConfig {
  id: Plan;
  name: string;
  price: string;
  priceNum: number;
  scans: number;
  badge?: string;
  badgeColor?: string;
  diet: boolean;
  skincare: boolean;
  skincareLevel: string;
  dietLevel: string;
  icon: React.ComponentType<{ className?: string }>;
  glowColor: string;
  borderColor: string;
}

const PLANS: PlanConfig[] = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    priceNum: 0,
    scans: 2,
    diet: false,
    skincare: false,
    skincareLevel: "",
    dietLevel: "",
    icon: Sparkles,
    glowColor: "rgba(255,255,255,0.1)",
    borderColor: "border-white/20",
  },
  {
    id: "chad",
    name: "Chad",
    price: "$20/mo",
    priceNum: 20,
    scans: 20,
    badge: "Popular",
    badgeColor: "bg-purple-500 text-white",
    diet: true,
    skincare: true,
    skincareLevel: "Specialised skincare plan",
    dietLevel: "Specialised diet plan",
    icon: Zap,
    glowColor: "rgba(168,85,247,0.25)",
    borderColor: "border-purple-500/50",
  },
  {
    id: "adam",
    name: "True Adam Pack",
    price: "$50/mo",
    priceNum: 50,
    scans: 40,
    badge: "Best Value",
    badgeColor: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
    diet: true,
    skincare: true,
    skincareLevel: "Premium skincare tips & routine",
    dietLevel: "Advanced nutrition & diet plan",
    icon: Crown,
    glowColor: "rgba(234,179,8,0.2)",
    borderColor: "border-yellow-500/50",
  },
];

export default function SubscriptionPage({
  currentPlan,
  scanCount,
}: {
  currentPlan: Plan;
  setCurrentPlan: (p: Plan) => void;
  scanCount: number;
}) {
  const limit = PLAN_LIMITS[currentPlan];
  const usagePercent = Math.min(100, Math.round((scanCount / limit) * 100));

  return (
    <div className="max-w-lg mx-auto p-4 pb-12 space-y-5">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="w-14 h-14 rounded-2xl gradient-purple-pink mx-auto mb-3 flex items-center justify-center">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
        <p className="text-white/60 text-sm mt-1">
          Level up your glow game with the right pack
        </p>
      </div>

      {/* Info banner */}
      <div
        className="flex items-start gap-3 glass rounded-2xl p-4 border border-blue-500/20"
        data-ocid="subscription.panel"
      >
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-blue-300 text-xs leading-relaxed">
          <span className="font-semibold">Payment coming soon.</span> Preview
          your plan options below — payment integration will be enabled shortly.
          Your current plan is active.
        </p>
      </div>

      {/* Current usage */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white/70 text-sm font-medium">
            Current usage
          </span>
          <span className="text-white text-sm font-bold">
            {scanCount} / {limit} scans
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full gradient-purple-pink rounded-full transition-all duration-700"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <p className="text-white/40 text-xs">
          {limit - scanCount > 0
            ? `${limit - scanCount} scans remaining on ${
                currentPlan === "basic"
                  ? "Basic"
                  : currentPlan === "chad"
                    ? "Chad"
                    : "True Adam Pack"
              } plan`
            : "All scans used — upgrade to get more"}
        </p>
      </div>

      {/* Plan cards */}
      <div className="space-y-4">
        {PLANS.map((plan) => {
          const isActive = currentPlan === plan.id;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              data-ocid={`subscription.${plan.id}.card`}
              className={`glass rounded-3xl p-5 border-2 transition-all ${
                isActive
                  ? `${plan.borderColor} shadow-lg`
                  : "border-white/10 hover:border-white/30"
              }`}
              style={
                isActive ? { boxShadow: `0 0 30px ${plan.glowColor}` } : {}
              }
            >
              {/* Plan header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? "gradient-purple-pink" : "bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-base">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}
                        >
                          {plan.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs">
                      {plan.scans} scans included
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-black text-xl">
                    {plan.price}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-5">
                <FeatureRow
                  icon={<span className="text-sm">📷</span>}
                  label={`${plan.scans} face scans`}
                  included
                />
                <FeatureRow
                  icon={<Salad className="w-3.5 h-3.5" />}
                  label={plan.diet ? plan.dietLevel : "Diet plan"}
                  included={plan.diet}
                />
                <FeatureRow
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  label={plan.skincare ? plan.skincareLevel : "Skincare plan"}
                  included={plan.skincare}
                />
              </div>

              {/* CTA */}
              {plan.priceNum === 0 ? (
                <button
                  type="button"
                  disabled
                  data-ocid={`subscription.${plan.id}.button`}
                  className="w-full py-3 rounded-2xl text-sm font-semibold bg-white/5 text-white/40 cursor-not-allowed"
                >
                  {isActive ? "Current Plan" : "Downgrade (not available)"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  data-ocid={`subscription.${plan.id}.button`}
                  className="w-full py-3 rounded-2xl text-sm font-bold bg-white/10 text-white/50 cursor-not-allowed border border-white/10 relative group"
                >
                  {isActive ? (
                    "Current Plan"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4" />
                      Subscribe — Coming Soon
                    </span>
                  )}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white/70 text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Payment integration coming soon
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-white/30 text-xs">
        Prices are in USD. Subscriptions will be billed monthly via Stripe when
        payment is enabled.
      </p>

      <footer className="text-center pt-2">
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/40 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

function FeatureRow({
  icon,
  label,
  included,
}: {
  icon: React.ReactNode;
  label: string;
  included: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          included ? "bg-green-500/20" : "bg-white/5"
        }`}
      >
        {included ? (
          <Check className="w-3 h-3 text-green-400" />
        ) : (
          <X className="w-3 h-3 text-white/30" />
        )}
      </div>
      <div
        className={`flex items-center gap-1.5 text-xs ${
          included ? "text-white/80" : "text-white/30 line-through"
        }`}
      >
        <span className={included ? "text-white/60" : "text-white/20"}>
          {icon}
        </span>
        {label}
      </div>
    </div>
  );
}
