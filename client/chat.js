(function () {
  // اگر قبلاً تعریف شده، فقط باز/بسته کن
  if (window.toggleBefirChat && document.getElementById("befirChatBox")) {
    window.toggleBefirChat();
    return;
  }

  var d = document;
  var box = d.createElement("div");
  box.id = "befirChatBox";
  box.style.position = "fixed";
  box.style.bottom = "90px";
  box.style.left = "20px";
  box.style.width = "360px";
  box.style.maxWidth = "96vw";
  box.style.height = "480px";
  box.style.background = "#ffffff";
  box.style.borderRadius = "16px";
  box.style.boxShadow = "0 12px 30px rgba(0,0,0,0.25)";
  box.style.zIndex = "999999";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.overflow = "hidden";
  box.style.fontFamily = "Tahoma, sans-serif";

  d.body.appendChild(box);

  // وضعیت داخلی چت
  var state = {
    step: "language", // language | form | chat
    lang: "fa",       // fa | en | ku
    name: "",
    phone: "",
    email: ""
  };

  var texts = {
    fa: {
      title: "چت بفر",
      subtitle: "مشاوره و همراهی برای مسیر شما",
      close: "بستن",
      chooseLanguage: "زبان خود را انتخاب کنید",
      faBtn: "فارسی",
      enBtn: "English",
      kuBtn: "کوردی",
      formTitle: "شروع گفتگو",
      formHint: "لطفاً اطلاعات خود را وارد کنید",
      name: "نام",
      phone: "شماره موبایل",
      email: "ایمیل (اختیاری)",
      namePlaceholder: "مثلاً سارا",
      phonePlaceholder: "مثلاً 0912...",
      emailPlaceholder: "example@mail.com",
      formError: "لطفاً اطلاعات را به‌درستی وارد کنید",
      startChat: "شروع گفتگو با بفر",
      chatWelcome: "سلام {name} 🌿\nخوش آمدی به گفت‌وگوی بفر. چه کمکی از دستم برمیاد؟",
      inputPlaceholder: "پیام خود را بنویسید...",
      sendingHint: "فعلاً پاسخ آزمایشی است؛ بعداً به هوش مصنوعی وصل می‌کنیم."
    },
    en: {
      title: "Befir Chat",
      subtitle: "Guidance for your creative path",
      close: "Close",
      chooseLanguage: "Choose your language",
      faBtn: "فارسی",
      enBtn: "English",
      kuBtn: "Kurdî",
      formTitle: "Start a conversation",
      formHint: "Please fill your info",
      name: "Name",
      phone: "Mobile",
      email: "Email (optional)",
      namePlaceholder: "e.g. Sara",
      phonePlaceholder: "e.g. +98...",
      emailPlaceholder: "example@mail.com",
      formError: "Please enter valid information.",
      startChat: "Start chat with Befir",
      chatWelcome: "Hi {name} 🌿\nWelcome to Befir chat. How can I help you?",
      inputPlaceholder: "Type your message...",
      sendingHint: "Test mode only – later we connect to AI."
    },
    ku: {
      title: "چات بەفر",
      subtitle: "یارمەتی و ڕێنمایی بۆ ڕێگات",
      close: "닫",
      chooseLanguage: "زمانەکەت هەڵبژێرە",
      faBtn: "فارسی",
      enBtn: "English",
      kuBtn: "کوردی",
      formTitle: "دەستپێکردنی گفتوگو",
      formHint: "تکایە زانیاریەکان پڕبکەرەوە",
      name: "ناو",
      phone: "ژمارەی مۆبایل",
      email: "ئیمەیل (ئەگەر حەزت بێت)",
      namePlaceholder: "بۆ نموونە: سارا",
      phonePlaceholder: "بۆ نموونە: ٠٩١٢...",
      emailPlaceholder: "example@mail.com",
      formError: "تکایە زانیاری بە دروستی بنووسە.",
      startChat: "دەستپێکردن لە چات لەگەڵ بەفر",
      chatWelcome: "سڵاو {name} 🌿\nبێخێربێیت بۆ چاتی بەفر. چۆن یارمەتیت بدەم؟",
      inputPlaceholder: "پەیامەکەت بنووسە...",
      sendingHint: "تاکو ئێستا تاقیکردنەوەیە – دواتر بە AI دەربەست دەکەین."
    }
  };

  // هدر ثابت
  box.innerHTML = `
    <div id="befir-header"
         style="
           background: linear-gradient(135deg,#b6d51c,#ffcc00);
           padding:10px 12px;
           display:flex;
           align-items:center;
           justify-content:space-between;
         ">
      <div style="display:flex;align-items:center;gap:8px;">
        <div style="
          width:34px;height:34px;border-radius:50%;
          background:#fff url('https://befir.ir/uploads/f6d3b611d36b4cba9483e6d257113923.gif')
          center/26px 26px no-repeat;
        "></div>
        <div>
          <div id="befir-title"
               style="font-weight:bold;font-size:13px;color:#111;">Befir Chat</div>
          <div id="befir-subtitle"
               style="font-size:11px;color:#222;opacity:.85;">Online assistant</div>
        </div>
      </div>
      <button id="befir-close"
              style="border:none;background:transparent;color:#222;
                     font-size:18px;cursor:pointer;line-height:1;">✕</button>
    </div>
    <div id="befir-body"
         style="flex:1;display:flex;flex-direction:column;background:#f7f7f9;"></div>
  `;

  var body = d.getElementById("befir-body");
  var titleEl = d.getElementById("befir-title");
  var subEl = d.getElementById("befir-subtitle");
  var closeBtn = d.getElementById("befir-close");

  function applyLangUI() {
    var t = texts[state.lang];
    titleEl.textContent = t.title;
    subEl.textContent = t.subtitle;
    if (state.lang === "en") {
      body.style.direction = "ltr";
      body.style.textAlign = "left";
    } else {
      body.style.direction = "rtl";
      body.style.textAlign = "right";
    }
  }

  function renderLanguageStep() {
    var t = texts[state.lang]; // فعلاً عنوان را با زبان پیش‌فرض نشان می‌دهیم
    applyLangUI();

    body.innerHTML = `
      <div style="padding:16px;display:flex;flex-direction:column;gap:14px;font-size:13px;">
        <div style="font-weight:bold;">${t.chooseLanguage}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button data-lang="fa"
                  style="flex:1;min-width:80px;padding:8px;border-radius:999px;
                         border:none;cursor:pointer;background:#111;color:#fff;font-size:12px;">
            ${texts.fa.faBtn}
          </button>
          <button data-lang="en"
                  style="flex:1;min-width:80px;padding:8px;border-radius:999px;
                         border:none;cursor:pointer;background:#e0e0e0;color:#111;font-size:12px;">
            ${texts.fa.enBtn}
          </button>
          <button data-lang="ku"
                  style="flex:1;min-width:80px;padding:8px;border-radius:999px;
                         border:none;cursor:pointer;background:#e0e0e0;color:#111;font-size:12px;">
            ${texts.fa.kuBtn}
          </button>
        </div>
        <div style="font-size:11px;color:#666;line-height:1.5;">
          پس از انتخاب زبان، فرم آغاز گفتگو نمایش داده می‌شود.
        </div>
      </div>
    `;

    var buttons = body.querySelectorAll("button[data-lang]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.lang = this.getAttribute("data-lang");
        state.step = "form";
        renderFormStep();
      });
    });
  }

  function renderFormStep() {
    var t = texts[state.lang];
    applyLangUI();

    body.innerHTML = `
      <div style="padding:14px;font-size:13px;display:flex;flex-direction:column;height:100%;">
        <div style="font-weight:bold;margin-bottom:4px;">${t.formTitle}</div>
        <div style="font-size:11px;color:#666;margin-bottom:12px;">
          ${t.formHint}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;flex:1;">
          <div>
            <div style="font-size:12px;margin-bottom:4px;">${t.name}</div>
            <input id="befir-name"
                   placeholder="${t.namePlaceholder}"
                   style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;
                          font-size:12px;${state.lang === "en" ? "text-align:left;" : "text-align:right;"}">
          </div>
          <div>
            <div style="font-size:12px;margin-bottom:4px;">${t.phone}</div>
            <input id="befir-phone"
                   placeholder="${t.phonePlaceholder}"
                   style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;
                          font-size:12px;${state.lang === "en" ? "text-align:left;" : "text-align:right;"}">
          </div>
          <div>
            <div style="font-size:12px;margin-bottom:4px;">${t.email}</div>
            <input id="befir-email"
                   placeholder="${t.emailPlaceholder}"
                   style="width:100%;padding:8px;border-radius:8px;border:1px solid #ccc;
                          font-size:12px;${state.lang === "en" ? "text-align:left;" : "text-align:right;"}">
          </div>
          <div id="befir-error"
               style="font-size:11px;color:#d60000;display:none;margin-top:4px;">
            ${t.formError}
          </div>
        </div>
        <button id="befir-start"
                style="margin-top:10px;width:100%;padding:9px;border-radius:999px;
                       border:none;cursor:pointer;background:#b6d51c;color:#111;
                       font-weight:bold;font-size:13px;">
          ${t.startChat}
        </button>
      </div>
    `;

    var nameInput = d.getElementById("befir-name");
    var phoneInput = d.getElementById("befir-phone");
    var emailInput = d.getElementById("befir-email");
    var startBtn = d.getElementById("befir-start");
    var errEl = d.getElementById("befir-error");

    startBtn.addEventListener("click", function () {
      var name = nameInput.value.trim();
      var phone = phoneInput.value.trim();
      var email = emailInput.value.trim();

      var phoneOk = phone.length >= 8 && /\d/.test(phone);
      var emailOk = !email || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

      if (!name || !phoneOk || !emailOk) {
        errEl.style.display = "block";
        return;
      }

      errEl.style.display = "none";
      state.name = name;
      state.phone = phone;
      state.email = email;
      state.step = "chat";
      renderChatStep();
    });
  }

  function renderChatStep() {
    var t = texts[state.lang];
    applyLangUI();

    var welcome = t.chatWelcome.replace("{name}", state.name || (state.lang === "en" ? "friend" : "دوست من"));

    body.innerHTML = `
      <div style="display:flex;flex-direction:column;height:100%;font-size:13px;">
        <div style="padding:8px 10px;font-size:11px;color:#777;border-bottom:1px solid #eee;">
          ${t.sendingHint}
        </div>
        <div id="befir-chat-log"
             style="flex:1;padding:10px;overflow-y:auto;background:#f7f7f9;"></div>
        <div style="padding:8px;border-top:1px solid #eee;display:flex;gap:6px;">
          <input id="befir-chat-input"
                 placeholder="${t.inputPlaceholder}"
                 style="flex:1;padding:8px;border-radius:999px;border:1px solid #ccc;
                        font-size:12px;${state.lang === "en" ? "text-align:left;" : "text-align:right;"}">
          <button id="befir-chat-send"
                  style="padding:8px 12px;border-radius:999px;border:none;
                         background:#111;color:#fff;font-size:12px;cursor:pointer;">
            ▸
          </button>
        </div>
      </div>
    `;

    var log = d.getElementById("befir-chat-log");
    var input = d.getElementById("befir-chat-input");
    var sendBtn = d.getElementById("befir-chat-send");

    function addMsg(text, from) {
      var wrap = d.createElement("div");
      wrap.style.margin = "4px 0";
      wrap.style.display = "flex";
      wrap.style.justifyContent =
        from === "user"
          ? (state.lang === "en" ? "flex-end" : "flex-start")
          : (state.lang === "en" ? "flex-start" : "flex-end");

      var bubble = d.createElement("div");
      bubble.style.maxWidth = "80%";
      bubble.style.padding = "6px 9px";
      bubble.style.borderRadius = "12px";
      bubble.style.fontSize = "12px";
      bubble.style.whiteSpace = "pre-wrap";
      bubble.style.lineHeight = "1.5";

      if (from === "user") {
        bubble.style.background = "#111";
        bubble.style.color = "#fff";
        bubble.style.borderBottomLeftRadius = state.lang === "en" ? "12px" : "4px";
        bubble.style.borderBottomRightRadius = state.lang === "en" ? "4px" : "12px";
      } else {
        bubble.style.background = "#ffffff";
        bubble.style.color = "#222";
        bubble.style.border = "1px solid #ddd";
        bubble.style.borderBottomLeftRadius = state.lang === "en" ? "4px" : "12px";
        bubble.style.borderBottomRightRadius = state.lang === "en" ? "12px" : "4px";
      }

      bubble.textContent = text;
      wrap.appendChild(bubble);
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
    }

    // پیام خوش‌آمد
    addMsg(welcome, "bot");

    function sendMessage() {
      var text = input.value.trim();
      if (!text) return;
      addMsg(text, "user");
      input.value = "";

      // اینجا بعداً به n8n و GPT وصل می‌کنیم
      setTimeout(function () {
        if (state.lang === "en") {
          addMsg("This is a demo answer. Later, I will be connected to AI and respond smartly.", "bot");
        } else if (state.lang === "ku") {
          addMsg("ئەم وەڵامە تاقیکردنەوەیە. دواتر بە AI دەربەستم و وەڵام بە شێوەی زیرەکانە دەدەم.", "bot");
        } else {
          addMsg("این فقط یک پاسخ آزمایشی است. بعداً به هوش مصنوعی وصل می‌شوم و هوشمند جواب می‌دهم.", "bot");
        }
      }, 600);
    }

    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });
    sendBtn.addEventListener("click", sendMessage);
  }

  // دکمه بستن
  closeBtn.addEventListener("click", function () {
    box.style.display = "none";
  });

  // تابع عمومی برای دکمه بیرون
  window.toggleBefirChat = function () {
    if (!box) return;
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };

  // شروع از صفحه انتخاب زبان
  renderLanguageStep();
})();
