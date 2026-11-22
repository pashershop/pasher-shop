import React from 'react';

/**
 * Pure inline SVG cartoon-style Bangladeshi local market (বাজার) background.
 * Zero external image URLs or files — 100% embedded directly in code.
 */
export const CartoonBazaarBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* Sky-to-Bazaar Soft Gradient Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #DCEBFF 0%, #EEF5FF 42%, #FFF7ED 78%, #FDE68A44 100%)',
        }}
      />

      {/* Repeating Subtle Cartoon Bazaar Icon Pattern across the entire viewport */}
      <svg
        className="absolute inset-0 w-full h-full opacity-55 animate-bazaar-float"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bazaar-bg-tile"
            width="260"
            height="260"
            patternUnits="userSpaceOnUse"
          >
            {/* Cartoon Shopping Basket */}
            <g transform="translate(24, 28) rotate(-8)">
              <path
                d="M8 18 L44 18 L39 40 C38 43 36 44 33 44 L19 44 C16 44 14 43 13 40 Z"
                fill="#FFEDD5"
                stroke="#FB923C"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M16 18 L22 7 M36 18 L30 7"
                stroke="#EA580C"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line x1="20" y1="24" x2="20" y2="38" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="24" x2="26" y2="38" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
              <line x1="32" y1="24" x2="32" y2="38" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Cartoon Mango & Leaf */}
            <g transform="translate(152, 22) rotate(12)">
              <path
                d="M22 8 C34 8 40 20 35 32 C30 42 15 44 10 35 C6 26 11 8 22 8 Z"
                fill="#FEF08A"
                stroke="#EAB308"
                strokeWidth="2.2"
              />
              <path
                d="M22 8 C26 3 32 3 34 7 C30 10 25 10 22 8 Z"
                fill="#BBF7D0"
                stroke="#22C55E"
                strokeWidth="1.8"
              />
            </g>

            {/* Cartoon Mini Shop Awning */}
            <g transform="translate(105, 118)">
              <rect
                x="6"
                y="20"
                width="42"
                height="26"
                rx="4"
                fill="#DBEAFE"
                stroke="#60A5FA"
                strokeWidth="2"
              />
              <path
                d="M2 20 L8 8 L46 8 L52 20 Z"
                fill="#FED7AA"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <rect x="20" y="30" width="14" height="16" rx="2" fill="#93C5FD" />
            </g>

            {/* Cartoon Carrot */}
            <g transform="translate(36, 152) rotate(24)">
              <path
                d="M12 10 C18 8 24 12 22 20 L14 40 C13 42 11 42 10 40 L6 18 C5 13 8 11 12 10 Z"
                fill="#FED7AA"
                stroke="#F97316"
                strokeWidth="2"
              />
              <path
                d="M14 9 C11 2 16 1 17 8 M15 9 C20 3 23 6 18 10"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Cartoon Price Tag */}
            <g transform="translate(198, 165) rotate(-14)">
              <path
                d="M6 12 L22 4 L38 14 L38 32 L14 36 L6 24 Z"
                fill="#E0F2FE"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="14" r="2.5" fill="#0284C7" />
            </g>

            {/* Cartoon Apple / Tomato */}
            <g transform="translate(140, 208)">
              <circle cx="18" cy="20" r="12" fill="#FECACA" stroke="#EF4444" strokeWidth="2" />
              <path d="M18 8 C19 3 23 3 24 6" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bazaar-bg-tile)" />
      </svg>

      {/* Top Cartoon Sun & Puffy Clouds */}
      <svg
        viewBox="0 0 1440 240"
        preserveAspectRatio="xMidYMin slice"
        className="absolute top-0 left-0 w-full h-56 sm:h-64 opacity-80"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Warm Cartoon Sun */}
        <g transform="translate(1285, 68)">
          <circle cx="0" cy="0" r="46" fill="#FEF08A" opacity="0.65" className="animate-pulse" />
          <circle cx="0" cy="0" r="30" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
          <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.7" className="animate-bazaar-spin-slow">
            <line x1="0" y1="-42" x2="0" y2="-52" />
            <line x1="0" y1="42" x2="0" y2="52" />
            <line x1="-42" y1="0" x2="-52" y2="0" />
            <line x1="42" y1="0" x2="52" y2="0" />
            <line x1="-30" y1="-30" x2="-37" y2="-37" />
            <line x1="30" y1="-30" x2="37" y2="-37" />
            <line x1="-30" y1="30" x2="-37" y2="37" />
            <line x1="30" y1="30" x2="37" y2="37" />
          </g>
        </g>

        {/* Puffy Cartoon Cloud Left */}
        <g transform="translate(95, 58)" opacity="0.85">
          <g className="animate-bazaar-cloud">
            <path
              d="M20 44 C8 44 0 36 0 26 C0 17 7 10 16 9 C21 2 30 0 40 2 C49 4 56 11 58 19 C67 19 74 26 74 34 C74 41 67 44 58 44 Z"
              fill="#FFFFFF"
              stroke="#BFDBFE"
              strokeWidth="2.5"
            />
          </g>
        </g>

        {/* Puffy Cartoon Cloud Center-Left */}
        <g transform="translate(460, 34) scale(0.85)" opacity="0.75">
          <g className="animate-bazaar-cloud-slow">
            <path
              d="M20 44 C8 44 0 36 0 26 C0 17 7 10 16 9 C21 2 30 0 40 2 C49 4 56 11 58 19 C67 19 74 26 74 34 C74 41 67 44 58 44 Z"
              fill="#FFFFFF"
              stroke="#BFDBFE"
              strokeWidth="2.5"
            />
          </g>
        </g>

        {/* Puffy Cartoon Cloud Right */}
        <g transform="translate(960, 52) scale(1.1)" opacity="0.8">
          <g className="animate-bazaar-cloud">
            <path
              d="M20 44 C8 44 0 36 0 26 C0 17 7 10 16 9 C21 2 30 0 40 2 C49 4 56 11 58 19 C67 19 74 26 74 34 C74 41 67 44 58 44 Z"
              fill="#FFFFFF"
              stroke="#BFDBFE"
              strokeWidth="2.5"
            />
          </g>
        </g>
      </svg>

      {/* Bottom Full-Width Illustrated Cartoon Bazaar Panorama */}
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full h-[300px] sm:h-[380px] lg:h-[430px] opacity-80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bazaar-bg-hills" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="bazaar-bg-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Soft Distant Cartoon Hills & Trees */}
        <path
          d="M0 295 Q180 230 390 278 T820 265 T1220 282 T1440 250 L1440 420 L0 420 Z"
          fill="url(#bazaar-bg-hills)"
        />
        <path
          d="M0 325 Q260 280 560 315 T1080 302 T1440 322 L1440 420 L0 420 Z"
          fill="#BBF7D0"
          opacity="0.55"
        />

        {/* Cartoon Trees in Background */}
        <g transform="translate(28, 222)">
          <rect x="24" y="66" width="12" height="52" rx="5" fill="#92400E" opacity="0.7" />
          <circle cx="30" cy="48" r="28" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
          <circle cx="14" cy="58" r="18" fill="#86EFAC" stroke="#16A34A" strokeWidth="2.5" />
          <circle cx="46" cy="58" r="18" fill="#22C55E" stroke="#16A34A" strokeWidth="2.5" />
        </g>

        <g transform="translate(565, 232) scale(0.9)">
          <rect x="24" y="66" width="12" height="52" rx="5" fill="#92400E" opacity="0.7" />
          <circle cx="30" cy="48" r="28" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
          <circle cx="46" cy="58" r="18" fill="#86EFAC" stroke="#16A34A" strokeWidth="2.5" />
        </g>

        <g transform="translate(1340, 215)">
          <rect x="24" y="66" width="12" height="52" rx="5" fill="#92400E" opacity="0.7" />
          <circle cx="30" cy="48" r="30" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
          <circle cx="12" cy="60" r="18" fill="#86EFAC" stroke="#16A34A" strokeWidth="2.5" />
          <circle cx="48" cy="60" r="18" fill="#22C55E" stroke="#16A34A" strokeWidth="2.5" />
        </g>

        {/* Festive Market Bunting Flags across the Bazaar */}
        <g className="animate-bazaar-sway">
          <path
            d="M110 198 Q360 232 615 190 Q880 226 1160 190"
            fill="none"
            stroke="#475569"
            strokeWidth="2.5"
            strokeDasharray="2 0"
            opacity="0.65"
          />
          <g>
            <polygon points="155,205 173,207 162,226" fill="#FF7900" />
            <polygon points="198,210 216,211 206,230" fill="#0B4A8A" />
            <polygon points="242,213 260,213 251,232" fill="#10B981" />
            <polygon points="286,215 304,215 295,234" fill="#FACC15" />
            <polygon points="330,215 348,214 339,233" fill="#EC4899" />
            <polygon points="374,214 392,212 384,231" fill="#FF7900" />
            <polygon points="418,211 436,209 428,228" fill="#0EA5E9" />
            <polygon points="462,208 480,205 473,224" fill="#10B981" />
            <polygon points="506,203 524,200 517,219" fill="#FACC15" />
            <polygon points="550,198 568,195 562,214" fill="#FF7900" />

            <polygon points="670,197 688,199 678,218" fill="#0B4A8A" />
            <polygon points="718,202 736,204 726,223" fill="#FF7900" />
            <polygon points="766,206 784,208 774,227" fill="#10B981" />
            <polygon points="814,209 832,209 823,228" fill="#FACC15" />
            <polygon points="862,210 880,210 871,229" fill="#EC4899" />
            <polygon points="910,209 928,208 920,227" fill="#0EA5E9" />
            <polygon points="958,206 976,204 969,223" fill="#FF7900" />
            <polygon points="1006,202 1024,199 1017,218" fill="#10B981" />
            <polygon points="1054,197 1072,195 1065,214" fill="#FACC15" />
          </g>
        </g>

        {/* Bazaar Ground / Walkway */}
        <rect x="0" y="348" width="1440" height="72" fill="url(#bazaar-bg-road)" />
        <line x1="0" y1="348" x2="1440" y2="348" stroke="#F59E0B" strokeWidth="3" opacity="0.55" />

        {/* === SHOP 1: Cartoon Grocery Shop (মুদি দোকান) === */}
        <g transform="translate(88, 182)">
          {/* Building body */}
          <rect
            x="14"
            y="42"
            width="192"
            height="126"
            rx="12"
            fill="#FFFBEB"
            stroke="#0B4A8A"
            strokeWidth="3.5"
          />
          {/* Signboard */}
          <rect
            x="42"
            y="6"
            width="136"
            height="32"
            rx="10"
            fill="#0B4A8A"
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          <circle cx="60" cy="22" r="7" fill="#FF7900" />
          <rect x="74" y="17" width="82" height="10" rx="5" fill="#E0F2FE" />

          {/* Striped Orange & White Cartoon Awning */}
          <path
            d="M4 42 L216 42 L224 72 L-4 72 Z"
            fill="#FF7900"
            stroke="#9A3412"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon points="24,42 52,42 46,72 16,72" fill="#FFFFFF" />
          <polygon points="82,42 110,42 108,72 78,72" fill="#FFFFFF" />
          <polygon points="140,42 168,42 170,72 140,72" fill="#FFFFFF" />
          {/* Scalloped bottom edge */}
          <circle cx="14" cy="72" r="12" fill="#FF7900" />
          <circle cx="38" cy="72" r="12" fill="#FFFFFF" />
          <circle cx="62" cy="72" r="12" fill="#FF7900" />
          <circle cx="86" cy="72" r="12" fill="#FFFFFF" />
          <circle cx="110" cy="72" r="12" fill="#FF7900" />
          <circle cx="134" cy="72" r="12" fill="#FFFFFF" />
          <circle cx="158" cy="72" r="12" fill="#FF7900" />
          <circle cx="182" cy="72" r="12" fill="#FFFFFF" />
          <circle cx="206" cy="72" r="12" fill="#FF7900" />

          {/* Shop Window & Door */}
          <rect x="28" y="92" width="96" height="52" rx="8" fill="#BAE6FD" stroke="#0B4A8A" strokeWidth="3" />
          {/* Items on Shelf inside window */}
          <rect x="38" y="104" width="16" height="20" rx="4" fill="#F97316" />
          <rect x="58" y="100" width="16" height="24" rx="4" fill="#10B981" />
          <rect x="78" y="106" width="16" height="18" rx="4" fill="#EAB308" />
          <rect x="98" y="102" width="16" height="22" rx="4" fill="#EF4444" />
          <line x1="28" y1="126" x2="124" y2="126" stroke="#0B4A8A" strokeWidth="3" />

          {/* Door */}
          <rect x="138" y="92" width="52" height="76" rx="8" fill="#38BDF8" stroke="#0B4A8A" strokeWidth="3" />
          <circle cx="147" cy="132" r="3.5" fill="#FACC15" />

          {/* Rice Sacks outside */}
          <ellipse cx="32" cy="160" rx="16" ry="12" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
          <ellipse cx="56" cy="161" rx="15" ry="11" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
        </g>

        {/* === SHOP 2: Cartoon Fruit & Veggie Stall (কাঁচা বাজার) === */}
        <g transform="translate(360, 212)">
          {/* Wooden Frame */}
          <rect x="20" y="34" width="8" height="104" rx="3" fill="#92400E" />
          <rect x="204" y="34" width="8" height="104" rx="3" fill="#92400E" />

          {/* Green & Yellow Striped Canopy */}
          <path
            d="M4 34 L228 34 L218 8 L14 8 Z"
            fill="#10B981"
            stroke="#065F46"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon points="44,8 78,8 74,34 36,34" fill="#FDE047" />
          <polygon points="114,8 148,8 148,34 114,34" fill="#FDE047" />
          <polygon points="184,8 214,8 220,34 186,34" fill="#FDE047" />

          {/* Stall Counter */}
          <rect x="12" y="88" width="208" height="50" rx="10" fill="#F59E0B" stroke="#92400E" strokeWidth="3" />
          <rect x="24" y="98" width="184" height="30" rx="6" fill="#FEF3C7" opacity="0.85" />

          {/* Cartoon Fruit & Veggie Baskets */}
          {/* Basket 1: Tomatoes/Apples */}
          <path d="M26 88 L66 88 L62 104 L30 104 Z" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <circle cx="37" cy="83" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="48" cy="81" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="57" cy="84" r="6.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />

          {/* Basket 2: Mangoes & Bananas */}
          <path d="M84 88 L134 88 L130 104 L88 104 Z" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <ellipse cx="98" cy="82" rx="8" ry="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="111" cy="80" rx="8" ry="6" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />
          <ellipse cx="123" cy="83" rx="7" ry="5.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />

          {/* Basket 3: Greens & Eggplants */}
          <path d="M150 88 L200 88 L196 104 L154 104 Z" fill="#D97706" stroke="#78350F" strokeWidth="2" />
          <circle cx="163" cy="82" r="7.5" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <ellipse cx="177" cy="81" rx="7" ry="9" fill="#9333EA" stroke="#6B21A8" strokeWidth="1.5" />
          <circle cx="190" cy="83" r="7" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" />
        </g>

        {/* === Cartoon Street Lamp === */}
        <g transform="translate(620, 178)">
          <rect x="14" y="30" width="7" height="140" rx="3" fill="#334155" />
          <circle cx="17.5" cy="22" r="14" fill="#FEF08A" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="17.5" cy="22" r="24" fill="#FDE047" opacity="0.3" className="animate-pulse" />
        </g>

        {/* === SHOP 3: Cartoon Blue Pharmacy / Store (দোকান ও ফার্মেসি) === */}
        <g transform="translate(680, 168)">
          <rect
            x="16"
            y="44"
            width="216"
            height="138"
            rx="14"
            fill="#FFFFFF"
            stroke="#0B4A8A"
            strokeWidth="3.5"
          />
          {/* Rooftop Sign */}
          <rect x="48" y="8" width="152" height="32" rx="10" fill="#FF7900" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="68" cy="24" r="7" fill="#FFFFFF" />
          <rect x="82" y="19" width="96" height="10" rx="5" fill="#FFF7ED" />

          {/* Blue & Cyan Striped Awning */}
          <path
            d="M4 44 L244 44 L252 74 L-4 74 Z"
            fill="#0B4A8A"
            stroke="#073463"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon points="28,44 60,44 54,74 20,74" fill="#7DD3FC" />
          <polygon points="94,44 126,44 124,74 90,74" fill="#7DD3FC" />
          <polygon points="160,44 192,44 194,74 160,74" fill="#7DD3FC" />

          {/* Large Display Window */}
          <rect x="30" y="94" width="114" height="58" rx="10" fill="#E0F2FE" stroke="#0B4A8A" strokeWidth="3" />
          <path d="M40 140 L54 110 L70 110 L56 140 Z" fill="#FFFFFF" opacity="0.5" />
          {/* Plus / Pharmacy or Product Boxes */}
          <rect x="96" y="106" width="28" height="28" rx="6" fill="#10B981" />
          <rect x="107" y="111" width="6" height="18" rx="2" fill="#FFFFFF" />
          <rect x="101" y="117" width="18" height="6" rx="2" fill="#FFFFFF" />

          {/* Door */}
          <rect x="160" y="94" width="54" height="88" rx="10" fill="#FFEDD5" stroke="#0B4A8A" strokeWidth="3" />
          <rect x="170" y="104" width="34" height="32" rx="5" fill="#7DD3FC" />
          <circle cx="168" cy="146" r="3.5" fill="#FF7900" />
        </g>

        {/* === Cartoon Delivery Scooter / Market Cart in Foreground === */}
        <g className="animate-bazaar-cart">
          {/* Cart body */}
          <rect x="12" y="18" width="64" height="36" rx="8" fill="#FF7900" stroke="#9A3412" strokeWidth="3" />
          <rect x="22" y="25" width="44" height="10" rx="4" fill="#FFFFFF" opacity="0.85" />
          {/* Cart Handle */}
          <path d="M12 22 L0 10 L-10 10" fill="none" stroke="#0B4A8A" strokeWidth="4" strokeLinecap="round" />
          {/* Shopping bags poking out */}
          <rect x="22" y="2" width="18" height="18" rx="4" fill="#4ADE80" stroke="#15803D" strokeWidth="2.5" />
          <rect x="44" y="4" width="20" height="16" rx="4" fill="#38BDF8" stroke="#0369A1" strokeWidth="2.5" />
          {/* Wheels */}
          <circle cx="24" cy="58" r="10" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="64" cy="58" r="10" fill="#1E293B" stroke="#FFFFFF" strokeWidth="2.5" />
        </g>

        {/* === SHOP 4: Cozy Tea & Bakery Corner (চা ও নাস্তা) === */}
        <g transform="translate(1070, 192)">
          <rect
            x="16"
            y="40"
            width="210"
            height="118"
            rx="14"
            fill="#FFF1F2"
            stroke="#9F1239"
            strokeWidth="3.5"
          />
          {/* Striped Pink/Orange Canopy */}
          <path
            d="M4 40 L238 40 L244 68 L-2 68 Z"
            fill="#FB7185"
            stroke="#9F1239"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon points="32,40 62,40 58,68 24,68" fill="#FFFBEB" />
          <polygon points="94,40 124,40 122,68 90,68" fill="#FFFBEB" />
          <polygon points="156,40 186,40 188,68 156,68" fill="#FFFBEB" />

          {/* Counter Window */}
          <rect x="30" y="84" width="120" height="48" rx="8" fill="#FEF3C7" stroke="#9F1239" strokeWidth="3" />
          {/* Cartoon Tea Cup Icon on Sign */}
          <rect x="64" y="10" width="114" height="24" rx="8" fill="#0B4A8A" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="84" y="18" width="74" height="8" rx="4" fill="#FDE047" />

          {/* Tea Pot & Snack Jars */}
          <circle cx="64" cy="116" r="11" fill="#F97316" stroke="#9A3412" strokeWidth="2" />
          <rect x="92" y="104" width="16" height="22" rx="4" fill="#38BDF8" />
          <rect x="116" y="106" width="16" height="20" rx="4" fill="#4ADE80" />

          {/* Door */}
          <rect x="164" y="84" width="46" height="74" rx="8" fill="#FDBA74" stroke="#9F1239" strokeWidth="3" />
          <circle cx="172" cy="124" r="3" fill="#0B4A8A" />
        </g>
      </svg>
    </div>
  );
};
