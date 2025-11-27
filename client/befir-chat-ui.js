(function () {
  // همیشه پاکسازی کامل — هیچ حالت قدیمی نگه داشته نشود
  try { localStorage.clear(); } catch (e) {}

  // اگر قبلاً چت در DOM ساخته شده بوده → حذف کن
  var oldBox = document.getElementById("befirChatBox");
  if (oldBox) oldBox.remove();

  console.log("🔥 Befir Chat — fresh load");

  // اینجا UI واقعی ساخته می‌شود
  var box = document.createElement("div");
  box.id = "befirChatBox";
  box.style.position = "fixed";
  box.style.zIndex = "999999";
  box.style.bottom = "90px";
  box.style.left = "20px";
  box.style.width = "360px";
  box.style.height = "480px";
  box.style.background = "#fff";
  box.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";
  box.style.borderRadius = "16px";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.overflow = "hidden";
  box.style.fontFamily = "sans-serif";

  document.body.appendChild(box);

  // فقط یک مرحله: انتخاب زبان → فرم → چت
  box.innerHTML = `
    <div style="background:#ffcc00;padding:10px;font-weight:bold;">
      👋 گفتگو با بفر
    </div>
    <div style="padding:12px;font-size:13px;">
      <p>نسخه تست ساده — جهت دیباگ مشکل کش</p>
      <p>این چت همیشه از صفر شروع می‌شود.</p>
    </div>
  `;

  // تابع باز/بسته کردن
  window.toggleBefirChat = function () {
    box.style.display =
      box.style.display === "none" ? "flex" : "none";
  };
})();
