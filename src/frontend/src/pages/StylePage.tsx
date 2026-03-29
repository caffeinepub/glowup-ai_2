import { Palette, Shirt, Star, Watch } from "lucide-react";

const STYLES = [
  {
    name: "Clean Minimalist",
    desc: "Neutral tones, clean cuts, no excess. Effortlessly elevated.",
    palette: ["#F5F0EB", "#2C2C2C", "#9E8E7E", "#FFFFFF"],
    pieces: [
      "White crew-neck tee",
      "Slim chinos",
      "Clean leather sneakers",
      "Minimal watch",
    ],
  },
  {
    name: "Smart Casual",
    desc: "Polished but relaxed — perfect for most occasions.",
    palette: ["#1B3A6B", "#F4C430", "#E8E0D8", "#3D3D3D"],
    pieces: [
      "Oxford shirt (tucked or half-tuck)",
      "Dark slim jeans",
      "Chelsea boots",
      "Simple belt",
    ],
  },
  {
    name: "Streetwear Edge",
    desc: "Bold, expressive, and youth-forward with statement pieces.",
    palette: ["#000000", "#FF3B30", "#C0C0C0", "#1C1C1E"],
    pieces: [
      "Graphic oversized hoodie",
      "Cargo pants",
      "High-top sneakers",
      "Snapback cap",
    ],
  },
  {
    name: "Soft Aesthetic",
    desc: "Pastel tones, cozy textures, gentle and approachable.",
    palette: ["#FFD6E0", "#C8E6C9", "#E3D5F5", "#FFF9C4"],
    pieces: [
      "Pastel knit sweater",
      "Linen trousers",
      "Canvas slip-ons",
      "Tote bag",
    ],
  },
];

const ACCESSORIES = [
  {
    name: "Watches",
    tip: "A clean analog watch elevates any outfit immediately.",
  },
  {
    name: "Glasses/Sunglasses",
    tip: "Frame shape should complement your face shape.",
  },
  { name: "Bags", tip: "A structured tote or backpack shows intentionality." },
  {
    name: "Jewelry",
    tip: "Less is more — one statement piece, keep the rest minimal.",
  },
  { name: "Hats", tip: "Match hat style to your aesthetic for cohesion." },
  { name: "Scarves", tip: "Adds texture and personality to neutral outfits." },
];

export default function StylePage() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="text-center pt-4">
        <h2 className="text-2xl font-bold text-white">Style Guide</h2>
        <p className="text-white/60 text-sm mt-1">
          Discover your personal aesthetic
        </p>
      </div>

      {/* Style Cards */}
      <div className="space-y-3">
        {STYLES.map(({ name, desc, palette, pieces }) => (
          <div key={name} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-white font-bold text-lg">{name}</h3>
                <p className="text-white/60 text-sm">{desc}</p>
              </div>
              <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            </div>
            {/* Color palette */}
            <div className="flex gap-2 mb-3">
              {palette.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-lg border border-white/20 flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-white/40 text-xs self-center ml-1">
                Color palette
              </span>
            </div>
            {/* Key pieces */}
            <div className="grid grid-cols-2 gap-1.5">
              {pieces.map((piece) => (
                <div
                  key={piece}
                  className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2 py-1.5"
                >
                  <Shirt className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  <span className="text-white/70 text-xs">{piece}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Accessories */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl gradient-purple-pink flex items-center justify-center">
            <Watch className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">Accessory Guide</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ACCESSORIES.map(({ name, tip }) => (
            <div key={name} className="bg-white/5 rounded-xl p-3">
              <p className="text-white font-medium text-sm">{name}</p>
              <p className="text-white/50 text-xs mt-0.5">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Psychology */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rainbow-500 to-pink-400 gradient-purple-pink flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg">Color Psychology</h3>
        </div>
        <div className="space-y-2">
          {[
            {
              color: "Navy / Black",
              effect: "Authority, sophistication, slimming",
            },
            { color: "White / Cream", effect: "Clean, fresh, approachable" },
            {
              color: "Burgundy / Red",
              effect: "Confidence, passion, attention-grabbing",
            },
            { color: "Olive / Earth", effect: "Grounded, reliable, natural" },
            { color: "Pastels", effect: "Soft, gentle, youthful energy" },
          ].map(({ color, effect }) => (
            <div
              key={color}
              className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
            >
              <span className="text-white text-sm">{color}</span>
              <span className="text-white/50 text-xs">{effect}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
