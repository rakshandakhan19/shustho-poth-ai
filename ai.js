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
  ["clinic e jete dure", "travel_barrier"]
];

function tokenize(text) { return (text || "").toLowerCase().replace(/[।,!?;:()\-]/g, " ").split(/\s+/).filter(Boolean); }
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
  const margin = sorted[0][1] - (sorted[1] ? sorted[1][1] : sorted[0][1] - 2);
  return { intent: sorted[0][0], confidence: Math.max(.5, Math.min(.99, .55 + margin / 8)), scores };
}
function extractFields(text) {
  const value = (text || "").toLowerCase().replace(/[০-৯]/g, digit => "০১২৩৪৫৬৭৮৯".indexOf(digit));
  const fields = { duration: null, age: null, reduced_intake: false, breathing_reported: false, financial_barrier: false, travel_barrier: false, offline_reported: false };
  const duration = value.match(/(\d+)\s*(দিন|day|days)/); if (duration) fields.duration = `${duration[1]} ${duration[2]}`;
  const age = value.match(/(\d+)\s*(বছর|year|years|মাস|month|months)/); if (age) fields.age = `${age[1]} ${age[2]}`;
  if (/(খেতে|খাওয়া|খাচ্ছে|দুধ|পানি|eat|milk|water)/.test(value) && /(না|নেই|চায় না|পারছে না|not|no)/.test(value)) fields.reduced_intake = true;
  fields.breathing_reported = /শ্বাস|বুক ধর|শ্বাসকষ্ট|শ্বাস নিতে|shash|nishash|breath|koshto/.test(value);
  fields.financial_barrier = /টাকা নাই|টাকা নেই|ভাড়া নেই|টাকা লাগবে|সামর্থ্য নেই|taka nai|taka nei|vara nai|cost/.test(value);
  fields.travel_barrier = /দূর|দুই ঘণ্টা|দুই ঘন্টা|ভাড়া|dure|ghonta|shomoy lage/.test(value);
  fields.offline_reported = /নেট নাই|নেট নেই|ইন্টারনেট নেই|সিঙ্ক|net nai|internet nai|sync|data sesh|নেটওয়ার্ক/.test(value);
  return fields;
}
function analyzeCase(text) {
  const result = classify(text), fields = extractFields(text);
  const required = { fever: ["age", "duration"], breathing_difficulty: ["age", "duration"], seizure: ["age", "duration"], pain: ["age", "duration"] }[result.intent] || [];
  const missing = required.filter(key => !fields[key]), uncertainty = [];
  if (result.confidence < .72) uncertainty.push("AI intent confidence is low; confirm the concern.");
  missing.forEach(key => uncertainty.push(`${key} is missing and should be confirmed by the health worker.`));
  if (fields.breathing_reported) uncertainty.push("Breathing difficulty is based on reported words; confirm clinically.");
  return { intent: result.intent, confidence: result.confidence, fields, missing, uncertainty };
}
