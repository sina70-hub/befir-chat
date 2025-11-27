(function () {
  var d = document;

  // اگر قبلاً لود شده بود، فقط باز/بسته کن
  if (window.__befirChatLoaded) {
    if (window.toggleBefirChat) window.toggleBefirChat();
    return;
  }
  window.__befirChatLoaded = true;

  var STATE_KEY = "befirChatState_v1";

  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Cannot load chat state", e);
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Cannot save chat state", e);
    }
  }

  // متن‌ها برای سه زبان
  var TEXTS = {
    fa: {
      langLabel: "🇮🇷 فارسی",
      dir: "rtl",
      title: "گفتگو با بفر",
      chooseLang: "لطفاً زبان خود را انتخاب کنید:",
      formTitle: "شروع گفتگو",
      name: "نام",
      phone: "شماره موبایل",
      email: "ایمیل",
      startChat: "شروع گفتگو",
      back: "بازگشت",
      validationError: "لطفاً همه فیلدها را به‌درستی پر کنید.",
      invalidEmail: "ایمیل نامعتبر است.",
      invalidPhone: "شماره موبایل نامعتبر است.",
      chatPlaceholder: "پیام خود را بنویسید...",
      send: "ارسال",
      attach: "اسکرین‌شات / عکس",
      fileTooBig: "حجم تصویر زیاد است. حداکثر ۲ مگابایت.",
      fileSelected: "تصویر انتخاب شد: {name}",
      mini: "کوچک‌نمایی",
      close: "بستن",
      systemHello: "سلام 👋 من بُفر بات هستم؛ در چه زمینه‌ای می‌تونم کمک کنم؟",
      imageTag: "[تصویر پیوست شده]",
      mockReply: "پیام شما دریافت شد؛ به‌زودی پاسخ می‌دهیم. (این پاسخ آزمایشی است)"
    },
    en: {
      langLabel: "🇬🇧 English",
      dir: "ltr",
      title: "Chat with Befir",
      chooseLang: "Please choose your language:",
      formTitle: "Start conversation",
      name: "Name",
      phone: "Phone number",
      email: "Email",
      startChat: "Start chat",
      back: "Back",
      validationError: "Please fill all fields correctly.",
      invalidEmail: "Email is not valid.",
      invalidPhone: "Phone number is not valid.",
      chatPlaceholder: "Type your message...",
      send: "Send",
      attach: "Attach screenshot / image",
      fileTooBig: "Image is too large. Max 2 MB.",
      fileSelected: "Image selected: {name}",
      mini: "Minimize",
      close: "Close",
      systemHello: "Hi 👋 I'm Befir bot. How can I help you today?",
      imageTag: "[Image attached]",
      mockReply: "We received your message; you'll get a reply soon. (Mock reply)"
    },
    ku: {
      langLabel: "🇮🇶 کوردی",
      dir: "rtl",
      title: "وتووێژ لەگەڵ بفر",
      chooseLang: "تکایە زمانەکەت هەڵبژێرە:",
      formTitle: "دەستپیکردنی گفتوگو",
      name: "ناو",
      phone: "ژمارەی مۆبایل",
      email: "ئیمەیل",
      startChat: "دەستپێکردن",
      back: "گەڕانەوە",
      validationError: "تکایە هەموو خانەکان بە دروستی پڕبکەوە.",
      invalidEmail: "ئیمەیل نادروستە.",
      invalidPhone: "ژمارەی مۆبایل نادروستە.",
      chatPlaceholder: "پەیامەکەت بنووسە...",
      send: "ناردن",
      attach: "ناردنی وێنە / سکرین‌شات",
      fileTooBig: "قەبارەی وێنە زۆرە. زۆرترین ٢MB.",
      fileSelected: "وێنە هەڵبژێردرا: {name}",
      mini: "بچووککردنەوە",
      close: "داخستن",
      systemHello: "سڵاو 👋 من بُفر باتم؛ لە چی ده‌توانم یارمەتیت بدەم؟",
      imageTag: "[وێنە هاوپێچ کرا]",
      mockReply: "پەیامەکەت گەلایەوە؛ بەزووترین کات وەڵام دەدرێت. (وەڵامی تاقیکارییە)"
    }
  };

  var DEFAULT_STATE = {
    step: "language", // language | form | chat
    lang: "fa",
    user: { name: "", phone: "", email: "" },
    minimized: false,
    messages: [] // {from:'user'|'bot'|'system', text:string, time:number}
  };

  var state = loadState() || DEFAULT_STATE;

  // کم‌کم اگر key عوض شد، اینجا می‌توانی migration بدی
  function resetStateKeepUser() {
    state = {
      step: "chat",
      lang: state.lang || "fa",
      user: state.user || { name: "", phone: "", email: "" },
      minimized: false,
      messages: state.messages || []
    };
    saveState();
  }

  // ساخت باکس اصلی
  var box = d.createElement("div");
  box.id = "befirChatBox";
  box.style.position = "fixed";
  box.style.zIndex = "999999";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
  box.style.background = "#ffffff";
  box.style.overflow = "hidden";
  box.style.borderRadius = "16px";
  box.style.fontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Tahoma,Arial,sans-serif';

  d.body.appendChild(box);

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function applyLayout() {
    if (state.minimized) {
      // در حالت مینیمایز فقط هدر دیده شود
      box.style.height = "52px";
    } else if (isMobile()) {
      // موبایل: تقریبا تمام صفحه
      box.style.width = "100%";
      box.style.height = "100%";
      box.style.left = "0";
      box.style.right = "0";
      box.style.bottom = "0";
      box.style.top = "0";
      box.style.borderRadius = "0";
    } else {
      // دسکتاپ: پنجره در گوشه پایین چپ (یا راست در صورت نیاز)
      box.style.width = "360px";
      box.style.height = "480px";
      box.style.left = "20px"; // گوشه چپ پایین
      box.style.right = "";
      box.style.bottom = "90px";
      box.style.top = "";
      box.style.borderRadius = "16px";
    }
  }

  window.addEventListener("resize", applyLayout);

  var attachedFile = null; // فایل انتخاب‌شده (فقط برای ارسال، نه ذخیره در state)

  function formatTime(t) {
    var d = new Date(t);
    return (
      d.getHours().toString().padStart(2, "0") +
      ":" +
      d.getMinutes().toString().padStart(2, "0")
    );
  }

  function addMessage(from, text) {
    state.messages.push({
      from: from,
      text: text,
      time: Date.now()
    });
    saveState();
  }

  // این تابع بعداً به n8n/ChatGPT وصل می‌شود
  function sendToBackend(payload) {
    // 🔴 اینجا را بعداً در n8n صدا می‌زنیم (Webhook یا HTTP Request)
    // فعلاً فقط در کنسول نمایش می‌دهیم
    console.log("Send to backend (stub):", payload);
  }

  function render() {
    applyLayout();

    var t = TEXTS[state.lang] || TEXTS.fa;
    var dir = t.dir || "rtl";
    var align = dir === "rtl" ? "right" : "left";

    box.setAttribute("dir", dir);
    box.style.textAlign = align;

    var headerHTML =
      '<div style="background:#ffcc00;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;">' +
      '<div style="font-weight:bold;font-size:14px;color:#111;">' +
      t.title +
      "</div>" +
      '<div style="display:flex;gap:4px;">' +
      '<button data-act="minimize" style="border:none;background:rgba(0,0,0,0.08);border-radius:6px;padding:2px 6px;font-size:11px;cursor:pointer;">' +
      t.mini +
      "</button>" +
      '<button data-act="close" style="border:none;background:rgba(0,0,0,0.18);border-radius:6px;padding:2px 8px;font-size:12px;cursor:pointer;">×</button>' +
      "</div>" +
      "</div>";

    var contentHTML = "";

    if (state.step === "language") {
      contentHTML =
        '<div style="padding:14px;font-size:13px;">' +
        "<p>" +
        t.chooseLang +
        "</p>" +
        '<div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">';

      ["fa", "en", "ku"].forEach(function (lng) {
        var tt = TEXTS[lng];
        contentHTML +=
          '<button data-lang="' +
          lng +
          '" style="border:1px solid #ddd;border-radius:10px;padding:8px 10px;font-size:13px;cursor:pointer;text-align:center;background:#f9f9f9;">' +
          tt.langLabel +
          "</button>";
      });

      contentHTML += "</div></div>";
    } else if (state.step === "form") {
      contentHTML =
        '<div style="padding:14px;font-size:13px;display:flex;flex-direction:column;gap:10px;">' +
        "<div style='font-weight:bold;font-size:13px;'>" +
        t.formTitle +
        "</div>" +
        "<label>" +
        t.name +
        "<br><input id='befirName' style='width:100%;margin-top:4px;padding:6px 8px;border-radius:8px;border:1px solid #ddd;font-size:13px;' value=\"" +
        (state.user.name || "") +
        '"></label>' +
        "<label>" +
        t.phone +
        "<br><input id='befirPhone' style='width:100%;margin-top:4px;padding:6px 8px;border-radius:8px;border:1px solid #ddd;font-size:13px;' value=\"" +
        (state.user.phone || "") +
        '"></label>' +
        "<label>" +
        t.email +
        "<br><input id='befirEmail' style='width:100%;margin-top:4px;padding:6px 8px;border-radius:8px;border:1px solid #ddd;font-size:13px;' value=\"" +
        (state.user.email || "") +
        '"></label>' +
        "<div id='befirFormError' style='color:#c00;font-size:12px;min-height:16px;'></div>" +
        "<div style='display:flex;justify-content:space-between;margin-top:6px;gap:8px;'>" +
        "<button data-act='backToLang' style='flex:1;border:none;border-radius:8px;padding:7px 10px;font-size:13px;background:#f1f1f1;cursor:pointer;'>" +
        t.back +
        "</button>" +
        "<button data-act='startChat' style='flex:1;border:none;border-radius:8px;padding:7px 10px;font-size:13px;background:#111;color:#fff;cursor:pointer;'>" +
        t.startChat +
        "</button>" +
        "</div>" +
        "</div>";
    } else {
      // chat
      contentHTML =
        "<div style='flex:1;display:flex;flex-direction:column;height:100%;'>" +
        "<div id='befirMessages' style='flex:1;padding:10px;overflow-y:auto;background:#f7f7f7;font-size:13px;'>";
      state.messages.forEach(function (msg) {
        var isUser = msg.from === "user";
        var isSystem = msg.from === "system";
        var alignSelf = isUser ? "flex-end" : "flex-start";
        var bg = isUser ? "#111" : isSystem ? "#e0e0e0" : "#ffffff";
        var color = isUser ? "#fff" : "#111";

        contentHTML +=
          "<div style='display:flex;flex-direction:column;margin-bottom:6px;align-items:" +
          (isUser ? "flex-end" : "flex-start") +
          ";'>" +
          "<div style='max-width:80%;padding:6px 9px;border-radius:10px;background:" +
          bg +
          ";color:" +
          color +
          ";white-space:pre-wrap;word-wrap:break-word;'>" +
          msg.text +
          "</div>" +
          "<div style='font-size:10px;color:#777;margin-top:2px;'>" +
          formatTime(msg.time) +
          "</div>" +
          "</div>";
      });

      contentHTML +=
        "</div>" +
        "<div style='padding:6px 8px;border-top:1px solid #ddd;background:#fff;'>" +
        "<div style='display:flex;flex-direction:row;gap:6px;align-items:center;'>" +
        "<label style='font-size:11px;cursor:pointer;white-space:nowrap;'>" +
        t.attach +
        "<input id='befirFile' type='file' accept='image/*' style='display:none;'>" +
        "</label>" +
        "<input id='befirInput' placeholder='" +
        t.chatPlaceholder +
        "' style='flex:1;border-radius:999px;border:1px solid #ddd;padding:6px 10px;font-size:13px;'>" +
        "<button id='befirSendBtn' style='border:none;border-radius:999px;padding:6px 14px;background:#111;color:#fff;font-size:13px;cursor:pointer;'>" +
        t.send +
        "</button>" +
        "</div>" +
        "<div id='befirFileInfo' style='font-size:11px;color:#666;margin-top:3px;min-height:14px;'></div>" +
        "</div>" +
        "</div>";
    }

    var bodyHTML =
      "<div id='befirChatInner' style='display:flex;flex-direction:column;height:100%;'>" +
      headerHTML +
      "<div id='befirChatContent' style='flex:1;overflow:hidden;'>" +
      contentHTML +
      "</div>" +
      "</div>";

    box.innerHTML = bodyHTML;

    // در حالت مینیمایز، فقط هدر دیده شود
    var contentEl = d.getElementById("befirChatContent");
    if (state.minimized && contentEl) {
      contentEl.style.display = "none";
    }

    // لیسنرهای هدر
    var minBtn = box.querySelector("[data-act='minimize']");
    var closeBtn = box.querySelector("[data-act='close']");
    if (minBtn) {
      minBtn.onclick = function () {
        state.minimized = !state.minimized;
        saveState();
        render();
      };
    }
    if (closeBtn) {
      closeBtn.onclick = function () {
        box.style.display = "none";
        saveState();
      };
    }

    // مرحله زبان
    box.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.onclick = function () {
        var lng = btn.getAttribute("data-lang");
        state.lang = lng;
        state.step = "form";
        saveState();
        render();
      };
    });

    // مرحله فرم
    var backBtn = box.querySelector("[data-act='backToLang']");
    var startBtn = box.querySelector("[data-act='startChat']");
    if (backBtn) {
      backBtn.onclick = function () {
        state.step = "language";
        saveState();
        render();
      };
    }
    if (startBtn) {
      startBtn.onclick = function () {
        var nameEl = d.getElementById("befirName");
        var phoneEl = d.getElementById("befirPhone");
        var emailEl = d.getElementById("befirEmail");
        var errEl = d.getElementById("befirFormError");

        var name = (nameEl.value || "").trim();
        var phone = (phoneEl.value || "").trim();
        var email = (emailEl.value || "").trim();

        var t = TEXTS[state.lang] || TEXTS.fa;

        function isEmailValid(e) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        }
        function isPhoneValid(p) {
          return p.replace(/\D/g, "").length >= 8;
        }

        if (!name || !phone || !email) {
          errEl.textContent = t.validationError;
          return;
        }
        if (!isEmailValid(email)) {
          errEl.textContent = t.invalidEmail;
          return;
        }
        if (!isPhoneValid(phone)) {
          errEl.textContent = t.invalidPhone;
          return;
        }

        state.user = { name: name, phone: phone, email: email };
        state.step = "chat";
        // اولین پیام سیستم
        if (!state.messages || state.messages.length === 0) {
          state.messages = [];
          addMessage("system", t.systemHello);
        }
        saveState();
        render();
      };
    }

    // مرحله چت
    var inputEl = d.getElementById("befirInput");
    var sendBtn = d.getElementById("befirSendBtn");
    var fileInput = d.getElementById("befirFile");
    var fileInfo = d.getElementById("befirFileInfo");
    var messagesEl = d.getElementById("befirMessages");

    if (messagesEl) {
      // اسکرول به آخر
      setTimeout(function () {
        messagesEl.scrollTop = messagesEl.scrollHeight + 9999;
      }, 50);
    }

    if (fileInput) {
      fileInput.onchange = function (e) {
        var f = e.target.files[0];
        var t = TEXTS[state.lang] || TEXTS.fa;

        if (!f) {
          attachedFile = null;
          fileInfo.textContent = "";
          return;
        }
        if (f.size > 2 * 1024 * 1024) {
          attachedFile = null;
          fileInput.value = "";
          fileInfo.textContent = t.fileTooBig;
          return;
        }
        attachedFile = f;
        fileInfo.textContent = t.fileSelected.replace("{name}", f.name);
      };
    }

    function doSend() {
      if (!inputEl || !sendBtn) return;
      var txt = (inputEl.value || "").trim();
      var t = TEXTS[state.lang] || TEXTS.fa;

      if (!txt && !attachedFile) return;

      var label = txt;
      if (attachedFile) {
        label += "\n" + t.imageTag;
      }

      addMessage("user", label);
      render(); // دوباره رندر تا پیام کاربر نمایش داده شود

      // بعد از رندر جدید، دوباره عناصر را بگیریم
      var newInput = d.getElementById("befirInput");
      var newFileInput = d.getElementById("befirFile");
      var newFileInfo = d.getElementById("befirFileInfo");
      if (newInput) newInput.value = "";
      if (newFileInput) newFileInput.value = "";
      if (newFileInfo) newFileInfo.textContent = "";
      var fileToSend = attachedFile;
      attachedFile = null;

      // آماده کردن payload برای n8n / backend
      var payload = {
        lang: state.lang,
        user: state.user,
        text: txt,
        hasImage: !!fileToSend,
        conversation: state.messages
      };

      if (fileToSend) {
        var reader = new FileReader();
        reader.onload = function () {
          payload.imageData = reader.result; // base64
          sendToBackend(payload);
        };
        reader.readAsDataURL(fileToSend);
      } else {
        sendToBackend(payload);
      }

      // پاسخ آزمایشی (بعداً حذف می‌شود و جای آن پاسخ واقعی ChatGPT می‌آید)
      setTimeout(function () {
        var t = TEXTS[state.lang] || TEXTS.fa;
        addMessage("bot", t.mockReply);
        render();
      }, 800);
    }

    if (sendBtn && inputEl) {
      sendBtn.onclick = doSend;
      inputEl.onkeydown = function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          doSend();
        }
      };
    }
  }

  // toggle جهانی
  window.toggleBefirChat = function () {
    if (box.style.display === "none") {
      box.style.display = "flex";
      applyLayout();
    } else {
      box.style.display = "none";
    }
  };

  // اگر state وجود دارد (لوکال‌استورج)، از همان ادامه بده
  if (!state || !state.step) {
    state = DEFAULT_STATE;
  }

  render();
})();
