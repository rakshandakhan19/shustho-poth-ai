/* =========================================================
   Shustho Poth AI
   Simple interface language switcher
   English / বাংলা / Banglish
   ========================================================= */

(function () {
  "use strict";

  const translations = {
    en: {
      tagline: "From local words to the next safe step.",

      heroEyebrow: "Your health journey · Bangladesh",
      heroTitle:
        "Shustho Poth AI turns local words into the next safe and practical step toward care.",
      heroText:
        "Describe what is happening in your own Bangla or Banglish. This prototype can help surface possible warning signs and practical next steps toward human care, including cost, transport, and connectivity barriers.",

      tell: "Tell",
      check: "Check",
      act: "Act",
      reach: "Reach",
      afford: "Afford",
      share: "Share",
      follow: "Follow up",

      healthHelp: "Health Help",
      healthRecord: "My Record",
      reachCare: "Reach Care",
      communityHelp: "Community Help",
      followUp: "Follow-up",
      smsOffline: "SMS / Offline",
      privacy: "Privacy",

      needHealthHelp: "🚨 I need health help",
      myHealthRecord: "📋 My health record",
      reachCareButton: "🤝 Help me reach care",
      offlineButton: "📶 Offline / SMS",

      nextSteps: "Your next steps",
      step1: "Tell us in your own words",
      step2: "Check possible warning signs",
      step3: "Choose a safe next step with human care",
      step4: "Explore ways to reach care",
      step5: "Save, share with consent, and follow up",

      tellUs: "I need health help",
      tellDescription:
        "What is happening to you or someone in your household? You can type in Bangla, Banglish, or a mix.",

      yourWords: "Your words",
      structureCase: "Structure this case →",
      tryDemo: "Try a synthetic demo",

      voiceQuestion:
        "How would you like to tell us what is happening?",
      type: "⌨️ Type",
      speak: "🎙️ Speak",
      speechLanguage: "Speech language",
      recordVoice: "🎙️ Record voice",
      stop: "Stop",
      typeInstead: "⌨️ Type instead",

      communityTitle: "🤝 Get Community Help",
      communityQuestion:
        "Would you like help from a participating community health worker?",

      careTitle: "Help me reach care",
      careDescription:
        "Think through facility, cost, transport, connectivity, and returning for follow-up.",

      financialTitle: "💰 Can you afford care?",
      financialDescription:
        "Affordability support is one small part of reaching care.",

      financingOptions: "Healthcare Financing Options",
      ngoSupport: "Community / NGO support",
      subsidizedCare: "Subsidized care",
      transportSupport: "Transport support",
      microProtection: "Illustrative micro-health protection",

      bKashTitle: "Mobile-money contribution simulation",
      simulateContribution: "Simulate contribution",

      smsTitle: "📱 SMS Mode",
      simulateSMS: "Simulate SMS response",

      followTitle: "My Follow-ups",
      saveFollowUp: "Save follow-up locally",

      offlineTitle: "Offline queue",
      connection: "Simulate connection restored",
      sync: "Sync now (demo)",

      facilityTitle: "Facility reference",
      findCare: "📍 Find care near me",

      responsibleTitle: "Responsible AI and shared-device privacy",

      demoNetwork:
        "Demo network — not a live emergency service.",

      emergency:
        "If this is severe or life-threatening, call 999 or seek emergency care immediately.",

      aiDisclaimer:
        "AI provides guidance — not a diagnosis."
    },

    bn: {
      tagline: "স্থানীয় ভাষা থেকে নিরাপদ পরবর্তী পদক্ষেপ।",

      heroEyebrow: "আপনার স্বাস্থ্যযাত্রা · বাংলাদেশ",
      heroTitle:
        "Shustho Poth AI স্থানীয় ভাষাকে স্বাস্থ্যসেবার জন্য নিরাপদ ও বাস্তবসম্মত পরবর্তী পদক্ষেপে রূপ দিতে সাহায্য করে।",
      heroText:
        "আপনার নিজের বাংলা বা সহজ ভাষায় কী হচ্ছে তা বলুন। এই প্রোটোটাইপ সম্ভাব্য সতর্কতার লক্ষণ এবং চিকিৎসাসেবায় পৌঁছানোর পরবর্তী পদক্ষেপ বুঝতে সাহায্য করতে পারে।",

      tell: "বলুন",
      check: "যাচাই করুন",
      act: "পদক্ষেপ নিন",
      reach: "পৌঁছান",
      afford: "খরচ দেখুন",
      share: "শেয়ার করুন",
      follow: "ফলো-আপ",

      healthHelp: "স্বাস্থ্য সহায়তা",
      healthRecord: "আমার রেকর্ড",
      reachCare: "চিকিৎসাসেবায় পৌঁছান",
      communityHelp: "কমিউনিটি সহায়তা",
      followUp: "ফলো-আপ",
      smsOffline: "SMS / অফলাইন",
      privacy: "গোপনীয়তা",

      needHealthHelp: "🚨 স্বাস্থ্য সহায়তা চাই",
      myHealthRecord: "📋 আমার স্বাস্থ্য রেকর্ড",
      reachCareButton: "🤝 চিকিৎসাসেবায় পৌঁছাতে সাহায্য চাই",
      offlineButton: "📶 অফলাইন / SMS",

      nextSteps: "আপনার পরবর্তী পদক্ষেপ",
      step1: "নিজের ভাষায় বলুন",
      step2: "সম্ভাব্য সতর্কতার লক্ষণ দেখুন",
      step3: "মানবিক স্বাস্থ্যসেবার মাধ্যমে নিরাপদ পদক্ষেপ নিন",
      step4: "চিকিৎসাসেবায় পৌঁছানোর উপায় দেখুন",
      step5: "সম্মতি নিয়ে সংরক্ষণ, শেয়ার ও ফলো-আপ করুন",

      tellUs: "স্বাস্থ্য সহায়তা চাই",
      tellDescription:
        "আপনার বা পরিবারের কারও কী হচ্ছে? বাংলা, Banglish অথবা দুই ভাষা মিশিয়ে লিখতে পারেন।",

      yourWords: "আপনার কথা",
      structureCase: "কেস সাজান →",
      tryDemo: "একটি ডেমো দেখুন",

      voiceQuestion:
        "কীভাবে আপনার সমস্যাটি জানাতে চান?",
      type: "⌨️ লিখুন",
      speak: "🎙️ বলুন",
      speechLanguage: "কথার ভাষা",
      recordVoice: "🎙️ কথা রেকর্ড করুন",
      stop: "থামুন",
      typeInstead: "⌨️ লিখুন",

      communityTitle: "🤝 কমিউনিটি সহায়তা নিন",
      communityQuestion:
        "আপনি কি একজন কমিউনিটি স্বাস্থ্যকর্মীর কাছ থেকে সাহায্য চান?",

      careTitle: "চিকিৎসাসেবায় পৌঁছাতে সাহায্য",
      careDescription:
        "চিকিৎসাকেন্দ্র, খরচ, যাতায়াত, ইন্টারনেট এবং ফলো-আপের বিষয়গুলো বিবেচনা করুন।",

      financialTitle: "💰 চিকিৎসার খরচ বহন করতে পারবেন?",
      financialDescription:
        "চিকিৎসাসেবায় পৌঁছানোর একটি অংশ হলো খরচের বিষয়টি বিবেচনা করা।",

      financingOptions: "চিকিৎসা খরচের সহায়তার উপায়",
      ngoSupport: "কমিউনিটি / NGO সহায়তা",
      subsidizedCare: "ভর্তুকিযুক্ত চিকিৎসা",
      transportSupport: "যাতায়াত সহায়তা",
      microProtection: "উদাহরণমূলক মাইক্রো স্বাস্থ্য সুরক্ষা",

      bKashTitle: "মোবাইল মানি অবদান সিমুলেশন",
      simulateContribution: "অবদান সিমুলেট করুন",

      smsTitle: "📱 SMS মোড",
      simulateSMS: "SMS উত্তর সিমুলেট করুন",

      followTitle: "আমার ফলো-আপ",
      saveFollowUp: "ফলো-আপ সংরক্ষণ করুন",

      offlineTitle: "অফলাইন কিউ",
      connection: "সংযোগ ফিরে এসেছে সিমুলেট করুন",
      sync: "এখন Sync করুন (ডেমো)",

      facilityTitle: "চিকিৎসাকেন্দ্রের তথ্য",
      findCare: "📍 কাছাকাছি চিকিৎসাসেবা খুঁজুন",

      responsibleTitle: "দায়িত্বশীল AI ও শেয়ার্ড-ডিভাইস গোপনীয়তা",

      demoNetwork:
        "ডেমো নেটওয়ার্ক — এটি কোনো লাইভ জরুরি সেবা নয়।",

      emergency:
        "এটি গুরুতর বা জীবন-ঝুঁকিপূর্ণ হলে এখনই ৯৯৯-এ কল করুন অথবা জরুরি চিকিৎসা নিন।",

      aiDisclaimer:
        "AI নির্দেশনা দেয় — রোগ নির্ণয় করে না।"
    },

    banglish: {
      tagline: "Local kotha theke safe next step.",

      heroEyebrow: "Apnar health journey · Bangladesh",
      heroTitle:
        "Shustho Poth AI local kotha ke care-er jonno safe ebong practical next step-e niye jay.",
      heroText:
        "Apnar nijer Bangla ba Banglish-e ki hocche bolun. Ei prototype possible warning sign ebong human care-e jawar practical next step bujhte help kore.",

      tell: "Bolun",
      check: "Check korun",
      act: "Step nin",
      reach: "Pouchan",
      afford: "Khoroch dekhen",
      share: "Share korun",
      follow: "Follow-up",

      healthHelp: "Health Help",
      healthRecord: "Amar Record",
      reachCare: "Care-e Pouchan",
      communityHelp: "Community Help",
      followUp: "Follow-up",
      smsOffline: "SMS / Offline",
      privacy: "Privacy",

      needHealthHelp: "🚨 Health help chai",
      myHealthRecord: "📋 Amar health record",
      reachCareButton: "🤝 Care-e pouchate help chai",
      offlineButton: "📶 Offline / SMS",

      nextSteps: "Apnar next steps",
      step1: "Nijer kothay bolun",
      step2: "Possible warning sign check korun",
      step3: "Human care-er sathe safe next step nin",
      step4: "Care-e jawar upay dekhen",
      step5: "Consent niye save, share ebong follow-up korun",

      tellUs: "Health help chai",
      tellDescription:
        "Apnar ba family-r karo ki hocche? Bangla, Banglish, ba mix kore likhte paren.",

      yourWords: "Apnar kotha",
      structureCase: "Case sajun →",
      tryDemo: "Synthetic demo try korun",

      voiceQuestion:
        "Ki vabe ki hocche amader bolte chan?",
      type: "⌨️ Type",
      speak: "🎙️ Speak",
      speechLanguage: "Speech language",
      recordVoice: "🎙️ Voice record korun",
      stop: "Stop",
      typeInstead: "⌨️ Type korun",

      communityTitle: "🤝 Community Help nin",
      communityQuestion:
        "Apni ki ekjon community health worker-er help chan?",

      careTitle: "Care-e pouchate help",
      careDescription:
        "Facility, cost, transport, connectivity ebong follow-up niye bhabun.",

      financialTitle: "💰 Care-er khoroch afford korte parben?",
      financialDescription:
        "Care-e pouchanor ekta important part holo khoroch-er solution.",

      financingOptions: "Healthcare Financing Options",
      ngoSupport: "Community / NGO support",
      subsidizedCare: "Subsidized care",
      transportSupport: "Transport support",
      microProtection: "Illustrative micro-health protection",

      bKashTitle: "Mobile-money contribution simulation",
      simulateContribution: "Contribution simulate korun",

      smsTitle: "📱 SMS Mode",
      simulateSMS: "SMS response simulate korun",

      followTitle: "Amar Follow-ups",
      saveFollowUp: "Follow-up locally save korun",

      offlineTitle: "Offline queue",
      connection: "Connection restore simulate korun",
      sync: "Sync now (demo)",

      facilityTitle: "Facility reference",
      findCare: "📍 Kacher care khujun",

      responsibleTitle: "Responsible AI ebong shared-device privacy",

      demoNetwork:
        "Demo network — eta kono live emergency service na.",

      emergency:
        "Jodi eta severe ba life-threatening hoy, ekhon 999-e call korun ba emergency care nin.",

      aiDisclaimer:
        "AI guidance dey — diagnosis kore na."
    }
  };

  /*
   * These elements are deliberately selected by their existing IDs.
   * This means the rest of app.js remains untouched.
   */

  const map = {
    heroTitle: "heroTitle",
    heroEyebrow: ".hero-main .eyebrow",
    tagline: ".tagline",

    healthHelp: '.nav a[href="#screen"]',
    healthRecord: '.nav a[href="#healthRecord"]',
    reachCare: '.nav a[href="#carePath"]',
    communityHelp: '.nav a[href="#communityHelp"]',
    followUp: '.nav a[href="#followupCard"]',
    smsOffline: '.nav a[href="#smsMode"]',
    privacy: '.nav a[href="#responsible"]',

    needHealthHelp: '.hero-main a[href="#screen"]',
    myHealthRecord: '.hero-main a[href="#healthRecord"]',
    reachCareButton: '.hero-main a[href="#carePath"]',
    offlineButton: '.hero-main a[href="#smsMode"]',

    nextSteps: ".hero-steps h3",

    tellUs: "#screenTitle",
    yourWords: 'label[for="input"]',
    structureCase: "#runButton",
    tryDemo: "#screen .subhead",

    voiceQuestion: "#voiceTitle",
    type: "#voiceTypeModeButton",
    speak: "#voiceSpeakModeButton",
    speechLanguage: 'label[for="voiceLanguage"]',
    recordVoice: "#recordVoiceButton",
    stop: "#stopVoiceButton",
    typeInstead: "#typeInsteadButton",

    communityTitle: "#communityTitle",
    communityQuestion: "#communityHelp .section-heading p",

    careTitle: "#careTitle",
    careDescription: "#careTitle + p",

    financialTitle: "#financialTitle",
    financialDescription: "#financialTitle + p",

    bKashTitle: ".money-panel:nth-child(2) h3",
    simulateContribution: "#paymentButton",

    smsTitle: "#smsModeTitle",
    simulateSMS: "#simulateSmsButton",

    followTitle: "#followTitle",
    saveFollowUp: "#followupButton",

    offlineTitle: "#offlineTitle",
    connection: "#connectionButton",
    sync: "#syncButton",

    facilityTitle: "#facilityTitle",
    findCare: "#findNearbyButton",

    responsibleTitle: "#responsible h2"
  };

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) {
      el.textContent = value;
    }
  }

  function setButtonText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) {
      el.textContent = value;
    }
  }

  function applyLanguage(language) {
    const t = translations[language] || translations.en;

    document.documentElement.lang =
      language === "bn" ? "bn" : "en";

    Object.keys(map).forEach(function (key) {
      if (t[key]) {
        setText(map[key], t[key]);
      }
    });

    /*
     * Some elements are buttons rather than ordinary text.
     */
    setButtonText("#runButton", t.structureCase);
    setButtonText("#paymentButton", t.simulateContribution);
    setButtonText("#simulateSmsButton", t.simulateSMS);
    setButtonText("#followupButton", t.saveFollowUp);
    setButtonText("#connectionButton", t.connection);
    setButtonText("#syncButton", t.sync);
    setButtonText("#findNearbyButton", t.findCare);

    /*
     * Journey pills
     */
    const journey = document.querySelectorAll(".journey span");

    if (journey.length >= 7) {
      const labels = [
        t.tell,
        t.check,
        t.act,
        t.reach,
        t.afford,
        t.share,
        t.follow
      ];

      journey.forEach(function (item, index) {
        const number = index + 1;
        item.innerHTML =
          "<b>" + number + "</b> " + labels[index];
      });
    }

    /*
     * Store selected language locally.
     */
    try {
      localStorage.setItem("shusthoPothLanguage", language);
    } catch (e) {}

    /*
     * Update selector.
     */
    const selector = document.getElementById("languageSelector");
    if (selector) {
      selector.value = language;
    }
  }

  function initializeLanguage() {
    const selector = document.getElementById("languageSelector");

    if (!selector) return;

    let saved = "en";

    try {
      saved =
        localStorage.getItem("shusthoPothLanguage") || "en";
    } catch (e) {}

    selector.value = saved;

    selector.addEventListener("change", function () {
      applyLanguage(this.value);
    });

    applyLanguage(saved);
  }

  /*
   * Wait until the page has loaded.
   */
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeLanguage
    );
  } else {
    initializeLanguage();
  }
})();
