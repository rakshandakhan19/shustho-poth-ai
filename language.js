(function () {
  "use strict";

  const translations = {
    en: {
      tagline: "From local words to the next safe step.",
      journey: [
        "Tell", "Check", "Act", "Reach", "Afford", "Share", "Follow-up"
      ],
      healthHelp: "Health Help",
      record: "My Record",
      reach: "Reach Care",
      community: "Community Help",
      follow: "Follow-up",
      sms: "SMS / Offline",

      heroEyebrow: "Your health journey · Bangladesh",
      heroTitle:
        "Shustho Poth AI turns local words into the next safe and practical step toward care.",
      heroText:
        "Describe what is happening in your own Bangla or Banglish. This prototype can help surface possible warning signs and practical next steps toward human care, including cost, transport, and connectivity barriers.",

      helpButton: "🚨 I need health help",
      recordButton: "📋 My health record",
      careButton: "🤝 Help me reach care",
      offlineButton: "📶 Offline / SMS",

      nextSteps: "Your next steps",

      screenTitle: "I need health help",
      screenDescription:
        "What is happening to you or someone in your household? You can type in Bangla, Banglish, or a mix of Bangla and English.",
      words: "Your words",

      voiceTitle:
        "How would you like to tell us what is happening?",
      type: "⌨️ Type",
      speak: "🎙️ Speak",
      recordVoice: "🎙️ Record voice",
      stop: "Stop",
      typeInstead: "⌨️ Type instead",

      structure: "Structure this case →",
      demo: "Synthetic demo cases",

      communityTitle: "🤝 Get Community Help",
      communityQuestion:
        "Would you like help from a participating community health worker?",

      recordTitle: "📋 My Health Record",
      shareTitle: "Share My Health Record",

      smsTitle: "📱 SMS Mode",

      careTitle: "Help me reach care",
      financialTitle: "💰 Can you afford care?",
      findCare: "📍 Find care near me",

      responsibleTitle: "Responsible AI and shared-device privacy",

      bangla: "বাংলা",
      banglish: "Banglish",
      english: "English"
    },

    bn: {
      tagline: "স্থানীয় কথা থেকে নিরাপদ পরবর্তী পদক্ষেপ।",
      journey: [
        "বলুন", "যাচাই করুন", "পদক্ষেপ নিন",
        "পৌঁছান", "খরচ দেখুন", "শেয়ার করুন", "ফলো-আপ"
      ],
      healthHelp: "স্বাস্থ্য সহায়তা",
      record: "আমার রেকর্ড",
      reach: "চিকিৎসাসেবায় পৌঁছান",
      community: "কমিউনিটি সহায়তা",
      follow: "ফলো-আপ",
      sms: "SMS / অফলাইন",

      heroEyebrow: "আপনার স্বাস্থ্যযাত্রা · বাংলাদেশ",
      heroTitle:
        "Shustho Poth AI স্থানীয় কথাকে স্বাস্থ্যসেবার জন্য নিরাপদ ও বাস্তবসম্মত পরবর্তী পদক্ষেপে রূপ দিতে সাহায্য করে।",
      heroText:
        "আপনার নিজের বাংলা ভাষায় কী হচ্ছে তা বলুন। এই প্রোটোটাইপ সম্ভাব্য সতর্কতার লক্ষণ এবং মানবিক স্বাস্থ্যসেবায় পৌঁছানোর পরবর্তী পদক্ষেপ বুঝতে সাহায্য করতে পারে।",

      helpButton: "🚨 স্বাস্থ্য সহায়তা চাই",
      recordButton: "📋 আমার স্বাস্থ্য রেকর্ড",
      careButton: "🤝 চিকিৎসাসেবায় পৌঁছাতে সাহায্য চাই",
      offlineButton: "📶 অফলাইন / SMS",

      nextSteps: "আপনার পরবর্তী পদক্ষেপ",

      screenTitle: "স্বাস্থ্য সহায়তা চাই",
      screenDescription:
        "আপনার বা পরিবারের কারও কী হচ্ছে? বাংলা, Banglish অথবা বাংলা ও ইংরেজি মিশিয়ে লিখতে পারেন।",
      words: "আপনার কথা",

      voiceTitle:
        "কীভাবে আপনার সমস্যাটি জানাতে চান?",
      type: "⌨️ লিখুন",
      speak: "🎙️ বলুন",
      recordVoice: "🎙️ কথা রেকর্ড করুন",
      stop: "থামুন",
      typeInstead: "⌨️ লিখুন",

      structure: "কেস সাজান →",
      demo: "সিনথেটিক ডেমো কেস",

      communityTitle: "🤝 কমিউনিটি সহায়তা নিন",
      communityQuestion:
        "আপনি কি একজন কমিউনিটি স্বাস্থ্যকর্মীর কাছ থেকে সাহায্য চান?",

      recordTitle: "📋 আমার স্বাস্থ্য রেকর্ড",
      shareTitle: "আমার স্বাস্থ্য রেকর্ড শেয়ার করুন",

      smsTitle: "📱 SMS মোড",

      careTitle: "চিকিৎসাসেবায় পৌঁছাতে সাহায্য",
      financialTitle: "💰 চিকিৎসার খরচ বহন করতে পারবেন?",
      findCare: "📍 কাছাকাছি চিকিৎসাসেবা খুঁজুন",

      responsibleTitle:
        "দায়িত্বশীল AI ও শেয়ার্ড-ডিভাইস গোপনীয়তা",

      bangla: "বাংলা",
      banglish: "Banglish",
      english: "English"
    },

    banglish: {
      tagline: "Local kotha theke safe next step.",
      journey: [
        "Bolun", "Check korun", "Step nin",
        "Pouchan", "Khoroch dekhen", "Share korun", "Follow-up"
      ],
      healthHelp: "Health Help",
      record: "Amar Record",
      reach: "Care-e Pouchan",
      community: "Community Help",
      follow: "Follow-up",
      sms: "SMS / Offline",

      heroEyebrow: "Apnar health journey · Bangladesh",
      heroTitle:
        "Shustho Poth AI local kotha ke care-er jonno safe ebong practical next step-e niye jay.",
      heroText:
        "Apnar nijer Bangla ba Banglish-e ki hocche bolun. Ei prototype possible warning sign ebong human care-e jawar practical next step bujhte help kore.",

      helpButton: "🚨 Health help chai",
      recordButton: "📋 Amar health record",
      careButton: "🤝 Care-e pouchate help chai",
      offlineButton: "📶 Offline / SMS",

      nextSteps: "Apnar next steps",

      screenTitle: "Health help chai",
      screenDescription:
        "Apnar ba family-r karo ki hocche? Bangla, Banglish, ba Bangla-English mix kore likhte paren.",
      words: "Apnar kotha",

      voiceTitle:
        "Ki vabe ki hocche amader bolte chan?",
      type: "⌨️ Type",
      speak: "🎙️ Speak",
      recordVoice: "🎙️ Voice record korun",
      stop: "Stop",
      typeInstead: "⌨️ Type korun",

      structure: "Case sajun →",
      demo: "Synthetic demo cases",

      communityTitle: "🤝 Community Help nin",
      communityQuestion:
        "Apni ki ekjon community health worker-er help chan?",

      recordTitle: "📋 Amar Health Record",
      shareTitle: "Amar Health Record Share korun",

      smsTitle: "📱 SMS Mode",

      careTitle: "Care-e pouchate help",
      financialTitle: "💰 Care-er khoroch afford korte parben?",
      findCare: "📍 Kacher care khujun",

      responsibleTitle:
        "Responsible AI ebong shared-device privacy",

      bangla: "বাংলা",
      banglish: "Banglish",
      english: "English"
    }
  };

  function text(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) el.textContent = value;
  }

  function applyLanguage(lang) {
    const t = translations[lang] || translations.en;

    document.documentElement.lang = lang === "bn" ? "bn" : "en";

    // Header
    text(".tagline", t.tagline);

    // Navigation
    text('.nav a[href="#screen"]', t.healthHelp);
    text('.nav a[href="#healthRecord"]', t.record);
    text('.nav a[href="#carePath"]', t.reach);
    text('.nav a[href="#communityHelp"]', t.community);
    text('.nav a[href="#followupCard"]', t.follow);
    text('.nav a[href="#smsMode"]', t.sms);

    // Hero
    text(".hero-main .eyebrow", t.heroEyebrow);
    text(".hero-main h2", t.heroTitle);
    text(".hero-main .subhead", t.heroText);

    const heroButtons = document.querySelectorAll(".hero-main a");
    if (heroButtons.length >= 4) {
      heroButtons[0].textContent = t.helpButton;
      heroButtons[1].textContent = t.recordButton;
      heroButtons[2].textContent = t.careButton;
      heroButtons[3].textContent = t.offlineButton;
    }

    // Journey
    const journey = document.querySelectorAll(".journey span");
    journey.forEach((el, i) => {
      if (t.journey[i]) {
        const number = i + 1;
        el.innerHTML = "<b>" + number + "</b> " + t.journey[i];
      }
    });

    // Main screening
    text("#screenTitle", t.screenTitle);
    text("#screen .subhead", t.screenDescription);
    text('label[for="input"]', t.words);

    // Voice
    text("#voiceTitle", t.voiceTitle);
    text("#voiceTypeModeButton", t.type);
    text("#voiceSpeakModeButton", t.speak);
    text("#recordVoiceButton", t.recordVoice);
    text("#stopVoiceButton", t.stop);
    text("#typeInsteadButton", t.typeInstead);

    // Main action
    text("#runButton", t.structure);

    // Community
    text("#communityTitle", t.communityTitle);
    text("#communityHelp .section-heading p", t.communityQuestion);

    // Record/share
    text("#healthRecord h2", t.recordTitle);
    text("#shareRecord h2", t.shareTitle);

    // SMS
    text("#smsMode h2", t.smsTitle);

    // Care
    text("#carePath h2", t.careTitle);
    text("#findNearbyButton", t.findCare);

    // Financial
    text("#financial h2", t.financialTitle);

    // Responsible AI
    text("#responsible h2", t.responsibleTitle);

    try {
      localStorage.setItem("shusthoPothLanguage", lang);
    } catch (e) {}

    const selector = document.getElementById("languageSelector");
    if (selector) selector.value = lang;
  }

  function init() {
    const selector = document.getElementById("languageSelector");
    if (!selector) return;

    let saved = "en";

    try {
      saved = localStorage.getItem("shusthoPothLanguage") || "en";
    } catch (e) {}

    selector.value = saved;

    selector.addEventListener("change", function () {
      applyLanguage(this.value);
    });

    applyLanguage(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
