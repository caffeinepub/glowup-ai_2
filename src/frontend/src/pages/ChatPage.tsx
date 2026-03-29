import { useQuery } from "@tanstack/react-query";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const RESPONSES: Record<string, string[]> = {
  jawline: [
    "To define your jawline, try mewing (proper tongue posture), face yoga jaw exercises, and reduce sodium intake to minimize water retention. Cardio helps reduce overall face fat too.",
    "Consistency with facial exercises + staying lean through cardio are the most effective natural ways to define your jawline over time.",
  ],
  skin: [
    "Clear skin comes down to: consistent cleansing, SPF every morning, non-comedogenic moisturizer, and staying hydrated. Vitamin C serum in the morning and retinol at night are game changers.",
    "The basics: wash your face twice daily, never sleep in makeup, change pillowcases weekly, and stay hydrated. These alone improve most skin concerns.",
  ],
  hair: [
    "For healthy hair: reduce heat styling, use a satin pillowcase, deep condition weekly, and take a biotin supplement. Scalp massages improve blood flow and promote growth.",
    "Trim your hair every 6-8 weeks, avoid overwashing, and use a heat protectant whenever styling with heat.",
  ],
  diet: [
    "For a glowing appearance, focus on: antioxidant-rich berries, omega-3 fatty acids from salmon/walnuts, vitamin C from citrus, and at least 2L of water daily.",
    "Cut sugar and processed foods to see the biggest improvement in skin clarity and energy levels.",
  ],
  exercise: [
    "For appearance: combine cardio (fat loss, circulation) with strength training (muscle tone, posture). Aim for 3-5 days per week. Better posture alone dramatically improves how you look.",
    "Face yoga + cardio + strength training is the ultimate combination for improving your physical appearance naturally.",
  ],
  sleep: [
    "Sleep is when your body repairs skin and hair. 7-9 hours on a silk pillowcase with consistent sleep/wake times will visibly improve your skin within weeks.",
    "Poor sleep increases cortisol, which breaks down collagen. Prioritizing sleep is one of the highest-leverage appearance habits.",
  ],
  eye: [
    "For brighter eyes: stay hydrated, get adequate sleep, use eye cream with caffeine to reduce puffiness, and use a cold spoon in the morning to de-puff.",
    "Gua sha massage around the eye area and vitamin K eye cream can reduce dark circles over time.",
  ],
  posture: [
    "Better posture instantly makes you look more confident and attractive. Focus on: strengthening your core and back, keeping your chin level, and opening your chest when standing.",
  ],
};

const DEFAULT_RESPONSES = [
  "Great question! For your best appearance, consistency is everything — pick 2-3 habits and do them daily before adding more.",
  "The fundamentals matter most: sleep 8 hours, drink 2L water, wear SPF, and move your body 30 minutes daily. These alone create visible change.",
  "Self-improvement is a journey, not a destination. Focus on progress, not perfection — every small step compounds over time!",
];

function generateResponse(question: string): string {
  const lower = question.toLowerCase();
  if (
    lower.includes("founder") ||
    lower.includes("owner") ||
    lower.includes("creator") ||
    lower.includes("who made") ||
    lower.includes("who built") ||
    lower.includes("who created") ||
    lower.includes("who owns") ||
    lower.includes("who is behind")
  ) {
    return "GlowUp AI was founded by @lord_ron666. 👑";
  }
  for (const [keyword, responses] of Object.entries(RESPONSES)) {
    if (lower.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return DEFAULT_RESPONSES[
    Math.floor(Math.random() * DEFAULT_RESPONSES.length)
  ];
}

export default function ChatPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<
    { question: string; answer: string }[]
  >([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  const { data: savedMessages } = useQuery<Message[]>({
    queryKey: ["messages", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserMessages(identity.getPrincipal());
    },
    enabled: !!actor && !!identity,
  });

  const allMessages = [
    ...(savedMessages ?? []).map((m) => ({
      question: m.question,
      answer: m.answer,
    })),
    ...localMessages,
  ];

  useEffect(() => {
    if (allMessages.length !== prevLengthRef.current) {
      prevLengthRef.current = allMessages.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const send = async () => {
    if (!input.trim() || sending) return;
    const question = input.trim();
    const answer = generateResponse(question);
    setSending(true);
    setInput("");
    setLocalMessages((prev) => [...prev, { question, answer }]);
    try {
      await actor?.addMessage(question, answer);
    } catch {
      // ignore
    }
    setSending(false);
  };

  const QUICK = [
    "How can I improve my jawline?",
    "Best foods for clear skin?",
    "How to grow thicker hair?",
    "Tips for better sleep?",
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold text-white">AI Beauty Coach</h2>
        <p className="text-white/60 text-sm">
          Ask anything about appearance & self-care
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
        {allMessages.length === 0 && (
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full gradient-purple-pink flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">GlowUp AI</span>
            </div>
            <p className="text-white/80 text-sm">
              Hi! I'm your personal AI beauty and wellness coach. Ask me
              anything about skincare, hair, fitness, diet, or style!
            </p>
            <div className="mt-3 space-y-2">
              {QUICK.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setInput(q)}
                  className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-white/70 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {allMessages.map((msg, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: messages are append-only
          <div key={`msg-${i}`} className="space-y-2">
            <div className="flex justify-end">
              <div className="flex items-end gap-2">
                <div className="bg-purple-600/60 backdrop-blur rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs">
                  <p className="text-white text-sm">{msg.question}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full gradient-purple-pink flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="glass rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-xs">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {msg.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask your beauty coach..."
            className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 text-sm"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || sending}
            className="w-12 h-12 rounded-2xl gradient-purple-pink flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
