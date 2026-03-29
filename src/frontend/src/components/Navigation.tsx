import {
  Camera,
  Copy,
  Crown,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MessageCircle,
  Moon,
  Salad,
  Shirt,
  Sparkles,
  Sun,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page, Plan } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const navItems: {
  id: Page;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "scan", label: "Scan", icon: Camera },
  { id: "tips", label: "Tips", icon: Lightbulb },
  { id: "diet", label: "Diet", icon: Salad },
  { id: "style", label: "Style", icon: Shirt },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "subscription", label: "Plans", icon: Crown },
];

const planLabels: Record<Plan, { label: string; color: string }> = {
  basic: { label: "Basic", color: "bg-white/20 text-white" },
  chad: { label: "Chad", color: "bg-blue-500/80 text-white" },
  adam: { label: "True Adam", color: "bg-yellow-500/80 text-black" },
};

export default function Navigation({
  page,
  setPage,
  dark,
  setDark,
  currentPlan = "basic",
}: {
  page: Page;
  setPage: (p: Page) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  currentPlan?: Plan;
}) {
  const { clear, identity } = useInternetIdentity();
  const [sheetOpen, setSheetOpen] = useState(false);

  const principal = identity?.getPrincipal().toText() ?? "";
  const initials = principal ? principal.slice(0, 2).toUpperCase() : "U";
  const plan = planLabels[currentPlan];

  const copyPrincipal = () => {
    navigator.clipboard.writeText(principal).then(() => {
      toast.success("Principal ID copied!");
    });
  };

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-purple-pink flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-lg">GlowUp AI</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isPlans = item.id === "subscription";
          const isActive = page === item.id;

          if (isPlans && !isActive) {
            return (
              <button
                type="button"
                key={item.id}
                data-ocid="nav.subscription.link"
                onClick={() => setPage(item.id)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all animate-gold-glow border border-yellow-400/50 bg-yellow-400/10"
                style={{ color: "#ffd700" }}
              >
                <Crown
                  className="w-4 h-4"
                  style={{
                    color: "#ffd700",
                    filter: "drop-shadow(0 0 4px rgba(234,179,8,0.8))",
                  }}
                />
                <span className="hidden sm:block gold-shimmer-text">Plans</span>
              </button>
            );
          }

          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "gradient-purple-pink text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:block">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Avatar Button */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              data-ocid="nav.profile.button"
              className="w-8 h-8 rounded-full gradient-purple-pink flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-all ring-2 ring-white/20 hover:ring-white/40"
              aria-label="Open profile"
            >
              {initials}
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="glass-dark border-white/10 text-white w-80"
            data-ocid="nav.profile.sheet"
          >
            <SheetHeader>
              <SheetTitle className="text-white">My Profile</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col items-center gap-4 mt-6">
              {/* Large avatar */}
              <div className="w-20 h-20 rounded-full gradient-purple-pink flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {initials}
              </div>

              {/* Plan badge */}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${plan.color}`}
              >
                {plan.label} Plan
              </span>
            </div>

            {/* Principal ID */}
            <div className="mt-6 px-1">
              <p className="text-white/50 text-xs mb-1 font-medium uppercase tracking-wider">
                Principal ID
              </p>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <p
                  className="text-white/80 text-xs font-mono flex-1 truncate"
                  title={principal}
                >
                  {principal || "Not available"}
                </p>
                <button
                  type="button"
                  data-ocid="nav.profile.button"
                  onClick={copyPrincipal}
                  className="text-white/50 hover:text-white transition-colors flex-shrink-0"
                  aria-label="Copy principal ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="mt-8 px-1">
              <Button
                data-ocid="nav.profile.button"
                onClick={() => {
                  setSheetOpen(false);
                  clear();
                }}
                className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30"
                variant="ghost"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
