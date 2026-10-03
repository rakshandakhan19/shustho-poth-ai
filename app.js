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
  if (latestAnalysis.concerns.includes("fever") && !byId("caseTemperature").value.trim()) missing.push("temperature, if measured");
  if (latestAnalysis.concerns.includes("breathing_difficulty") && !byId("caseRespRate").value.trim()) missing.push("respiratory rate if measured");
  if ((latestAnalysis.concerns.includes("diarrhea_vomiting") || latestAnalysis.concerns.includes("dehydration")) && !byId("ableToDrink").value) missing.push("ability to drink");
  if ((latestAnalysis.concerns.includes("diarrhea_vomiting") || latestAnalysis.concerns.includes("dehydration")) && !byId("urination").value) missing.push("urination");
  if (latestAnalysis.concerns.includes("maternal_pregnancy") && !byId("pregnancyWeeks").value.trim()) missing.push("pregnancy duration, if known");
  if (latestAnalysis.concerns.includes("maternal_pregnancy") && !byId("maternalSymptoms").value) missing.push("bleeding/labour symptoms");
  byId("missingPreview").textContent = missing.length ? `Still to ask / record: ${missing.join(", ")}.` : "The key suggested fields are recorded. Confirm them with the patient.";
}
function runAI() {
  const text = byId("input").value.trim();
  if (!text) { byId("inputError").textContent = "Enter the patient’s words or load a synthetic example first."; byId("input").focus(); return; }
  byId("inputError").textContent = "";
  latestAnalysis = analyzeCase(text);
  byId("humanDecisionStatus").textContent = "No worker decision recorded yet. AI does not choose the action.";
  byId("followupStatus").textContent = "No follow-up scheduled.";
  byId("supportStatus").textContent = "Illustrative prototype pathway — availability and eligibility must be verified locally.";
  byId("paymentStatus").textContent = "No payment has been made.";
  byId("planResult").textContent = "No calculation yet.";
  draft = { id:caseId(), text, analysis:latestAnalysis, patient:{age:latestAnalysis.fields.age || "", sex:"", duration:latestAnalysis.fields.duration || "", temperature:latestAnalysis.fields.temperature || "", respiratory_rate:latestAnalysis.fields.respiratory_rate || "", able_to_drink:latestAnalysis.fields.able_to_drink || "", urination:latestAnalysis.fields.urination || "", pregnancy_weeks:latestAnalysis.fields.pregnancy_weeks || "", bleeding_or_labour_symptoms:latestAnalysis.fields.bleeding_or_labour_symptoms || "", reported_concerns:latestAnalysis.concerns.map(formatIntent).join(", ")}, worker_decision:"", facility_id:"", barriers:latestAnalysis.barriers.map(key => ({financial:"financial_cost",travel:"facility_distance",connectivity:"connectivity",continuity:"continuity",navigation:"navigation"}[key] || key)).filter(x => ["financial_cost","transport_cost","facility_distance","no_transport","connectivity","shared_phone","continuity","navigation"].includes(x)), support_pathways:[], payment_demo:null, follow_up:null, created_at:new Date().toISOString(), status:"pending_offline" };
  renderResult();
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
  const urgency = flags.length ? `<div class="alert alert-danger"><strong>Human health worker review needed</strong><p>Potential warning sign from reported words. Confirm immediately and follow local clinical protocol. Access or payment support must not delay the worker’s clinical assessment.</p>${flags.map(flag => `<p><b>${escapeHTML(flag.label)}:</b> ${escapeHTML(flag.reason)}</p>`).join("")}</div>` : `<div class="alert"><strong>Screening support only.</strong> No rule-based warning phrase was recognized. This does not rule out risk; the worker must still review.</div>`;
  const displayConcerns = analysis.direct_matches.length ? analysis.direct_matches : [analysis.model_intent];
  const concerns = displayConcerns.map(intent => `<span class="tag">${escapeHTML(formatIntent(intent))}</span>`).join(" ");
  byId("results").innerHTML = `
    <div class="section-heading"><div><span class="eyebrow">STEP 2 · CASE SUMMARY</span><h2>Reported information</h2></div><span class="case-id">${escapeHTML(draft.id)}</span></div>
    <p class="safety-label">AI screening support · Not a diagnosis · Human decision required</p>
    <div class="result-grid"><div><h3>Possible presentation categories</h3><div>${concerns}</div><p class="muted">${analysis.direct_matches.length ? "Matched phrase cues" : "Model-only suggestion — no phrase cue matched; confirm the concern"}. These describe reported words, not a disease. Match score: <b>${Math.round(analysis.confidence * 100)}%</b> (uncalibrated model score, not a probability of illness).</p><p class="muted">Naive Bayes top class: ${escapeHTML(formatIntent(analysis.model_intent))}${analysis.model_intent !== analysis.intent ? " · differs from the selected worker-review category; check carefully" : ""}</p></div>
      <div>${urgency}</div></div>
    <div class="form-grid">
      <label>Age, if shared<input id="caseAge" value="${escapeHTML(draft.patient.age)}" placeholder="e.g., 4 years"></label>
      <label>Sex, if relevant and shared<select id="caseSex"><option value="">Not recorded</option><option>Female</option><option>Male</option><option>Another / not stated</option></select></label>
      <label>Symptom duration<input id="caseDuration" value="${escapeHTML(draft.patient.duration)}" placeholder="e.g., 3 days"></label>
      <label>Temperature, if measured<input id="caseTemperature" inputmode="decimal" placeholder="°C" value="${escapeHTML(draft.patient.temperature)}"></label>
      <label>Respiratory rate, if measured<input id="caseRespRate" inputmode="numeric" placeholder="breaths/min" value="${escapeHTML(draft.patient.respiratory_rate)}"></label>
      <label>Can the patient drink?<select id="ableToDrink"><option value="">Not asked</option><option value="No / difficulty reported">No / difficulty reported</option><option value="Yes, reported">Yes, reported</option></select></label>
      <label>Urination / প্রস্রাব<select id="urination"><option value="">Not asked</option><option value="Usual, reported">Usual, reported</option><option value="Reduced / none reported">Reduced / none reported</option></select></label>
      <label>Pregnancy duration, if relevant<input id="pregnancyWeeks" inputmode="numeric" placeholder="weeks, if known" value="${escapeHTML(draft.patient.pregnancy_weeks)}"></label>
      <label>Bleeding / labour symptoms<select id="maternalSymptoms"><option value="">Not asked</option><option value="Reported — worker to clarify">Reported — clarify with worker</option><option value="Not reported">Not reported</option></select></label>
      <label class="wide">Reported concerns — worker may edit<textarea id="caseConcerns" rows="2">${escapeHTML(draft.patient.reported_concerns)}</textarea></label>
    </div>
    <p id="missingPreview" class="alert alert-warn" aria-live="polite"></p>
    <details><summary>Original conversation</summary><p class="quoted-text">${escapeHTML(draft.text)}</p></details>
    <p class="muted">Synthetic example or de-identified wording only. Avoid names, phone numbers, NID, or other unnecessary identifiers.</p>`;
  byId("caseSex").value = draft.patient.sex;
  byId("ableToDrink").value = draft.patient.able_to_drink;
  byId("urination").value = draft.patient.urination;
  byId("maternalSymptoms").value = draft.patient.bleeding_or_labour_symptoms;
  ["caseAge","caseSex","caseDuration","caseTemperature","caseRespRate","ableToDrink","urination","pregnancyWeeks","maternalSymptoms","caseConcerns"].forEach(id => { byId(id).addEventListener("input", updateMissingPreview); byId(id).addEventListener("change", updateMissingPreview); });
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
  byId("accessSummary").textContent = `Reach: ${barriers.some(x => ["facility_distance","no_transport"].includes(x)) ? "barrier recorded" : "worker to confirm"} · Afford: ${barriers.some(x => ["financial_cost","transport_cost"].includes(x)) ? "barrier recorded" : "worker to confirm"} · Connect: ${barriers.some(x => ["connectivity","shared_phone"].includes(x)) ? "barrier recorded" : "worker to confirm"} · Return: ${barriers.includes("continuity") ? "barrier recorded" : "worker to confirm"}.`;
  byId("selectedFacilitySummary").textContent = facility ? `${facility.name} (${facility.name_bn}) · ${facility.district}, ${facility.upazila} · sample registry record; verify services, opening and capacity locally.` : "No facility selected. The worker chooses and verifies a suitable service.";
  refreshSms();
}
function recordDecision(decision) {
  if (!draft) return;
  draft.worker_decision = decision;
  byId("humanDecisionStatus").textContent = `Worker recorded: ${decision}. This is the health worker’s decision, not an AI recommendation.`;
  draft.status = decision === "Refer" ? "referral_pending" : decision === "Follow up" ? "followup_pending" : "worker_reviewed";
  persistDraft("Human decision saved locally.");
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
  if (!draft) { byId("followupStatus").textContent = "Screen a case first to create a local follow-up record."; return; }
  const value = byId("followupDate").value;
  if (!value) { byId("followupStatus").textContent = "Choose a follow-up date and time."; return; }
  draft.follow_up = { due_at:new Date(value).toISOString(), type:byId("followupType").value };
  draft.status = "followup_pending";
  byId("followupStatus").textContent = `${draft.follow_up.type} recorded for ${formatDate(draft.follow_up.due_at)}. Saved on this device; no reminder will be sent automatically.`;
  persistDraft("Follow-up saved locally.");
  refreshSms();
}
function refreshSms() {
  if (!draft || !byId("smsMessage")) return;
  const facility = selectedFacility();
  const red = draft.analysis.red_flags.length > 0;
  const smsLabels = { breathing_difficulty:"BREATHING CONCERN", neurological_red_flag:"NEURO WARNING", seizure:"SEIZURE REPORTED", chest_cardiac_warning:"CHEST CONCERN", dehydration:"HYDRATION CONCERN", diarrhea_vomiting:"DIARRHOEA/VOMITING", maternal_pregnancy:"MATERNAL CONCERN", injury_trauma:"INJURY REPORTED" };
  const concern = smsLabels[draft.analysis.intent] || "WORKER REVIEW";
  const due = draft.follow_up?.due_at ? new Date(draft.follow_up.due_at).toLocaleDateString() : "Worker to arrange";
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
      respiratory_rate:byId("caseRespRate")?.value.trim() || "", able_to_drink:byId("ableToDrink")?.value || "", urination:byId("urination")?.value || "",
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
  return true;
}
function saveCase() { if (!draft) return; persistDraft(); }
function renderQueue() {
  const records = safeStorage.read("shustho_poth_cases", []);
  const list = Array.isArray(records) ? records : [];
  byId("queueCount").textContent = `${list.length} locally stored case${list.length === 1 ? "" : "s"}`;
  byId("queueList").innerHTML = list.length ? list.map(record => `<article class="queue-row"><div><b>${escapeHTML(record.id)}</b><p>${escapeHTML(record.analysis?.concerns?.map(formatIntent).join(", ") || "Case record")}</p><small>${escapeHTML(record.worker_decision || "Worker decision pending")} · ${escapeHTML(record.status || "pending_offline")}</small></div><time>${escapeHTML(formatDate(record.created_at || record.saved_at))}</time></article>`).join("") : `<p class="muted">No cases saved on this device.</p>`;
}
function simulateConnection() { simulatedConnection = true; byId("connectionStatus").textContent = "Connection restored (simulation only). Your data remains local."; byId("syncButton").disabled = false; }
function simulateSync() {
  if (!simulatedConnection) { byId("syncStatus").textContent = "Simulate a connection first. No data has left this device."; return; }
  const records = safeStorage.read("shustho_poth_cases", []);
  const list = Array.isArray(records) ? records : [];
  list.forEach(record => { record.sync_status = "simulated_complete"; });
  safeStorage.write("shustho_poth_cases", list);
  byId("syncStatus").textContent = `${list.length} case${list.length === 1 ? "" : "s"} marked synced in this local simulation. No network request or transmission occurred.`;
  renderQueue();
}
function clearLocalData() {
  if (!window.confirm("Clear all locally stored Shustho Poth AI case records from this browser? This cannot be undone.")) return;
  try { localStorage.removeItem("shustho_poth_cases"); localStorage.removeItem("shustho_poth_last_case"); } catch {}
  draft = null; latestAnalysis = null; byId("queueStatus").textContent = "Local case data cleared from this browser."; renderQueue();
}
function renderFacilities() {
  const chosenDistrict = byId("districtFilter").value;
  const visible = chosenDistrict === "all" ? facilities : facilities.filter(f => f.district === chosenDistrict);
  byId("facilityCards").innerHTML = visible.map(f => `<article class="facility-card"><h3>${escapeHTML(f.name)}</h3><p class="bangla-name">${escapeHTML(f.name_bn || "")}</p><p>${escapeHTML(f.type)} · ${escapeHTML(f.district)}, ${escapeHTML(f.upazila)}</p><p class="muted">ID ${escapeHTML(f.facility_id)} · Prototype facility data · Verify locally</p><button type="button" class="button-small" onclick="chooseFacility('${escapeHTML(f.facility_id)}')">Select for this case</button></article>`).join("") || `<p>No sample records for this district.</p>`;
}
function chooseFacility(id) { if (!draft) { byId("facilityHint").textContent = "Screen or load a demo case before selecting a facility."; return; } draft.facility_id = id; byId("facilitySelect").value = id; updatePlanSummary(); byId("facilityHint").textContent = "Facility selected for this draft. Confirm locally that the service is appropriate and available."; }
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
  makeDemoButtons(); renderFacilities(); renderQueue();
  if (window.SHU_WHO_SUMMARY) renderIndicators(window.SHU_WHO_SUMMARY);
  loadLocalResources();
  byId("districtFilter").addEventListener("change", renderFacilities);
  byId("runButton").addEventListener("click", runAI);
  byId("saveCaseButton").addEventListener("click", saveCase);
  byId("paymentButton").addEventListener("click", simulateContribution);
  byId("planButton").addEventListener("click", calculatePlan);
  byId("followupButton").addEventListener("click", saveFollowup);
  byId("smsCopyButton").addEventListener("click", copySms);
  byId("connectionButton").addEventListener("click", simulateConnection);
  byId("syncButton").addEventListener("click", simulateSync);
  byId("clearDataButton").addEventListener("click", clearLocalData);
  ["decisionRefer","decisionFollow","decisionMore","decisionProtocol"].forEach(id => byId(id).addEventListener("click", event => recordDecision(event.currentTarget.dataset.decision)));
  document.querySelectorAll("[data-support]").forEach(button => button.addEventListener("click", () => setSupport(button.dataset.support, button.textContent.trim())));
  document.querySelectorAll("[name='barrier']").forEach(input => input.addEventListener("change", updatePlanSummary));
  document.querySelectorAll("[data-followup-hours]").forEach(button => button.addEventListener("click", () => selectFollowup(Number(button.dataset.followupHours))));
  if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("./service-worker.js", { scope:"./" }).catch(() => {});
});
