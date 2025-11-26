(function () {
  var d = document;

  // اگر چت‌باکس از قبل ساخته شده، فقط مخفی/نمایش کن
  var old = d.getElementById("befirChatBox");
  if (old) {
    old.style.display = old.style.display === "none" ? "flex" : "none";
    return;
  }

  // ساخت باکس چت
  var box = d.createElement("div");
  box.id = "befirChatBox";
  box.style.position = "fixed";
  box.style.bottom = "90px";
  box.style.right = "20px";
  box.style.width = "320px";
  box.style.height = "420px";
  box.style.background = "#ffffff";
  box.style.borderRadius = "12px";
  box.style.boxShadow = "0 0 14px rgba(0,0,0,0.2)";
  box.style.zIndex = "999999";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.fontFamily = "Tahoma, sans-serif";
  box.style.direction = "rtl";

  box.innerHTML = `
    <div style="background:#ffcc00;padding:10px;border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:space-between;">
      <span style="font-weight:bold;">گفتگو با بفر</span>
      <button id="befirChatClose" style="border:none;background:transparent;cursor:pointer;font-size:16px;">✕</button>
    </div>
    <div id="befirChatLog" style="flex:1;padding:8px;overflow-y:auto;background:#fafafa;font-size:13px;"></div>
    <div style="padding:8px;border-top:1px solid #eee;display:flex;gap:4px;">
      <input id="befirChatInput" type="text" placeholder="پیام خود را بنویسید…" 
             style="flex:1;padding:6px;border-radius:8px;border:1px solid #ccc;text-align:right;">
      <button id="befirChatSend" 
              style="padding:6px 10px;border:none;border-radius:8px;background:#ffcc00;cursor:pointer;font-weight:bold;">
        ارسال
      </button>
    </div>
  `;

  d.body.appendChild(box);

  var input = d.getElementById("befirChatInput");
  var log = d.getElementById("befirChatLog");
  var btnSend = d.getElementById("befirChatSend");
  var btnClose = d.getElementById("befirChatClose");

  function send() {
    var text = input.value.trim();
    if (!text) return;
    // پیام کاربر
    log.innerHTML += `<div style="margin:4px 0;text-align:right;color:#333;">🙋‍♂️ ${text}</div>`;
    input.value = "";
    // پاسخ تستی ربات (بعداً این را به n8n + GPT وصل می‌کنیم)
    log.innerHTML += `<div style="margin:4px 0;text-align:left;color:#0066cc;">🤖 پیام شما دریافت شد.</div>`;
    log.scrollTop = log.scrollHeight;
  }

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") send();
  });

  btnSend.onclick = send;

  btnClose.onclick = function () {
    box.style.display = "none";
  };
})();
