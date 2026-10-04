/* Shustho Poth AI — static browser workflow. No external services are called. */
const DEMOS = [
  { label: "Breathing + cost", text: "amar bacchar shash nite koshto hocche, hospital e jawar taka nai" },
  { label: "Financial barrier", text: "doctor dekhaite chai kintu taka nai" },
  { label: "No internet", text: "net nai, pore case pathabo" },
  { label: "Travel barrier", text: "hospital onek dure, gari bhara nai" },
  { label: "Sudden weakness + cost", text: "hothat ek pasher haat pa durbol, kotha bolte partese na, hospital e jawar taka nai" },
  { label: "Diarrhoea + dehydration concern", text: "3 din dhore patla paykhana, pani khete partese na, prosrab kom" },
  { label: "Routine follow-up", text: "jor kome geche, abar 3 din pore dekhate bolse" }
];
const FACILITY_FALLBACK = [
  { facility_id:"10000056", name:"Sir Salimullah Medical College Mitford Hospital", name_bn:"স্যার সলিমুল্লাহ মেডিকেল কলেজ মিটফোর্ড হাসপাতাল", type:"Medical College Hospital", division:"Dhaka", district:"Dhaka", upazila:"Kotwali" },
  { facility_id:"10000057", name:"Tejgaon Health Complex, Dhaka", name_bn:"তেজগাঁও স্বাস্থ্য কমপ্লেক্স, ঢাকা", type:"31-bed Hospital", division:"Dhaka", district:"Dhaka", upazila:"Tejgaon" },
  { facility_id:"10014947", name:"Taranagar Union Health Center", name_bn:"তারানগর ইউনিয়ন স্বাস্থ্য কেন্দ্র", type:"Union Health Center", division:"Dhaka", district:"Dhaka", upazila:"Keraniganj" },
  { facility_id:"10014948", name:"Zinjira Union Health Center", name_bn:"জিনজীরা ইউনিয়ন স্বাস্থ্য কেন্দ্র", type:"Union Health Center", division:"Dhaka", district:"Dhaka", upazila:"Keraniganj" },
  { facility_id:"10014949", name:"Agla Union Health Center", name_bn:"আগলা ইউনিয়ন স্বাস্থ্য কেন্দ্র", type:"Union Health Center", division:"Dhaka", district:"Dhaka", upazila:"Nawabganj" },
  { facility_id:"10013142", name:"Sakhipur Union Health Sub Center", name_bn:"সখিপুর ইউনিয়ন উপ-স্বাস্থ্য কেন্দ্র", type:"Union Health Sub Center", division:"Dhaka", district:"Tangail", upazila:"Sakhipur" }
];
let facilities = FACILITY_FALLBACK;
let latestAnalysis = null;
let draft = null;
let simulatedConnection = false;
const labels = INTENT_LABELS;
const byId = id => document.getElementById(id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
const RECORD_KEY = "shustho_poth_health_record";
const SHARE_KEY = "shustho_poth_share_demo";
let suggestedRecord = null;
let recordHidden = false;
const safeStorage = {
  read(key, fallback) { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } },
  write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
};
function caseId() { return `SP-${new Date().toISOString().replace(/\D/g, "").slice(2, 12)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`; }
function setDemo(index) { byId("input").value = DEMOS[index]?.text || ""; byId("demoStatus").textContent = "Synthetic example loaded. Select ‘Structure this case’."; byId("input").focus(); }
function makeDemoButtons() { byId("demoButtons").innerHTML = DEMOS.map((demo, i) => `<button type="button" class="chip-button" onclick="setDemo(${i})">${escapeHTML(demo.label)}</button>`).join(""); }
function formatDate(value) { if (!value) return "Not set"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString(); }
function formatIntent(intent) { return labels[intent] || intent || "Concern not identified"; }
function checkedBarriers() { return [...document.querySelectorAll("[name='barrier']:checked")].map(node => node.value); }
function updateMissingPreview() {
  if (!latestAnalysis) return;
  const missing = [];
  [["caseAge","age"],["caseDuration","duration"]].forEach(([id,label]) => { if (!byId(id)?.value.trim()) missing.push(label); });
  if (!byId("caseSeverity")?.value) missing.push("severity, if known");
  if (!byId("caseConsciousness")?.value) missing.push("consciousness/response, if known");
  if (latestAnalysis.concerns.includes("fever") && !byId("caseTemperature").value.trim()) missing.push("temperature, if measured");
  if (latestAnalysis.concerns.includes("breathing_difficulty") && !byId("caseRespRate").value.trim()) missing.push("respiratory rate if measured");
  if ((latestAnalysis.concerns.includes("diarrhea_vomiting") || latestAnalysis.concerns.includes("dehydration")) && !byId("ableToDrink").value) missing.push("ability to drink");
  if ((latestAnalysis.concerns.includes("diarrhea_vomiting") || latestAnalysis.concerns.includes("dehydration")) && !byId("urination").value) missing.push("urination");
  if (latestAnalysis.concerns.includes("maternal_pregnancy") && !byId("pregnancyWeeks").value.trim()) missing.push("pregnancy duration, if known");
  if (latestAnalysis.concerns.includes("maternal_pregnancy") && !byId("maternalSymptoms").value) missing.push("bleeding/labour symptoms");
  byId("missingPreview").textContent = missing.length ? `Information you may want to add (if known): ${missing.join(", ")}.` : "The suggested fields are recorded. Please check that they are accurate.";
}
function runAI() {
  const text = byId("input").value.trim();
  if (!text) { byId("inputError").textContent = "Enter the patient’s words or load a synthetic example first."; byId("input").focus(); return; }
  byId("inputError").textContent = "";
  latestAnalysis = analyzeCase(text);
  byId("humanDecisionStatus").textContent = "No next step recorded yet. AI does not choose care for you.";
  byId("followupStatus").textContent = "No follow-up scheduled.";
  byId("supportStatus").textContent = "Illustrative prototype pathway — availability and eligibility must be verified locally.";
  byId("paymentStatus").textContent = "No payment has been made.";
  byId("planResult").textContent = "No calculation yet.";
  draft = { id:caseId(), text, analysis:latestAnalysis, patient:{age:latestAnalysis.fields.age || "", sex:"", duration:latestAnalysis.fields.duration || "", temperature:latestAnalysis.fields.temperature || "", respiratory_rate:latestAnalysis.fields.respiratory_rate || "", severity:"", consciousness:"", able_to_drink:latestAnalysis.fields.able_to_drink || "", urination:latestAnalysis.fields.urination || "", pregnancy_weeks:latestAnalysis.fields.pregnancy_weeks || "", bleeding_or_labour_symptoms:latestAnalysis.fields.bleeding_or_labour_symptoms || "", reported_concerns:latestAnalysis.concerns.map(formatIntent).join(", ")}, worker_decision:"", facility_id:"", barriers:latestAnalysis.barriers.map(key => ({financial:"financial_cost",travel:"facility_distance",connectivity:"connectivity",continuity:"continuity",navigation:"navigation"}[key] || key)).filter(x => ["financial_cost","transport_cost","facility_distance","no_transport","connectivity","shared_phone","continuity","navigation"].includes(x)), support_pathways:[], payment_demo:null, follow_up:null, created_at:new Date().toISOString(), status:"pending_offline" };
  renderResult();
  detectRecordSuggestion(text);
  renderAccess();
  byId("results").hidden = false;
  byId("carePath").hidden = false;
  byId("smsCard").hidden = false;
  byId("followupCard").hidden = false;
  byId("results").scrollIntoView({ behavior:"smooth", block:"start" });
}
function renderResult() {
  const analysis = latestAnalysis;
  const flags = analysis.red_flags;
  const urgency = flags.length ? `<div class="alert alert-danger"><strong>⚠️ Potential emergency warning sign</strong><p><b>Please seek urgent human medical care.</b> If this is severe or life-threatening, call <b>999</b> or seek emergency medical care immediately. Financial planning, community support, or app use must not delay care.</p><p><a class="button danger" href="tel:999">Call 999</a></p>${flags.map(flag => `<p><b>${escapeHTML(flag.label)}:</b> ${escapeHTML(flag.reason)}</p>`).join("")}<p class="muted">Possible warning based on reported words only; not a diagnosis or live dispatch connection.</p></div>` : `<div class="alert"><strong>Screening support only.</strong> No rule-based warning phrase was recognized. This does not rule out risk. Contact a health professional if you are worried.</div>`;
  const displayConcerns = analysis.direct_matches.length ? analysis.direct_matches : [analysis.model_intent];
  const concerns = displayConcerns.map(intent => `<span class="tag">${escapeHTML(formatIntent(intent))}</span>`).join(" ");
  const confidenceBand = analysis.confidence >= .65 ? "High model score" : analysis.confidence >= .35 ? "Moderate model score" : "Low model score";
  const confidenceCaution = analysis.confidence < .35 ? `<p class="alert alert-danger"><b>AI is uncertain about this case. Do not rely on the AI classification.</b> Continue with human medical assessment.</p>` : "";
  byId("results").innerHTML = `
    <div class="section-heading"><div><span class="eyebrow">STEP 2 · CHECK WHAT WE UNDERSTOOD</span><h2>What we understood</h2><p>Your words are organized as possible presentation categories—not a diagnosis.</p></div><span class="case-id">${escapeHTML(draft.id)}</span></div>
    <p class="safety-label">AI support only · Not a diagnosis · Human care decisions</p>
    <div class="result-grid"><div><h3>Possible concern</h3><div>${concerns}</div><p class="muted">${analysis.direct_matches.length ? "Matched phrase cues" : "Model-only suggestion — no phrase cue matched; confirm with a health professional"}. ${confidenceBand}: <b>${Math.round(analysis.confidence * 100)}%</b>. Uncalibrated score, not a disease probability.</p>${confidenceCaution}<p class="muted">Naive Bayes top class: ${escapeHTML(formatIntent(analysis.model_intent))}${analysis.model_intent !== analysis.intent ? " · phrase cues show a different concern; review both" : ""}</p></div>
      <div>${urgency}</div></div>
    <div class="form-grid">
      <label>Age, if shared<input id="caseAge" value="${escapeHTML(draft.patient.age)}" placeholder="e.g., 4 years"></label>
      <label>Sex, if relevant and shared<select id="caseSex"><option value="">Not recorded</option><option>Female</option><option>Male</option><option>Another / not stated</option></select></label>
      <label>Symptom duration<input id="caseDuration" value="${escapeHTML(draft.patient.duration)}" placeholder="e.g., 3 days"></label>
      <label>Temperature, if measured<input id="caseTemperature" inputmode="decimal" placeholder="°C" value="${escapeHTML(draft.patient.temperature)}"></label>
      <label>Respiratory rate, if measured<input id="caseRespRate" inputmode="numeric" placeholder="breaths/min" value="${escapeHTML(draft.patient.respiratory_rate)}"></label>
      <label>How severe does it feel?<select id="caseSeverity"><option value="">Not asked</option><option>Mild as described</option><option>Moderate as described</option><option>Severe as described</option><option>Not sure</option></select></label>
      <label>Consciousness / response<select id="caseConsciousness"><option value="">Not asked</option><option>Responding as usual, reported</option><option>Confused or unusually drowsy, reported</option><option>Not responding / unconscious, reported</option></select></label>
      <label>Can the patient drink?<select id="ableToDrink"><option value="">Not asked</option><option value="No / difficulty reported">No / difficulty reported</option><option value="Yes, reported">Yes, reported</option></select></label>
      <label>Urination / প্রস্রাব<select id="urination"><option value="">Not asked</option><option value="Usual, reported">Usual, reported</option><option value="Reduced / none reported">Reduced / none reported</option></select></label>
      <label>Pregnancy duration, if relevant<input id="pregnancyWeeks" inputmode="numeric" placeholder="weeks, if known" value="${escapeHTML(draft.patient.pregnancy_weeks)}"></label>
      <label>Bleeding / labour symptoms<select id="maternalSymptoms"><option value="">Not asked</option><option value="Reported — worker to clarify">Reported — clarify with worker</option><option value="Not reported">Not reported</option></select></label>
      <label class="wide">Possible concern categories (you may correct these)<textarea id="caseConcerns" rows="2">${escapeHTML(draft.patient.reported_concerns)}</textarea></label>
    </div>
    <p id="missingPreview" class="alert alert-warn" aria-live="polite"></p>
    <details><summary>Original conversation</summary><p class="quoted-text">${escapeHTML(draft.text)}</p></details>
    <p class="muted">Synthetic example or de-identified wording only. Avoid names, phone numbers, NID, or other unnecessary identifiers.</p>`;
  byId("caseSex").value = draft.patient.sex;
  byId("ableToDrink").value = draft.patient.able_to_drink;
  byId("urination").value = draft.patient.urination;
  byId("maternalSymptoms").value = draft.patient.bleeding_or_labour_symptoms;
  ["caseAge","caseSex","caseDuration","caseTemperature","caseRespRate","caseSeverity","caseConsciousness","ableToDrink","urination","pregnancyWeeks","maternalSymptoms","caseConcerns"].forEach(id => { byId(id).addEventListener("input", updateMissingPreview); byId(id).addEventListener("change", updateMissingPreview); });
  updateMissingPreview();
}
function renderAccess() {
  byId("facilitySelect").innerHTML = `<option value="">Choose from sample facilities (verify locally)</option>` + facilities.map(f => `<option value="${escapeHTML(f.facility_id)}">${escapeHTML(f.name)} · ${escapeHTML(f.district)} (${escapeHTML(f.upazila)})</option>`).join("");
  byId("facilitySelect").onchange = () => { draft.facility_id = byId("facilitySelect").value; updatePlanSummary(); refreshSms(); };
  if (draft.facility_id) byId("facilitySelect").value = draft.facility_id;
  const selected = new Set(draft.barriers);
  document.querySelectorAll("[name='barrier']").forEach(input => { input.checked = selected.has(input.value); input.onchange = () => { draft.barriers = checkedBarriers(); updatePlanSummary(); }; });
  updatePlanSummary();
}
function selectedFacility() { return facilities.find(f => f.facility_id === (byId("facilitySelect")?.value || draft?.facility_id)); }
function updatePlanSummary() {
  if (!draft) return;
  const facility = selectedFacility();
  const barriers = checkedBarriers();
  draft.barriers = barriers;
  byId("accessSummary").textContent = `Reach: ${barriers.some(x => ["facility_distance","no_transport"].includes(x)) ? "barrier recorded" : "health professional to confirm"} · Afford: ${barriers.some(x => ["financial_cost","transport_cost"].includes(x)) ? "barrier recorded" : "worker to confirm"} · Connect: ${barriers.some(x => ["connectivity","shared_phone"].includes(x)) ? "barrier recorded" : "worker to confirm"} · Return: ${barriers.includes("continuity") ? "barrier recorded" : "worker to confirm"}.`;
  byId("selectedFacilitySummary").textContent = facility ? `${facility.name} (${facility.name_bn}) · ${facility.district}, ${facility.upazila} · sample registry record; verify services, opening and capacity locally.` : "No facility selected. Check locally whether a facility is appropriate and available.";
  refreshSms();
}
function recordDecision(decision) {
  if (!draft) { byId("humanDecisionStatus").textContent="Analyze or choose a synthetic demo first. This control records your own next-step plan only."; return; }
  draft.patient_next_step = decision;
  draft.worker_decision = "";
  byId("humanDecisionStatus").textContent = `You noted: ${decision}. This is your plan, not a clinical decision or AI recommendation; speak with a health professional.`;
  draft.status = decision.toLowerCase().includes("follow") ? "followup_pending" : "patient_plan_noted";
  persistDraft("Your planned next step was saved locally.");
  refreshSms();
}
function setSupport(key, label) {
  if (!draft) { byId("supportStatus").textContent = "Screen a case first; this concept can then be attached to its local access plan."; return; }
  const status = byId("supportStatus");
  if (!draft.support_pathways.includes(key)) draft.support_pathways.push(key);
  status.textContent = `${label} noted as an illustrative option. Eligibility and availability must be verified locally. No payment, insurance, loan, or referral is provided.`;
  persistDraft("Access option saved locally.");
}
function simulateContribution() {
  if (!draft) { byId("paymentStatus").textContent = "Screen a case first. No payment has been made."; return; }
  draft.payment_demo = { amount_bdt:100, method:"bKash / mobile money concept", simulated:true, recorded_at:new Date().toISOString(), next_contribution:new Date(Date.now() + 30 * 86400000).toISOString() };
  setSupport("mobile_money", "Mobile money concept");
  byId("paymentStatus").textContent = `Demo contribution recorded: BDT 100. Next illustrative contribution date: ${new Date(draft.payment_demo.next_contribution).toLocaleDateString()}. Demo only — no real money transferred.`;
  persistDraft("Demo payment event saved locally; no transfer was made.");
}
function calculatePlan() {
  const amount = Number(byId("planAmount").value), months = Number(byId("planMonths").value);
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(months) || months < 1) { byId("planResult").textContent = "Enter an illustrative positive amount and a number of months."; return; }
  byId("planResult").textContent = `Illustrative arithmetic only: BDT ${amount.toFixed(0)} ÷ ${months} months = BDT ${(amount / months).toFixed(2)} per month. This is not credit, financial advice, or an offer.`;
  if (draft) { draft.payment_plan = { total_bdt:amount, months, monthly_bdt:Number((amount / months).toFixed(2)), illustrative:true }; persistDraft("Illustrative plan saved locally."); }
}
function selectFollowup(hours) {
  const date = new Date(Date.now() + hours * 3600000);
  byId("followupDate").value = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);
  byId("followupType").value = "Referral follow-up";
  saveFollowup();
}
function saveFollowup() {
  const value = byId("followupDate").value;
  if (!value) { byId("followupStatus").textContent = "Choose a follow-up date and time."; return; }
  const followup = { due_at:new Date(value).toISOString(), type:byId("followupType").value, note:byId("followupNote").value.trim(), status:"Pending" };
  if (draft) {
    draft.follow_up = followup;
    draft.status = "followup_pending";
    byId("followupStatus").textContent = `${draft.follow_up.type} recorded for ${formatDate(draft.follow_up.due_at)}. Saved on this device; no reminder will be sent automatically.`;
    persistDraft("Follow-up saved locally.");
  } else {
    const records=safeStorage.read("shustho_poth_cases",[]), list=Array.isArray(records)?records:[];
    const item={id:caseId(),created_at:new Date().toISOString(),status:"followup_pending",follow_up:followup};
    list.unshift(item); safeStorage.write("shustho_poth_cases",list.slice(0,100));
    byId("followupStatus").textContent=`${item.follow_up.type} recorded for ${formatDate(item.follow_up.due_at)}. Saved on this device; no reminder will be sent automatically.`;
    renderQueue();
  }
  renderFollowups();
  if (draft) refreshSms();
}
function refreshSms() {
  if (!draft || !byId("smsMessage")) return;
  const facility = selectedFacility();
  const red = draft.analysis.red_flags.length > 0;
  const smsLabels = { breathing_difficulty:"BREATHING CONCERN", neurological_red_flag:"NEURO WARNING", seizure:"SEIZURE REPORTED", chest_cardiac_warning:"CHEST CONCERN", dehydration:"HYDRATION CONCERN", diarrhea_vomiting:"DIARRHOEA/VOMITING", maternal_pregnancy:"MATERNAL CONCERN", injury_trauma:"INJURY REPORTED" };
  const concern = smsLabels[draft.analysis.intent] || "WORKER REVIEW";
  const due = draft.follow_up?.due_at ? new Date(draft.follow_up.due_at).toLocaleDateString() : "You or a care professional can arrange";
  const facilityText = facility ? `FAC: ${facility.name}` : "FAC: to confirm";
  let message = [`CASE ${draft.id}`, red ? "PROMPT WORKER REVIEW" : "WORKER REVIEW", concern, facilityText, `FOLLOW-UP: ${due}`].join("\n");
  if (message.length > 160) message = [`CASE ${draft.id}`, red ? "PROMPT WORKER REVIEW" : "WORKER REVIEW", concern, facility ? `FAC: ${facility.name.slice(0, 20)}` : "FAC: confirm", `FOLLOW-UP: ${due}`].join("\n");
  byId("smsMessage").value = message.slice(0, 160);
  if (byId("smsCount")) byId("smsCount").textContent = `${byId("smsMessage").value.length}/160 characters · financial details omitted`;
}
async function copySms() {
  try { await navigator.clipboard.writeText(byId("smsMessage").value); byId("smsStatus").textContent = "Copied on this device. Not sent. Check for consent and remove anything not needed before sharing."; }
  catch { byId("smsStatus").textContent = "Select and copy the message manually. It is only prepared locally and was not sent."; }
}
function persistDraft(message = "Case saved on this device.") {
  if (!draft) return false;
  if (latestAnalysis) {
    draft.text = byId("input").value.trim();
    draft.analysis = latestAnalysis;
    draft.patient = { ...draft.patient,
      age:byId("caseAge")?.value.trim() || "", sex:byId("caseSex")?.value || "",
      duration:byId("caseDuration")?.value.trim() || "", temperature:byId("caseTemperature")?.value.trim() || "",
      respiratory_rate:byId("caseRespRate")?.value.trim() || "", severity:byId("caseSeverity")?.value || "", consciousness:byId("caseConsciousness")?.value || "", able_to_drink:byId("ableToDrink")?.value || "", urination:byId("urination")?.value || "",
      pregnancy_weeks:byId("pregnancyWeeks")?.value.trim() || "", bleeding_or_labour_symptoms:byId("maternalSymptoms")?.value || "",
      reported_concerns:byId("caseConcerns")?.value.trim() || "" };
  }
  draft.updated_at = new Date().toISOString();
  const records = safeStorage.read("shustho_poth_cases", []);
  const list = Array.isArray(records) ? records : [];
  const index = list.findIndex(record => record.id === draft.id);
  if (index >= 0) list[index] = { ...draft }; else list.unshift({ ...draft });
  if (!safeStorage.write("shustho_poth_cases", list.slice(0, 100)) || !safeStorage.write("shustho_poth_last_case", draft)) {
    byId("saveStatus").textContent = "Local save failed. Check browser storage and available device space.";
    return false;
  }
  byId("saveStatus").textContent = message;
  renderQueue();
  renderFollowups();
  return true;
}
function saveCase() { if (!draft) { byId("saveStatus").textContent="Describe what is happening and select Analyze first. No case has been saved."; byId("screen").scrollIntoView({behavior:"smooth"}); return; } persistDraft(); }
function renderQueue() {
  const records = safeStorage.read("shustho_poth_cases", []);
  const list = Array.isArray(records) ? records : [];
  const waiting=list.filter(record=>record.sync_status!=="simulated_complete").length;
  byId("queueCount").textContent = `${waiting} case${waiting===1?"":"s"} waiting to sync`;
  byId("queueList").innerHTML = list.length ? list.map(record => `<article class="queue-row"><div><b>${escapeHTML(record.id)}</b><p>${escapeHTML(record.analysis?.concerns?.map(formatIntent).join(", ") || record.follow_up?.type || "Case record")}</p><small>${escapeHTML(record.patient_next_step || "No next step noted")} · ${escapeHTML(record.sync_status === "simulated_complete" ? "Synced (demo)" : navigator.onLine ? "Ready to sync (demo)" : "Stored locally")}</small></div><time>${escapeHTML(formatDate(record.created_at || record.saved_at))}</time></article>`).join("") : `<p class="muted">No cases or follow-ups saved on this device.</p>`;
}
function simulateConnection() { simulatedConnection = true; byId("connectionStatus").textContent = "Connection restored (simulation only). Your data remains local."; byId("syncButton").disabled = false; }
function simulateSync() {
  if (!simulatedConnection && !navigator.onLine) { byId("syncStatus").textContent = "Simulate a connection first. No data has left this device."; return; }
  const records = safeStorage.read("shustho_poth_cases", []);
  const list = Array.isArray(records) ? records : [];
  list.forEach(record => { record.sync_status = "simulated_complete"; });
  safeStorage.write("shustho_poth_cases", list);
  byId("syncStatus").textContent = `${list.length} case${list.length === 1 ? "" : "s"} marked synced in this local simulation. No network request or transmission occurred.`;
  renderQueue();
}
function clearLocalData() {
  if (!window.confirm("Clear all locally stored Shustho Poth AI case records from this browser? This cannot be undone.")) return;
  try { ["shustho_poth_cases","shustho_poth_last_case",RECORD_KEY,SHARE_KEY,"shustho_poth_support_requests"].forEach(key => localStorage.removeItem(key)); } catch {}
  draft = null; latestAnalysis = null; byId("queueStatus").textContent = "Local demo cases, record items, consent share, and support requests cleared from this browser."; byId("recordStatus").textContent = "Local health record cleared."; byId("recipientView").hidden = true; byId("communityRequest").hidden = true; renderHealthRecord(); renderShareStatus(); renderQueue();
}
function recordItems() { const items = safeStorage.read(RECORD_KEY, []); return Array.isArray(items) ? items : []; }
function renderHealthRecord() {
  const root = byId("recordList"); if (!root) return;
  if (recordHidden) { root.hidden = true; byId("recordHiddenStatus").hidden = false; byId("hideRecordButton").textContent = "Show my health record"; return; }
  root.hidden = false; byId("recordHiddenStatus").hidden = true; byId("hideRecordButton").textContent = "Hide my health record";
  const names = {diagnoses:"Diagnosis",medicines:"Medicine",allergies:"Allergy",visits:"Previous visit",tests:"Test result",referrals:"Referral",followups:"Follow-up"};
  const list = recordItems();
  root.innerHTML = list.length ? list.map(item => `<article class="metric"><p class="eyebrow">${escapeHTML(names[item.type] || item.type)}</p><h3>${escapeHTML(item.item)}</h3><p>${escapeHTML(item.date || "Date not recorded")}${item.provider ? ` · ${escapeHTML(item.provider)}` : ""}</p>${item.extra ? `<p>${escapeHTML(item.extra)}</p>` : ""}${item.notes ? `<p>${escapeHTML(item.notes)}</p>` : ""}<button type="button" class="button-small" data-edit-record="${escapeHTML(item.id)}">Edit</button> <button type="button" class="button-small" data-delete-record="${escapeHTML(item.id)}">Delete</button></article>`).join("") : `<p class="muted">No record items saved on this device yet.</p>`;
  root.querySelectorAll("[data-edit-record]").forEach(button => button.addEventListener("click", () => editRecord(button.dataset.editRecord)));
  root.querySelectorAll("[data-delete-record]").forEach(button => button.addEventListener("click", () => deleteRecord(button.dataset.deleteRecord)));
}
function saveRecordItem(item, message = "Record item saved on this device.") {
  const list = recordItems(), index = list.findIndex(row => row.id === item.id);
  if (index >= 0) list[index] = item; else list.unshift(item);
  if (!safeStorage.write(RECORD_KEY, list)) { byId("recordStatus").textContent = "Could not save. Browser storage may be unavailable."; return false; }
  byId("recordStatus").textContent = `${message} Local browser storage is not encrypted.`; renderHealthRecord(); renderShareStatus(); return true;
}
function saveRecordForm() {
  const itemText = byId("recordItem").value.trim();
  if (!itemText) { byId("recordStatus").textContent = "Enter a record item first."; byId("recordItem").focus(); return; }
  const type = byId("recordType").value;
  if (type === "diagnoses" && !window.confirm("Did a health professional diagnose this? Only save it if yes.")) { byId("recordStatus").textContent = "Diagnosis not saved. Confirm with a health professional first."; return; }
  const id = byId("recordEditId").value || `REC-${Date.now()}-${Math.random().toString(36).slice(2,5)}`;
  const item = {id,type,item:itemText,date:byId("recordDate").value,provider:byId("recordProvider").value.trim(),extra:byId("recordExtra").value.trim(),notes:byId("recordNotes").value.trim(),confirmed_by_patient:true,updated_at:new Date().toISOString()};
  if (saveRecordItem(item, "Patient-confirmed record item saved locally.")) clearRecordForm();
}
function clearRecordForm() { ["recordItem","recordDate","recordProvider","recordExtra","recordNotes","recordEditId"].forEach(id => byId(id).value = ""); byId("recordType").value = "diagnoses"; }
function editRecord(id) { const item = recordItems().find(row => row.id === id); if (!item) return; byId("recordEditId").value=item.id; byId("recordType").value=item.type; byId("recordItem").value=item.item; byId("recordDate").value=item.date || ""; byId("recordProvider").value=item.provider || ""; byId("recordExtra").value=item.extra || ""; byId("recordNotes").value=item.notes || ""; byId("recordStatus").textContent="Editing this item. Save to update it."; byId("recordItem").focus(); }
function deleteRecord(id) { const list=recordItems().filter(row=>row.id!==id); safeStorage.write(RECORD_KEY,list); byId("recordStatus").textContent="Record item removed from this browser."; renderHealthRecord(); renderShareStatus(); }
function detectRecordSuggestion(text) {
  const input=text.toLowerCase(); let item=null;
  if (/(doctor|doctor said|ডাক্তার|চিকিৎসক).*(diabetes|ডায়াবেটিস|ডায়াবেটিস)|(diabetes|ডায়াবেটিস|ডায়াবেটিস).*(doctor|ডাক্তার|diagnos)/i.test(input)) item={type:"diagnoses",item:"Diabetes (patient-reported as diagnosed by a health professional)",extra:"Patient confirmation required",question:"Did a health professional diagnose this?"};
  const medicine=input.match(/\b(metformin|paracetamol|paracetemol)\b\s*(\d{2,4})?\s*(mg)?/i);
  if (!item && medicine && /(i take|taking|খাই|খাচ্ছি|নিই|রাতে|প্রতিদিন|every night|nightly|daily)/i.test(input)) item={type:"medicines",item:`${medicine[1]}${medicine[2] ? ` — ${medicine[2]} ${medicine[3] || "mg"}` : ""}${/(every night|nightly|রাতে)/i.test(input) ? " — once nightly (as reported)" : " (as reported)"}`,extra:"Patient-reported; confirm dose and instructions with prescriber",question:"Is this medicine information correct as you reported it?"};
  suggestedRecord=item;
  const host=byId("recordSuggestion"); if (!host) return;
  host.hidden=!item;
  if (!item) { host.innerHTML=""; return; }
  host.innerHTML=`<b>Possible health-record update (suggestion only):</b><p>${escapeHTML(item.item)}</p><p>${escapeHTML(item.question)}</p><button type="button" class="button" id="confirmSuggestedRecord">Yes, save</button><button type="button" class="button secondary" id="cancelSuggestedRecord">No, cancel</button><p class="muted">Nothing is saved unless you confirm.</p>`;
  byId("confirmSuggestedRecord").addEventListener("click",()=>{ if(item.type==="diagnoses"&&!window.confirm("Confirm: a health professional diagnosed this?")) return; saveRecordItem({id:`REC-${Date.now()}`,type:item.type,item:item.item,date:new Date().toISOString().slice(0,10),provider:"",extra:item.extra,notes:"Confirmed by patient from an AI suggestion; verify with health professional.",confirmed_by_patient:true,updated_at:new Date().toISOString()},"Your confirmed suggestion was added to the record."); host.hidden=true; });
  byId("cancelSuggestedRecord").addEventListener("click",()=>{ suggestedRecord=null; host.hidden=true; });
}
function requestCommunityHelp() {
  if (!byId("supportConsent").checked) { byId("communityRequest").hidden=false; byId("communityRequest").textContent="Please select consent to prepare a demo request, or choose Continue without help. No data is sent."; return; }
  const includeHealth=byId("supportHealthConsent").checked;
  const analysis=draft?.analysis || latestAnalysis;
  const barriers=checkedBarriers();
  const request={id:draft?.id || caseId(),created_at:new Date().toISOString(),location:byId("supportLocation").value.trim() || "Not shared",concern:includeHealth ? (analysis?.concerns?.map(formatIntent).join(", ") || "Not assessed") : "Not shared",barriers:barriers.length?barriers.join(", "):"Not specified",requested_support:byId("supportNeed").value,health_information_included:includeHealth,simulated:true};
  const existing=safeStorage.read("shustho_poth_support_requests",[]); const rows=Array.isArray(existing)?existing:[]; rows.unshift(request); safeStorage.write("shustho_poth_support_requests",rows.slice(0,50));
  byId("communityRequest").hidden=false;
  byId("communityRequest").innerHTML=`<h3>Community Support Request — DEMO</h3><p><b>Case:</b> ${escapeHTML(request.id)} · <b>Time:</b> ${escapeHTML(formatDate(request.created_at))}</p><p><b>Location:</b> ${escapeHTML(request.location)} · <b>Potential concern:</b> ${escapeHTML(request.concern)}</p><p><b>Access barrier:</b> ${escapeHTML(request.barriers)} · <b>Requested support:</b> ${escapeHTML(request.requested_support)}</p><p class="safety-label">Demo network — not sent; not a live emergency service.</p>${analysis?.red_flags?.length?"<p><b>Potential urgent warning:</b> seek urgent human care/call 999. This request must not delay care.</p>":""}`;
  byId("supportConsent").checked=false;
}
function continueWithoutCommunity() { byId("supportConsent").checked=false; byId("supportHealthConsent").checked=false; byId("communityRequest").hidden=false; byId("communityRequest").textContent="You chose to continue without community help. No request was created or sent."; }
function renderShareStatus() {
  const share=safeStorage.read(SHARE_KEY,null), view=byId("recipientView"); if (!view) return;
  if (!share || Date.now()>share.expires_at) { if(share) safeStorage.write(SHARE_KEY,null); view.hidden=true; return; }
  view.hidden=false;
  byId("shareStatus").textContent=`Demo access code: ${share.code}. Expires in 24 hours (${formatDate(share.expires_at)}). This is simulated and not secure authentication.`;
  const out=(share.shared_items||[]).map(item=>`<p><b>${escapeHTML(item.type)}:</b> ${escapeHTML(item.item)} ${item.extra?`· ${escapeHTML(item.extra)}`:""}</p>`);
  if(share.symptoms_text) out.push(`<p><b>Recent symptoms:</b> ${escapeHTML(share.symptoms_text)}</p>`);
  byId("sharedInformation").innerHTML=`<p><b>Recipient:</b> ${escapeHTML(share.recipient)} · <b>Consent:</b> Granted for selected fields</p><p><b>Case ID:</b> ${escapeHTML(draft?.id || "Local patient record")}</p>${out.length?out.join(""):`<p>No saved details exist for selected fields.</p>`}<p class="muted">Demo view contains selected items only. It is not transmitted or protected by production access controls.</p>`;
}
function generateAccessCode() {
  if(!byId("shareConsent").checked){byId("shareStatus").textContent="Please give consent before creating demo access. No information was shared.";return;}
  const fields=[...document.querySelectorAll("[name='shareField']:checked")].map(el=>el.value);
  if(!fields.length){byId("shareStatus").textContent="Choose at least one information category first.";return;}
  const records=recordItems();
  const sharedItems=fields.includes("full_history")?records:records.filter(item=>fields.includes(item.type));
  const share={code:String(Math.floor(100000+Math.random()*900000)),recipient:byId("shareRecipient").value,fields,shared_items:sharedItems.map(({type,item,extra,date,provider,notes,status})=>({type,item,extra,date,provider,notes,status})),symptoms_text:fields.includes("symptoms")?draft?.text||"":null,created_at:Date.now(),expires_at:Date.now()+24*60*60*1000,consent:true};
  safeStorage.write(SHARE_KEY,share); renderShareStatus(); byId("shareConsent").checked=false; setTimeout(renderShareStatus,24*60*60*1000);
}
function revokeAccess() { safeStorage.write(SHARE_KEY,null); byId("recipientView").hidden=true; byId("shareStatus").textContent="Demo access revoked on this device. Nothing was ever transmitted."; }
function simulateSmsResponse() { const text=byId("smsInput").value.trim(); if(!text){byId("smsReply").textContent="Enter a sample SMS first. Demo only; nothing is sent.";return;}const analysis=analyzeCase(text);const urgent=analysis.red_flags.length>0;byId("smsReply").innerHTML=`<b>DEMO SMS — not actually sent.</b><p>${urgent?"⚠️ POTENTIAL URGENT WARNING. SEEK HUMAN MEDICAL CARE NOW. CALL 999 IF LIFE-THREATENING.":"Thank you. This demo can help prepare care information and follow-up; contact a health professional if worried."}</p><p>Possible concern category: ${escapeHTML(formatIntent(analysis.intent))}. Local classifier and phrase checks only; not a diagnosis.</p><p>REPLY 1 COMMUNITY HELP · 2 CARE INFO · 3 FOLLOW-UP</p><p>CASE: ${escapeHTML(draft?.id || "SP-DEMO")}</p>`; }
function handleSmsOption(option) { if(option===1){byId("smsReply").textContent=`COMMUNITY SUPPORT REQUEST DRAFT PREPARED LOCALLY. CASE: ${draft?.id || "SP-DEMO"}. Review the consent choices before storing; nothing is transmitted.`; byId("communityHelp").scrollIntoView({behavior:"smooth"});} if(option===2){byId("smsReply").textContent="Option 2 selected. The facility list is only a sample; verify locally. For possible emergencies call 999."; document.querySelector("[aria-labelledby='facilityTitle']")?.scrollIntoView({behavior:"smooth"});} if(option===3){byId("smsReply").textContent="Option 3 selected. Set a local follow-up date below; no reminder or SMS will be sent."; byId("followupCard").hidden=false;byId("followupCard").scrollIntoView({behavior:"smooth"});} }
function updateNetworkStatus() { const badge=byId("networkBadge"); if(!badge)return; badge.textContent=navigator.onLine?"● Online — local-first":"● Offline — local functions available"; badge.style.background=navigator.onLine?"#ffffff12":"#8a5b15"; if(navigator.onLine&&byId("syncButton"))byId("syncButton").disabled=false; if(byId("connectionStatus"))byId("connectionStatus").textContent=navigator.onLine?"Connection available. Sync is still only a local demo; no database is connected.":"Offline — local screening, records, notes, and SMS preparation remain available."; renderQueue(); }
function renderFollowups() {
  const root=byId("followupList"); if(!root)return;
  const records=safeStorage.read("shustho_poth_cases",[]); const rows=(Array.isArray(records)?records:[]).filter(item=>item.follow_up);
  root.innerHTML=rows.length?rows.map(record=>`<article class="queue-row"><div><b>${escapeHTML(record.follow_up.type || "Follow-up")}</b><p>${escapeHTML(record.follow_up.note || "No note")}</p><small>${escapeHTML(record.follow_up.status || "Pending")} · ${escapeHTML(record.id)}</small></div><div><time>${escapeHTML(formatDate(record.follow_up.due_at))}</time><p><button type="button" class="button-small" data-complete-followup="${escapeHTML(record.id)}">Mark completed</button> <button type="button" class="button-small" data-reschedule-followup="${escapeHTML(record.id)}">Reschedule</button> <button type="button" class="button-small" data-note-followup="${escapeHTML(record.id)}">Add note</button></p></div></article>`).join(""):`<p class="muted">No saved follow-ups on this device.</p>`;
  root.querySelectorAll("[data-complete-followup]").forEach(button=>button.addEventListener("click",()=>updateFollowup(button.dataset.completeFollowup,{status:"Completed"})));
  root.querySelectorAll("[data-reschedule-followup]").forEach(button=>button.addEventListener("click",()=>{const date=window.prompt("Enter a new date and time in ISO format (YYYY-MM-DDTHH:mm):");if(date&&!Number.isNaN(new Date(date).getTime()))updateFollowup(button.dataset.rescheduleFollowup,{due_at:new Date(date).toISOString(),status:"Pending"});}));
  root.querySelectorAll("[data-note-followup]").forEach(button=>button.addEventListener("click",()=>{const note=window.prompt("Add a note for yourself:");if(note!==null)updateFollowup(button.dataset.noteFollowup,{note});}));
}
function updateFollowup(id,changes) { const records=safeStorage.read("shustho_poth_cases",[]);const record=(Array.isArray(records)?records:[]).find(item=>item.id===id);if(!record)return;record.follow_up={...record.follow_up,...changes};record.updated_at=new Date().toISOString();safeStorage.write("shustho_poth_cases",records);if(draft?.id===id)draft=record;byId("followupStatus").textContent=`Follow-up updated: ${record.follow_up.status || "Pending"}. Saved locally; no reminder was sent.`;renderFollowups();renderQueue(); }
function renderFacilities() {
  const chosenDistrict = byId("districtFilter").value;
  const visible = chosenDistrict === "all" ? facilities : facilities.filter(f => f.district === chosenDistrict);
  byId("facilityCards").innerHTML = visible.map(f => `<article class="facility-card"><h3>${escapeHTML(f.name)}</h3><p class="bangla-name">${escapeHTML(f.name_bn || "")}</p><p>${escapeHTML(f.type)} · ${escapeHTML(f.district)}, ${escapeHTML(f.upazila)}</p><p class="muted">ID ${escapeHTML(f.facility_id)} · Prototype facility data · Verify locally</p><button type="button" class="button-small" onclick="chooseFacility('${escapeHTML(f.facility_id)}')">Select for this case</button></article>`).join("") || `<p>No sample records for this district.</p>`;
  const select=byId("facilitySelect"), prior=select.value;
  select.innerHTML=`<option value="">Choose a sample facility (verify locally)</option>`+facilities.map(f=>`<option value="${escapeHTML(f.facility_id)}">${escapeHTML(f.name)} · ${escapeHTML(f.district)} (${escapeHTML(f.upazila)})</option>`).join("");
  select.value=prior;
  select.onchange=()=>{if(draft){draft.facility_id=select.value;updatePlanSummary();refreshSms();}else{const f=facilities.find(row=>row.facility_id===select.value);byId("selectedFacilitySummary").textContent=f?`${f.name} · ${f.type} · ${f.district}, ${f.upazila}. Demo/sample record; independently verify services, hours, and suitability.`:"No facility selected.";}};
}
function chooseFacility(id) { byId("facilitySelect").value=id; if (!draft) { byId("facilityHint").textContent = "Sample facility selected for discussion. Analyze a case to attach it to your local note."; byId("facilitySelect").dispatchEvent(new Event("change")); return; } draft.facility_id = id; updatePlanSummary(); byId("facilityHint").textContent = "Facility selected for this draft. Independently verify locally that it is appropriate and available."; }
function renderIndicators(data) {
  const output = byId("whoIndicators");
  output.innerHTML = data.indicators.map(indicator => {
    const years = indicator.observations.map(row => row.year).filter(Number.isFinite);
    const year = Math.max(...years), latest = indicator.observations.filter(row => row.year === year);
    const total = latest.filter(row => row.sex === "Total");
    const useRows = total.length === 1 ? total : latest;
    const values = useRows.length === 1 ? useRows.map(row => {
      const key = Object.keys(row).find(k => /^rate_per_.*_n$/.test(k));
      const lo = key && row[key.replace(/_n$/, "_nl")], hi = key && row[key.replace(/_n$/, "_nu")];
      return `${row[key] ?? "Not reported"}${row.sex && row.sex !== "Total" ? ` (${row.sex})` : ""}${lo != null && hi != null ? ` [${lo}–${hi}]` : ""}`;
    }).join("") : `${useRows.length} source rows (see dataset)`;
    const codes = Array.isArray(indicator.indicator_codes) ? indicator.indicator_codes.join(" · ") : (indicator.indicator_code || indicator.indicator_id);
    return `<article class="metric"><p class="eyebrow">${escapeHTML(codes)}</p><h3>${escapeHTML(indicator.indicator)}</h3><p class="metric-value">${escapeHTML(String(year))} · ${escapeHTML(values)}</p><p class="muted">${escapeHTML(indicator.unit)}</p></article>`;
  }).join("");
  const observationCount = data.source_observation_count ?? data.indicators.reduce((n, item) => n + item.observations.length, 0);
  byId("whoStatus").textContent = `${data.indicator_count || data.indicators.length} WHO indicators and ${observationCount} Bangladesh source observations are bundled locally (years ${data.source_year_start || Math.min(...data.indicators.flatMap(item => item.observations.map(row => row.year)))}–${data.source_year_end || Math.max(...data.indicators.flatMap(item => item.observations.map(row => row.year)))}). Cards show each indicator’s latest packaged year; the full source rows are preserved in the downloadable JSON. No WHO API is used.`;
}
function loadLocalResources() {
  if (!["http:","https:"].includes(location.protocol)) {
    renderFacilities();
    if (!window.SHU_WHO_SUMMARY) byId("whoStatus").textContent = "WHO indicator JSON is bundled locally. Core screening and case workflow work offline.";
    return;
  }
  fetch("./facilities_dghs_sample.json").then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => { if (Array.isArray(data.records)) facilities = data.records; renderFacilities(); if (draft) renderAccess(); }).catch(() => renderFacilities());
  fetch("./data/who_bangladesh_health_priorities.json").then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(renderIndicators).catch(() => { if (!window.SHU_WHO_SUMMARY) byId("whoStatus").textContent = "WHO context file is bundled locally; the classifier and workflow work without it."; });
}
document.addEventListener("DOMContentLoaded", () => {
  makeDemoButtons(); renderFacilities(); renderQueue(); renderHealthRecord(); renderShareStatus(); renderFollowups(); updateNetworkStatus();
  if (window.SHU_WHO_SUMMARY) renderIndicators(window.SHU_WHO_SUMMARY);
  loadLocalResources();
  byId("districtFilter").addEventListener("change", renderFacilities);
  byId("runButton").addEventListener("click", runAI);
  byId("saveCaseButton").addEventListener("click", saveCase);
  byId("prepareReferralButton").addEventListener("click",()=>{if(!draft){byId("saveStatus").textContent="Analyze your words first to prepare a case-specific note. No referral was sent.";byId("screen").scrollIntoView({behavior:"smooth"});return;}byId("smsCard").hidden=false;byId("smsCard").scrollIntoView({behavior:"smooth"});refreshSms();});
  byId("paymentButton").addEventListener("click", simulateContribution);
  byId("planButton").addEventListener("click", calculatePlan);
  byId("followupButton").addEventListener("click", saveFollowup);
  byId("smsCopyButton").addEventListener("click", copySms);
  byId("connectionButton").addEventListener("click", simulateConnection);
  byId("syncButton").addEventListener("click", simulateSync);
  byId("clearDataButton").addEventListener("click", clearLocalData);
  byId("saveRecordItemButton").addEventListener("click", saveRecordForm);
  byId("cancelRecordEditButton").addEventListener("click", clearRecordForm);
  byId("hideRecordButton").addEventListener("click",()=>{recordHidden=!recordHidden;renderHealthRecord();});
  byId("requestCommunityButton").addEventListener("click",requestCommunityHelp);
  byId("continueCommunityButton").addEventListener("click",continueWithoutCommunity);
  byId("generateAccessButton").addEventListener("click",generateAccessCode);
  byId("revokeAccessButton").addEventListener("click",revokeAccess);
  byId("simulateSmsButton").addEventListener("click",simulateSmsResponse);
  byId("smsOptionHelp").addEventListener("click",()=>handleSmsOption(1));
  byId("smsOptionCare").addEventListener("click",()=>handleSmsOption(2));
  byId("smsOptionFollowup").addEventListener("click",()=>handleSmsOption(3));
  byId("recordType").addEventListener("change",()=>{const type=byId("recordType").value;byId("recordItem").placeholder=type==="allergies"?"Allergen":"Condition, medicine, visit, test, referral, or follow-up";});
  document.querySelectorAll("[name='affordChoice']").forEach(choice=>choice.addEventListener("change",()=>{const mapping={cost:"financial_cost",transport:"transport_cost"};if(mapping[choice.value])document.querySelector(`[name='barrier'][value='${mapping[choice.value]}']`).checked=true;if(choice.value==="payment")byId("financial").scrollIntoView({behavior:"smooth"});if(choice.value==="community")byId("communityHelp").scrollIntoView({behavior:"smooth"});if(draft){draft.affordability_response=choice.value;persistDraft("Your access choice was saved locally.");}updatePlanSummary();}));
  ["decisionRefer","decisionFollow","decisionMore","decisionProtocol"].forEach(id => byId(id).addEventListener("click", event => recordDecision(event.currentTarget.dataset.decision)));
  document.querySelectorAll("[data-support]").forEach(button => button.addEventListener("click", () => setSupport(button.dataset.support, button.textContent.trim())));
  document.querySelectorAll("[name='barrier']").forEach(input => input.addEventListener("change", updatePlanSummary));
  document.querySelectorAll("[data-followup-hours]").forEach(button => button.addEventListener("click", () => selectFollowup(Number(button.dataset.followupHours))));
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("./service-worker.js", { scope:"./" }).catch(() => {});
  window.addEventListener("online",updateNetworkStatus); window.addEventListener("offline",updateNetworkStatus);
});
