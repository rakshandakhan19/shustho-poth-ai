const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const sandbox={};
vm.runInNewContext(fs.readFileSync(path.join(root,'ai.js'),'utf8')+'\nglobalThis.api={analyzeCase};',sandbox);
const analyzeCase=sandbox.api.analyzeCase;
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let passed=0;
function check(name,fn){fn();passed++;console.log(`PASS ${name}`);}
function downstream(a){return JSON.stringify({intent:a.intent,concerns:a.concerns,barriers:a.barriers,red_flags:a.red_flags.map(x=>x.id),model_signal:a.model_signal});}
const hero='amar bacchar shash nite koshto hocche, hospital e jawar taka nai';
check('voice transcript follows the same downstream pipeline as typed text',()=>{assert.equal(downstream(analyzeCase(hero)),downstream(analyzeCase(hero)));assert.match(app,/function useVoiceTranscript\(\)[\s\S]*?byId\("input"\)\.value=transcript[\s\S]*?inputSource="Voice transcript"[\s\S]*?runAI\(\);/);});
check('hero transcript includes breathing concern',()=>assert(analyzeCase(hero).concerns.includes('breathing_difficulty')));
check('hero transcript detects financial barrier',()=>assert(analyzeCase(hero).concerns.includes('financial_barrier')));
check('hero transcript reaches existing urgent warning rules',()=>assert(analyzeCase(hero).red_flags.length>0));
check('Banglish negation suppresses positive breathing warning',()=>{const a=analyzeCase('bacchar shash nite koshto hocche na');assert(!a.concerns.includes('breathing_difficulty'));assert.equal(a.red_flags.length,0);});
check('Bangla transcript reaches breathing rule and preserves Bangla negation',()=>{assert(analyzeCase('শ্বাস নিতে কষ্ট হচ্ছে').red_flags.length>0);const n=analyzeCase('শ্বাস নিতে কষ্ট হচ্ছে না');assert.equal(n.red_flags.length,0);assert(!n.concerns.includes('breathing_difficulty'));});
check('mixed-language transcript reaches existing concern and barrier signals',()=>{const a=analyzeCase('My baby has breathing difficulty, hospital e taka nai');assert(a.concerns.includes('breathing_difficulty'));assert(a.concerns.includes('financial_barrier'));});
check('requested Bangla, Banglish, mixed, severe, cost and combined examples use the existing safety pipeline',()=>{
  const examples=[
    ['আমার বাচ্চার শ্বাস নিতে কষ্ট হচ্ছে','breathing_difficulty',true],
    ['amar bacchar shash nite koshto hocche','breathing_difficulty',true],
    ['amar bacchar breathing e problem hocche','breathing_difficulty',true],
    ['baccha shash nite parche na','breathing_difficulty',true],
    ['hospital e jawar taka nai','financial_barrier',false],
    ['amar bacchar shash nite koshto hocche hospital e jawar taka nai','breathing_difficulty',true]
  ];
  for(const [text,category,escalate] of examples){const a=analyzeCase(text);assert(a.concerns.includes(category),text);assert.equal(a.red_flags.length>0,escalate,text);}
  const combo=analyzeCase(examples[5][0]);assert(combo.concerns.includes('financial_barrier'));assert(combo.barriers.includes('financial'));
});
check('common Romanized spelling variations normalize for matching without changing the source text',()=>{
  for(const text of ['bacchar sas nite kosto hocche','bacchar shas nite kosht hoyeche','bacchar shash nite koshto hoise'])assert(analyzeCase(text).concerns.includes('breathing_difficulty'),text);
  assert(analyzeCase('bacchar shash nite koshto hocche na').red_flags.length===0);
});
check('empty transcript is blocked before analysis',()=>{assert.match(app,/if\(!transcript\)\{byId\("voiceReviewStatus"\)/);});
check('SpeechRecognition unavailable fallback offers typing',()=>{assert.match(app,/if\(!SpeechRecognition\)/);assert.match(html,/Voice input isn't supported in this browser\. You can type your message instead\./);assert.match(html,/id="typeInsteadButton"/);});
console.log(`Passed ${passed} voice transcript and fallback checks. Browser microphone recognition was not exercised.`);
