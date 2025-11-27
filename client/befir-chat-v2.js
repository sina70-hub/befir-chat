(function () {
  var d = document;

  // اگر قبلا ساخته شده، فقط نمایش/مخفی کنیم
  if (window.befirChatBox) {
    window.toggleBefirChat();
    return;
  }

  // متن‌های چندزبانه
  var texts = {
    fa: {
      title: "گفتگو با بفر",
      status: "پاسخگوی سوالات شما هستیم.",
      chooseLangTitle: "زبان خود را انتخاب کنید",
      chooseLangSub: "برای شروع گفتگو یکی از زبان‌ها را انتخاب کنید:",
      langFa: "فارسی",
      langEn: "English",
      langKu: "کوردی",
      formTitle: "شروع گفتگو",
      formSub: "لطفاً این فرم کوتاه را تکمیل کنید.",
      namePlaceholder: "نام شما",
      phonePlaceholder: "شماره موبایل",
      emailPlaceholder: "ایمیل (اختیاری)",
      startChat: "شروع گفتگو",
      validationName: "نام حداقل باید ۲ کاراکتر باشد.",
      validationPhone: "شماره موبایل نامعتبر است.",
      validationEmail: "ایمیل نامعتبر است.",
      chatWelcome: "سلام، خوش آمدی به بفر 👋",
      chatIntro: "چطور می‌تونیم کمکت کنیم؟",
      suggestion: "می‌خوام درباره مشاوره با بفر بدونم.",
      placeholderMessage: "پیام خود را بنویسید...",
      send: "ارسال"
    },
    en: {
      title: "Chat with Befir",
      status: "We’re here to help you.",
      chooseLangTitle: "Choose your language",
      chooseLangSub: "Please select your preferred language:",
      langFa: "Farsi",
      langEn: "English",
      langKu: "Kurdish",
      formTitle: "Start a conversation",
      formSub: "Please fill out this short form.",
      namePlaceholder: "Your name",
      phonePlaceholder: "Phone number",
      emailPlaceholder: "Email (optional)",
      startChat: "Start chat",
      validationName: "Name must be at least 2 characters.",
      validationPhone: "Phone number looks invalid.",
      validationEmail: "Email address looks invalid.",
      chatWelcome: "Hi, welcome to Befir 👋",
      chatIntro: "How can we help you today?",
      suggestion: "I’d like to know about consulting with Befir.",
      placeholderMessage: "Type your message...",
      send: "Send"
    },
    ku: {
      // کوردی در حد ساده – بعداً می‌تونیم دقیق‌ترش کنیم
      title: "گفتوگۆ لەگەڵ بفر",
      status: "ئه‌مه‌ ئاماده‌ین یارمەتیت بده‌ین.",
      chooseLangTitle: "زمان هەڵبژێرە",
      chooseLangSub: "تکایە زمانێکی خۆت هەڵبژێرە:",
      langFa: "فارسە",
      langEn: "ئینگلیزی",
      langKu: "کوردی",
      formTitle: "دەستپێکردنی گفتوگۆ",
      formSub: "تکایە ئەم فۆڕمە کورتە پربکەوە.",
      namePlaceholder: "ناو",
      phonePlaceholder: "ژمارەی مۆبایل",
      emailPlaceholder: "ئیمێل (ئارەزووی)",
      startChat: "دەستپێکردن",
      validationName: "ناو پێویستە لانی کەم ٢ پیت بێت.",
      validationPhone: "ژمارەی مۆبایل هەڵەیە.",
      validationEmail: "ئیمێل دروست نییە.",
      chatWelcome: "سڵاو، بەخێربێیت بۆ بفر 👋",
      chatIntro: "چۆن دەتوانین یارمەتیت بدەین؟",
      suggestion: "دەمەوێت دەربارەی ڕاوێژکاری لەگەڵ بفر بیزانم.",
      placeholderMessage: "پەیامەکەت لێرە بنووسە...",
      send: "ناردن"
    }
  };

  var currentLang = "fa";
  var userInfo = { name: "", phone: "", email: "" };
  var conversationLog = [];

  // ساخت استایل کلی
  var style = d.createElement("style");
  style.innerHTML = `
    #befirChatBox {
      position: fixed;
      bottom: 90px;
      left: 20px;
      width: 340px;
      height: 460px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 18px 40px rgba(0,0,0,0.35);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      direction: rtl;
    }
    #befirChatBox * {
      box-sizing: border-box;
    }
    .befir-header {
      background: #ffcc00;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .befir-header-title {
      font-size: 14px;
      font-weight: 700;
      color: #222;
    }
    .befir-header-status {
      font-size: 11px;
      color: #444;
      margin-top: 2px;
    }
    .befir-header-left {
      display: flex;
      flex-direction: column;
    }
    .befir-header-close {
      border: none;
      background: rgba(0,0,0,0.08);
      width: 22px;
      height: 22px;
      border-radius: 999px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
    }
    .befir-body {
      flex: 1;
      background: #f7f7f7;
      padding: 10px;
      overflow-y: auto;
    }
    .befir-footer {
      padding: 8px;
      border-top: 1px solid #e0e0e0;
      background: #fff;
    }
    .befir-screen {
      display: none;
      height: 100%;
    }
    .befir-screen.active {
      display: block;
    }
    .befir-lang-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .befir-lang-sub {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    .befir-lang-buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .befir-pill-button {
      flex: 1 1 30%;
      padding: 6px 8px;
      border-radius: 999px;
      border: none;
      font-size: 12px;
      cursor: pointer;
      background: #ffffff;
      color: #333;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
      transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s;
      text-align: center;
    }
    .befir-pill-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.15);
      background: #fffbdd;
    }
    .befir-form-group {
      margin-bottom: 8px;
    }
    .befir-label {
      font-size: 11px;
      margin-bottom: 3px;
      display: block;
      color: #444;
    }
    .befir-input {
      width: 100%;
      border-radius: 10px;
      border: 1px solid #ddd;
      padding: 7px 9px;
      font-size: 12px;
      outline: none;
    }
    .befir-input:focus {
      border-color: #ffcc00;
      box-shadow: 0 0 0 1px rgba(255,204,0,0.5);
    }
    .befir-error {
      font-size: 11px;
      color: #d11;
      margin-top: 2px;
    }
    .befir-primary-btn {
      width: 100%;
      border-radius: 999px;
      border: none;
      padding: 8px 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: #ffcc00;
      color: #222;
      box-shadow: 0 8px 16px rgba(0,0,0,0.18);
    }
    .befir-primary-btn:active {
      transform: translateY(1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .befir-screen-title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .befir-screen-sub {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    .befir-message-list {
      height: 100%;
      overflow-y: auto;
      padding-right: 2px;
    }
    .befir-msg-row {
      margin-bottom: 6px;
      display: flex;
    }
    .befir-msg-row.bot {
      justify-content: flex-start;
    }
    .befir-msg-row.user {
      justify-content: flex-end;
    }
    .befir-msg-bubble {
      max-width: 85%;
      padding: 6px 8px;
      border-radius: 12px;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .befir-msg-bubble.bot {
      background: #ffffff;
      border: 1px solid #e3e3e3;
    }
    .befir-msg-bubble.user {
      background: #ffec80;
      border: 1px solid #f6d74a;
    }
    .befir-suggestion {
      font-size: 11px;
      padding: 6px 8px;
      background: #fff8d6;
      border-radius: 10px;
      border: 1px dashed rgba(0,0,0,0.15);
      cursor: pointer;
      margin-bottom: 8px;
    }
    .befir-input-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .befir-textarea {
      flex: 1;
      resize: none;
      border-radius: 10px;
      border: 1px solid #ddd;
      padding: 6px 8px;
      font-size: 12px;
      height: 40px;
      outline: none;
    }
    .befir-textarea:focus {
      border-color: #ffcc00;
      box-shadow: 0 0 0 1px rgba(255,204,0,0.4);
    }
    .befir-send-btn {
      border: none;
      border-radius: 999px;
      padding: 7px 10px;
      background: #ffcc00;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      min-width: 60px;
    }
  `;
  d.head.appendChild(style);

  // ساخت بدنه چت
  var box = d.createElement("div");
  box.id = "befirChatBox";

  // Header
  var header = d.createElement("div");
  header.className = "befir-header";

  var headerLeft = d.createElement("div");
  headerLeft.className = "befir-header-left";

  var titleEl = d.createElement("div");
  titleEl.className = "befir-header-title";

  var statusEl = d.createElement("div");
  statusEl.className = "befir-header-status";

  headerLeft.appendChild(titleEl);
  headerLeft.appendChild(statusEl);

  var closeBtn = d.createElement("button");
  closeBtn.className = "befir-header-close";
  closeBtn.innerText = "×";
  closeBtn.onclick = function () {
    window.toggleBefirChat();
  };

  header.appendChild(headerLeft);
  header.appendChild(closeBtn);

  // Body
  var body = d.createElement("div");
  body.className = "befir-body";

  // سه صفحه: زبان، فرم، چت
  var screenLang = d.createElement("div");
  screenLang.className = "befir-screen";
  var screenForm = d.createElement("div");
  screenForm.className = "befir-screen";
  var screenChat = d.createElement("div");
  screenChat.className = "befir-screen";

  body.appendChild(screenLang);
  body.appendChild(screenForm);
  body.appendChild(screenChat);

  // Footer
  var footer = d.createElement("div");
  footer.className = "befir-footer";

  //   ۱) صفحه انتخاب زبان
  var langTitle = d.createElement("div");
  langTitle.className = "befir-lang-title";

  var langSub = d.createElement("div");
  langSub.className = "befir-lang-sub";

  var langButtons = d.createElement("div");
  langButtons.className = "befir-lang-buttons";

  function makeLangBtn(code) {
    var btn = d.createElement("button");
    btn.className = "befir-pill-button";
    btn.dataset.lang = code;
    btn.onclick = function () {
      currentLang = code;
      applyTexts();
      showScreen("form");
    };
    return btn;
  }

  var langFaBtn = makeLangBtn("fa");
  var langEnBtn = makeLangBtn("en");
  var langKuBtn = makeLangBtn("ku");

  langButtons.appendChild(langFaBtn);
  langButtons.appendChild(langEnBtn);
  langButtons.appendChild(langKuBtn);

  screenLang.appendChild(langTitle);
  screenLang.appendChild(langSub);
  screenLang.appendChild(langButtons);

  //   ۲) صفحه فرم اولیه
  var formTitle = d.createElement("div");
  formTitle.className = "befir-screen-title";

  var formSub = d.createElement("div");
  formSub.className = "befir-screen-sub";

  function makeInputGroup(nameKey, type) {
    var wrap = d.createElement("div");
    wrap.className = "befir-form-group";

    var label = d.createElement("label");
    label.className = "befir-label";

    var input = d.createElement("input");
    input.className = "befir-input";
    input.type = type || "text";

    var err = d.createElement("div");
    err.className = "befir-error";
    err.style.display = "none";

    wrap.appendChild(label);
    wrap.appendChild(input);
    wrap.appendChild(err);

    return { wrap, label, input, err };
  }

  var nameGroup = makeInputGroup("name", "text");
  var phoneGroup = makeInputGroup("phone", "tel");
  var emailGroup = makeInputGroup("email", "email");

  var startBtn = d.createElement("button");
  startBtn.className = "befir-primary-btn";

  startBtn.onclick = function () {
    // پاک کردن پیام خطا
    nameGroup.err.style.display = "none";
    phoneGroup.err.style.display = "none";
    emailGroup.err.style.display = "none";

    var t = texts[currentLang];

    var name = nameGroup.input.value.trim();
    var phone = phoneGroup.input.value.trim();
    var email = emailGroup.input.value.trim();
    var valid = true;

    if (name.length < 2) {
      nameGroup.err.innerText = t.validationName;
      nameGroup.err.style.display = "block";
      valid = false;
    }

    var digits = phone.replace(/\D/g, "");
    if (digits.length < 8) {
      phoneGroup.err.innerText = t.validationPhone;
      phoneGroup.err.style.display = "block";
      valid = false;
    }

    if (email.length > 0) {
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        emailGroup.err.innerText = t.validationEmail;
        emailGroup.err.style.display = "block";
        valid = false;
      }
    }

    if (!valid) return;

    userInfo = { name: name, phone: phone, email: email };
    // بعداً این اطلاعات برای n8n و شیت استفاده می‌شود
    console.log("Befir user info:", userInfo);

    showScreen("chat");
    initChat();
  };

  screenForm.appendChild(formTitle);
  screenForm.appendChild(formSub);
  screenForm.appendChild(nameGroup.wrap);
  screenForm.appendChild(phoneGroup.wrap);
  screenForm.appendChild(emailGroup.wrap);
  screenForm.appendChild(startBtn);

  //   ۳) صفحه چت
  var msgList = d.createElement("div");
  msgList.className = "befir-message-list";

  var suggestion = d.createElement("div");
  suggestion.className = "befir-suggestion";

  suggestion.onclick = function () {
    addMessage(texts[currentLang].suggestion, "user");
    fakeBotAnswer(texts[currentLang].suggestion);
  };

  screenChat.appendChild(msgList);
  screenChat.appendChild(suggestion);

  // Footer برای صفحه چت
  var inputRow = d.createElement("div");
  inputRow.className = "befir-input-row";

  var textarea = d.createElement("textarea");
  textarea.className = "befir-textarea";

  var sendBtn = d.createElement("button");
  sendBtn.className = "befir-send-btn";

  sendBtn.onclick = function () {
    var text = textarea.value.trim();
    if (!text) return;
    textarea.value = "";
    addMessage(text, "user");
    fakeBotAnswer(text);
  };

  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendBtn.onclick();
    }
  });

  inputRow.appendChild(textarea);
  inputRow.appendChild(sendBtn);

  // ساختار نهایی
  box.appendChild(header);
  box.appendChild(body);
  box.appendChild(footer);

  d.body.appendChild(box);

  // ذخیره در window
  window.befirChatBox = box;

  // تابع سوییچ صفحه
  function showScreen(name) {
    screenLang.classList.remove("active");
    screenForm.classList.remove("active");
    screenChat.classList.remove("active");

    if (name === "lang") screenLang.classList.add("active");
    if (name === "form") screenForm.classList.add("active");
    if (name === "chat") screenChat.classList.add("active");

    if (name === "chat") {
      footer.style.display = "block";
    } else {
      footer.style.display = "none";
    }
  }

  // اضافه کردن موارد به footer (فقط برای صفحه چت استفاده می‌شود)
  footer.appendChild(inputRow);

  // پر کردن متن‌ها با زبان فعلی
  function applyTexts() {
    var t = texts[currentLang];
    titleEl.innerText = t.title;
    statusEl.innerText = t.status;

    langTitle.innerText = t.chooseLangTitle;
    langSub.innerText = t.chooseLangSub;
    langFaBtn.innerText = t.langFa;
    langEnBtn.innerText = t.langEn;
    langKuBtn.innerText = t.langKu;

    formTitle.innerText = t.formTitle;
    formSub.innerText = t.formSub;
    nameGroup.label.innerText = t.namePlaceholder;
    nameGroup.input.placeholder = t.namePlaceholder;
    phoneGroup.label.innerText = t.phonePlaceholder;
    phoneGroup.input.placeholder = t.phonePlaceholder;
    emailGroup.label.innerText = t.emailPlaceholder;
    emailGroup.input.placeholder = t.emailPlaceholder;
    startBtn.innerText = t.startChat;

    suggestion.innerText = t.suggestion;
    textarea.placeholder = t.placeholderMessage;
    sendBtn.innerText = t.send;

    // جهت متن – برای انگلیسی/کوردی اگر خواستی می‌شود تنظیم کرد
    if (currentLang === "en") {
      box.style.direction = "ltr";
      msgList.style.direction = "ltr";
    } else {
      box.style.direction = "rtl";
      msgList.style.direction = "rtl";
    }
  }

  // افزودن پیام به لیست
  function addMessage(text, from) {
    var row = d.createElement("div");
    row.className = "befir-msg-row " + (from === "user" ? "user" : "bot");

    var bubble = d.createElement("div");
    bubble.className = "befir-msg-bubble " + (from === "user" ? "user" : "bot");
    bubble.innerText = text;

    row.appendChild(bubble);
    msgList.appendChild(row);

    // اسکرول به انتها
    msgList.scrollTop = msgList.scrollHeight;

    conversationLog.push({ from, text, ts: Date.now() });
  }

  // پاسخ موقتی ربات (تا وقتی به n8n و GPT وصل کنیم)
  function fakeBotAnswer(userText) {
    var t = texts[currentLang];
    var reply;

    if (currentLang === "fa") {
      reply = "پیامت رسید 🙏\nفعلاً این یک نسخه آزمایشی است. بعداً این پیام‌ها به نیتن و هوش مصنوعی وصل می‌شوند.";
    } else if (currentLang === "en") {
      reply = "Got your message 🙏\nThis is a demo version. Soon this chat will be connected to n8n and AI.";
    } else {
      reply = "پەیامەکەت گەیشت 🙏\nئەم وەشانە تاقیکارییە، دواتر لەگەڵ هوش مەصنوعی دادەگرێت.";
    }

    setTimeout(function () {
      addMessage(reply, "bot");
    }, 600);
  }

  // شروع چت: اول زبان
  applyTexts();
  showScreen("lang");

  // توگل نمایش
  window.toggleBefirChat = function () {
    if (box.style.display === "none") {
      box.style.display = "flex";
    } else {
      box.style.display = "none";
    }
  };

  // وقتی برای اولین بار لود می‌شود، حتماً نمایش بده
  box.style.display = "flex";

  // init chat پس از ورود اطلاعات
  function initChat() {
    msgList.innerHTML = "";
    conversationLog = [];

    var t = texts[currentLang];
    addMessage(t.chatWelcome, "bot");
    addMessage(t.chatIntro, "bot");
  }
})();
