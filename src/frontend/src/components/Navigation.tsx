import {
  Camera,
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
} from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

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

export default function Navigation({
  page,
  setPage,
  dark,
  setDark,
}: {
  page: Page;
  setPage: (p: Page) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
}) {
  const { clear } = useInternetIdentity();

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-purple-pink flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-lg">GlowUp AI</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`nav.${item.id}.link`}
            onClick={() => setPage(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              page === item.id
                ? "gradient-purple-pink text-white"
                : item.id === "subscription"
                  ? "text-yellow-400/80 hover:text-yellow-300 hover:bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:block">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => clear()}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
