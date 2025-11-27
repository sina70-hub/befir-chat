(function () {
  var d = document;

  // اگر قبلاً چت ساخته شده، فقط نمایش/مخفی کن و برگرد
  var existing = d.getElementById("befirChatBox");
  if (existing) {
    existing.style.display =
      existing.style.display === "none" ? "flex" : "none";
    return;
  }

  // --- وضعیت داخلی فقط در حافظه (هیچ localStorage) ---
  var state = {
    step: "language", // language | form | chat
    lang: "fa",       // fa | en | ku
    minimized: false,
    user: { name: "", phone: "", email: "" },
    messages: []      // {from:'user'|'bot'|'system', text:string, time:number}
  };

  var attachedFile = null;

  // --- متن‌ها برای سه زبان ---
  var TEXTS = {
    fa: {
      dir: "rtl",
      title: "گفتگو با بفر",
      status: "پاسخگوی مسیر و سوالات شما هستیم 🌿",
      chooseLangTitle: "زبان خود را انتخاب کنید",
      formTitle: "شروع گفتگو",
      formSubtitle: "لطفاً اطلاعات کوتاه زیر را وارد کنید:",
      nameLabel: "نام",
      phoneLabel: "شماره موبایل",
      emailLabel: "ایمیل (اختیاری)",
      namePlaceholder: "نام شما",
      phonePlaceholder: "مثلاً 0912...",
      emailPlaceholder: "example@mail.com",
      back: "بازگشت",
      startChat: "شروع گفتگو با بفر",
      nameError: "نام باید حداقل ۲ کاراکتر باشد.",
      phoneError: "شماره موبایل نامعتبر است.",
      emailError: "ایمیل نامعتبر است.",
      validationError: "لطفاً خطاهای فرم را برطرف کنید.",
      inputPlaceholder: "اینجا پیام خود را بنویسید...",
      attachLabel: "ضمیمه",
      attachHint: "می‌توانید اسکرین‌شات یا تصویر مشکل‌تان را بفرستید.",
      fileTooBig: "حجم تصویر زیاد است؛ حداکثر ۲ مگابایت.",
      fileSelected: "تصویر انتخاب شد: {name}",
      imageTag: "[تصویر پیوست شد]",
      autoHello: "سلام {name} 👋\nبه گفتگوی بفر خوش آمدی.",
      autoIntro: "چه کمکی از دستم برمیاد؟ می‌تونی مشکلت، پروژه‌ات یا سؤالت رو برام بنویسی.",
      autoReply: "پیام‌ات رسید 🙏\nاین نسخه فعلاً آزمایشی است؛ در نسخه‌ی نهایی به نیتن و هوش مصنوعی بفر وصل می‌شوم.",
      btnSend: "➤"
    },
    en: {
      dir: "ltr",
      title: "Befir Chat",
      status: "We’re here to support your path 🌿",
      chooseLangTitle: "Choose your language",
      formTitle: "Start conversation",
      formSubtitle: "Please fill out this short form:",
      nameLabel: "Name",
      phoneLabel: "Mobile number",
      emailLabel: "Email (optional)",
      namePlaceholder: "Your name",
      phonePlaceholder: "e.g. +98...",
      emailPlaceholder: "example@mail.com",
      back: "Back",
      startChat: "Start chat with Befir",
      nameError: "Name must be at least 2 characters.",
      phoneError: "Phone number looks invalid.",
      emailError: "Email looks invalid.",
      validationError: "Please fix the form errors.",
      inputPlaceholder: "Type your message here...",
      attachLabel: "Attach",
      attachHint: "You can attach a screenshot or image.",
      fileTooBig: "Image is too large (max 2 MB).",
      fileSelected: "Image selected: {name}",
      imageTag: "[Image attached]",
      autoHello: "Hi {name} 👋\nWelcome to Befir chat.",
      autoIntro: "How can I help you today? Feel free to describe your question or project.",
      autoReply: "Got your message 🙏\nThis is a demo version — in production I’ll be connected to N8N & AI.",
      btnSend: "➤"
    },
    ku: {
      dir: "rtl",
      title: "گفتوگۆ لەگەڵ بەفر",
      status: "ئه‌مه‌ ئامادەین یارمەتیت بدەین 🌿",
      chooseLangTitle: "زمانێک هەڵبژێرە",
      formTitle: "دەستپیکردنی گفتوگۆ",
      formSubtitle: "تکایە زانیاریەکانت بنووسە:",
      nameLabel: "ناو",
      phoneLabel: "ژمارەی مۆبایل",
      emailLabel: "ئیمەیل (ئارەزووی)",
      namePlaceholder: "ناوی تۆ",
      phonePlaceholder: "بۆ نموونە: ٠٧٥٠...",
      emailPlaceholder: "example@mail.com",
      back: "گەڕانەوە",
      startChat: "دەستپێکردن لە چات لەگەڵ بەفر",
      nameError: "ناو پێویستە کەمەکە ٢ پیت بێت.",
      phoneError: "ژمارەی مۆبایل دروست نییە.",
      emailError: "ئیمەیل دروست نییە.",
      validationError: "تکایە هەڵەکان چاک بکە.",
      inputPlaceholder: "پەیامەکەت لێرە بنووسە...",
      attachLabel: "هاوپێچ",
      attachHint: "دەتوانیت وێنە یان سکرین‌شۆت نێرە.",
      fileTooBig: "قەبارەی وێنە زۆر گەورەیە (زۆرترین ٢MB).",
      fileSelected: "وێنە هەڵبژێردرا: {name}",
      imageTag: "[وێنە هاوپێچ کرا]",
      autoHello: "سڵاو {name} 👋\nبەخێربێیت بۆ چاتی بەفر.",
      autoIntro: "چۆن دەتوانم یارمەتیت بدەم؟ پرسیارەکەت یان پرۆژەکەت باسی بکە.",
      autoReply: "پەیامەکەت گەیشت 🙏\nئەم وەشانە تاقیکارییە؛ دواتر بە نیتن و هوش مەصنوعی دادەگرێت.",
      btnSend: "➤"
    }
  };

  // --- استایل کلی با <style> ---
  var style = d.createElement("style");
  style.textContent = `
  #befirChatBox {
    box-sizing: border-box;
  }
  #befirChatBox * {
    box-sizing: border-box;
  }
  .befir-shadow {
    box-shadow: 0 16px 40px rgba(0,0,0,0.35);
  }
  .befir-header {
    background: linear-gradient(135deg,#ffdd55,#ffcc00);
    padding: 8px 10px;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }
  .befir-header-left {
    display:flex;
    align-items:center;
    gap:8px;
  }
  .befir-avatar {
    width:32px;
    height:32px;
    border-radius:50%;
    background: radial-gradient(circle at 30% 20%, #ffe6f2, #f48fb1);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    color:#fff;
    font-weight:bold;
  }
  .befir-header-title {
    font-size:13px;
    font-weight:700;
    color:#111;
  }
  .befir-header-status {
    font-size:11px;
    color:#333;
    opacity:0.9;
  }
  .befir-header-actions {
    display:flex;
    gap:6px;
    align-items:center;
  }
  .befir-icon-btn {
    border:none;
    width:22px;
    height:22px;
    border-radius:999px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:13px;
    cursor:pointer;
    background:rgba(0,0,0,0.06);
    color:#222;
  }
  .befir-icon-btn:hover {
    background:rgba(0,0,0,0.13);
  }
  .befir-body {
    flex:1;
    background:#f6f7fb;
    padding:10px;
    font-size:13px;
    overflow:hidden;
    display:flex;
    flex-direction:column;
  }
  .befir-screen {
    display:none;
    height:100%;
  }
  .befir-screen.active {
    display:flex;
    flex-direction:column;
  }
  .befir-lang-buttons {
    display:flex;
    flex-direction:column;
    gap:8px;
    margin-top:10px;
  }
  .befir-pill-btn {
    border-radius:999px;
    border:none;
    padding:8px 10px;
    font-size:13px;
    cursor:pointer;
    background:#fff;
    display:flex;
    justify-content:space-between;
    align-items:center;
    box-shadow:0 4px 10px rgba(0,0,0,0.06);
  }
  .befir-pill-btn span {
    font-size:11px;
    opacity:0.8;
  }
  .befir-pill-btn:hover {
    box-shadow:0 6px 16px rgba(0,0,0,0.14);
    transform:translateY(-1px);
  }
  .befir-form-group {
    margin-bottom:8px;
  }
  .befir-label {
    display:block;
    font-size:11px;
    color:#555;
    margin-bottom:3px;
  }
  .befir-input {
    width:100%;
    border-radius:10px;
    border:1px solid #ddd;
    padding:7px 9px;
    font-size:12px;
    outline:none;
    background:#fff;
  }
  .befir-input:focus {
    border-color:#ffcc00;
    box-shadow:0 0 0 1px rgba(255,204,0,0.4);
  }
  .befir-error {
    font-size:11px;
    color:#d11;
    margin-top:2px;
  }
  .befir-form-buttons {
    display:flex;
    gap:8px;
    margin-top:10px;
  }
  .befir-secondary-btn,
  .befir-primary-btn {
    flex:1;
    border-radius:999px;
    border:none;
    padding:7px 10px;
    font-size:13px;
    cursor:pointer;
  }
  .befir-secondary-btn {
    background:#e3e3e3;
    color:#222;
  }
  .befir-primary-btn {
    background:#111;
    color:#fff;
  }
  .befir-chat-messages {
    flex:1;
    overflow-y:auto;
    padding-right:2px;
  }
  .befir-msg-row {
    margin-bottom:6px;
    display:flex;
    flex-direction:column;
  }
  .befir-msg-bubble {
    max-width:80%;
    padding:6px 9px;
    border-radius:12px;
    font-size:12px;
    line-height:1.5;
    white-space:pre-wrap;
    word-break:break-word;
  }
  .befir-user .befir-msg-bubble {
    background:#111;
    color:#fff;
    align-self:flex-end;
  }
  .befir-bot .befir-msg-bubble {
    background:#ffffff;
    color:#222;
    border:1px solid #ddd;
    align-self:flex-start;
  }
  .befir-msg-time {
    font-size:10px;
    color:#777;
    margin-top:2px;
  }
  .befir-attach-hint {
    font-size:11px;
    color:#666;
    margin-bottom:6px;
  }
  .befir-chat-footer {
    border-top:1px solid #ddd;
    padding:6px 6px 8px;
    background:#fff;
  }
  .befir-input-row {
    display:flex;
    align-items:center;
    gap:6px;
  }
  .befir-textarea {
    flex:1;
    border-radius:999px;
    border:1px solid #ddd;
    padding:7px 11px;
    font-size:12px;
    resize:none;
    height:36px;
    outline:none;
    background:#fafafa;
  }
  .befir-textarea:focus {
    border-color:#ffcc00;
    box-shadow:0 0 0 1px rgba(255,204,0,0.4);
    background:#fff;
  }
  .befir-circle-icon {
    border:none;
    border-radius:50%;
    width:32px;
    height:32px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:16px;
    cursor:pointer;
    background:#f2f2f2;
  }
  .befir-circle-icon:hover {
    background:#e5e5e5;
  }
  .befir-file-info {
    font-size:11px;
    color:#555;
    margin-top:3px;
    min-height:14px;
  }

  @media (max-width: 768px) {
    #befirChatBox {
      left:0 !important;
      right:0 !important;
      bottom:0 !important;
      width:100% !important;
      height:100% !important;
      border-radius:0 !important;
    }
  }
  `;
  d.head.appendChild(style);

  // --- ساخت باکس اصلی ---
  var box = d.createElement("div");
  box.id = "befirChatBox";
  box.className = "befir-shadow";
  box.style.position = "fixed";
  box.style.bottom = "90px";
  box.style.left = "20px";
  box.style.width = "360px";
  box.style.maxWidth = "96vw";
  box.style.height = "480px";
  box.style.maxHeight = "80vh";
  box.style.background = "#ffffff";
  box.style.borderRadius = "16px";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.overflow = "hidden";
  box.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Tahoma,sans-serif';

  d.body.appendChild(box);

  function applyDir() {
    var t = TEXTS[state.lang];
    var dir = t.dir || "rtl";
    box.dir = dir;
    if (dir === "ltr") {
      box.style.textAlign = "left";
    } else {
      box.style.textAlign = "right";
    }
  }

  function formatTime(ts) {
    var date = new Date(ts);
    var h = date.getHours().toString().padStart(2, "0");
    var m = date.getMinutes().toString().padStart(2, "0");
    return h + ":" + m;
  }

  function applyLayout() {
    if (state.minimized) {
      box.style.height = "52px";
    } else {
      if (window.innerWidth <= 768) {
        box.style.left = "0";
        box.style.right = "0";
        box.style.bottom = "0";
        box.style.height = "100%";
        box.style.width = "100%";
        box.style.borderRadius = "0";
      } else {
        box.style.left = "20px";
        box.style.bottom = "90px";
        box.style.width = "360px";
        box.style.height = "480px";
        box.style.borderRadius = "16px";
      }
    }
  }
  window.addEventListener("resize", applyLayout);

  function render() {
    applyDir();
    applyLayout();
    var t = TEXTS[state.lang];

    // هدر
    var headerHTML =
      '<div class="befir-header">' +
      '<div class="befir-header-left">' +
      '<div class="befir-avatar">ب</div>' +
      '<div>' +
      '<div class="befir-header-title">' +
      t.title +
      "</div>" +
      '<div class="befir-header-status">' +
      t.status +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="befir-header-actions">' +
      '<button class="befir-icon-btn" data-act="minimize">' +
      (state.minimized ? "+" : "−") +
      "</button>" +
      '<button class="befir-icon-btn" data-act="close">×</button>' +
      "</div>" +
      "</div>";

    var bodyHTML = '<div class="befir-body">';

    if (state.step === "language") {
      bodyHTML +=
        '<div class="befir-screen active" id="befir-screen-lang">' +
        '<div style="font-weight:600;margin-bottom:6px;">' +
        t.chooseLangTitle +
        "</div>" +
        '<div class="befir-lang-buttons">' +
        '<button class="befir-pill-btn" data-lang="fa">فارسی<span>Persian</span></button>' +
        '<button class="befir-pill-btn" data-lang="en">English<span>English</span></button>' +
        '<button class="befir-pill-btn" data-lang="ku">کوردی<span>Kurdî</span></button>' +
        "</div>" +
        "</div>";
    } else if (state.step === "form") {
      bodyHTML +=
        '<div class="befir-screen active" id="befir-screen-form">' +
        '<div style="font-weight:600;margin-bottom:4px;">' +
        t.formTitle +
        "</div>" +
        '<div style="font-size:11px;color:#666;margin-bottom:8px;">' +
        t.formSubtitle +
        "</div>" +
        '<div class="befir-form-group">' +
        '<label class="befir-label">' +
        t.nameLabel +
        "</label>" +
        '<input class="befir-input" id="befir-name" placeholder="' +
        t.namePlaceholder +
        '" value="' +
        (state.user.name || "") +
        '">' +
        '<div class="befir-error" id="befir-name-error"></div>' +
        "</div>" +
        '<div class="befir-form-group">' +
        '<label class="befir-label">' +
        t.phoneLabel +
        "</label>" +
        '<input class="befir-input" id="befir-phone" placeholder="' +
        t.phonePlaceholder +
        '" value="' +
        (state.user.phone || "") +
        '">' +
        '<div class="befir-error" id="befir-phone-error"></div>' +
        "</div>" +
        '<div class="befir-form-group">' +
        '<label class="befir-label">' +
        t.emailLabel +
        "</label>" +
        '<input class="befir-input" id="befir-email" placeholder="' +
        t.emailPlaceholder +
        '" value="' +
        (state.user.email || "") +
        '">' +
        '<div class="befir-error" id="befir-email-error"></div>' +
        "</div>" +
        '<div class="befir-error" id="befir-form-error" style="margin-top:4px;"></div>' +
        '<div class="befir-form-buttons">' +
        '<button class="befir-secondary-btn" data-act="back-lang">' +
        t.back +
        "</button>" +
        '<button class="befir-primary-btn" data-act="start-chat">' +
        t.startChat +
        "</button>" +
        "</div>" +
        "</div>";
    } else {
      // صفحه چت
      bodyHTML +=
        '<div class="befir-screen active" id="befir-screen-chat">' +
        '<div class="befir-chat-messages" id="befir-messages"></div>' +
        '<div class="befir-chat-footer">' +
        '<div class="befir-attach-hint">' +
        t.attachHint +
        "</div>" +
        '<div class="befir-input-row">' +
        '<button class="befir-circle-icon" type="button" id="befir-attach-btn">📷</button>' +
        '<input type="file" id="befir-file" accept="image/*" style="display:none;">' +
        '<textarea class="befir-textarea" id="befir-input" placeholder="' +
        t.inputPlaceholder +
        '"></textarea>' +
        '<button class="befir-circle-icon" type="button" id="befir-send-btn">' +
        t.btnSend +
        "</button>" +
        "</div>" +
        '<div class="befir-file-info" id="befir-file-info"></div>' +
        "</div>" +
        "</div>";
    }

    bodyHTML += "</div>";

    box.innerHTML = headerHTML + bodyHTML;

    // هدر اکشن‌ها
    var minimizeBtn = box.querySelector('[data-act="minimize"]');
    var closeBtn = box.querySelector('[data-act="close"]');
    if (minimizeBtn) {
      minimizeBtn.onclick = function () {
        state.minimized = !state.minimized;
        render();
      };
    }
    if (closeBtn) {
      closeBtn.onclick = function () {
        box.style.display = "none";
      };
    }

    // انتخاب زبان
    box.querySelectorAll(".befir-pill-btn[data-lang]").forEach(function (btn) {
      btn.onclick = function () {
        var lang = btn.getAttribute("data-lang");
        state.lang = lang;
        state.step = "form";
        render();
      };
    });

    // فرم
    var backLangBtn = box.querySelector('[data-act="back-lang"]');
    var startChatBtn = box.querySelector('[data-act="start-chat"]');
    if (backLangBtn) {
      backLangBtn.onclick = function () {
        state.step = "language";
        render();
      };
    }
    if (startChatBtn) {
      startChatBtn.onclick = function () {
        var t = TEXTS[state.lang];
        var nameEl = d.getElementById("befir-name");
        var phoneEl = d.getElementById("befir-phone");
        var emailEl = d.getElementById("befir-email");
        var nameErr = d.getElementById("befir-name-error");
        var phoneErr = d.getElementById("befir-phone-error");
        var emailErr = d.getElementById("befir-email-error");
        var formErr = d.getElementById("befir-form-error");

        nameErr.textContent = "";
        phoneErr.textContent = "";
        emailErr.textContent = "";
        formErr.textContent = "";

        var name = (nameEl.value || "").trim();
        var phone = (phoneEl.value || "").trim();
        var email = (emailEl.value || "").trim();

        var ok = true;

        if (name.length < 2) {
          nameErr.textContent = t.nameError;
          ok = false;
        }

        var digits = phone.replace(/\D/g, "");
        if (digits.length < 8) {
          phoneErr.textContent = t.phoneError;
          ok = false;
        }

        if (email) {
          var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          if (!emailOk) {
            emailErr.textContent = t.emailError;
            ok = false;
          }
        }

        if (!ok) {
          formErr.textContent = t.validationError;
          return;
        }

        state.user = { name: name, phone: phone, email: email };
        state.step = "chat";
        state.messages = [];
        attachedFile = null;
        render();
        initChat();
      };
    }

    // صفحه چت
    if (state.step === "chat") {
      var msgContainer = d.getElementById("befir-messages");
      var inputEl = d.getElementById("befir-input");
      var sendBtn = d.getElementById("befir-send-btn");
      var attachBtn = d.getElementById("befir-attach-btn");
      var fileInput = d.getElementById("befir-file");
      var fileInfo = d.getElementById("befir-file-info");
      var t = TEXTS[state.lang];

      function renderMessages() {
        if (!msgContainer) return;
        msgContainer.innerHTML = "";
        state.messages.forEach(function (m) {
          var row = d.createElement("div");
          row.className =
            "befir-msg-row " + (m.from === "user" ? "befir-user" : "befir-bot");
          var bubble = d.createElement("div");
          bubble.className = "befir-msg-bubble";
          bubble.textContent = m.text;
          var time = d.createElement("div");
          time.className = "befir-msg-time";
          time.textContent = formatTime(m.time);
          row.appendChild(bubble);
          row.appendChild(time);
          msgContainer.appendChild(row);
        });
        msgContainer.scrollTop = msgContainer.scrollHeight + 9999;
      }

      function addMessage(from, text) {
        state.messages.push({
          from: from,
          text: text,
          time: Date.now()
        });
        renderMessages();
      }

      // اولین بار: پیام خوش‌آمد
      if (!state._initiated) {
        state._initiated = true;
        var hello = t.autoHello.replace("{name}", state.user.name || "");
        addMessage("bot", hello);
        addMessage("bot", t.autoIntro);
      } else {
        renderMessages();
      }

      if (attachBtn && fileInput && fileInfo) {
        attachBtn.onclick = function () {
          fileInput.click();
        };
        fileInput.onchange = function (e) {
          var file = e.target.files[0];
          if (!file) {
            attachedFile = null;
            fileInfo.textContent = "";
            return;
          }
          if (file.size > 2 * 1024 * 1024) {
            attachedFile = null;
            fileInput.value = "";
            fileInfo.textContent = t.fileTooBig;
            return;
          }
          attachedFile = file;
          fileInfo.textContent = t.fileSelected.replace("{name}", file.name);
        };
      }

      function send() {
        if (!inputEl) return;
        var text = (inputEl.value || "").trim();
        if (!text && !attachedFile) return;

        var messageText = text;
        if (attachedFile) {
          messageText += "\n" + t.imageTag;
        }

        addMessage("user", messageText);
        inputEl.value = "";
        if (fileInput) fileInput.value = "";
        if (fileInfo) fileInfo.textContent = "";
        var fileToSend = attachedFile;
        attachedFile = null;

        // اینجا بعداً به n8n / بک‌اند وصل می‌کنیم:
        // sendToBackend({ lang:state.lang, user:state.user, text:text, file:fileToSend, history:state.messages });

        // پاسخ اتومات، در زبان مناسب
        setTimeout(function () {
          addMessage("bot", t.autoReply);
        }, 700);
      }

      if (sendBtn) sendBtn.onclick = send;
      if (inputEl) {
        inputEl.onkeydown = function (e) {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        };
      }
    }

    // در حالت مینیمایز، بدنه را مخفی کن
    var bodyEl = box.querySelector(".befir-body");
    if (bodyEl) {
      bodyEl.style.display = state.minimized ? "none" : "flex";
    }
  }

  function initChat() {
    // فعلاً منطق آغاز چت داخل render چت انجام شده
  }

  // toggle برای دکمه بیرونی
  window.toggleBefirChat = function () {
    if (!box) return;
    if (box.style.display === "none") {
      box.style.display = "flex";
      state.minimized = false;
      render();
    } else {
      box.style.display = "none";
    }
  };

  // شروع
  render();
})();
