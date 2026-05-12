export type CategoryId =
  | "upper"
  | "bodysuits"
  | "tops"
  | "shirts"
  | "vests-jackets"
  | "lower"
  | "pants"
  | "skirts"
  | "dresses"
  | "sets";

export type Costume = {
  id: string;
  name: string;
  quantity: number;
  ageRange: string[];
  categories: CategoryId[];
  images: string[];
  colors: string[];
  clothingTypes: string[];
  styles: string[];
  searchKeywords: string[];
  description?: string;
};

export const categories = [
  {
    id: "upper",
    name: "חלק עליון",
    subCategories: [
      { id: "bodysuits", name: "בגדי גוף" },
      { id: "tops", name: "טופים" },
      { id: "shirts", name: "גופיות וחולצות" },
      { id: "vests-jackets", name: "וסטים וג׳קטים" },
    ],
  },
  {
    id: "lower",
    name: "חלק תחתון",
    subCategories: [
      { id: "pants", name: "מכנסיים" },
      { id: "skirts", name: "חצאיות" },
    ],
  },
  {
    id: "dresses",
    name: "שמלות",
    subCategories: [],
  },
  {
    id: "sets",
    name: "סטים",
    subCategories: [],
  },
] as const;

export const filterOptions = {
  colors: ["אדום", "שחור", "לבן", "זהב", "כסף", "כחול", "ורוד", "סגול","אפור","חום"],
  ages: ["קטנטנות", "יסודי צעיר", "יסודי מתקדם", "חטיבה-תיכון"],
  clothingTypes: [
    "בגד גוף",
    "טופ",
    "גופיה",
    "חולצה",
    "וסט",
    "ג׳קט",
    "מכנס",
    "חצאית",
    "שמלה",
    "סט",
  ],
  styles: [
    "מודרני",
    "ג׳אז",
    "היפ הופ",
    "לירי",
  ],
};

export const costumes: Costume[] = [
  {
  id: "gray-school-skirt",
  name: "חצאית בית ספר אפורה",
  quantity: 35,
  ageRange: ["יסודי מתקדם"],
  categories: ["lower"],
  images: ["/costumes/skirts/skirt-1.jpg"],
  colors: ["אפור"],
  clothingTypes: ["חצאית"],
  styles: ["ג׳אז"],
  searchKeywords: ["חצאית אפורה", "בית ספר", "אפור", "חצאית"],
},
{
  id: "black-secretary-skirt",
  name: "חצאית למה שחורה מזכירות",
  quantity: 14,
  ageRange: ["חטיבה-תיכון"],
  categories: ["lower"],
  images: ["/costumes/skirts/skirt-2.jpg","/costumes/skirts/skirt-2.2.jpg"],
  colors: ["שחור"],
  clothingTypes: ["חצאית"],
  styles: ["ג׳אז"],
  searchKeywords: ["חצאית שחורה", "מזכיר", "שחור", "חצאית"],
},
{
  id: "pink-half-skirt",
  name: "חצי חצאית סטן ורודה",
  quantity: 24,
  ageRange: ["קטנטנות"],
  categories: ["lower"],
  images: ["/costumes/skirts/skirt-3.2.jpg","/costumes/skirts/skirt-3.jpg"],
  colors: ["ורוד"],
  clothingTypes: ["חצאית"],
  styles: ["לירי"],
  searchKeywords: ["חצאית ורודה", "סטן", "ורוד", "חצאית"],
},
{
  id: "black-half-skirt",
  name: "חצי חצאית סטן שחורה",
  quantity: 25,
  ageRange: ["חטיבה-תיכון"],
  categories: ["lower"],
  images: ["/costumes/skirts/skirt-4.jpg"],
  colors: ["שחור"],
  clothingTypes: ["חצאית"],
  styles: ["לירי"],
  searchKeywords: ["חצאית שחורה", "סטן", "שחור", "חצאית"],
},
{
  id: "black-white-striped-skirt",
  name: "חצאית פסים שחור לבן",
  quantity: 32,
  ageRange: ["יסודי צעיר"],
  categories: ["lower"],
  images: ["/costumes/skirts/skirt-5.jpg","/costumes/skirts/skirt-5.2.jpg","/costumes/skirts/skirt-5.3.jpg","/costumes/skirts/skirt-5.4.jpg"],
  colors: ["שחור","לבן"],
  clothingTypes: ["חצאית"],
  styles: ["ג׳אז","מודרני"],
  searchKeywords: ["חצאית פסים", "לבן", "שחור", "חצאית"],
},
{
  id: "leopard-chiffon-skirt",
  name: "חצאית שיפון מנומרת",
  quantity: 16,
  ageRange: ["חטיבה-תיכון"],
  categories: ["lower"],
  images: ["/costumes/skirts/skirt-6.JPG"],
  colors: ["חום"],
  clothingTypes: ["חצאית"],
  styles: ["לירי","מודרני"],
  searchKeywords: ["חצאית מנומרת", "שיפון", "מנומר", "חצאית"],
},

];