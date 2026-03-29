import { Apple, Droplets, Leaf, Zap } from "lucide-react";

const SECTIONS = [
  {
    title: "Skin Health",
    icon: Droplets,
    color: "from-blue-500 to-cyan-400",
    foods: [
      { name: "Blueberries", benefit: "Antioxidants fight skin aging" },
      { name: "Avocado", benefit: "Healthy fats keep skin supple" },
      { name: "Tomatoes", benefit: "Lycopene protects against UV damage" },
      { name: "Sweet Potato", benefit: "Beta-carotene gives a natural glow" },
      { name: "Green Tea", benefit: "Polyphenols reduce inflammation" },
      {
        name: "Dark Chocolate",
        benefit: "Flavonoids hydrate and protect skin",
      },
    ],
  },
  {
    title: "Hair Strength",
    icon: Zap,
    color: "from-amber-500 to-yellow-400",
    foods: [
      { name: "Eggs", benefit: "Biotin and protein for hair growth" },
      { name: "Salmon", benefit: "Omega-3s nourish hair follicles" },
      { name: "Spinach", benefit: "Iron and folate prevent hair loss" },
      {
        name: "Nuts & Seeds",
        benefit: "Zinc and Vitamin E strengthen strands",
      },
      { name: "Greek Yogurt", benefit: "Protein and vitamin B5 for shine" },
    ],
  },
  {
    title: "Overall Glow",
    icon: Apple,
    color: "from-green-500 to-emerald-400",
    foods: [
      { name: "Water (2L+)", benefit: "Hydration is the foundation of glow" },
      {
        name: "Citrus Fruits",
        benefit: "Vitamin C boosts collagen production",
      },
      { name: "Carrots", benefit: "Vitamin A for clear, smooth skin" },
      { name: "Broccoli", benefit: "Vitamins C & K improve complexion" },
      { name: "Turmeric", benefit: "Curcumin reduces skin inflammation" },
    ],
  },
];

const MEAL_PLAN = [
  {
    meal: "Breakfast",
    items: [
      "Greek yogurt with blueberries & honey",
      "Green tea",
      "Handful of walnuts",
    ],
  },
  {
    meal: "Lunch",
    items: [
      "Salmon with roasted sweet potato",
      "Spinach & avocado salad",
      "Lemon water",
    ],
  },
  { meal: "Snack", items: ["Apple with almond butter", "Herbal tea"] },
  {
    meal: "Dinner",
    items: [
      "Grilled chicken with broccoli & tomatoes",
      "Brown rice",
      "Turmeric golden milk",
    ],
  },
];

export default function DietPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-center pt-4">
        <h2 className="text-2xl font-bold text-white">Diet & Nutrition</h2>
        <p className="text-white/60 text-sm mt-1">
          Eat your way to a natural glow
        </p>
      </div>

      {SECTIONS.map(({ title, icon: Icon, color, foods }) => (
        <div key={title} className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {foods.map(({ name, benefit }) => (
              <div key={name} className="bg-white/5 rounded-xl p-3">
                <p className="text-white font-medium text-sm">{name}</p>
                <p className="text-white/50 text-xs mt-0.5">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Daily Meal Plan */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">
            Sample Daily Meal Plan
          </h3>
        </div>
        <div className="space-y-3">
          {MEAL_PLAN.map(({ meal, items }) => (
            <div key={meal} className="bg-white/5 rounded-xl p-3">
              <p className="text-purple-300 font-semibold text-sm mb-1">
                {meal}
              </p>
              {items.map((item) => (
                <p
                  key={item}
                  className="text-white/70 text-xs flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-pink-400 inline-block" />
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-white/30 text-xs pb-4">
        Dietary suggestions only. Consult a nutritionist for personalized
        medical advice.
      </p>
    </div>
  );
}
