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
    //חצאיות
    {
  id: "red-saten-skirt",
  name: "חצאית סטן אדומה",
  quantity: 17,
  ageRange: ["קטנטנים"],
  categories: ["lower","skirts"],
  images: ["/costumes/tankTops/tank-1.jpg","/costumes/tankTops/tank-1.2.jpg"],
  colors: ["אדום"],
  clothingTypes: ["חצאית"],
  styles: ["ג׳אז"],
  searchKeywords: ["חצאית אדומה", "אדום", "חצאית", "סטן"],
},
  {
  id: "gray-school-skirt",
  name: "חצאית בית ספר אפורה",
  quantity: 35,
  ageRange: ["יסודי מתקדם"],
  categories: ["lower","skirts"],
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
  categories: ["lower","skirts"],
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
  categories: ["lower","skirts"],
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
  categories: ["lower","skirts"],
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
  categories: ["lower","skirts"],
  images: ["/costumes/skirts/skirt-5.JPG","/costumes/skirts/skirt-5.2.JPG","/costumes/skirts/skirt-5.3.JPG","/costumes/skirts/skirt-5.4.JPG"],
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
  categories: ["lower","skirts"],
  images: ["/costumes/skirts/skirt-6.JPG"],
  colors: ["חום"],
  clothingTypes: ["חצאית"],
  styles: ["לירי","מודרני"],
  searchKeywords: ["חצאית מנומרת", "שיפון", "מנומר", "חצאית"],
},

//גופיות
{
  id: "red-tank-top",
  name: "גופיה אדומה מנצנצת",
  quantity: 18,
  ageRange: ["קטנטנים"],
  categories: ["upper","tops"],
  images: ["/costumes/tankTops/tank-1.jpg","/costumes/tankTops/tank-1.2.jpg"],
  colors: ["אדום"],
  clothingTypes: ["גופיה"],
  styles: ["ג׳אז","היפ הופ"],
  searchKeywords: ["גופיה אדומה", "אדום", "גופיה", "חולצה"],
},

//חולצות
{
  id: "white-botton-up-shirt",
  name: "חולצה מכופתרת לבנה קצרה",
  quantity: 36,
  ageRange: ["חטיבה-תיכון","יסודי מתקדם"],
  categories: ["upper","shirts"],
  images: ["/costumes/skirts/skirt-1.jpg","/costumes/skirts/skirt-2.jpg"],
  colors: ["לבן"],
  clothingTypes: ["חולצה"],
  styles: ["ג׳אז","היפ הופ"],
  searchKeywords: ["חולצה לבנה", "מכופתרת", "לבן", "חולצה"],
},

//בגדי גוף
{
  id: "pink-leotard-skirt",
  name: "בגד גוף- חצאית ורוד",
  quantity: 22,
  ageRange: ["קטנטנים"],
  categories: ["upper","bodysuits","skirts"],
  images: ["/costumes/skirts/skirt-3.2.jpg"],
  colors: ["ורוד"],
  clothingTypes: ["בגד גוף", "חצאית"],
  styles: ["ג׳אז","לירי"],
  searchKeywords: ["בגד גוף", "חצאית", "ורוד", "שמלה"],
},
{
  id: "black-shimer-bodysuits",
  name: "בגד גוף שחור מנצנץ",
  quantity: 23,
  ageRange: ["חטיבה-תיכון"],
  categories: ["upper","bodysuits"],
  images: ["/costumes/bodysuits/bodysuit-1.jpg","/costumes/skirts/skirt-4.jpg"],
  colors: ["שחור","כסף"],
  clothingTypes: ["בגד גוף", "חצאית"],
  styles: ["ג׳אז","לירי","מודרני"],
  searchKeywords: ["בגד גוף", "שחור", "מנצנץ", "שחור מנצנץ"],
},
{
  id: "white-bodysuit",
  name: "בגד גוף סטן לבן שרוולים תפוחים",
  quantity: 28,
  ageRange: ["יסודי צעיר","קטנטנות"],
  categories: ["upper","bodysuits"],
  images: ["/costumes/skirts/skirt-5.JPG","/costumes/skirts/skirt-5.4.JPG"],
  colors: ["לבן"],
  clothingTypes: ["בגד גוף"],
  styles: ["ג׳אז","מודרני"],
  searchKeywords: ["בגד גוף", "לבן", "סטן"],
},
];