/* Shustho Poth AI: small, synthetic Naive Bayes model. Browser-only; not clinical. */
const TRAINING_CASES = [
  ["বাচ্চার জ্বর আছে", "fever"],
  ["আমার মেয়ের জ্বর হয়েছে", "fever"],
  ["তিন দিন ধরে জ্বর", "fever"],
  ["বাচ্চার গা গরম", "fever"],
  ["জ্বরের জন্য খুব দুর্বল", "fever"],
  ["বাচ্চার জ্বর আর খেতে চায় না", "fever"],
  ["ছেলের দুই দিন ধরে জ্বর", "fever"],
  ["মেয়ের শরীর গরম হয়ে আছে", "fever"],
  ["জ্বরটা কমছে না", "fever"],
  ["বাচ্চার জ্বর হয়েছে গতকাল", "fever"],
  ["baby'r jor ache", "fever"],
  ["bacchar jor hocche", "fever"],
  ["tin din dhore jor", "fever"],
  ["bacchar body gorom", "fever"],
  ["jor komche na", "fever"],
  ["বাচ্চার শ্বাস নিতে কষ্ট হচ্ছে", "breathing_difficulty"],
  ["শ্বাসকষ্ট হচ্ছে", "breathing_difficulty"],
  ["বুক ধর ধর করছে", "breathing_difficulty"],
  ["বাচ্চা ঠিকমতো শ্বাস নিতে পারছে না", "breathing_difficulty"],
  ["শ্বাস খুব দ্রুত চলছে", "breathing_difficulty"],
  ["বুক চাপ চাপ লাগছে আর কাশি আছে", "breathing_difficulty"],
  ["শ্বাস নিতে গেলে কষ্ট হয়", "breathing_difficulty"],
  ["বাচ্চার নিশ্বাস নিতে সমস্যা", "breathing_difficulty"],
  ["দম নিতে কষ্ট হচ্ছে", "breathing_difficulty"],
  ["বাচ্চার বুকটা ধরছে", "breathing_difficulty"],
  ["bacchar shash nite koshto", "breathing_difficulty"],
  ["shash koshto hocche", "breathing_difficulty"],
  ["buk dhor dhor korche", "breathing_difficulty"],
  ["nishash nite parছে na", "breathing_difficulty"],
  ["bacchar breath korte koshto", "breathing_difficulty"],
  ["ছেলের খিঁচুনি হচ্ছে", "seizure"],
  ["বাচ্চার খিঁচুনি হয়েছে", "seizure"],
  ["আজ খিঁচুনি হয়েছে", "seizure"],
  ["শরীর কাঁপতে কাঁপতে খিঁচুনি হয়েছে", "seizure"],
  ["আবার খিঁচুনি হচ্ছে", "seizure"],
  ["খিঁচুনি দেখে ভয় পেয়েছি", "seizure"],
  ["মেয়ের খিঁচুনি হয়েছিল", "seizure"],
  ["খিঁচুনি এখন থেমেছে", "seizure"],
  ["বাচ্চা হঠাৎ খিঁচুনি দিল", "seizure"],
  ["খিঁচুনির মতো কাঁপছে", "seizure"],
  ["bacchar khichuni hocche", "seizure"],
  ["cheler khichuni hoyeche", "seizure"],
  ["aj khichuni holo", "seizure"],
  ["baccha hotat khichuni dilo", "seizure"],
  ["khichuni abar hocche", "seizure"],
  ["বাচ্চার পেট ব্যথা করছে", "pain"],
  ["পেটে অনেক ব্যথা", "pain"],
  ["দুই দিন ধরে পেট ব্যথা", "pain"],
  ["ছেলের পেটে ব্যথা আর বমি", "pain"],
  ["পেট মোচড় দিচ্ছে", "pain"],
  ["পেটটা খুব ব্যথা করছে", "pain"],
  ["আজ সকাল থেকে পেটে ব্যথা", "pain"],
  ["বাচ্চার পেটের ব্যথা কমছে না", "pain"],
  ["পেটে ব্যথা হচ্ছে", "pain"],
  ["মেয়ের পেট ব্যথা করছে", "pain"],
  ["pet betha korche", "pain"],
  ["dui din dhore pet betha", "pain"],
  ["bacchar pet betha", "pain"],
  ["pet mochra diye betha", "pain"],
  ["pet onek betha", "pain"],
  ["ডাক্তারের কাছে যাওয়ার টাকা নাই", "financial_barrier"],
  ["হাসপাতালে যাওয়ার টাকা নেই", "financial_barrier"],
  ["চিকিৎসার খরচ দিতে পারব না", "financial_barrier"],
  ["ডাক্তারের ভাড়া নেই", "financial_barrier"],
  ["হাসপাতালে যেতে টাকা লাগবে কিন্তু টাকা নেই", "financial_barrier"],
  ["টাকা না থাকায় ডাক্তার দেখাতে পারছি না", "financial_barrier"],
  ["চিকিৎসার জন্য টাকা নাই", "financial_barrier"],
  ["বাচ্চাকে ডাক্তার দেখানোর সামর্থ্য নেই", "financial_barrier"],
  ["যাওয়ার ভাড়া দিতে পারব না", "financial_barrier"],
  ["ডাক্তারের কাছে যাওয়ার খরচ নেই", "financial_barrier"],
  ["doctor dekhanor taka nai", "financial_barrier"],
  ["hospital e jawar taka nai", "financial_barrier"],
  ["treatment er taka nei", "financial_barrier"],
  ["doctor er vara nai", "financial_barrier"],
  ["chikitsa korte taka nai", "financial_barrier"],
  ["নেট নাই", "connectivity"],
  ["ইন্টারনেট নেই", "connectivity"],
  ["নেট এলে রিপোর্ট পাঠাব", "connectivity"],
  ["এখন নেট নেই পরে পাঠাব", "connectivity"],
  ["কেসটা পরে সিঙ্ক করব", "connectivity"],
  ["ফোনে নেট আসছে না", "connectivity"],
  ["ডাটা শেষ হয়ে গেছে", "connectivity"],
  ["এখন অনলাইনে পাঠানো সম্ভব না", "connectivity"],
  ["নেটওয়ার্ক নেই", "connectivity"],
  ["সংযোগ ফিরে এলে কেস পাঠাব", "connectivity"],
  ["net nai", "connectivity"],
  ["internet nai", "connectivity"],
  ["net ashle pathabo", "connectivity"],
  ["pore sync korbo", "connectivity"],
  ["mobile data sesh", "connectivity"],
  ["ক্লিনিকে যেতে অনেক দূর", "travel_barrier"],
  ["ডাক্তারের কাছে যেতে দুই ঘণ্টা লাগে", "travel_barrier"],
  ["হাসপাতাল অনেক দূরে", "travel_barrier"],
  ["ক্লিনিকে যাওয়ার রাস্তা অনেক দূর", "travel_barrier"],
  ["যেতে অনেক সময় লাগে", "travel_barrier"],
  ["হাসপাতালে যেতে দূর পথ", "travel_barrier"],
  ["ডাক্তারের কাছে যেতে কষ্ট হয় কারণ অনেক দূর", "travel_barrier"],
  ["ক্লিনিক থেকে বাড়ি অনেক দূরে", "travel_barrier"],
  ["যাতায়াতের পথ অনেক লম্বা", "travel_barrier"],
  ["হাসপাতালে পৌঁছাতে অনেক সময় লাগে", "travel_barrier"],
  ["clinic onek dure", "travel_barrier"],
  ["doctor er kache jete dui ghonta lage", "travel_barrier"],
  ["hospital onek dure", "travel_barrier"],
  ["jete onek shomoy lage", "travel_barrier"],
  ["clinic e jete dure", "travel_barrier"],
  ["কাশি হচ্ছে", "cough_respiratory"],
  ["অনেক কাশি আর কফ আছে", "cough_respiratory"],
  ["শুকনো কাশি হচ্ছে", "cough_respiratory"],
  ["baccha kashi ditese", "cough_respiratory"],
  ["kashi ar kof hocche", "cough_respiratory"],
  ["cough for three days", "cough_respiratory"],
  ["পাতলা পায়খানা হচ্ছে", "diarrhea_vomiting"],
  ["বমি আর পাতলা পায়খানা", "diarrhea_vomiting"],
  ["৩ দিন ধরে ডায়রিয়া", "diarrhea_vomiting"],
  ["patla paykhana hocche", "diarrhea_vomiting"],
  ["bacchar bomi hocche", "diarrhea_vomiting"],
  ["loose motion hocche", "diarrhea_vomiting"],
  ["পানি খেতে পারছে না আর প্রস্রাব কম", "dehydration"],
  ["মুখ শুকিয়ে গেছে পানি খাচ্ছে না", "dehydration"],
  ["প্রস্রাব হচ্ছে না", "dehydration"],
  ["pani khaitese na, prosrab kom", "dehydration"],
  ["baccha pani khete partese na", "dehydration"],
  ["very thirsty and weak", "dehydration"],
  ["পড়ে গিয়ে মাথায় লেগেছে", "injury_trauma"],
  ["হাতে কেটে রক্ত পড়ছে", "injury_trauma"],
  ["দুর্ঘটনায় পায়ে আঘাত পেয়েছে", "injury_trauma"],
  ["pore giye mathay legeche", "injury_trauma"],
  ["accident e pa kete geche", "injury_trauma"],
  ["রক্তপাত হচ্ছে", "injury_trauma"],
  ["হঠাৎ এক পাশের হাত পা দুর্বল", "neurological_red_flag"],
  ["কথা জড়িয়ে যাচ্ছে হঠাৎ", "neurological_red_flag"],
  ["মুখ একদিকে বেঁকে গেছে", "neurological_red_flag"],
  ["hothat ek pasher haat pa durbol", "neurological_red_flag"],
  ["kotha bolte partese na", "neurological_red_flag"],
  ["suddenly one side feels weak", "neurological_red_flag"],
  ["আমি গর্ভবতী, পেটে ব্যথা", "maternal_pregnancy"],
  ["গর্ভাবস্থায় রক্ত যাচ্ছে", "maternal_pregnancy"],
  ["প্রসবের ব্যথা শুরু হয়েছে", "maternal_pregnancy"],
  ["ami pregnant, rokto jacche", "maternal_pregnancy"],
  ["pregnancy te pet betha", "maternal_pregnancy"],
  ["pregnant and bleeding", "maternal_pregnancy"],
  ["গায়ে চুলকানি আর ফুসকুড়ি", "skin_problem"],
  ["ত্বকে লাল দাগ উঠেছে", "skin_problem"],
  ["চামড়ায় ঘা হয়েছে", "skin_problem"],
  ["gaye chulkani hocche", "skin_problem"],
  ["skin e rash uthse", "skin_problem"],
  ["itchy rash on body", "skin_problem"],
  ["বুকে চাপ আর ব্যথা হচ্ছে", "chest_cardiac_warning"],
  ["বুকের মাঝখানে ব্যথা", "chest_cardiac_warning"],
  ["হাঁটলে বুকে চাপ লাগে", "chest_cardiac_warning"],
  ["buk e chap ar betha", "chest_cardiac_warning"],
  ["buk betha hocche", "chest_cardiac_warning"],
  ["chest pressure since morning", "chest_cardiac_warning"],
  ["রক্তে সুগার বেশি বলেছে", "diabetes_related"],
  ["ডায়াবেটিস আছে, দুর্বল লাগে", "diabetes_related"],
  ["সুগার মাপতে চাই", "diabetes_related"],
  ["diabetes ache, durbol lage", "diabetes_related"],
  ["blood sugar beshi", "diabetes_related"],
  ["sugar check korte chai", "diabetes_related"],
  ["রক্তচাপ বেশি এসেছে", "hypertension_related"],
  ["প্রেসার মাপতে চাই", "hypertension_related"],
  ["আগে থেকে উচ্চ রক্তচাপ আছে", "hypertension_related"],
  ["pressure beshi esheche", "hypertension_related"],
  ["blood pressure check korte chai", "hypertension_related"],
  ["high pressure bola hoyeche", "hypertension_related"],
  ["জ্বর কমেছে, তিন দিন পরে দেখাতে বলেছে", "routine_follow_up"],
  ["আবার এক সপ্তাহ পরে আসতে বলেছে", "routine_follow_up"],
  ["আগের ভিজিটের ফলোআপ করতে চাই", "routine_follow_up"],
  ["jor komeche abar dekhate hobe", "routine_follow_up"],
  ["3 din pore follow up ache", "routine_follow_up"],
  ["come back next week for review", "routine_follow_up"],
  // Expanded synthetic Bangladesh phrasing: spelling variation, incomplete and mixed-language text.
  ["jor jor lagche aj shokal theke", "fever"], ["আমার বাচ্চার গা পুড়ে যাচ্ছে জ্বর", "fever"], ["fever ase, matha gorom", "fever"], ["কাল রাত থেকে জ্বর আর কাঁপুনি", "fever"],
  ["amar dom nite kosto hocche", "breathing_difficulty"], ["বাচ্চা ঠিকমতো নিশ্বাস নিতে পারছে না", "breathing_difficulty"], ["shash ta choto choto hocche", "breathing_difficulty"], ["can't breathe comfortably, বুক ধরে", "breathing_difficulty"],
  ["kashi hocche onek din dhore", "cough_respiratory"], ["বুকে কফ জমেছে মনে হয়", "cough_respiratory"], ["কাশি থামছে না ভাই", "cough_respiratory"], ["bacchar dry cough hocche", "cough_respiratory"],
  ["patla paykhana bar bar hocche", "diarrhea_vomiting"], ["বমি হচ্ছে কিছু রাখতে পারছি না", "diarrhea_vomiting"], ["pet kharap ar loose motion", "diarrhea_vomiting"], ["diarrhoea, আজ তিনবার হয়েছে", "diarrhea_vomiting"],
  ["mukh jibh shukiye jacche", "dehydration"], ["পানি খেলেই বমি করে দিচ্ছে", "dehydration"], ["prosrab ajke khub kom", "dehydration"], ["not drinking and barely passing urine", "dehydration"],
  ["আজকে আবার খিঁচুনি হলো", "seizure"], ["baccha chokh ulte khichuni dicche", "seizure"], ["khichuni porar por ghumacche", "seizure"], ["convulsion abar start hoise", "seizure"],
  ["pet betha ta onek", "pain"], ["হাত-পায়ে খুব যন্ত্রণা", "pain"], ["back e betha dui din", "pain"], ["matha dhore ache", "pain"],
  ["pore giye hat kete gese", "injury_trauma"], ["রাস্তায় পড়ে হাঁটুতে আঘাত", "injury_trauma"], ["গরম পানিতে হাত পুড়েছে", "injury_trauma"], ["accident e mathay legeche", "injury_trauma"],
  ["mukh ta ek dike neme geche", "neurological_red_flag"], ["হঠাৎ কথা আটকে যাচ্ছে", "neurological_red_flag"], ["one arm suddenly numb hoye gese", "neurological_red_flag"], ["face droop and kotha jorano", "neurological_red_flag"],
  ["ami ma hote jacchi pet betha", "maternal_pregnancy"], ["গর্ভের বাচ্চা নড়ছে কম", "maternal_pregnancy"], ["pregnancy te halka bleeding hocche", "maternal_pregnancy"], ["delivery er somoy hoyeche", "maternal_pregnancy"],
  ["chulkay pura shorir", "skin_problem"], ["হাতে লাল লাল ফুসকুড়ি", "skin_problem"], ["rash ta barbe mone hocche", "skin_problem"], ["চামড়ার সমস্যা দেখাবো", "skin_problem"],
  ["বুকের ভেতর চাপ চাপ লাগে", "chest_cardiac_warning"], ["buk betha ar gham hocche", "chest_cardiac_warning"], ["chest feels tight since morning", "chest_cardiac_warning"], ["বুকে অস্বস্তি আর ব্যথা", "chest_cardiac_warning"],
  ["sugar beshi dekhacche", "diabetes_related"], ["ডায়াবেটিসের ওষুধ নিচ্ছি", "diabetes_related"], ["glucose reading high", "diabetes_related"], ["sugar check korbo kothay", "diabetes_related"],
  ["pressure bere geche mone hocche", "hypertension_related"], ["প্রেসারটা মাপতে হবে", "hypertension_related"], ["BP beshi boleche", "hypertension_related"], ["high blood pressure check korte chai", "hypertension_related"],
  ["taka nai doctor dekhab kivabe", "financial_barrier"], ["ভিজিটের খরচ দিতে পারব না", "financial_barrier"], ["oshudh kinar poisha nai", "financial_barrier"], ["cost is too much for us", "financial_barrier"],
  ["net nai ekhono", "connectivity"], ["ইন্টারনেট চলছে না পরে পাঠাবো", "connectivity"], ["phone e data nai", "connectivity"], ["no network right now", "connectivity"],
  ["hospital e jawa onek kothin dure", "travel_barrier"], ["গাড়ি পাচ্ছি না হাসপাতালে যাবো কীভাবে", "travel_barrier"], ["gari bhara beshi, dure jete parbo na", "travel_barrier"], ["transport is not available nearby", "travel_barrier"],
  ["abar checkup korte hobe agami shoptaho", "routine_follow_up"], ["আগামী তিন দিন পরে আবার দেখাতে বলেছে", "routine_follow_up"], ["followup date ta mone nai", "routine_follow_up"], ["come back after a few days", "routine_follow_up"],
];

function normalizeText(text) {
  return (text || "").toLowerCase().replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit)).replace(/[।,!?;:()\-]/g, " ").replace(/\s+/g, " ").trim();
}
function tokenize(text) { return normalizeText(text).split(/\s+/).filter(Boolean); }
function trainNaiveBayes(rows) {
  const classes = [...new Set(rows.map(row => row[1]))], docs = {}, words = {}, total = {}, vocabulary = new Set();
  classes.forEach(label => { docs[label] = 0; words[label] = {}; total[label] = 0; });
  rows.forEach(([text, label]) => { docs[label]++; tokenize(text).forEach(token => { vocabulary.add(token); words[label][token] = (words[label][token] || 0) + 1; total[label]++; }); });
  return { classes, docs, words, total, vocabulary: [...vocabulary], n: rows.length };
}
const MODEL = trainNaiveBayes(TRAINING_CASES);
function classify(text) {
  const tokens = tokenize(text), scores = {};
  MODEL.classes.forEach(label => {
    let score = Math.log((MODEL.docs[label] + 1) / (MODEL.n + MODEL.classes.length));
    tokens.forEach(token => { score += Math.log(((MODEL.words[label][token] || 0) + 1) / (MODEL.total[label] + MODEL.vocabulary.length)); });
    scores[label] = score;
  });
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maximum = sorted[0]?.[1] ?? 0;
  const expScores = sorted.map(([, value]) => Math.exp(value - maximum));
  const total = expScores.reduce((sum, value) => sum + value, 0) || 1;
  return { intent: sorted[0]?.[0] || "unknown", confidence: (expScores[0] || 0) / total, scores };
}

const CUE_RULES = [
  ["neurological_red_flag", /এক পাশের.*(দুর্বল|অবশ)|হঠাৎ.*(হাত|পা).*(দুর্বল|অবশ)|কথা জড়িয়ে|কথা বলতে.*(পারছে না|শব্দ বের হচ্ছে না)|মুখ.*বেঁকে|hothat ek pasher.*(durbol|obosh)|ek pasher haat pa durbol|hothat.*(obosh|joracche)|kotha bolte partese na|kotha joracche|one side.*(weak|numb)|sudden.*weak|slurred speech|face.*droop|drooping face/i],
  ["breathing_difficulty", /শ্বাস.?কষ্ট|বুক ধর ধর|শ্বাস নিতে.*কষ্ট|দম নিতে.*কষ্ট|নিশ্বাস নিতে.*কষ্ট|শ্বাস নিতে পারছে না|shash nite koshto|shash koshto|shash kosto|nishash.*koshto|buk dhor|dom nite koshto|cannot breathe|can't breathe|cannot breathe comfortably|breath.*(difficulty|hard|trouble)|short of breath/i],
  ["seizure", /খিঁচুনি|খিচুনি|khichuni|seizure|convulsion/i],
  ["chest_cardiac_warning", /বুকে চাপ|বুকের মাঝখানে ব্যথা|বুকে ব্যথা|buk.*(chap|betha)|chest (pain|pressure)|chest.*discomfort|tight feeling.*chest|tight.*chest/i],
  ["maternal_pregnancy", /গর্ভবতী|গর্ভাবস্থা|প্রসব|বাচ্চার নড়াচড়া কম|pregnan|pregnant|delivery pain|baby.*movement.*less/i],
  ["dehydration", /পানি খেতে পারছে না|পানি খাচ্ছে না|পানিও রাখতে পারছে না|প্রস্রাব (হচ্ছে না|কম)|মুখ শুকিয়ে|জিহ্বা শুকনো|pani (khete|khaite|khaitese) partese na|prosrab kom|tongue dry|no urine|cannot keep fluids/i],
  ["diarrhea_vomiting", /পাতলা পায়খানা|ডায়রিয়া|বমি|patla paykhana|diarr?hoea|diarrhea|loose motion|vomit/i],
  ["injury_trauma", /দুর্ঘটনা|আঘাত|পড়ে গিয়ে|কেটে.*রক্ত|রক্তপাত|পুড়ে গেছে|accident|injur|wound|bleeding|cut.*blood|burnt/i],
  ["cough_respiratory", /কাশি|কফ|kashi|kof|cough|phlegm/i],
  ["skin_problem", /চুলকানি|ফুসকুড়ি|ত্বকে|চামড়ায়|র‍্যাশ|rash|itch|skin problem/i],
  ["diabetes_related", /ডায়াবেটিস|সুগার|রক্তে.*গ্লুকোজ|diabetes|glucose|blood sugar/i],
  ["hypertension_related", /উচ্চ রক্তচাপ|প্রেসার|রক্তচাপ|blood pressure|high bp|hypertension/i],
  ["fever", /জ্বর|গা গরম|জ্বরে|jor|fever/i],
  ["pain", /ব্যথা|বেদনা|betha|pain|ache/i],
  ["financial_barrier", /টাকা (নাই|নেই|কম)|খরচ বেশি|ভাড়া নাই|ভাড়া নেই|সামর্থ্য নেই|taka (nai|nei|kom)|cost beshi|vara nai|bhara nai|gari bhara nai|transport er taka nai|medicine kenar taka nai|can't afford|cannot afford/i],
  ["travel_barrier", /অনেক দূর|দূরে|যেতে কষ্ট|গাড়ি ভাড়া|যাতায়াত|transport nai|hospital onek dure|gari bhara|far away|gari nai|transport unavailable/i],
  ["connectivity", /নেট নাই|নেট নেই|ইন্টারনেট নেই|নেটওয়ার্ক নেই|নেটওয়ার্ক না থাকায়|না থাকায় এখন পাঠাতে|পরে পাঠাব|pore.*pathabo|shared phone|phone.*shared|net nai|internet nai|network nai|network.*not available|offline/i],
  ["routine_follow_up", /ফলো.?আপ|আবার.*দেখা|পরে.*দেখাতে|pore.*dekhate|abar.*dekhate|follow.?up|come back|review visit|পুনরায়.*(আস|দেখা)|dekhano.*somoy/i]
];
const INTENT_LABELS = {
  fever:"Reported fever", breathing_difficulty:"Reported breathing difficulty", cough_respiratory:"Cough / respiratory concern",
  diarrhea_vomiting:"Diarrhoea / vomiting reported", dehydration:"Possible dehydration concern (reported signs)", seizure:"Seizure reported",
  pain:"Pain reported", injury_trauma:"Injury / trauma reported", neurological_red_flag:"Possible neurological red flag",
  maternal_pregnancy:"Pregnancy / maternal concern reported", skin_problem:"Skin concern reported", chest_cardiac_warning:"Chest discomfort reported",
  diabetes_related:"Diabetes / glucose concern reported", hypertension_related:"Blood-pressure concern reported",
  financial_barrier:"Financial access barrier", connectivity:"Connectivity barrier", travel_barrier:"Travel barrier", routine_follow_up:"Routine follow-up requested"
};
function detectConcerns(text) {
  const normalized = normalizeText(text);
  return CUE_RULES.filter(([, pattern]) => pattern.test(normalized)).map(([intent]) => intent);
}
function detectRedFlags(text, concerns, fields) {
  const value = normalizeText(text);
  const flags = [];
  const add = (id, label, reason) => flags.push({ id, label, reason });
  if (concerns.includes("neurological_red_flag")) add("possible_neurological_red_flag", "Possible sudden neurological warning sign", "Sudden one-sided weakness, face change, or speech difficulty was reported.");
  if (concerns.includes("breathing_difficulty")) add("reported_breathing_difficulty", "Breathing difficulty reported", "The reported words mention breathing difficulty; seek prompt human assessment.");
  if (concerns.includes("seizure")) add("seizure_report", "Seizure reported", "A seizure is reported; seek urgent human assessment and follow local emergency guidance.");
  if (concerns.includes("chest_cardiac_warning")) add("chest_discomfort_report", "Chest pain or pressure reported", "The reported words mention chest discomfort; seek prompt human assessment.");
  if (/(অজ্ঞান|জ্ঞান নেই|সাড়া দিচ্ছে না|জাগানো যাচ্ছে না|unconscious|unresponsive|not waking|cannot wake|fainted and.*not|অচেতন)/i.test(value)) add("unconscious_report", "Unconsciousness or not responding reported", "The reported words describe not waking or not responding; seek urgent human help.");
  if (/(বিভ্রান্ত|কথা বুঝতে পারছে না|হঠাৎ.*গুলিয়ে|confus(ed|ion)|altered consciousness|not making sense|খুব ঝিমুনি|অস্বাভাবিক ঘুমঘুম|অচেতন)/i.test(value)) add("confusion_report", "Confusion or altered awareness reported", "The reported words describe confusion or unusual drowsiness; seek prompt human assessment.");
  if (/(অনেক রক্ত|প্রচুর রক্ত|রক্ত বন্ধ হচ্ছে না|রক্তপাত বন্ধ হচ্ছে না|রক্তে ভেসে|রক্ত ঝরছে|severe bleeding|heavy bleeding|bleeding.*won't stop|won't stop bleeding|lots of blood)/i.test(value)) add("severe_bleeding_report", "Heavy or ongoing bleeding reported", "The reported words describe heavy or ongoing bleeding; seek urgent human care.");
  if (/(মাথায় জোরে আঘাত|মাথায় গুরুতর আঘাত|মাথায় পড়ে গেছে|মাথায় আঘাত.*অজ্ঞান|serious head injury|head injury|hit.*head|fall.*head|head trauma)/i.test(value)) add("head_injury_report", "Head injury reported", "A head injury was mentioned; urgent assessment may be needed, especially with loss of consciousness or confusion.");
  if (concerns.includes("maternal_pregnancy") && /গর্ভ.*(রক্ত|bleed)|pregnan.*bleed|রক্ত.*গর্ভ|গর্ভাবস্থায়.*রক্ত|প্রসবের ব্যথা|delivery pain|pregnancy.*(bleeding|severe pain)/i.test(value)) add("maternal_warning_report", "Pregnancy-related bleeding or labour warning reported", "Seek prompt human assessment under local emergency guidance.");
  if (concerns.includes("injury_trauma") && /রক্তপাত|অনেক রক্ত|রক্ত পড়|bleed|blood/i.test(value)) add("bleeding_report", "Bleeding reported after injury", "Heavy or ongoing bleeding needs urgent human assessment.");
  if (/(মাথায়.*লেগেছে|mathay legeche|hit.*head|head injury|head trauma|পড়ে.*মাথায়)/i.test(value) && /(ঘুরছে|ghur|বমি|অজ্ঞান|confus|dizz|vomit|unconscious)/i.test(value)) add("head_injury_report", "Head injury with a concerning symptom reported", "A head injury and dizziness, vomiting, confusion, or loss of consciousness were reported; seek urgent human assessment.");
  if (/প্রস্রাব (হচ্ছে না|কম)|no urine|prosrab.*(kom|hoy nai)|pani rakhte partese na|পানি খেতে পারছে না|pani (khete|khaite|khaitese) partese na|cannot keep fluids|unable to drink|চোখ বসে|চামড়া.*শুকনো/i.test(value)) add("fluid_or_urine_warning", "Unable to drink or very little/no urine reported", "The reported words describe difficulty drinking or reduced urine; seek prompt human assessment.");
  return flags;
}

function extractFields(text) {
  const value = (text || "").toLowerCase().replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit));
  const fields = { duration: null, age: null, temperature: null, respiratory_rate: null, able_to_drink: null, urination: null, pregnancy_weeks: null, bleeding_or_labour_symptoms: null, reduced_intake: false, breathing_reported: false, financial_barrier: false, travel_barrier: false, offline_reported: false };
  const duration = value.match(/(\d+)\s*(দিন|din|day|days|week|weeks|সপ্তাহ)/); if (duration) fields.duration = `${duration[1]} ${duration[2]}`;
  const age = value.match(/(\d+)\s*(বছর|bochor|বছরের|year|years|মাস|mas|month|months)/); if (age) fields.age = `${age[1]} ${age[2]}`;
  const temperature = value.match(/(\d{2,3}(?:\.\d)?)\s*(?:°?c|ডিগ্রি|degree)/); if (temperature) fields.temperature = temperature[1];
  const respiratoryRate = value.match(/(\d{1,3})\s*(?:breaths?\s*\/\s*min|শ্বাস\s*প্রতি\s*মিনিট)/); if (respiratoryRate) fields.respiratory_rate = respiratoryRate[1];
  if (/পানি খেতে পারছে না|পানি খাচ্ছে না|pani (khete|khaite|khaitese) partese na|can't drink|cannot drink/i.test(value)) fields.able_to_drink = "No / difficulty reported";
  else if (/পানি খাচ্ছে|পানি খেতে পারছে|pani khaitese|can drink/i.test(value)) fields.able_to_drink = "Yes, reported";
  if (/প্রস্রাব হচ্ছে না|প্রস্রাব কম|prosrab kom|no urine/i.test(value)) fields.urination = "Reduced / none reported";
  else if (/প্রস্রাব স্বাভাবিক|prosrab normal|urinating normally/i.test(value)) fields.urination = "Usual, reported";
  const weeks = value.match(/(\d+)\s*(?:সপ্তাহ|week|weeks)/); if (weeks && /গর্ভ|pregnan|pregnant/i.test(value)) fields.pregnancy_weeks = weeks[1];
  if (/রক্ত যাচ্ছে|রক্তপাত|প্রসবের ব্যথা|rokto jacche|bleeding|labou?r pain|delivery pain/i.test(value)) fields.bleeding_or_labour_symptoms = "Reported — worker to clarify";
  if (/(খেতে|খাওয়া|খাচ্ছে|দুধ|পানি|খাবার|খাইতেছে|খাইতেসে|eat|khabar|khaitese|milk|water)/.test(value) && /(না|নেই|চায় না|পারছে না|partese na|not|no)/.test(value)) fields.reduced_intake = true;
  fields.breathing_reported = /শ্বাস|বুক ধর|শ্বাসকষ্ট|শ্বাস নিতে|shash|nishash|breath/.test(value);
  fields.financial_barrier = /টাকা (নাই|নেই|কম)|ভাড়া নেই|ভাড়া নাই|টাকা লাগবে|সামর্থ্য নেই|taka (nai|nei|kom)|vara nai|bhara nai|gari bhara nai|cost|can't afford|cannot afford/.test(value);
  fields.travel_barrier = /দূর|দুই ঘণ্টা|দুই ঘন্টা|ভাড়া|dure|ghonta|shomoy lage|gari nai|transport unavailable/.test(value);
  fields.offline_reported = /নেট নাই|নেট নেই|ইন্টারনেট নেই|সিঙ্ক|net nai|internet nai|sync|data sesh|নেটওয়ার্ক|pore.*pathabo|shared phone|phone.*shared/.test(value);
  return fields;
}
function analyzeCase(text) {
  const prediction = classify(text), fields = extractFields(text), concerns = detectConcerns(text);
  const urgentConcern = concerns.find(x => ["neurological_red_flag", "breathing_difficulty", "seizure", "chest_cardiac_warning"].includes(x));
  const intent = urgentConcern || (concerns.includes("routine_follow_up") ? "routine_follow_up" : null) || (concerns.includes(prediction.intent) ? prediction.intent : null) || concerns[0] || prediction.intent;
  const barriers = [];
  if (fields.financial_barrier || concerns.includes("financial_barrier")) barriers.push("financial");
  if (fields.travel_barrier || concerns.includes("travel_barrier")) barriers.push("travel");
  if (fields.offline_reported || concerns.includes("connectivity")) barriers.push("connectivity");
  if (/(ফিরে আসতে|আবার আসতে.*কষ্ট|reminder nai|follow.?up.*difficult|can't return|pore asha mushkil)/i.test(normalizeText(text))) barriers.push("continuity");
  if (/(কোথায় যাব|কোথায় যেতে|bujhi na.*kothay|where to go|don't know where)/i.test(normalizeText(text))) barriers.push("navigation");
  const required = new Set(["age", "duration"]);
  if (concerns.includes("fever")) required.add("temperature");
  if (concerns.includes("breathing_difficulty")) required.add("respiratory_rate_if_measured");
  if (concerns.includes("diarrhea_vomiting") || concerns.includes("dehydration")) { required.add("able_to_drink"); required.add("urination"); }
  if (concerns.includes("maternal_pregnancy")) { required.add("pregnancy_weeks"); required.add("bleeding_or_labour_symptoms"); }
  const missing = [...required].filter(key => !fields[key]);
  const uncertainty = [];
  if (prediction.confidence < .30) uncertainty.push("Low model score: confirm the concern in the patient's own words.");
  else if (prediction.confidence < .55) uncertainty.push("Moderate model score: verify the selected concern.");
  if (prediction.intent !== intent) uncertainty.push(`Model's top class (${INTENT_LABELS[prediction.intent] || prediction.intent}) differs from the directly matched concern; worker review is essential.`);
  if (missing.length) uncertainty.push("Some relevant information is not recorded yet.");
  const redFlags = detectRedFlags(text, concerns, fields);
  return { intent, model_intent: prediction.intent, confidence: prediction.confidence, direct_matches: [...new Set(concerns)], concerns: [...new Set(concerns.length ? concerns : [prediction.intent])], fields, barriers, missing, uncertainty, red_flags: redFlags, safety_note: "Screening and documentation support only. Not a diagnosis or autonomous referral decision." };
}
