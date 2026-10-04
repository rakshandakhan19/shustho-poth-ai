const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),sandbox={};
vm.runInNewContext(fs.readFileSync(path.join(root,'ai.js'),'utf8')+'\nglobalThis.rows=TRAINING_CASES;',sandbox);
const test=JSON.parse(fs.readFileSync(path.join(root,'evaluation_cases_independent.json'),'utf8'));
assert.equal(test.length,150);
assert.equal(new Set(test.map(x=>x.id)).size,150);
for(const row of test){assert(row.id&&typeof row.text==='string'&&row.expected_category&&typeof row.expected_escalate==='boolean'&&['bangla','banglish','mixed','other'].includes(row.language_type)&&['normal','negation','typo','ambiguous','safety','non_health'].includes(row.test_type));}
const normalize=s=>s.toLowerCase().replace(/[।,!?;:()\-]/g,' ').replace(/\s+/g,' ').trim();
const training=new Set(sandbox.rows.map(row=>normalize(row[0])));
const overlap=test.filter(row=>training.has(normalize(row.text)));
assert.deepEqual(overlap.map(row=>row.id),[],'Independent utterances must not be copied verbatim from training phrases');
console.log(`Passed independent dataset structure and exact-copy check: ${test.length} cases; no verbatim training overlap.`);
