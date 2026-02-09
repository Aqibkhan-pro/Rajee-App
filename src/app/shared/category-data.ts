


export interface CatItem {
  key: string;
  ar: string;
  en: string;
}

export const SECTIONS: CatItem[] = [
  { key: 'cars_section', ar: 'السيارات', en: 'Cars' },
  { key: 'device_section', ar: 'الأجهزة', en: 'Device' },
  { key: 'all_auctions', ar: 'كل المزادات', en: 'All Auctions' },
];


export const ALL_AUCTION_CATEGORIES: CatItem[] =  [
  { key: 'animals_birds_section', en: 'Animals and Birds', ar: 'الحيوانات والطيور' },
  { key: 'furniture_section', en: 'Furniture', ar: 'الأثاث' },
  { key: 'personal_accessories_section', en: 'Personal Accessories', ar: 'الإكسسوارات الشخصية' },
  { key: 'services_section', en: 'Services', ar: 'الخدمات' },
  { key: 'food_beverages_section', en: 'Food and Beverages', ar: 'الطعام والمشروبات' },
  { key: 'game_entertainment_section', en: 'Game and Entertainment', ar: 'الألعاب والترفيه' },
  { key: 'hunting_tips_section', en: 'Hunting and Tips', ar: 'الصيد والنصائح' },
  { key: 'cultivation_gardens_section', en: 'Cultivation and Gardens', ar: 'الزراعة والحدائق' },
  { key: 'programming_designs_section', en: 'Programming and Designs', ar: 'البرمجة والتصميمات' },
  { key: 'parties_events_section', en: 'Parties and Events', ar: 'الحفلات والفعاليات' },
  { key: 'library_arts_section', en: 'Library and Arts', ar: 'المكتبة والفنون' },
  { key: 'travel_tourism_section', en: 'Travel and Tourism', ar: 'السفر والسياحة' },
  { key: 'uncategorized_auction_section', en: 'Uncategorized Section', ar: 'قسم غير مصنف' },
  { key: 'missing_section', en: 'Missing', ar: 'مفقود' },
  { key: 'education_training_section', en: 'Education and Training', ar: 'التعليم والتدريب' },
  { key: 'financing_loans_section', en: 'Financing and Loans', ar: 'التمويل والقروض' },
  { key: 'anecdotes_traditions_section', en: 'Anecdotes & Traditions', ar: 'الحكايات والتقاليد' },
  { key: 'projects_investments_section', en: 'Projects and Investments', ar: 'المشاريع والاستثمارات' },
];

// ✅ your brands list (same)
export const allCarBrandsCombined: string[] = [
  'Tank', 'Zotye', 'Geely', 'BYD', 'Great Wall',
  'Chery', 'SAIC Motor', 'Changan', 'Dongfeng',
  'FAW', 'BAIC', 'Brilliance', 'JAC Motors',
  'Haval', 'MG Motor', 'Nio', 'XPeng', 'Li Auto',
  'Tesla', 'Polestar', 'Rivian', 'Lucid', 'Faraday Future', 'Canoo',
  'Fisker', 'Lordstown', 'Rimac', 'Pininfarina',
  'Ferrari', 'Lamborghini', 'McLaren', 'Bugatti',
  'Pagani', 'Koenigsegg', 'Aston Martin', 'Lotus',
  'Maserati', 'Bentley', 'Rolls-Royce', 'Spyker',
  'Hennessey', 'SSC', 'Saleen', 'Karma',
  'Daewoo', 'Saturn', 'Pontiac', 'Oldsmobile',
  'Plymouth', 'Eagle', 'Mercury', 'Edsel',
  'Studebaker', 'Packard', 'Duesenberg', 'DeLorean',
  'Hummer', 'Cord', 'Hudson', 'Nash', 'Kaiser',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen',
  'Porsche', 'Fiat', 'Alfa Romeo', 'Volvo', 'Jaguar', 'Land Rover',
  'Mini', 'Smart', 'Seat', 'Skoda', 'Dacia',
  'Lancia', 'Citroën', 'Peugeot', 'Renault',
  'Opel', 'Vauxhall', 'Suzuki', 'Ariel', 'Morgan',
  'Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru',
  'Mitsubishi', 'Lexus', 'Acura', 'Infiniti',
  'Hyundai', 'Kia', 'Genesis', 'Isuzu',
  'Daihatsu', 'Proton', 'Perodua', 'Tata',
  'Mahindra', 'Maruti Suzuki', 'Hindustan'
];

/**
 * ✅ AAP YAHAN APNA FULL OBJECT PASTE KARO (same as you sent)
 * (Main yahan paste nahi kar raha warna file bohat lambi ho jayegi, but aapka object ready hai)
 */
// ✅ your big models map (paste full object same as you have)
export const carBrandsWithAllModels: Record<string, string[]> =
{
  "Toyota": ["Land Cruiser", "Camry", "Avalon", "Hilux", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius", "Yaris", "4Runner", "Sequoia", "Sienna", "C-HR", "Supra", "Venza", "Crown"],
  "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Focus", "Fusion", "Ranger", "Bronco", "Edge", "Expedition", "Transit", "EcoSport", "Fiesta", "GT", "Maverick", "Raptor", "Everest", "Territory"],
  "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "M3", "M5", "i3", "i4", "i8", "Z4", "8 Series", "X6", "M4", "2 Series", "X4", "iX", "i7"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "A-Class", "GLA", "GLC", "GLE", "GLS", "G-Class", "AMG GT", "CLA", "CLS", "SL", "EQS", "EQE", "Maybach", "V-Class", "B-Class", "EQB", "EQV"],
  "Honda": ["Accord", "Civic", "CR-V", "Pilot", "HR-V", "Odyssey", "Fit", "Ridgeline", "Passport", "Insight", "City", "BR-V", "CR-Z", "NSX", "Jazz", "Brio", "Mobilio", "WR-V"],
  "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "TT", "R8", "RS3", "RS5", "RS7", "e-tron", "S4", "S5", "Q4 e-tron", "Q2", "A5", "A7"],
  "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster", "Semi", "Model S Plaid", "Model X Plaid"],
  "Nissan": ["Altima", "Sentra", "Maxima", "Rogue", "Pathfinder", "Murano", "Frontier", "Titan", "GT-R", "Z", "Leaf", "Ariya", "Juke", "Kicks", "Versa", "NV200", "X-Trail", "Qashqai"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Palisade", "Accent", "Venue", "Ioniq 5", "Ioniq 6", "Genesis", "Santa Cruz", "Veloster", "Creta", "Grand i10", "i20"],
  "Chevrolet": ["Silverado", "Equinox", "Traverse", "Malibu", "Camaro", "Corvette", "Tahoe", "Suburban", "Colorado", "Blazer", "Trax", "Bolt", "Impala", "Spark", "Cruze", "Trailblazer", "Captiva"],
  "Volkswagen": ["Golf", "Jetta", "Passat", "Tiguan", "Atlas", "Arteon", "ID.4", "ID.Buzz", "Taos", "T-Roc", "Polo", "Touareg", "Beetle", "Scirocco", "Virtus", "T-Cross", "ID.3"],
  "Porsche": ["911", "Cayenne", "Panamera", "Macan", "Taycan", "Boxster", "Cayman", "918 Spyder", "Carrera GT", "Taycan Cross Turismo"],
  "Ferrari": ["F8 Tributo", "SF90 Stradale", "Roma", "Portofino", "812 Superfast", "296 GTB", "Daytona SP3", "LaFerrari", "F430", "458 Italia", "California"],
  "Lamborghini": ["Aventador", "Huracán", "Urus", "Countach", "Revuelto", "Sián", "Gallardo", "Murciélago", "Diablo", "Jalpa"],
  "McLaren": ["720S", "Artura", "765LT", "P1", "Senna", "Elva", "Speedtail", "GT", "570S", "650S", "MP4-12C"],
  "Lexus": ["ES", "RX", "NX", "UX", "LS", "LC", "LX", "GX", "IS", "RC", "LM", "RZ"],
  "Kia": ["Sorento", "Sportage", "Telluride", "Seltos", "Forte", "K5", "Rio", "Stinger", "EV6", "Niro", "Carnival", "Sonet", "Ceed"],
  "Mazda": ["Mazda3", "Mazda6", "CX-5", "CX-30", "CX-9", "CX-50", "MX-5 Miata", "RX-7", "RX-8", "CX-3", "CX-60", "CX-90"],
  "Subaru": ["Outback", "Forester", "Crosstrek", "Impreza", "WRX", "BRZ", "Ascent", "Legacy", "Levorg", "Solterra"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator", "Wagoneer", "Commander", "Avenger"],
  "Volvo": ["XC90", "XC60", "XC40", "S90", "S60", "V90", "V60", "C40", "EX90", "EX30", "EX40", "EC40"],
  "Jaguar": ["F-Pace", "E-Pace", "I-Pace", "XF", "XJ", "F-Type", "XE", "XK", "X-Type", "S-Type"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Defender", "Discovery", "Discovery Sport"],
  "Bentley": ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Azure", "Continental GTC"],
  "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan", "Spectre", "Silver Shadow"],
  "Aston Martin": ["DB11", "Vantage", "DBS", "Valhalla", "Valkyrie", "DBX", "Rapide", "Vanquish"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "GranTurismo", "MC20", "Grecale", "GranCabrio"],
  "Bugatti": ["Chiron", "Veyron", "Divo", "Centodieci", "La Voiture Noire", "Bolide"],
  "Genesis": ["G70", "G80", "G90", "GV70", "GV80", "GV60", "G80 Electrified", "GV70 Electrified"],
  "Acura": ["TLX", "RDX", "MDX", "Integra", "NSX", "ILX", "RLX", "CDX"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80", "QX55", "QX30", "Q30"],
  "Cadillac": ["Escalade", "CT5", "XT5", "XT6", "Lyriq", "Celestiq", "CT4", "XT4", "Escalade-V"],
  "Chrysler": ["300", "Pacifica", "Voyager", "Aspen", "PT Cruiser", "Sebring"],
  "Dodge": ["Charger", "Challenger", "Durango", "Hornet", "Journey", "Caliber", "Avenger"],
  "Ram": ["1500", "2500", "3500", "Promaster", "ProMaster City", "Dakota"],
  "Buick": ["Enclave", "Envision", "Encore", "Regal", "LaCrosse", "Verano", "Cascada"],
  "GMC": ["Sierra", "Yukon", "Acadia", "Canyon", "Hummer EV", "Terrain", "Savana"],
  "Lincoln": ["Navigator", "Aviator", "Corsair", "Nautilus", "Continental", "MKZ", "MKC"],
  "Mini": ["Cooper", "Countryman", "Clubman", "Convertible", "Paceman", "Coupe", "Roadster"],
  "Fiat": ["500", "500X", "500L", "Panda", "Tipo", "Punto", "Bravo", "Linea"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "4C", "Giulietta", "MiTo", "Brera"],
  "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage", "Lancer", "Pajero", "ASX", "Triton"],
  "Suzuki": ["Swift", "Vitara", "Jimny", "Baleno", "Ciaz", "Ertiga", "XL7", "S-Presso"],
  "Isuzu": ["D-Max", "MU-X", "Trooper", "Rodeo", "Ascender"],
  "Daewoo": ["Matiz", "Nexia", "Lanos", "Leganza", "Magnus", "Tacuma", "Kalos"],
  "Lotus": ["Emira", "Evora", "Elise", "Exige", "Esprit", "Europa", "Elan"],
  "Tank": ["Tank 300", "Tank 500", "Tank 700", "Tank 800"],
  "Smart": ["Fortwo", "Forfour", "Roadster", "Crossblade"],
  "Zotye": ["T600", "T700", "Z500", "E200", "SR9", "Z300"],
  "Geely": ["Coolray", "Azkarra", "Emgrand", "Okavango", "Geometry A", "Geometry C", "Borui GE"],
  "BYD": ["Han", "Tang", "Song", "Qin", "Atto 3", "Seal", "Dolphin", "Seagull", "Frigate 07"],
  "Nio": ["ES8", "ES6", "EC6", "ET7", "ET5", "ET9", "EL6", "EL8"],
  "XPeng": ["P7", "P5", "G9", "G3", "X9", "G6", "P7i"],
  "Li Auto": ["Li ONE", "Li L9", "Li L8", "Li L7", "Li Mega", "Li L6"],
  "Polestar": ["Polestar 1", "Polestar 2", "Polestar 3", "Polestar 4", "Polestar 5"],
  "Rivian": ["R1T", "R1S", "R2", "R3", "R3X"],
  "Lucid": ["Air", "Gravity", "Air Sapphire", "Air Pure", "Air Touring"],
  "Pagani": ["Huayra", "Zonda", "Utopia", "Imola"],
  "Koenigsegg": ["Jesko", "Regera", "Gemera", "Agera", "CC850"],
  "Hennessey": ["Venom F5", "Venom GT", "VelociRaptor", "Mammoth"],
  "SSC": ["Tuatara", "Aero", "Ultimate Aero"],
  "Saleen": ["S7", "S1", "S302", "SA-30"],
  "Karma": ["Revero", "GS-6", "Gyesera", "Kaveya"],
  "DeLorean": ["DMC-12", "Alpha5"],
  "Pontiac": ["Firebird", "GTO", "Trans Am", "Grand Prix", "Solstice", "Vibe", "Aztek"],
  "Oldsmobile": ["Cutlass", "Alero", "Aurora", "Intrigue", "Silhouette", "Bravada"],
  "Hummer": ["H1", "H2", "H3", "EV", "H2 SUT"],
  "Saab": ["9-3", "9-5", "900", "9000", "93", "95"],
  "Saturn": ["Aura", "ION", "Outlook", "Sky", "Vue", "Relay"],
  "Mercury": ["Grand Marquis", "Mariner", "Milan", "Montego", "Mountaineer", "Sable"],
  "Plymouth": ["Barracuda", "Duster", "Fury", "Grand Voyager", "Neon", "Prowler"],
  "Ariel": ["Atom", "Nomad"],
  "Bristol": ["Blenheim", "Fighter"],
  "Caterham": ["Seven", "Seven 160", "Seven 360", "Seven 420"],
  "Daihatsu": ["Move", "Tanto", "Mira", "Cast", "Copen", "Terios"],
  "Dacia": ["Sandero", "Duster", "Logan", "Jogger", "Spring", "Jumper"],
  "Seat": ["Leon", "Ibiza", "Arona", "Ateca", "Tarraco", "Cupra"],
  "Skoda": ["Octavia", "Superb", "Kodiaq", "Kamiq", "Enyaq", "Scala", "Fabia"],
  "Lancia": ["Ypsilon", "Delta", "Thema", "Voyager", "Flavia"],
  "Citroën": ["C3", "C4", "C5", "Berlingo", "C3 Aircross", "C5 Aircross"],
  "Peugeot": ["208", "308", "508", "3008", "5008", "2008", "Rifter"],
  "Renault": ["Clio", "Megane", "Captur", "Zoe", "Kadjar", "Talisman", "Arkana"],
  "Opel": ["Corsa", "Astra", "Mokka", "Insignia", "Crossland", "Grandland"],
  "Vauxhall": ["Corsa", "Astra", "Mokka", "Insignia", "Crossland", "Grandland"],
  "Proton": ["Saga", "Persona", "X50", "X70", "X90", "Iriz", "Exora"],
  "Perodua": ["Myvi", "Axia", "Bezza", "Ativa", "Alza", "Aruz"],
  "Tata": ["Nexon", "Harrier", "Safari", "Tiago", "Altroz", "Punch", "Hexa"],
  "Mahindra": ["Scorpio", "XUV700", "Thar", "Bolero", "XUV300", "Marazzo"],
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Vitara Brezza", "Ertiga", "Wagon R", "Celerio"],
  "Great Wall": ["Wingle", "Poer", "Cannon", "Haval Jolion", "Haval H6", "Tank 300"],
  "Chery": ["Tiggo", "Arrizo", "QQ", "Exeed", "Omoda", "Jaecoo"],
  "SAIC Motor": ["MG5", "MG ZS", "MG HS", "Roewe RX5", "Maxus D90", "Maxus T60"],
  "Changan": ["CS75", "CS55", "Eado", "UNI-V", "UNI-K", "CS35", "Benben"],
  "Dongfeng": ["Aeolus", "Venucia", "Fengon", "Rich", "Future"],
  "FAW": ["Hongqi H9", "Bestune T77", "Jiefang", "Hongqi HS7", "Hongqi E-HS9"],
  "BAIC": ["BJ40", "BJ80", "BJ90", "EU5", "EU7"],
  "Brilliance": ["V3", "V5", "V6", "V7", "H230"],
  "JAC Motors": ["J7", "S7", "S5", "S3", "T8"],
  "Haval": ["H6", "H9", "Jolion", "Big Dog", "M6", "F7"],
  "MG Motor": ["MG4", "MG5", "MG ZS", "MG HS", "MG3", "MG One"],
  "Faraday Future": ["FF 91", "FF 81"],
  "Canoo": ["Lifestyle Vehicle", "Pickup", "Multi-Purpose Delivery Vehicle"],
  "Lordstown": ["Endurance"],
  "Rimac": ["Nevera", "Concept One"],
  "Pininfarina": ["Battista", "Pura Vision"],
  "Fisker": ["Ocean", "Pear", "Alaska", "Ronin"],
  "Spyker": ["C8", "D12", "C12"],
  "W Motors": ["Lykan Hypersport", "Fenyr Supersport"],
  "Zenvo": ["TS1", "TSR", "TSR-S"],
  "Gumpert": ["Apollo", "Tornante"],
  "Vector": ["W8", "M12"],
  "Panoz": ["Esperante", "AIV Roadster"],
  "Mosler": ["MT900", "Raptor"],
  "Noble": ["M600", "M400", "M12"],
  "Ultima": ["RS", "Evolution", "Can-Am"],
  "Radical": ["SR3", "SR8", "RXC"],
  "BAC": ["Mono", "Mono R"],
  "Morgan": ["Plus 4", "Plus 6", "3 Wheeler", "Aero 8"],
  "Donkervoort": ["D8", "D8 GTO", "D8 GTO-S"],
  "RUF": ["CTR", "SCR", "RGT"],
  "Mazzanti": ["Evantra", "Millecavalli"],
  "Tushek": ["Renovatio T500", "TS600"]
};
/* =========================
   Arabic helpers (AUTO)
   ========================= */

// ✅ Brand Arabic overrides (jahan aap exact Arabic chahte ho)
export const BRAND_AR_OVERRIDES: Record<string, string> = {
  'Toyota': 'تويوتا',
  'Honda': 'هوندا',
  'Nissan': 'نيسان',
  'Hyundai': 'هيونداي',
  'Kia': 'كيا',
  'BMW': 'بي إم دبليو',
  'Mercedes-Benz': 'مرسيدس بنز',
  'Volkswagen': 'فولكس فاجن',
  'Land Rover': 'لاند روفر',
  'Rolls-Royce': 'رولز رويس',
  'Aston Martin': 'أستون مارتن',
  'Alfa Romeo': 'ألفا روميو',
  'Mitsubishi': 'ميتسوبيشي',
  'Suzuki': 'سوزوكي',
  'Isuzu': 'إيسوزو',
  'Daihatsu': 'دايهاتسو',
  'BYD': 'بي واي دي',
  'XPeng': 'إكس بنغ',
  'Li Auto': 'لي أوتو',
  'MG Motor': 'إم جي',
};

// ✅ Model Arabic overrides (common ones)
export const MODEL_AR_OVERRIDES: Record<string, string> = {
  'Land Cruiser': 'لاند كروزر',
  'Corolla': 'كورولا',
  'Camry': 'كامري',
  'Hilux': 'هايلوكس',
  'Civic': 'سيفيك',
  'Accord': 'أكورد',
  'C-Class': 'سي كلاس',
  'E-Class': 'إي كلاس',
  'S-Class': 'إس كلاس',
  'G-Class': 'جي كلاس',
  'Model S': 'موديل إس',
  'Model 3': 'موديل 3',
  'Model X': 'موديل إكس',
  'Model Y': 'موديل واي',
};

/* =========================
   ✅ DEVICE CATEGORIES (Step-1 when Device selected)
   ========================= */
   export const DEVICE_CATEGORIES: CatItem[] = [
    { key: 'apple_section', en: 'Apple', ar: 'آبل' },
    { key: 'samsung_section', en: 'Samsung', ar: 'سامسونج' },
    { key: 'sony_section', en: 'Sony', ar: 'سوني' },
    { key: 'lg_section', en: 'LG', ar: 'إل جي' },
    { key: 'huawei_section', en: 'Huawei', ar: 'هواوي' },
    { key: 'asus_section', en: 'Asus', ar: 'أسوس' },
    { key: 'acer_section', en: 'Acer', ar: 'إيسر' },
    { key: 'dell_section', en: 'Dell', ar: 'ديل' },
    { key: 'microsoft_section', en: 'Microsoft', ar: 'مايكروسوفت' },
    { key: 'nokia_section', en: 'Nokia', ar: 'نوكيا' },
    { key: 'blackberry_section', en: 'BlackBerry', ar: 'بلاك بيري' },
    { key: 'htc_section', en: 'HTC', ar: 'إتش تي سي' },
    { key: 'toshiba_section', en: 'Toshiba', ar: 'توشيبا' },

    { key: 'canon_section', en: 'Canon', ar: 'كانون' },
    { key: 'nikon_section', en: 'Nikon', ar: 'نيكون' },
    { key: 'fujifilm_section', en: 'Fujifilm', ar: 'فوجي فيلم' },
    { key: 'panasonic_section', en: 'Panasonic', ar: 'باناسونيك' },
    { key: 'olympus_section', en: 'Olympus', ar: 'أوليمبوس' },

    { key: 'computer_section', en: 'Computers', ar: 'الكمبيوتر' },
    { key: 'gaming_section', en: 'Gaming', ar: 'الألعاب' },
    { key: 'tv_audio_section', en: 'TV & Audio', ar: 'التلفزيون والصوت' },
    { key: 'generators_section', en: 'Generators & Power', ar: 'المولدات والطاقة' },
    { key: 'home_appliances_section', en: 'Home Appliances', ar: 'الأجهزة المنزلية' },
    { key: 'digital_cameras_section', en: 'Digital Cameras', ar: 'الكاميرات الرقمية' },
    { key: 'accounts_section', en: 'Accounts & Subscriptions', ar: 'الحسابات والاشتراكات' },
    { key: 'special_numbers_section', en: 'Special Numbers', ar: 'أرقام مميزة' },

    { key: 'uncategorized_section', en: 'Uncategorized', ar: 'غير مصنف' },
  ];


  /* =========================
   ✅ DEVICE MODELS (Step-2)
   Paste your FULL object here (remove duplicate keys)
   ========================= */
export const DEVICE_MODELS: Record<string, CatItem[]> = {
    apple_section: [
      { key: 'iphone', en: 'iPhone', ar: 'آيفون' },
      { key: 'ipad', en: 'iPad', ar: 'آيباد' },
      { key: 'mac', en: 'Mac', ar: 'ماك' },
      { key: 'macbook', en: 'MacBook', ar: 'ماك بوك' },
      { key: 'imac', en: 'iMac', ar: 'آي ماك' },
      { key: 'mac_mini', en: 'Mac mini', ar: 'ماك ميني' },
      { key: 'mac_studio', en: 'Mac Studio', ar: 'ماك ستوديو' },
      { key: 'mac_pro', en: 'Mac Pro', ar: 'ماك برو' },
      { key: 'apple_watch', en: 'Apple Watch', ar: 'ساعة آبل' },
      { key: 'airpods', en: 'AirPods', ar: 'إيربودز' },
      { key: 'apple_tv', en: 'Apple TV', ar: 'آبل تي في' },
      { key: 'homepod', en: 'HomePod', ar: 'هومبود' },
      { key: 'airtag', en: 'AirTag', ar: 'إيرتاغ' },
      { key: 'apple_pencil', en: 'Apple Pencil', ar: 'قلم آبل' },
      { key: 'magic_keyboard', en: 'Magic Keyboard', ar: 'لوحة مفاتيح ماجيك' },
      { key: 'magic_mouse', en: 'Magic Mouse', ar: 'ماوس ماجيك' },
      { key: 'magic_trackpad', en: 'Magic Trackpad', ar: 'تتبع ماجيك' },
      { key: 'airport', en: 'AirPort', ar: 'إيربورت' },
      { key: 'ipod', en: 'iPod', ar: 'آيبود' },
    ],

    uncategorized_section: [
      { key: 'unknown_brand', en: 'Unknown Brand', ar: 'ماركة غير معروفة' },
      { key: 'generic', en: 'Generic', ar: 'عام' },
      { key: 'white_label', en: 'White Label', ar: 'علامة بيضاء' },
      { key: 'no_brand', en: 'No Brand', ar: 'بدون ماركة' },
      { key: 'refurbished', en: 'Refurbished', ar: 'مجدد' },
      { key: 'oem', en: 'OEM', ar: 'الصانع الأصلي للمعدات' },
      { key: 'custom_built', en: 'Custom Built', ar: 'مخصص البناء' },
      { key: 'prototype', en: 'Prototype', ar: 'نموذج أولي' },
      { key: 'test_device', en: 'Test Device', ar: 'جهاز اختبار' },
      { key: 'demo_unit', en: 'Demo Unit', ar: 'وحدة عرض' },
    ],

    samsung_section: [
      { key: 'galaxy_s_series', en: 'Galaxy S Series', ar: 'سلسلة جالاكسي إس' },
      { key: 'galaxy_note_series', en: 'Galaxy Note Series', ar: 'سلسلة جالاكسي نوت' },
      { key: 'galaxy_z_series', en: 'Galaxy Z Series', ar: 'سلسلة جالاكسي زد' },
      { key: 'galaxy_a_series', en: 'Galaxy A Series', ar: 'سلسلة جالاكسي إيه' },
      { key: 'galaxy_m_series', en: 'Galaxy M Series', ar: 'سلسلة جالاكسي إم' },
      { key: 'galaxy_f_series', en: 'Galaxy F Series', ar: 'سلسلة جالاكسي إف' },
      { key: 'galaxy_tab', en: 'Galaxy Tab', ar: 'جالاكسي تاب' },
      { key: 'galaxy_book', en: 'Galaxy Book', ar: 'جالاكسي بوك' },
      { key: 'samsung_tv', en: 'Samsung TV', ar: 'تلفزيون سامسونج' },
      { key: 'samsung_refrigerator', en: 'Samsung Refrigerator', ar: 'ثلاجة سامسونج' },
      { key: 'samsung_washer', en: 'Samsung Washer', ar: 'غسالة سامسونج' },
      { key: 'samsung_dryer', en: 'Samsung Dryer', ar: 'مجفف سامسونج' },
      { key: 'samsung_microwave', en: 'Samsung Microwave', ar: 'ميكروويف سامسونج' },
      { key: 'samsung_ac', en: 'Samsung Air Conditioner', ar: 'مكيف سامسونج' },
      { key: 'samsung_monitor', en: 'Samsung Monitor', ar: 'شاشة سامسونج' },
      { key: 'samsung_ssd', en: 'Samsung SSD', ar: 'أس أس دي سامسونج' },
      { key: 'samsung_memory', en: 'Samsung Memory', ar: 'ذاكرة سامسونج' },
      { key: 'samsung_printer', en: 'Samsung Printer', ar: 'طابعة سامسونج' },
    ],

    sony_section: [
      { key: 'xperia', en: 'Xperia', ar: 'إكسبيريا' },
      { key: 'playstation', en: 'PlayStation', ar: 'بلايستيشن' },
      { key: 'bravia_tv', en: 'Bravia TV', ar: 'تلفزيون برافيا' },
      { key: 'alpha_cameras', en: 'Alpha Cameras', ar: 'كاميرات ألفا' },
      { key: 'cybershot', en: 'Cyber-shot', ar: 'سايبر شوت' },
      { key: 'handycam', en: 'Handycam', ar: 'هاندي كام' },
      { key: 'walkman', en: 'Walkman', ar: 'ووكمان' },
      { key: 'wh_headphones', en: 'WH Headphones', ar: 'سماعات دبليو إتش' },
      { key: 'wf_earbuds', en: 'WF Earbuds', ar: 'سماعات دبليو إف' },
      { key: 'srs_speakers', en: 'SRS Speakers', ar: 'مكبرات صوت إس آر إس' },
      { key: 'aibo', en: 'Aibo', ar: 'أيبو' },
      { key: 'vaio', en: 'VAIO', ar: 'فايو' },
      { key: 'sony_soundbar', en: 'Sony Soundbar', ar: 'ساوندبار سوني' },
      { key: 'sony_home_theater', en: 'Sony Home Theater', ar: 'مسرح منزلي سوني' },
      { key: 'sony_projector', en: 'Sony Projector', ar: 'بروجكتر سوني' },
    ],

    special_numbers_section: [
      { key: 'iphone_15', en: 'iPhone 15', ar: 'آيفون 15' },
      { key: 'iphone_14', en: 'iPhone 14', ar: 'آيفون 14' },
      { key: 'iphone_13', en: 'iPhone 13', ar: 'آيفون 13' },
      { key: 'iphone_12', en: 'iPhone 12', ar: 'آيفون 12' },
      { key: 'iphone_11', en: 'iPhone 11', ar: 'آيفون 11' },
      { key: 'galaxy_s23', en: 'Galaxy S23', ar: 'جالاكسي إس 23' },
      { key: 'galaxy_s22', en: 'Galaxy S22', ar: 'جالاكسي إس 22' },
      { key: 'galaxy_s21', en: 'Galaxy S21', ar: 'جالاكسي إس 21' },
      { key: 'galaxy_s20', en: 'Galaxy S20', ar: 'جالاكسي إس 20' },
      { key: 'playstation_5', en: 'PlayStation 5', ar: 'بلايستيشن 5' },
      { key: 'playstation_4', en: 'PlayStation 4', ar: 'بلايستيشن 4' },
      { key: 'playstation_3', en: 'PlayStation 3', ar: 'بلايستيشن 3' },
      { key: 'xbox_series_x', en: 'Xbox Series X', ar: 'إكس بوكس سيريس إكس' },
      { key: 'xbox_series_s', en: 'Xbox Series S', ar: 'إكس بوكس سيريس إس' },
      { key: 'xbox_one', en: 'Xbox One', ar: 'إكس بوكس ون' },
      { key: 'macbook_pro_m3', en: 'MacBook Pro M3', ar: 'ماك بوك برو إم 3' },
      { key: 'macbook_air_m2', en: 'MacBook Air M2', ar: 'ماك بوك إير إم 2' },
      { key: 'imac_m1', en: 'iMac M1', ar: 'آي ماك إم 1' },
      { key: 'canon_eos_r5', en: 'Canon EOS R5', ar: 'كانون إي أو إس آر 5' },
      { key: 'nikon_z9', en: 'Nikon Z9', ar: 'نيكون زد 9' },
      { key: 'sony_alpha_7_iv', en: 'Sony Alpha 7 IV', ar: 'سوني ألفا 7 الرابع' },
      { key: 'surface_pro_9', en: 'Surface Pro 9', ar: 'سيرفس برو 9' },
      { key: 'thinkpad_x1', en: 'ThinkPad X1', ar: 'ثينك باد إكس 1' },
      { key: 'rog_phone_7', en: 'ROG Phone 7', ar: 'هاتف آر أو جي 7' },
    ],

    home_appliances_section: [
      { key: 'refrigerator', en: 'Refrigerator', ar: 'ثلاجة' },
      { key: 'washing_machine', en: 'Washing Machine', ar: 'غسالة' },
      { key: 'dryer', en: 'Dryer', ar: 'مجفف' },
      { key: 'microwave', en: 'Microwave', ar: 'ميكروويف' },
      { key: 'oven', en: 'Oven', ar: 'فرن' },
      { key: 'dishwasher', en: 'Dishwasher', ar: 'جلاية صحون' },
      { key: 'cooktop', en: 'Cooktop', ar: 'سطح طهي' },
      { key: 'range_hood', en: 'Range Hood', ar: 'شفاط' },
      { key: 'air_fryer', en: 'Air Fryer', ar: 'قلاية هوائية' },
      { key: 'toaster', en: 'Toaster', ar: 'محمصة' },
      { key: 'blender', en: 'Blender', ar: 'خلاط' },
      { key: 'mixer', en: 'Mixer', ar: 'خلاط' },
      { key: 'coffee_maker', en: 'Coffee Maker', ar: 'صانع القهوة' },
      { key: 'kettle', en: 'Kettle', ar: 'غلاية' },
      { key: 'rice_cooker', en: 'Rice Cooker', ar: 'طاهي الأرز' },
      { key: 'vacuum_cleaner', en: 'Vacuum Cleaner', ar: 'مكنسة كهربائية' },
      { key: 'air_purifier', en: 'Air Purifier', ar: 'منقي هواء' },
      { key: 'water_purifier', en: 'Water Purifier', ar: 'منقي ماء' },
      { key: 'iron', en: 'Iron', ar: 'مكواة' },
      { key: 'electric_shaver', en: 'Electric Shaver', ar: 'ماكينة حلاقة كهربائية' },
      { key: 'hair_dryer', en: 'Hair Dryer', ar: 'مجفف شعر' },
      { key: 'toothbrush', en: 'Toothbrush', ar: 'فرشاة أسنان' },
    ],

    blackberry_section: [
      { key: 'blackberry_bold', en: 'BlackBerry Bold', ar: 'بلاك بيري بولد' },
      { key: 'blackberry_curve', en: 'BlackBerry Curve', ar: 'بلاك بيري كيرف' },
      { key: 'blackberry_pearl', en: 'BlackBerry Pearl', ar: 'بلاك بيري بيرل' },
      { key: 'blackberry_storm', en: 'BlackBerry Storm', ar: 'بلاك بيري ستورم' },
      { key: 'blackberry_torch', en: 'BlackBerry Torch', ar: 'بلاك بيري تورش' },
      { key: 'blackberry_z10', en: 'BlackBerry Z10', ar: 'بلاك بيري زد 10' },
      { key: 'blackberry_q10', en: 'BlackBerry Q10', ar: 'بلاك بيري كيو 10' },
      { key: 'blackberry_passport', en: 'BlackBerry Passport', ar: 'بلاك بيري باسبورت' },
      { key: 'blackberry_priv', en: 'BlackBerry Priv', ar: 'بلاك بيري بريف' },
      { key: 'blackberry_keyone', en: 'BlackBerry KEYone', ar: 'بلاك بيري كي ون' },
      { key: 'blackberry_key2', en: 'BlackBerry KEY2', ar: 'بلاك بيري كي 2' },
      { key: 'blackberry_motion', en: 'BlackBerry Motion', ar: 'بلاك بيري موشن' },
    ],

    canon_section: [
      { key: 'eos_r_series', en: 'EOS R Series', ar: 'سلسلة إي أو إس آر' },
      { key: 'eos_m_series', en: 'EOS M Series', ar: 'سلسلة إي أو إس إم' },
      { key: 'eos_dslr', en: 'EOS DSLR', ar: 'إي أو إس دي إس إل آر' },
      { key: 'powershot', en: 'PowerShot', ar: 'باور شوت' },
      { key: 'ixus', en: 'IXUS', ar: 'إيكسوس' },
      { key: 'canon_printer', en: 'Canon Printer', ar: 'طابعة كانون' },
      { key: 'canon_scanner', en: 'Canon Scanner', ar: 'ماسح كانون' },
      { key: 'canon_projector', en: 'Canon Projector', ar: 'بروجكتر كانون' },
      { key: 'canon_lens_ef', en: 'Canon Lens EF', ar: 'عدسة كانون إي إف' },
      { key: 'canon_lens_rf', en: 'Canon Lens RF', ar: 'عدسة كانون آر إف' },
      { key: 'canon_binoculars', en: 'Canon Binoculars', ar: 'مناظير كانون' },
    ],

    lg_section: [
      { key: 'lg_tv', en: 'LG TV', ar: 'تلفزيون إل جي' },
      { key: 'lg_refrigerator', en: 'LG Refrigerator', ar: 'ثلاجة إل جي' },
      { key: 'lg_washer', en: 'LG Washer', ar: 'غسالة إل جي' },
      { key: 'lg_dryer', en: 'LG Dryer', ar: 'مجفف إل جي' },
      { key: 'lg_ac', en: 'LG Air Conditioner', ar: 'مكيف إل جي' },
      { key: 'lg_monitor', en: 'LG Monitor', ar: 'شاشة إل جي' },
      { key: 'lg_gram_laptop', en: 'LG Gram Laptop', ar: 'لابتوب إل جي جرام' },
      { key: 'lg_v_series', en: 'LG V Series Phone', ar: 'هاتف إل جي في سيريس' },
      { key: 'lg_g_series', en: 'LG G Series Phone', ar: 'هاتف إل جي جي سيريس' },
      { key: 'lg_q_series', en: 'LG Q Series', ar: 'سلسلة إل جي كيو' },
      { key: 'lg_stylo', en: 'LG Stylo', ar: 'إل جي ستايلو' },
      { key: 'lg_wing', en: 'LG Wing', ar: 'إل جي وينج' },
      { key: 'lg_rollable', en: 'LG Rollable', ar: 'إل جي رولابل' },
      { key: 'lg_soundbar', en: 'LG Soundbar', ar: 'ساوندبار إل جي' },
    ],

    nokia_section: [
      { key: 'nokia_3310', en: 'Nokia 3310', ar: 'نوكيا 3310' },
      { key: 'nokia_1100', en: 'Nokia 1100', ar: 'نوكيا 1100' },
      { key: 'nokia_lumia', en: 'Nokia Lumia', ar: 'نوكيا لوميا' },
      { key: 'nokia_x_series', en: 'Nokia X Series', ar: 'سلسلة نوكيا إكس' },
      { key: 'nokia_g_series', en: 'Nokia G Series', ar: 'سلسلة نوكيا جي' },
      { key: 'nokia_c_series', en: 'Nokia C Series', ar: 'سلسلة نوكيا سي' },
      { key: 'nokia_8_series', en: 'Nokia 8 Series', ar: 'سلسلة نوكيا 8' },
      { key: 'nokia_7_series', en: 'Nokia 7 Series', ar: 'سلسلة نوكيا 7' },
      { key: 'nokia_6_series', en: 'Nokia 6 Series', ar: 'سلسلة نوكيا 6' },
      { key: 'nokia_5_series', en: 'Nokia 5 Series', ar: 'سلسلة نوكيا 5' },
      { key: 'nokia_3_series', en: 'Nokia 3 Series', ar: 'سلسلة نوكيا 3' },
      { key: 'nokia_2_series', en: 'Nokia 2 Series', ar: 'سلسلة نوكيا 2' },
      { key: 'nokia_1_series', en: 'Nokia 1 Series', ar: 'سلسلة نوكيا 1' },
    ],

    microsoft_section: [
      { key: 'surface_pro', en: 'Surface Pro', ar: 'سيرفس برو' },
      { key: 'surface_laptop', en: 'Surface Laptop', ar: 'سيرفس لابتوب' },
      { key: 'surface_studio', en: 'Surface Studio', ar: 'سيرفس ستوديو' },
      { key: 'surface_book', en: 'Surface Book', ar: 'سيرفس بوك' },
      { key: 'surface_go', en: 'Surface Go', ar: 'سيرفس جو' },
      { key: 'surface_duo', en: 'Surface Duo', ar: 'سيرفس ديو' },
      { key: 'xbox', en: 'Xbox', ar: 'إكس بوكس' },
      { key: 'microsoft_mouse', en: 'Microsoft Mouse', ar: 'ماوس مايكروسوفت' },
      { key: 'microsoft_keyboard', en: 'Microsoft Keyboard', ar: 'لوحة مفاتيح مايكروسوفت' },
      { key: 'microsoft_webcam', en: 'Microsoft Webcam', ar: 'كاميرا ويب مايكروسوفت' },
      { key: 'microsoft_headphones', en: 'Microsoft Headphones', ar: 'سماعات مايكروسوفت' },
      { key: 'windows_phone', en: 'Windows Phone', ar: 'هاتف ويندوز' },
      { key: 'zune', en: 'Zune', ar: 'زون' },
      { key: 'band', en: 'Band', ar: 'باند' },
    ],

    nikon_section: [
      { key: 'nikon_z_series', en: 'Nikon Z Series', ar: 'سلسلة نيكون زد' },
      { key: 'nikon_d_series', en: 'Nikon D Series', ar: 'سلسلة نيكون دي' },
      { key: 'nikon_coolpix', en: 'Nikon Coolpix', ar: 'نيكون كولبيكس' },
      { key: 'nikon_lens_z', en: 'Nikon Lens Z', ar: 'عدسة نيكون زد' },
      { key: 'nikon_lens_f', en: 'Nikon Lens F', ar: 'عدسة نيكون إف' },
      { key: 'nikon_binoculars', en: 'Nikon Binoculars', ar: 'مناظير نيكون' },
      { key: 'nikon_scope', en: 'Nikon Scope', ar: 'منظار نيكون' },
      { key: 'nikon_microscope', en: 'Nikon Microscope', ar: 'ميكروسكوب نيكون' },
      { key: 'nikon_projector', en: 'Nikon Projector', ar: 'بروجكتر نيكون' },
    ],

    htc_section: [
      { key: 'htc_one', en: 'HTC One', ar: 'إتش تي سي ون' },
      { key: 'htc_desire', en: 'HTC Desire', ar: 'إتش تي سي ديزاير' },
      { key: 'htc_u_series', en: 'HTC U Series', ar: 'سلسلة إتش تي سي يو' },
      { key: 'htc_10', en: 'HTC 10', ar: 'إتش تي سي 10' },
      { key: 'htc_m_series', en: 'HTC M Series', ar: 'سلسلة إتش تي سي إم' },
      { key: 'htc_butterfly', en: 'HTC Butterfly', ar: 'إتش تي سي باترفلاي' },
      { key: 'htc_wildfire', en: 'HTC Wildfire', ar: 'إتش تي سي وايلد فاير' },
      { key: 'htc_chacha', en: 'HTC ChaCha', ar: 'إتش تي سي تشاتشا' },
      { key: 'htc_salsa', en: 'HTC Salsa', ar: 'إتش تي سي سالسا' },
      { key: 'htc_vive', en: 'HTC Vive', ar: 'إتش تي سي فايف' },
      { key: 'htc_exodus', en: 'HTC Exodus', ar: 'إتش تي سي إكسودس' },
    ],

    toshiba_section: [
      { key: 'toshiba_laptop', en: 'Toshiba Laptop', ar: 'لابتوب توشيبا' },
      { key: 'toshiba_tv', en: 'Toshiba TV', ar: 'تلفزيون توشيبا' },
      { key: 'toshiba_refrigerator', en: 'Toshiba Refrigerator', ar: 'ثلاجة توشيبا' },
      { key: 'toshiba_washer', en: 'Toshiba Washer', ar: 'غسالة توشيبا' },
      { key: 'toshiba_microwave', en: 'Toshiba Microwave', ar: 'ميكروويف توشيبا' },
      { key: 'toshiba_ac', en: 'Toshiba Air Conditioner', ar: 'مكيف توشيبا' },
      { key: 'toshiba_hdd', en: 'Toshiba HDD', ar: 'هارد ديسك توشيبا' },
      { key: 'toshiba_ssd', en: 'Toshiba SSD', ar: 'أس أس دي توشيبا' },
      { key: 'toshiba_memory', en: 'Toshiba Memory', ar: 'ذاكرة توشيبا' },
      { key: 'toshiba_printer', en: 'Toshiba Printer', ar: 'طابعة توشيبا' },
      { key: 'toshiba_scanner', en: 'Toshiba Scanner', ar: 'ماسح توشيبا' },
    ],

    dell_section: [
      { key: 'dell_xps', en: 'Dell XPS', ar: 'ديل إكس بي إس' },
      { key: 'dell_inspiron', en: 'Dell Inspiron', ar: 'ديل إنسبيرون' },
      { key: 'dell_latitude', en: 'Dell Latitude', ar: 'ديل لاتيتيود' },
      { key: 'dell_precision', en: 'Dell Precision', ar: 'ديل بريسيجن' },
      { key: 'dell_vostro', en: 'Dell Vostro', ar: 'ديل فوسترو' },
      { key: 'dell_alienware', en: 'Dell Alienware', ar: 'ديل ألين وير' },
      { key: 'dell_g_series', en: 'Dell G Series', ar: 'سلسلة ديل جي' },
      { key: 'dell_monitor', en: 'Dell Monitor', ar: 'شاشة ديل' },
      { key: 'dell_printer', en: 'Dell Printer', ar: 'طابعة ديل' },
      { key: 'dell_projector', en: 'Dell Projector', ar: 'بروجكتر ديل' },
      { key: 'dell_tablet', en: 'Dell Tablet', ar: 'تابلت ديل' },
      { key: 'dell_dock', en: 'Dell Dock', ar: 'دوك ديل' },
    ],

    huawei_section: [
      { key: 'huawei_p_series', en: 'Huawei P Series', ar: 'سلسلة هواوي بي' },
      { key: 'huawei_mate_series', en: 'Huawei Mate Series', ar: 'سلسلة هواوي ميت' },
      { key: 'huawei_nova_series', en: 'Huawei Nova Series', ar: 'سلسلة هواوي نوفا' },
      { key: 'huawei_y_series', en: 'Huawei Y Series', ar: 'سلسلة هواوي واي' },
      { key: 'huawei_matebook', en: 'Huawei MateBook', ar: 'هواوي ميت بوك' },
      { key: 'huawei_matepad', en: 'Huawei MatePad', ar: 'هواوي ميت باد' },
      { key: 'huawei_watch', en: 'Huawei Watch', ar: 'ساعة هواوي' },
      { key: 'huawei_band', en: 'Huawei Band', ar: 'سوار هواوي' },
      { key: 'huawei_freebuds', en: 'Huawei FreeBuds', ar: 'سماعات هواوي فري بادز' },
      { key: 'huawei_router', en: 'Huawei Router', ar: 'راوتر هواوي' },
      { key: 'huawei_modem', en: 'Huawei Modem', ar: 'مودم هواوي' },
      { key: 'huawei_tv', en: 'Huawei TV', ar: 'تلفزيون هواوي' },
    ],

    asus_section: [
      { key: 'asus_zenfone', en: 'Asus ZenFone', ar: 'أسوس زين فون' },
      { key: 'asus_rog_phone', en: 'Asus ROG Phone', ar: 'أسوس آر أو جي فون' },
      { key: 'asus_zenbook', en: 'Asus ZenBook', ar: 'أسوس زين بوك' },
      { key: 'asus_vivobook', en: 'Asus VivoBook', ar: 'أسوس فيفو بوك' },
      { key: 'asus_rog_laptop', en: 'Asus ROG Laptop', ar: 'أسوس آر أو جي لابتوب' },
      { key: 'asus_tuf_gaming', en: 'Asus TUF Gaming', ar: 'أسوس تي يو إف جيمنج' },
      { key: 'asus_monitor', en: 'Asus Monitor', ar: 'شاشة أسوس' },
      { key: 'asus_router', en: 'Asus Router', ar: 'راوتر أسوس' },
      { key: 'asus_motherboard', en: 'Asus Motherboard', ar: 'لوحة أم أسوس' },
      { key: 'asus_graphics_card', en: 'Asus Graphics Card', ar: 'كرت شاشة أسوس' },
      { key: 'asus_tablet', en: 'Asus Tablet', ar: 'تابلت أسوس' },
    ],

    acer_section: [
      { key: 'acer_aspire', en: 'Acer Aspire', ar: 'إيسر أسباير' },
      { key: 'acer_swift', en: 'Acer Swift', ar: 'إيسر سويفت' },
      { key: 'acer_predator', en: 'Acer Predator', ar: 'إيسر بريداتور' },
      { key: 'acer_nitro', en: 'Acer Nitro', ar: 'إيسر نايترو' },
      { key: 'acer_spin', en: 'Acer Spin', ar: 'إيسر سبين' },
      { key: 'acer_travelmate', en: 'Acer TravelMate', ar: 'إيسر ترافيل ميت' },
      { key: 'acer_chromebook', en: 'Acer Chromebook', ar: 'إيسر كروم بوك' },
      { key: 'acer_monitor', en: 'Acer Monitor', ar: 'شاشة إيسر' },
      { key: 'acer_projector', en: 'Acer Projector', ar: 'بروجكتر إيسر' },
      { key: 'acer_tablet', en: 'Acer Tablet', ar: 'تابلت إيسر' },
    ],

    panasonic_section: [
      { key: 'panasonic_tv', en: 'Panasonic TV', ar: 'تلفزيون باناسونيك' },
      { key: 'panasonic_refrigerator', en: 'Panasonic Refrigerator', ar: 'ثلاجة باناسونيك' },
      { key: 'panasonic_washer', en: 'Panasonic Washer', ar: 'غسالة باناسونيك' },
      { key: 'panasonic_microwave', en: 'Panasonic Microwave', ar: 'ميكروويف باناسونيك' },
      { key: 'panasonic_camera', en: 'Panasonic Camera', ar: 'كاميرا باناسونيك' },
      { key: 'panasonic_lumix', en: 'Panasonic Lumix', ar: 'باناسونيك لوميكس' },
      { key: 'panasonic_headphones', en: 'Panasonic Headphones', ar: 'سماعات باناسونيك' },
      { key: 'panasonic_shaver', en: 'Panasonic Shaver', ar: 'ماكينة حلاقة باناسونيك' },
      { key: 'panasonic_iron', en: 'Panasonic Iron', ar: 'مكواة باناسونيك' },
      { key: 'panasonic_battery', en: 'Panasonic Battery', ar: 'بطارية باناسونيك' },
      { key: 'panasonic_projector', en: 'Panasonic Projector', ar: 'بروجكتر باناسونيك' },
    ],

    fujifilm_section: [
      { key: 'fujifilm_x_series', en: 'Fujifilm X Series', ar: 'سلسلة فوجي فيلم إكس' },
      { key: 'fujifilm_gfx', en: 'Fujifilm GFX', ar: 'فوجي فيلم جي إف إكس' },
      { key: 'fujifilm_instax', en: 'Fujifilm Instax', ar: 'فوجي فيلم إنستاكس' },
      { key: 'fujifilm_finepix', en: 'Fujifilm FinePix', ar: 'فوجي فيلم فاين بيكس' },
      { key: 'fujifilm_lens_xf', en: 'Fujifilm Lens XF', ar: 'عدسة فوجي فيلم إكس إف' },
      { key: 'fujifilm_lens_gf', en: 'Fujifilm Lens GF', ar: 'عدسة فوجي فيلم جي إف' },
      { key: 'fujifilm_printer', en: 'Fujifilm Printer', ar: 'طابعة فوجي فيلم' },
      { key: 'fujifilm_scanner', en: 'Fujifilm Scanner', ar: 'ماسح فوجي فيلم' },
      { key: 'fujifilm_projector', en: 'Fujifilm Projector', ar: 'بروجكتر فوجي فيلم' },
    ],

    hitachi_section: [
      { key: 'hitachi_tv', en: 'Hitachi TV', ar: 'تلفزيون هيتاشي' },
      { key: 'hitachi_refrigerator', en: 'Hitachi Refrigerator', ar: 'ثلاجة هيتاشي' },
      { key: 'hitachi_washer', en: 'Hitachi Washer', ar: 'غسالة هيتاشي' },
      { key: 'hitachi_ac', en: 'Hitachi Air Conditioner', ar: 'مكيف هيتاشي' },
      { key: 'hitachi_projector', en: 'Hitachi Projector', ar: 'بروجكتر هيتاشي' },
      { key: 'hitachi_camera', en: 'Hitachi Camera', ar: 'كاميرا هيتاشي' },
      { key: 'hitachi_power_tools', en: 'Hitachi Power Tools', ar: 'أدوات كهربائية هيتاشي' },
      { key: 'hitachi_hdd', en: 'Hitachi HDD', ar: 'هارد ديسك هيتاشي' },
      { key: 'hitachi_excavator', en: 'Hitachi Excavator', ar: 'حفارة هيتاشي' },
      { key: 'hitachi_elevator', en: 'Hitachi Elevator', ar: 'مصعد هيتاشي' },
    ],

    olympus_section: [
      { key: 'olympus_om_d', en: 'Olympus OM-D', ar: 'أوليمبوس أو إم-دي' },
      { key: 'olympus_pen', en: 'Olympus PEN', ar: 'أوليمبوس بن' },
      { key: 'olympus_tough', en: 'Olympus Tough', ar: 'أوليمبوس توف' },
      { key: 'olympus_zuiko_lens', en: 'Olympus Zuiko Lens', ar: 'عدسة أوليمبوس زويكو' },
      { key: 'olympus_microscope', en: 'Olympus Microscope', ar: 'ميكروسكوب أوليمبوس' },
      { key: 'olympus_endoscope', en: 'Olympus Endoscope', ar: 'منظار أوليمبوس' },
      { key: 'olympus_recorder', en: 'Olympus Recorder', ar: 'مسجل أوليمبوس' },
      { key: 'olympus_binoculars', en: 'Olympus Binoculars', ar: 'مناظير أوليمبوس' },
      { key: 'olympus_voice_recorder', en: 'Olympus Voice Recorder', ar: 'مسجل صوت أوليمبوس' },
    ],

    computer_section: [
      { key: 'desktop_pc', en: 'Desktop PC', ar: 'كمبيوتر مكتبي' },
      { key: 'laptop', en: 'Laptop', ar: 'لابتوب' },
      { key: 'notebook', en: 'Notebook', ar: 'دفتر ملاحظات' },
      { key: 'ultrabook', en: 'Ultrabook', ar: 'الترا بوك' },
      { key: 'chromebook', en: 'Chromebook', ar: 'كروم بوك' },
      { key: 'workstation', en: 'Workstation', ar: 'محطة عمل' },
      { key: 'server', en: 'Server', ar: 'خادم' },
      { key: 'mini_pc', en: 'Mini PC', ar: 'كمبيوتر مصغر' },
      { key: 'all_in_one_pc', en: 'All-in-One PC', ar: 'كمبيوتر متكامل' },
      { key: 'gaming_pc', en: 'Gaming PC', ar: 'كمبيوتر ألعاب' },
      { key: 'tablet_pc', en: 'Tablet PC', ar: 'كمبيوتر لوحي' },
      { key: '2_in_1_laptop', en: '2-in-1 Laptop', ar: 'لابتوب 2 في 1' },
    ],

    gaming_section: [
      { key: 'gaming_console', en: 'Gaming Console', ar: 'كونسول ألعاب' },
      { key: 'gaming_pc', en: 'Gaming PC', ar: 'كمبيوتر ألعاب' },
      { key: 'gaming_laptop', en: 'Gaming Laptop', ar: 'لابتوب ألعاب' },
      { key: 'gaming_monitor', en: 'Gaming Monitor', ar: 'شاشة ألعاب' },
      { key: 'gaming_mouse', en: 'Gaming Mouse', ar: 'ماوس ألعاب' },
      { key: 'gaming_keyboard', en: 'Gaming Keyboard', ar: 'لوحة مفاتيح ألعاب' },
      { key: 'gaming_headset', en: 'Gaming Headset', ar: 'سماعات ألعاب' },
      { key: 'gaming_chair', en: 'Gaming Chair', ar: 'كرسي ألعاب' },
      { key: 'gaming_controller', en: 'Gaming Controller', ar: 'جهاز تحكم ألعاب' },
      { key: 'vr_headset', en: 'VR Headset', ar: 'سماعات الواقع الافتراضي' },
      { key: 'arcade_machine', en: 'Arcade Machine', ar: 'آلة أركيد' },
      { key: 'handheld_console', en: 'Handheld Console', ar: 'كونسول محمول' },
    ],

    tv_audio_section: [
      { key: 'smart_tv', en: 'Smart TV', ar: 'تلفزيون ذكي' },
      { key: 'oled_tv', en: 'OLED TV', ar: 'تلفزيون OLED' },
      { key: 'qled_tv', en: 'QLED TV', ar: 'تلفزيون QLED' },
      { key: '4k_tv', en: '4K TV', ar: 'تلفزيون 4K' },
      { key: '8k_tv', en: '8K TV', ar: 'تلفزيون 8K' },
      { key: 'soundbar', en: 'Soundbar', ar: 'ساوندبار' },
      { key: 'home_theater', en: 'Home Theater', ar: 'مسرح منزلي' },
      { key: 'av_receiver', en: 'AV Receiver', ar: 'مستقبل إيه في' },
      { key: 'speaker_system', en: 'Speaker System', ar: 'نظام مكبرات صوت' },
      { key: 'sound_system', en: 'Sound System', ar: 'نظام صوتي' },
      { key: 'bluetooth_speaker', en: 'Bluetooth Speaker', ar: 'مكبر صوت بلوتوث' },
      { key: 'portable_speaker', en: 'Portable Speaker', ar: 'مكبر صوت محمول' },
      { key: 'headphones', en: 'Headphones', ar: 'سماعات رأس' },
      { key: 'earbuds', en: 'Earbuds', ar: 'سماعات أذن' },
      { key: 'earphones', en: 'Earphones', ar: 'سماعات أذن' },
      { key: 'microphone', en: 'Microphone', ar: 'ميكروفون' },
      { key: 'amplifier', en: 'Amplifier', ar: 'مضخم صوت' },
    ],

    generators_section: [
      { key: 'portable_generator', en: 'Portable Generator', ar: 'مولد محمول' },
      { key: 'inverter_generator', en: 'Inverter Generator', ar: 'مولد انفيرتر' },
      { key: 'standby_generator', en: 'Standby Generator', ar: 'مولد احتياطي' },
      { key: 'solar_generator', en: 'Solar Generator', ar: 'مولد شمسي' },
      { key: 'gas_generator', en: 'Gas Generator', ar: 'مولد غاز' },
      { key: 'diesel_generator', en: 'Diesel Generator', ar: 'مولد ديزل' },
      { key: 'propane_generator', en: 'Propane Generator', ar: 'مولد بروبان' },
      { key: 'wind_generator', en: 'Wind Generator', ar: 'مولد رياح' },
      { key: 'water_generator', en: 'Water Generator', ar: 'مولد مياه' },
      { key: 'power_bank', en: 'Power Bank', ar: 'بنك طاقة' },
      { key: 'ups', en: 'UPS', ar: 'يو بي إس' },
      { key: 'voltage_stabilizer', en: 'Voltage Stabilizer', ar: 'مثبت جهد' },
    ],

    accounts_section: [
      { key: 'netflix', en: 'Netflix', ar: 'نتفليكس' },
      { key: 'amazon_prime', en: 'Amazon Prime', ar: 'أمازون برايم' },
      { key: 'disney_plus', en: 'Disney+', ar: 'ديزني بلاس' },
      { key: 'hulu', en: 'Hulu', ar: 'هولو' },
      { key: 'hbo_max', en: 'HBO Max', ar: 'إتش بي أو ماكس' },
      { key: 'spotify', en: 'Spotify', ar: 'سبوتيفاي' },
      { key: 'apple_music', en: 'Apple Music', ar: 'آبل ميوزك' },
      { key: 'youtube_premium', en: 'YouTube Premium', ar: 'يوتيوب بريميوم' },
      { key: 'adobe_creative_cloud', en: 'Adobe Creative Cloud', ar: 'أدوبي كرييتيف كلاود' },
      { key: 'microsoft_365', en: 'Microsoft 365', ar: 'مايكروسوفت 365' },
      { key: 'google_workspace', en: 'Google Workspace', ar: 'جوجل ورك سبيس' },
      { key: 'icloud', en: 'iCloud', ar: 'آي كلاود' },
      { key: 'dropbox', en: 'Dropbox', ar: 'دروب بوكس' },
      { key: 'playstation_plus', en: 'PlayStation Plus', ar: 'بلايستيشن بلاس' },
      { key: 'xbox_game_pass', en: 'Xbox Game Pass', ar: 'إكس بوكس جيم باس' },
      { key: 'nintendo_switch_online', en: 'Nintendo Switch Online', ar: 'نينتندو سويتش أونلاين' },
    ],

    digital_cameras_section: [
      { key: 'dslr_camera', en: 'DSLR Camera', ar: 'كاميرا دي إس إل آر' },
      { key: 'mirrorless_camera', en: 'Mirrorless Camera', ar: 'كاميرا ميرورلس' },
      { key: 'point_and_shoot_camera', en: 'Point-and-Shoot Camera', ar: 'كاميرا بوانت اند شوت' },
      { key: 'bridge_camera', en: 'Bridge Camera', ar: 'كاميرا بريدج' },
      { key: 'action_camera', en: 'Action Camera', ar: 'كاميرا أكشن' },
      { key: '360_camera', en: '360 Camera', ar: 'كاميرا 360' },
      { key: 'instant_camera', en: 'Instant Camera', ar: 'كاميرا فورية' },
      { key: 'film_camera', en: 'Film Camera', ar: 'كاميرا فيلم' },
      { key: 'drone_camera', en: 'Drone Camera', ar: 'كاميرا درون' },
      { key: 'webcam', en: 'Webcam', ar: 'كاميرا ويب' },
      { key: 'cctv_camera', en: 'CCTV Camera', ar: 'كاميرا مراقبة' },
      { key: 'trail_camera', en: 'Trail Camera', ar: 'كاميرا تريل' },
    ],

};




export const AUCTION_SUBCATEGORIES: Record<string, CatItem[]> = {
  animals_birds_section: [
    { key: 'dogs', en: 'Dogs', ar: 'الكلاب' },
    { key: 'cats', en: 'Cats', ar: 'القطط' },
    { key: 'birds', en: 'Birds', ar: 'الطيور' },
    { key: 'horses', en: 'Horses', ar: 'الخيول' },
    { key: 'fish', en: 'Fish', ar: 'الأسماك' },
    { key: 'reptiles', en: 'Reptiles', ar: 'الزواحف' },
    { key: 'small_pets', en: 'Small Pets', ar: 'الحيوانات الصغيرة' },
    { key: 'farm_animals', en: 'Farm Animals', ar: 'حيوانات المزرعة' },
    { key: 'exotic_animals', en: 'Exotic Animals', ar: 'حيوانات غريبة' },
    { key: 'pet_supplies', en: 'Pet Supplies', ar: 'مستلزمات الحيوانات الأليفة' },
    { key: 'bird_cages', en: 'Bird Cages', ar: 'أقفاص الطيور' },
    { key: 'aquariums', en: 'Aquariums', ar: 'أحواض السمك' },
    { key: 'animal_food', en: 'Animal Food', ar: 'طعام الحيوانات' },
    { key: 'veterinary_services', en: 'Veterinary Services', ar: 'الخدمات البيطرية' },
    { key: 'animal_training', en: 'Animal Training', ar: 'تدريب الحيوانات' },
  ],

  furniture_section: [
    { key: 'living_room_furniture', en: 'Living Room Furniture', ar: 'أثاث غرفة المعيشة' },
    { key: 'bedroom_furniture', en: 'Bedroom Furniture', ar: 'أثاث غرفة النوم' },
    { key: 'dining_room_furniture', en: 'Dining Room Furniture', ar: 'أثاث غرفة الطعام' },
    { key: 'office_furniture', en: 'Office Furniture', ar: 'أثاث المكاتب' },
    { key: 'outdoor_furniture', en: 'Outdoor Furniture', ar: 'أثاث خارجي' },
    { key: 'kitchen_furniture', en: 'Kitchen Furniture', ar: 'أثاث المطبخ' },
    { key: 'antique_furniture', en: 'Antique Furniture', ar: 'أثاث قديم' },
    { key: 'modern_furniture', en: 'Modern Furniture', ar: 'أثاث حديث' },
    { key: 'sofas', en: 'Sofas', ar: 'الأرائك' },
    { key: 'beds', en: 'Beds', ar: 'الأسرة' },
    { key: 'tables', en: 'Tables', ar: 'الطاولات' },
    { key: 'chairs', en: 'Chairs', ar: 'الكراسي' },
    { key: 'cabinets', en: 'Cabinets', ar: 'الخزائن' },
    { key: 'shelves', en: 'Shelves', ar: 'الرفوف' },
    { key: 'mattresses', en: 'Mattresses', ar: 'المراتب' },
  ],

  personal_accessories_section: [
    { key: 'watches', en: 'Watches', ar: 'الساعات' },
    { key: 'jewelry', en: 'Jewelry', ar: 'المجوهرات' },
    { key: 'handbags', en: 'Handbags', ar: 'حقائب اليد' },
    { key: 'wallets', en: 'Wallets', ar: 'المحافظ' },
    { key: 'belts', en: 'Belts', ar: 'الأحزمة' },
    { key: 'scarves', en: 'Scarves', ar: 'الأوشحة' },
    { key: 'sunglasses', en: 'Sunglasses', ar: 'النظارات الشمسية' },
    { key: 'ties', en: 'Ties', ar: 'ربطات العنق' },
    { key: 'hats', en: 'Hats', ar: 'القبعات' },
    { key: 'gloves', en: 'Gloves', ar: 'القفازات' },
    { key: 'perfumes', en: 'Perfumes', ar: 'العطور' },
    { key: 'cosmetics', en: 'Cosmetics', ar: 'مستحضرات التجميل' },
    { key: 'hair_accessories', en: 'Hair Accessories', ar: 'إكسسوارات الشعر' },
    { key: 'keychains', en: 'Keychains', ar: 'سلاسل المفاتيح' },
    { key: 'phone_accessories', en: 'Phone Accessories', ar: 'إكسسوارات الهواتف' },
  ],

  services_section: [
    { key: 'home_services', en: 'Home Services', ar: 'خدمات منزلية' },
    { key: 'transport_services', en: 'Transport Services', ar: 'خدمات النقل' },
    { key: 'repair_services', en: 'Repair Services', ar: 'خدمات الإصلاح' },
    { key: 'cleaning_services', en: 'Cleaning Services', ar: 'خدمات التنظيف' },
    { key: 'beauty_services', en: 'Beauty Services', ar: 'خدمات التجميل' },
    { key: 'educational_services', en: 'Educational Services', ar: 'خدمات تعليمية' },
    { key: 'health_services', en: 'Health Services', ar: 'خدمات صحية' },
    { key: 'legal_services', en: 'Legal Services', ar: 'خدمات قانونية' },
    { key: 'consulting_services', en: 'Consulting Services', ar: 'خدمات استشارية' },
    { key: 'event_services', en: 'Event Services', ar: 'خدمات الفعاليات' },
    { key: 'photography_services', en: 'Photography Services', ar: 'خدمات التصوير' },
    { key: 'catering_services', en: 'Catering Services', ar: 'خدمات التغذية' },
    { key: 'security_services', en: 'Security Services', ar: 'خدمات الأمن' },
    { key: 'it_services', en: 'IT Services', ar: 'خدمات تكنولوجيا المعلومات' },
    { key: 'maintenance_services', en: 'Maintenance Services', ar: 'خدمات الصيانة' },
  ],

  food_beverages_section: [
    { key: 'fresh_food', en: 'Fresh Food', ar: 'الطعام الطازج' },
    { key: 'canned_food', en: 'Canned Food', ar: 'الطعام المعلب' },
    { key: 'beverages', en: 'Beverages', ar: 'المشروبات' },
    { key: 'sweets', en: 'Sweets', ar: 'الحلويات' },
    { key: 'spices', en: 'Spices', ar: 'التوابل' },
    { key: 'meat_products', en: 'Meat Products', ar: 'منتجات اللحوم' },
    { key: 'dairy_products', en: 'Dairy Products', ar: 'منتجات الألبان' },
    { key: 'bakery_products', en: 'Bakery Products', ar: 'منتجات المخابز' },
    { key: 'organic_food', en: 'Organic Food', ar: 'الطعام العضوي' },
    { key: 'imported_food', en: 'Imported Food', ar: 'الطعام المستورد' },
    { key: 'local_food', en: 'Local Food', ar: 'الطعام المحلي' },
    { key: 'cooking_ingredients', en: 'Cooking Ingredients', ar: 'مكونات الطبخ' },
    { key: 'frozen_food', en: 'Frozen Food', ar: 'الطعام المجمد' },
    { key: 'healthy_food', en: 'Healthy Food', ar: 'الطعام الصحي' },
    { key: 'traditional_food', en: 'Traditional Food', ar: 'الطعام التقليدي' },
  ],

  game_entertainment_section: [
    { key: 'video_games', en: 'Video Games', ar: 'ألعاب الفيديو' },
    { key: 'board_games', en: 'Board Games', ar: 'ألعاب الطاولة' },
    { key: 'card_games', en: 'Card Games', ar: 'ألعاب الورق' },
    { key: 'puzzles', en: 'Puzzles', ar: 'الألغاز' },
    { key: 'toys', en: 'Toys', ar: 'الألعاب' },
    { key: 'collectibles', en: 'Collectibles', ar: 'المقتنيات' },
    { key: 'sports_equipment', en: 'Sports Equipment', ar: 'معدات رياضية' },
    { key: 'musical_instruments', en: 'Musical Instruments', ar: 'آلات موسيقية' },
    { key: 'movie_tickets', en: 'Movie Tickets', ar: 'تذاكر السينما' },
    { key: 'concert_tickets', en: 'Concert Tickets', ar: 'تذاكر الحفلات' },
    { key: 'event_tickets', en: 'Event Tickets', ar: 'تذاكر الفعاليات' },
    { key: 'memberships', en: 'Memberships', ar: 'العضويات' },
    { key: 'party_supplies', en: 'Party Supplies', ar: 'مستلزمات الحفلات' },
    { key: 'drones', en: 'Drones', ar: 'الطائرات بدون طيار' },
    { key: 'rc_vehicles', en: 'RC Vehicles', ar: 'مركبات التحكم عن بعد' },
  ],

  hunting_tips_section: [
    { key: 'hunting_equipment', en: 'Hunting Equipment', ar: 'معدات الصيد' },
    { key: 'fishing_gear', en: 'Fishing Gear', ar: 'معدات صيد الأسماك' },
    { key: 'camping_gear', en: 'Camping Gear', ar: 'معدات التخييم' },
    { key: 'outdoor_gear', en: 'Outdoor Gear', ar: 'معدات خارجية' },
    { key: 'hunting_licenses', en: 'Hunting Licenses', ar: 'تراخيص الصيد' },
    { key: 'safety_equipment', en: 'Safety Equipment', ar: 'معدات السلامة' },
    { key: 'navigation_tools', en: 'Navigation Tools', ar: 'أدوات الملاحة' },
    { key: 'hunting_clothing', en: 'Hunting Clothing', ar: 'ملابس الصيد' },
    { key: 'hunting_guides', en: 'Hunting Guides', ar: 'مرشدو الصيد' },
    { key: 'wildlife_books', en: 'Wildlife Books', ar: 'كتب الحياة البرية' },
    { key: 'survival_gear', en: 'Survival Gear', ar: 'معدات النجاة' },
    { key: 'hunting_tips', en: 'Hunting Tips', ar: 'نصائح الصيد' },
    { key: 'fishing_tips', en: 'Fishing Tips', ar: 'نصائح صيد الأسماك' },
    { key: 'camouflage', en: 'Camouflage', ar: 'التخفي' },
    { key: 'animal_tracking', en: 'Animal Tracking', ar: 'تتبع الحيوانات' },
  ],

  cultivation_gardens_section: [
    { key: 'plants', en: 'Plants', ar: 'النباتات' },
    { key: 'seeds', en: 'Seeds', ar: 'البذور' },
    { key: 'gardening_tools', en: 'Gardening Tools', ar: 'أدوات البستنة' },
    { key: 'fertilizers', en: 'Fertilizers', ar: 'الأسمدة' },
    { key: 'pesticides', en: 'Pesticides', ar: 'مبيدات الآفات' },
    { key: 'soil', en: 'Soil', ar: 'التربة' },
    { key: 'pots', en: 'Pots', ar: 'الأصص' },
    { key: 'watering_systems', en: 'Watering Systems', ar: 'أنظمة الري' },
    { key: 'greenhouses', en: 'Greenhouses', ar: 'الصوب الزراعية' },
    { key: 'lawn_mowers', en: 'Lawn Mowers', ar: 'جرارات العشب' },
    { key: 'garden_furniture', en: 'Garden Furniture', ar: 'أثاث الحديقة' },
    { key: 'landscaping_services', en: 'Landscaping Services', ar: 'خدمات تنسيق الحدائق' },
    { key: 'garden_lights', en: 'Garden Lights', ar: 'إضاءة الحدائق' },
    { key: 'irrigation_systems', en: 'Irrigation Systems', ar: 'أنظمة الري' },
    { key: 'compost', en: 'Compost', ar: 'السماد العضوي' },
  ],

  programming_designs_section: [
    { key: 'web_design', en: 'Web Design', ar: 'تصميم المواقع' },
    { key: 'mobile_apps', en: 'Mobile Apps', ar: 'تطبيقات الجوال' },
    { key: 'software_development', en: 'Software Development', ar: 'تطوير البرمجيات' },
    { key: 'graphic_design', en: 'Graphic Design', ar: 'التصميم الجرافيكي' },
    { key: 'ui_ux_design', en: 'UI/UX Design', ar: 'تصميم واجهة المستخدم' },
    { key: 'logo_design', en: 'Logo Design', ar: 'تصميم الشعارات' },
    { key: 'website_templates', en: 'Website Templates', ar: 'قوالب المواقع' },
    { key: 'digital_marketing', en: 'Digital Marketing', ar: 'التسويق الرقمي' },
    { key: 'seo_services', en: 'SEO Services', ar: 'خدمات تحسين محركات البحث' },
    { key: 'content_writing', en: 'Content Writing', ar: 'كتابة المحتوى' },
    { key: 'translation_services', en: 'Translation Services', ar: 'خدمات الترجمة' },
    { key: 'data_analysis', en: 'Data Analysis', ar: 'تحليل البيانات' },
    { key: 'ai_services', en: 'AI Services', ar: 'خدمات الذكاء الاصطناعي' },
    { key: 'blockchain_development', en: 'Blockchain Development', ar: 'تطوير البلوكشين' },
    { key: 'cybersecurity_services', en: 'Cybersecurity Services', ar: 'خدمات الأمن السيبراني' },
  ],

  parties_events_section: [
    { key: 'wedding_services', en: 'Wedding Services', ar: 'خدمات الزفاف' },
    { key: 'birthday_parties', en: 'Birthday Parties', ar: 'حفلات الميلاد' },
    { key: 'corporate_events', en: 'Corporate Events', ar: 'الفعاليات المؤسسية' },
    { key: 'venue_rental', en: 'Venue Rental', ar: 'تأجير القاعات' },
    { key: 'event_planning', en: 'Event Planning', ar: 'تخطيط الفعاليات' },
    { key: 'catering', en: 'Catering', ar: 'خدمات التموين' },
    { key: 'decorations', en: 'Decorations', ar: 'الديكورات' },
    { key: 'entertainment', en: 'Entertainment', ar: 'الترفيه' },
    { key: 'photography_events', en: 'Photography Events', ar: 'تصوير الفعاليات' },
    { key: 'sound_systems', en: 'Sound Systems', ar: 'أنظمة الصوت' },
    { key: 'lighting_equipment', en: 'Lighting Equipment', ar: 'معدات الإضاءة' },
    { key: 'party_rentals', en: 'Party Rentals', ar: 'تأجير حفلات' },
    { key: 'invitations', en: 'Invitations', ar: 'الدعوات' },
    { key: 'event_security', en: 'Event Security', ar: 'أمن الفعاليات' },
    { key: 'transportation_events', en: 'Transportation Events', ar: 'النقل للفعاليات' },
  ],

  library_arts_section: [
    { key: 'books', en: 'Books', ar: 'الكتب' },
    { key: 'magazines', en: 'Magazines', ar: 'المجلات' },
    { key: 'artwork', en: 'Artwork', ar: 'الأعمال الفنية' },
    { key: 'paintings', en: 'Paintings', ar: 'اللوحات' },
    { key: 'sculptures', en: 'Sculptures', ar: 'المنحوتات' },
    { key: 'antiques', en: 'Antiques', ar: 'التحف' },
    { key: 'collector_items', en: 'Collector Items', ar: 'عناصر جامع' },
    { key: 'musical_scores', en: 'Musical Scores', ar: 'النوتات الموسيقية' },
    { key: 'photography_art', en: 'Photography Art', ar: 'فن التصوير' },
    { key: 'calligraphy', en: 'Calligraphy', ar: 'الخط العربي' },
    { key: 'rare_books', en: 'Rare Books', ar: 'الكتب النادرة' },
    { key: 'art_supplies', en: 'Art Supplies', ar: 'مستلزمات الفن' },
    { key: 'framing_services', en: 'Framing Services', ar: 'خدمات التأطير' },
    { key: 'art_restoration', en: 'Art Restoration', ar: 'ترميم الأعمال الفنية' },
    { key: 'art_classes', en: 'Art Classes', ar: 'دروس الفن' },
  ],

  travel_tourism_section: [
    { key: 'flight_tickets', en: 'Flight Tickets', ar: 'تذاكر الطيران' },
    { key: 'hotel_reservations', en: 'Hotel Reservations', ar: 'حجوزات الفنادق' },
    { key: 'tour_packages', en: 'Tour Packages', ar: 'الباقات السياحية' },
    { key: 'car_rentals', en: 'Car Rentals', ar: 'تأجير السيارات' },
    { key: 'visa_services', en: 'Visa Services', ar: 'خدمات التأشيرات' },
    { key: 'travel_insurance', en: 'Travel Insurance', ar: 'تأمين السفر' },
    { key: 'cruise_packages', en: 'Cruise Packages', ar: 'باقات الرحلات البحرية' },
    { key: 'adventure_tours', en: 'Adventure Tours', ar: 'جولات المغامرات' },
    { key: 'local_experiences', en: 'Local Experiences', ar: 'تجارب محلية' },
    { key: 'travel_guides', en: 'Travel Guides', ar: 'مرشدو السفر' },
    { key: 'luggage', en: 'Luggage', ar: 'الأمتعة' },
    { key: 'travel_accessories', en: 'Travel Accessories', ar: 'إكسسوارات السفر' },
    { key: 'transportation_passes', en: 'Transportation Passes', ar: 'بطاقات النقل' },
    { key: 'sightseeing_tours', en: 'Sightseeing Tours', ar: 'جولات المشاهدة' },
    { key: 'travel_apps', en: 'Travel Apps', ar: 'تطبيقات السفر' },
  ],

  uncategorized_auction_section: [
    { key: 'miscellaneous_items', en: 'Miscellaneous Items', ar: 'عناصر متنوعة' },
    { key: 'unidentified_items', en: 'Unidentified Items', ar: 'عناصر غير معروفة' },
    { key: 'general_auctions', en: 'General Auctions', ar: 'مزادات عامة' },
    { key: 'mixed_items', en: 'Mixed Items', ar: 'عناصر مختلطة' },
    { key: 'other_items', en: 'Other Items', ar: 'عناصر أخرى' },
  ],

  missing_section: [
    { key: 'lost_items', en: 'Lost Items', ar: 'العناصر المفقودة' },
    { key: 'found_items', en: 'Found Items', ar: 'العناصر المكتشفة' },
    { key: 'missing_persons', en: 'Missing Persons', ar: 'الأشخاص المفقودين' },
    { key: 'lost_documents', en: 'Lost Documents', ar: 'المستندات المفقودة' },
    { key: 'lost_jewelry', en: 'Lost Jewelry', ar: 'المجوهرات المفقودة' },
    { key: 'lost_electronics', en: 'Lost Electronics', ar: 'الإلكترونيات المفقودة' },
    { key: 'lost_keys', en: 'Lost Keys', ar: 'المفاتيح المفقودة' },
    { key: 'lost_pets', en: 'Lost Pets', ar: 'الحيوانات الأليفة المفقودة' },
    { key: 'lost_wallets', en: 'Lost Wallets', ar: 'المحافظ المفقودة' },
    { key: 'lost_phones', en: 'Lost Phones', ar: 'الهواتف المفقودة' },
    { key: 'recovery_services', en: 'Recovery Services', ar: 'خدمات الاستعادة' },
    { key: 'identification_services', en: 'Identification Services', ar: 'خدمات التعريف' },
    { key: 'reward_offers', en: 'Reward Offers', ar: 'عروض المكافآت' },
    { key: 'community_help', en: 'Community Help', ar: 'مساعدة المجتمع' },
    { key: 'lost_and_found_center', en: 'Lost and Found Center', ar: 'مركز المفقودات' },
  ],

  education_training_section: [
    { key: 'online_courses', en: 'Online Courses', ar: 'الدورات التدريبية عبر الإنترنت' },
    { key: 'university_courses', en: 'University Courses', ar: 'دورات الجامعة' },
    { key: 'training_programs', en: 'Training Programs', ar: 'برامج التدريب' },
    { key: 'tutoring_services', en: 'Tutoring Services', ar: 'خدمات التدريس الخصوصي' },
    { key: 'educational_books', en: 'Educational Books', ar: 'الكتب التعليمية' },
    { key: 'certification_courses', en: 'Certification Courses', ar: 'دورات الشهادات' },
    { key: 'language_courses', en: 'Language Courses', ar: 'دورات اللغة' },
    { key: 'professional_development', en: 'Professional Development', ar: 'التطوير المهني' },
    { key: 'skill_development', en: 'Skill Development', ar: 'تطوير المهارات' },
    { key: 'workshops', en: 'Workshops', ar: 'ورش العمل' },
    { key: 'seminars', en: 'Seminars', ar: 'الندوات' },
    { key: 'e_learning_platforms', en: 'E-Learning Platforms', ar: 'منصات التعلم الإلكتروني' },
    { key: 'educational_software', en: 'Educational Software', ar: 'برامج تعليمية' },
    { key: 'study_materials', en: 'Study Materials', ar: 'مواد الدراسة' },
    { key: 'academic_consulting', en: 'Academic Consulting', ar: 'استشارات أكاديمية' },
  ],

  financing_loans_section: [
    { key: 'personal_loans', en: 'Personal Loans', ar: 'القروض الشخصية' },
    { key: 'business_loans', en: 'Business Loans', ar: 'قروض الأعمال' },
    { key: 'mortgage_loans', en: 'Mortgage Loans', ar: 'قروض الرهن العقاري' },
    { key: 'car_loans', en: 'Car Loans', ar: 'قروض السيارات' },
    { key: 'education_loans', en: 'Education Loans', ar: 'قروض التعليم' },
    { key: 'investment_loans', en: 'Investment Loans', ar: 'قروض الاستثمار' },
    { key: 'microfinance', en: 'Microfinance', ar: 'التمويل الأصغر' },
    { key: 'credit_cards', en: 'Credit Cards', ar: 'البطاقات الائتمانية' },
    { key: 'financial_consulting', en: 'Financial Consulting', ar: 'استشارات مالية' },
    { key: 'debt_consolidation', en: 'Debt Consolidation', ar: 'توحيد الديون' },
    { key: 'crowdfunding', en: 'Crowdfunding', ar: 'التمويل الجماعي' },
    { key: 'angel_investors', en: 'Angel Investors', ar: 'المستثمرين الملائكة' },
    { key: 'venture_capital', en: 'Venture Capital', ar: 'رأس المال المخاطر' },
    { key: 'insurance_services', en: 'Insurance Services', ar: 'خدمات التأمين' },
    { key: 'retirement_planning', en: 'Retirement Planning', ar: 'تخطيط التقاعد' },
  ],

  anecdotes_traditions_section: [
    { key: 'traditional_clothing', en: 'Traditional Clothing', ar: 'الملابس التقليدية' },
    { key: 'traditional_jewelry', en: 'Traditional Jewelry', ar: 'المجوهرات التقليدية' },
    { key: 'folk_art', en: 'Folk Art', ar: 'الفن الشعبي' },
    { key: 'handicrafts', en: 'Handicrafts', ar: 'الحرف اليدوية' },
    { key: 'cultural_items', en: 'Cultural Items', ar: 'العناصر الثقافية' },
    { key: 'historical_artifacts', en: 'Historical Artifacts', ar: 'القطع الأثرية التاريخية' },
    { key: 'traditional_instruments', en: 'Traditional Instruments', ar: 'الآلات التقليدية' },
    { key: 'folklore_books', en: 'Folklore Books', ar: 'كتب الفلكلور' },
    { key: 'cultural_experiences', en: 'Cultural Experiences', ar: 'التجارب الثقافية' },
    { key: 'heritage_tours', en: 'Heritage Tours', ar: 'جولات التراث' },
    { key: 'traditional_food', en: 'Traditional Food', ar: 'الطعام التقليدي' },
    { key: 'customs_services', en: 'Customs Services', ar: 'خدمات العادات' },
    { key: 'storytelling_sessions', en: 'Storytelling Sessions', ar: 'جلسات رواية القصص' },
    { key: 'cultural_workshops', en: 'Cultural Workshops', ar: 'ورش عمل ثقافية' },
    { key: 'festival_participation', en: 'Festival Participation', ar: 'المشاركة في المهرجانات' },
  ],

  projects_investments_section: [
    { key: 'real_estate_investment', en: 'Real Estate Investment', ar: 'الاستثمار العقاري' },
    { key: 'business_investment', en: 'Business Investment', ar: 'استثمار الأعمال' },
    { key: 'startup_investment', en: 'Startup Investment', ar: 'استثمار الشركات الناشئة' },
    { key: 'stock_investment', en: 'Stock Investment', ar: 'استثمار الأسهم' },
    { key: 'crypto_investment', en: 'Crypto Investment', ar: 'استثمار العملات الرقمية' },
    { key: 'agricultural_projects', en: 'Agricultural Projects', ar: 'المشاريع الزراعية' },
    { key: 'industrial_projects', en: 'Industrial Projects', ar: 'المشاريع الصناعية' },
    { key: 'tourism_projects', en: 'Tourism Projects', ar: 'المشاريع السياحية' },
    { key: 'educational_projects', en: 'Educational Projects', ar: 'المشاريع التعليمية' },
    { key: 'healthcare_projects', en: 'Healthcare Projects', ar: 'المشاريع الصحية' },
    { key: 'technology_projects', en: 'Technology Projects', ar: 'المشاريع التكنولوجية' },
    { key: 'infrastructure_projects', en: 'Infrastructure Projects', ar: 'مشاريع البنية التحتية' },
    { key: 'energy_projects', en: 'Energy Projects', ar: 'مشاريع الطاقة' },
    { key: 'water_projects', en: 'Water Projects', ar: 'مشاريع المياه' },
    { key: 'transportation_projects', en: 'Transportation Projects', ar: 'مشاريع النقل' },
  ],
};


function slugify(v: string): string {
  return (v ?? '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[\s\-\/]+/g, '_')
    .replace(/[^\w]+/g, '');
}

function clean(v: string): string {
  return (v ?? '').toString().trim();
}

/** ✅ Simple transliteration (English -> Arabic) */
function toArabicAuto(input: string): string {
  const s = (input ?? '').toString().trim();
  if (!s) return '';

  // handle common digraphs first
  let t = s
    .replace(/sh/gi, 'ش')
    .replace(/ch/gi, 'تش')
    .replace(/kh/gi, 'خ')
    .replace(/gh/gi, 'غ')
    .replace(/th/gi, 'ث')
    .replace(/dh/gi, 'ذ')
    .replace(/ph/gi, 'ف');

  const map: Record<string, string> = {
    a: 'ا', b: 'ب', c: 'ك', d: 'د', e: 'ي', f: 'ف', g: 'ج', h: 'ه',
    i: 'ي', j: 'ج', k: 'ك', l: 'ل', m: 'م', n: 'ن', o: 'و', p: 'ب',
    q: 'ق', r: 'ر', s: 'س', t: 'ت', u: 'و', v: 'ف', w: 'و', x: 'كس',
    y: 'ي', z: 'ز',
  };

  let out = '';
  for (const ch of t) {
    const low = ch.toLowerCase();
    if (map[low]) out += map[low];
    else out += ch; // keep numbers, spaces, dashes
  }

  // cleanup spaces
  return out.replace(/\s+/g, ' ').trim();
}

function brandAr(en: string): string {
  return BRAND_AR_OVERRIDES[en] ?? toArabicAuto(en);
}

function modelAr(en: string): string {
  return MODEL_AR_OVERRIDES[en] ?? toArabicAuto(en);
}

/* =========================
   ✅ FINAL EXPORTS
   ========================= */

// ✅ Brands: SECTION jaisa CatItem[] (key/en/ar)
export const CAR_BRANDS: CatItem[] = Array.from(
  new Set([
    ...allCarBrandsCombined.map(clean).filter(Boolean),
    ...Object.keys(carBrandsWithAllModels || {}).map(clean).filter(Boolean),
  ])
)
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({
    key: slugify(name),
    en: name,
    ar: brandAr(name),
  }));

// ✅ Models: brandKey -> CatItem[]
export const MODELS_BY_BRAND_KEY: Record<string, CatItem[]> = (() => {
  const out: Record<string, CatItem[]> = {};

  Object.entries(carBrandsWithAllModels || {}).forEach(([brandName, models]) => {
    const bKey = slugify(brandName);

    out[bKey] = Array.from(new Set((models || []).map(clean).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b))
      .map((m) => ({
        key: slugify(m),
        en: m,
        ar: modelAr(m),
      }));
  });

  return out;
})();

export function getSectionByKey(sectionKey: string | null): CatItem | undefined {
  if (!sectionKey) return undefined;
  return SECTIONS.find(s => s.key === sectionKey);
}

export function getBrandsBySection(sectionKey: string | null | undefined): CatItem[] {
  return sectionKey === 'cars_section' ? CAR_BRANDS : [];
}

export function getModelsByBrandKey(brandKey: string | null | undefined): CatItem[] {
  if (!brandKey) return [];
  return MODELS_BY_BRAND_KEY[brandKey] ?? [];
}
