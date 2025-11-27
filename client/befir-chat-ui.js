(function () {
  // ---- DEBUG: فقط برای مطمئن شدن که فایل جدید لود شده ----
  alert("Befir Chat UI v3 loaded (بدون کش)");

  var d = document;

  // اگر قبلاً چت ساخته شده، کامل حذفش کن
  var oldBox = d.getElementById("befirChatBox");
  if (oldBox) {
    oldBox.parentNode.removeChild(oldBox);
  }

  // ⚠ هیچ چیزی در localStorage / sessionStorage ذخیره نمی‌کنیم.
  // یعنی هر بار صفحه رفرش شود، چت از صفر شروع می‌شود.

  // ========= ساخت باکس اصلی چت =========
  var box = d.createElement("div");
  box.id = "befirChatBox";
  box.style.position = "fixed";
  box.style.zIndex = "999999";
  box.style.bottom = "90px";
  box.style.left = "20px";
  box.style.width = "360px";
  box.style.maxWidth = "95vw";
  box.style.height = "480px";
  box.style.maxHeight = "80vh";
  box.style.background = "#ffffff";
  box.style.borderRadius = "14px";
  box.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.overflow = "hidden";
  box.style.fontFamily = "Tahoma, sans-serif";

  d.body.appendChild(box);

  // ========= هدر (نوار زرد بالا) =========
  var header = d.createElement("div");
  header.style.background = "#ffcc00";
  header.style.color = "#000";
  header.style.padding = "8px 10px";
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";
  header.style.fontSize = "13px";
  header.style.fontWeight = "bold";

  var title = d.createElement("span");
  title.innerHTML = "گفتگو با بفر";

  var closeBtn = d.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.border = "none";
  closeBtn.style.background = "transparent";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "18px";
  closeBtn.style.lineHeight = "18px";
  closeBtn.onclick = function () {
    // بستن کامل چت
    box.style.display = "none";
  };

  header.appendChild(title);
  header.appendChild(closeBtn);
  box.appendChild(header);

  // ========= بدنه داخلی برای مرحله‌ها =========
  var content = d.createElement("div");
  content.style.flex = "1";
  content.style.display = "flex";
  content.style.flexDirection = "column";
  content.style.background = "#f7f7f7";
  box.appendChild(content);

  // ========= مرحله ۱: انتخاب زبان =========
  function renderLanguageStep() {
    content.innerHTML = "";

    var wrap = d.createElement("div");
    wrap.style.padding = "12px";
    wrap.style.fontSize = "13px";

    var p = d.createElement("p");
    p.innerHTML = "لطفاً زبان خود را انتخاب کنید:";
    p.style.marginBottom = "10px";
    wrap.appendChild(p);

    function makeLangButton(text) {
      var btn = d.createElement("button");
      btn.type = "button";
      btn.innerHTML = text;
      btn.style.width = "100%";
      btn.style.margin = "4px 0";
      btn.style.padding = "8px 10px";
      btn.style.borderRadius = "8px";
      btn.style.border = "1px solid #ddd";
      btn.style.background = "#fff";
      btn.style.cursor = "pointer";
      btn.style.textAlign = "right";
      btn.onmouseenter = function () {
        btn.style.background = "#f0f0f0";
      };
      btn.onmouseleave = function () {
        btn.style.background = "#fff";
      };
      return btn;
    }

    var faBtn = makeLangButton("🇮🇷 فارسی");
    var enBtn = makeLangButton("🇬🇧 English");
    var kuBtn = makeLangButton("🇮🇶 کوردی");

    // فعلاً فقط زبان را برای نمایش متن فرم نگه می‌داریم
    faBtn.onclick = function () {
      renderFormStep("fa");
    };
    enBtn.onclick = function () {
      renderFormStep("en");
    };
    kuBtn.onclick = function () {
      renderFormStep("ku");
    };

    wrap.appendChild(faBtn);
    wrap.appendChild(enBtn);
    wrap.appendChild(kuBtn);

    content.appendChild(wrap);
  }

  // ========= مرحله ۲: فرم اولیه (نام / موبایل / ایمیل) =========
  function renderFormStep(lang) {
    content.innerHTML = "";

    var wrap = d.createElement("div");
    wrap.style.padding = "12px";
    wrap.style.fontSize = "13px";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.height = "100%";

    var title = d.createElement("p");
    if (lang === "en") {
      title.innerHTML = "Start chat";
    } else if (lang === "ku") {
      title.innerHTML = "دەستپێکردنی گوتووێژ";
    } else {
      title.innerHTML = "شروع گفتگو";
    }
    title.style.marginBottom = "10px";
    wrap.appendChild(title);

    function makeInput(placeholder) {
      var input = d.createElement("input");
      input.type = "text";
      input.placeholder = placeholder;
      input.style.width = "100%";
      input.style.margin = "4px 0";
      input.style.padding = "6px 8px";
      input.style.borderRadius = "6px";
      input.style.border = "1px solid #ddd";
      input.style.fontSize = "12px";
      return input;
    }

    var nameInput = makeInput("نام");
    var phoneInput = makeInput("شماره موبایل");
    var mailInput = makeInput("ایمیل");

    wrap.appendChild(nameInput);
    wrap.appendChild(phoneInput);
    wrap.appendChild(mailInput);

    // دکمه‌ها
    var btnRow = d.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.justifyContent = "space-between";
    btnRow.style.marginTop = "12px";

    var backBtn = d.createElement("button");
    backBtn.type = "button";
    backBtn.innerHTML = "بازگشت";
    backBtn.style.flex = "1";
    backBtn.style.marginRight = "4px";
    backBtn.style.border = "none";
    backBtn.style.borderRadius = "8px";
    backBtn.style.padding = "8px 0";
    backBtn.style.background = "#e0e0e0";
    backBtn.style.cursor = "pointer";
    backBtn.onclick = function () {
      renderLanguageStep();
    };

    var startBtn = d.createElement("button");
    startBtn.type = "button";
    startBtn.innerHTML = "شروع گفتگو";
    startBtn.style.flex = "1";
    startBtn.style.marginLeft = "4px";
    startBtn.style.border = "none";
    startBtn.style.borderRadius = "8px";
    startBtn.style.padding = "8px 0";
    startBtn.style.background = "#000";
    startBtn.style.color = "#fff";
    startBtn.style.cursor = "pointer";

    startBtn.onclick = function () {
      // چک ساده اسپم — خیلی ابتدایی
      var nameVal = (nameInput.value || "").trim();
      var phoneVal = (phoneInput.value || "").trim();
      var emailVal = (mailInput.value || "").trim();

      if (!nameVal || nameVal.length < 2) {
        alert("لطفاً نام معتبر وارد کنید.");
        return;
      }
      if (!phoneVal || phoneVal.length < 8) {
        alert("شماره موبایل معتبر نیست.");
        return;
      }
      if (emailVal && emailVal.indexOf("@") === -1) {
        alert("ایمیل معتبر نیست.");
        return;
      }

      // اینجا بعداً می‌توانیم به n8n یا سرور وصل شویم
      // فعلاً فقط وارد صفحه چت می‌شویم
      renderChatStep({
        lang: lang,
        name: nameVal,
        phone: phoneVal,
        email: emailVal
      });
    };

    btnRow.appendChild(backBtn);
    btnRow.appendChild(startBtn);
    wrap.appendChild(btnRow);

    content.appendChild(wrap);
  }

  // ========= مرحله ۳: صفحه چت (سادۀ اولیه) =========
  function renderChatStep(userInfo) {
    content.innerHTML = "";

    var wrap = d.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.height = "100%";

    // لیست پیام‌ها
    var msgList = d.createElement("div");
    msgList.style.flex = "1";
    msgList.style.overflowY = "auto";
    msgList.style.padding = "8px";
    msgList.style.background = "#f7f7f7";

    // پیام خوش‌آمد
    var intro = d.createElement("div");
    intro.style.marginBottom = "8px";
    intro.style.textAlign = "right";
    intro.style.fontSize = "12px";
    intro.innerHTML =
      "پیام شما دریافت شد؛ به‌زودی پاسخ می‌دهیم. (این یک نسخه آزمایشی است)";
    msgList.appendChild(intro);

    wrap.appendChild(msgList);

    // ورودی و دکمه ارسال
    var inputRow = d.createElement("div");
    inputRow.style.display = "flex";
    inputRow.style.padding = "6px";
    inputRow.style.borderTop = "1px solid #ddd";
    inputRow.style.background = "#fff";

    var input = d.createElement("input");
    input.type = "text";
    input.placeholder = "پیام خود را بنویسید...";
    input.style.flex = "1";
    input.style.border = "1px solid #ddd";
    input.style.borderRadius = "16px";
    input.style.padding = "6px 10px";
    input.style.fontSize = "12px";
    inputRow.appendChild(input);

    var sendBtn = d.createElement("button");
    sendBtn.type = "button";
    sendBtn.innerHTML = "ارسال";
    sendBtn.style.marginRight = "6px";
    sendBtn.style.border = "none";
    sendBtn.style.borderRadius = "16px";
    sendBtn.style.padding = "6px 12px";
    sendBtn.style.background = "#ffcc00";
    sendBtn.style.cursor = "pointer";

    function addUserMessage(text) {
      var bubble = d.createElement("div");
      bubble.style.margin = "4px 0";
      bubble.style.textAlign = "right";

      var span = d.createElement("span");
      span.innerHTML = text;
      span.style.display = "inline-block";
      span.style.background = "#000000";
      span.style.color = "#ffffff";
      span.style.borderRadius = "14px";
      span.style.padding = "6px 10px";
      span.style.fontSize = "12px";

      bubble.appendChild(span);
      msgList.appendChild(bubble);
      msgList.scrollTop = msgList.scrollHeight;
    }

    sendBtn.onclick = function () {
      var txt = (input.value || "").trim();
      if (!txt) return;
      addUserMessage(txt);
      input.value = "";
    };

    inputRow.appendChild(sendBtn);
    wrap.appendChild(inputRow);

    content.appendChild(wrap);
  }

  // اولین مرحله:
  renderLanguageStep();

  // تابع toggle برای دکمه بیرونی
  window.toggleBefirChat = function () {
    if (!box || !box.style) return;
    box.style.display = box.style.display === "none" ? "flex" : "none";
  };
})();
