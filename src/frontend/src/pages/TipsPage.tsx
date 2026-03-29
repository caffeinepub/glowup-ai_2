import { Droplets, Dumbbell, Scissors, Shirt, Sun, Wind } from "lucide-react";

const TIPS = [
  {
    category: "Skincare",
    icon: Droplets,
    color: "from-blue-500 to-cyan-400",
    items: [
      {
        title: "Double Cleanse",
        desc: "Remove SPF and makeup with oil cleanser, follow with water-based cleanser.",
      },
      {
        title: "Hydration Layers",
        desc: "Apply toner, serum, and moisturizer while skin is still slightly damp.",
      },
      {
        title: "SPF Daily",
        desc: "SPF 30+ every morning — the single best anti-aging and skin clarity habit.",
      },
      {
        title: "Gentle Exfoliation",
        desc: "Use AHA/BHA 2-3x per week to reveal brighter, smoother skin.",
      },
    ],
  },
  {
    category: "Grooming",
    icon: Scissors,
    color: "from-purple-500 to-violet-400",
    items: [
      {
        title: "Eyebrow Shaping",
        desc: "Clean brows frame your face — consider professional shaping every 4-6 weeks.",
      },
      {
        title: "Lip Care",
        desc: "Exfoliate lips weekly and apply a nourishing lip balm before bed nightly.",
      },
      {
        title: "Ear & Nose",
        desc: "Keep these areas tidy — small details make a big difference in overall appearance.",
      },
      {
        title: "Nail Hygiene",
        desc: "Clean, trimmed nails signal attention to detail. File edges smooth.",
      },
    ],
  },
  {
    category: "Hair Care",
    icon: Wind,
    color: "from-pink-500 to-rose-400",
    items: [
      {
        title: "Heat Protection",
        desc: "Always use heat protectant spray before blow drying or straightening.",
      },
      {
        title: "Deep Conditioning",
        desc: "Use a hair mask weekly to restore moisture and shine.",
      },
      {
        title: "Scalp Health",
        desc: "Massage scalp for 2 mins daily to boost circulation and hair growth.",
      },
      {
        title: "Trim Regularly",
        desc: "Trim every 6-8 weeks to eliminate split ends and keep style fresh.",
      },
    ],
  },
  {
    category: "Fitness",
    icon: Dumbbell,
    color: "from-amber-500 to-yellow-400",
    items: [
      {
        title: "Posture Exercises",
        desc: "Strong core and back muscles improve your posture, which elevates your presence.",
      },
      {
        title: "Face Yoga",
        desc: "5 minutes of facial exercises daily can tone facial muscles and reduce puffiness.",
      },
      {
        title: "Cardio Glow",
        desc: "30 min of cardio 4x/week improves circulation, giving skin a natural glow.",
      },
      {
        title: "Sleep Posture",
        desc: "Sleep on your back or use a silk pillowcase to reduce facial creasing.",
      },
    ],
  },
  {
    category: "Sun & Environment",
    icon: Sun,
    color: "from-orange-500 to-amber-400",
    items: [
      {
        title: "Antioxidant Serum",
        desc: "Vitamin C serum neutralizes free radicals and brightens skin tone.",
      },
      {
        title: "Eye Cream",
        desc: "Thin under-eye skin needs targeted care — apply gently with your ring finger.",
      },
    ],
  },
  {
    category: "Style Basics",
    icon: Shirt,
    color: "from-fuchsia-500 to-pink-400",
    items: [
      {
        title: "Fit Over Brand",
        desc: "Well-fitted clothes in any price range look better than expensive ill-fitting ones.",
      },
      {
        title: "Color Coordination",
        desc: "Stick to 3 colors per outfit max. Build around neutrals.",
      },
    ],
  },
];

export default function TipsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-center pt-4">
        <h2 className="text-2xl font-bold text-white">Improvement Tips</h2>
        <p className="text-white/60 text-sm mt-1">
          Personalized advice for your best look
        </p>
      </div>
      {TIPS.map(({ category, icon: Icon, color, items }) => (
        <div key={category} className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">{category}</h3>
          </div>
          <div className="space-y-3">
            {items.map(({ title, desc }) => (
              <div key={title} className="bg-white/5 rounded-xl p-3">
                <p className="text-white font-medium text-sm mb-0.5">{title}</p>
                <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-white/30 text-xs pb-4">
        These are general suggestions, not medical or professional advice.
      </p>
    </div>
  );
}
