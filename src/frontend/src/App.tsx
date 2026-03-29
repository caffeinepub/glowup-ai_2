import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import { Toaster } from "./components/ui/sonner";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import DietPage from "./pages/DietPage";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ProgressPage from "./pages/ProgressPage";
import ScanPage from "./pages/ScanPage";
import StylePage from "./pages/StylePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import TipsPage from "./pages/TipsPage";

export type Page =
  | "dashboard"
  | "scan"
  | "tips"
  | "diet"
  | "style"
  | "progress"
  | "chat"
  | "subscription";

export type Plan = "basic" | "chad" | "adam";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [page, setPage] = useState<Page>("dashboard");
  const [dark, setDark] = useState(true);
  const [profileSetupDone, setProfileSetupDone] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    skin: number;
    hair: number;
    symmetry: number;
    style: number;
    overall: number;
    photoUrl?: string;
  }>(null);
  const [scanCount, setScanCountState] = useState<number>(
    Number.parseInt(localStorage.getItem("glowup_scan_count") || "0", 10),
  );
  const [currentPlan, setCurrentPlanState] = useState<Plan>(
    (localStorage.getItem("glowup_plan") as Plan) || "basic",
  );

  const setScanCount = (n: number) => {
    setScanCountState(n);
    localStorage.setItem("glowup_scan_count", String(n));
  };

  const setCurrentPlan = (p: Plan) => {
    setCurrentPlanState(p);
    localStorage.setItem("glowup_plan", p);
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    if (actor && identity) {
      actor
        .getCallerUserProfile()
        .then((p) => {
          if (p && (p as { username?: string }).username)
            setProfileSetupDone(true);
        })
        .catch(() => {});
    }
  }, [actor, identity]);

  if (isInitializing) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-purple-pink mx-auto mb-4 animate-pulse" />
          <p className="text-white/70 text-lg">Loading GlowUp AI...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  if (!profileSetupDone) {
    return <ProfileSetupPage onDone={() => setProfileSetupDone(true)} />;
  }

  return (
    <div
      className={`min-h-screen ${dark ? "gradient-bg" : "bg-gray-50"} flex flex-col`}
    >
      <Navigation
        page={page}
        setPage={setPage}
        dark={dark}
        setDark={setDark}
        currentPlan={currentPlan}
      />
      <main className="flex-1 overflow-auto">
        {page === "dashboard" && (
          <DashboardPage scanResult={scanResult} setPage={setPage} />
        )}
        {page === "scan" && (
          <ScanPage
            setScanResult={setScanResult}
            setPage={setPage}
            scanCount={scanCount}
            currentPlan={currentPlan}
            onScanComplete={() => setScanCount(scanCount + 1)}
          />
        )}
        {page === "tips" && <TipsPage />}
        {page === "diet" && <DietPage />}
        {page === "style" && <StylePage />}
        {page === "progress" && <ProgressPage />}
        {page === "chat" && <ChatPage />}
        {page === "subscription" && (
          <SubscriptionPage
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
            scanCount={scanCount}
          />
        )}
      </main>
      <Toaster />
    </div>
  );
}
