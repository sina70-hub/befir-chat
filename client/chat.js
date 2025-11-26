(function(){

    // ایجاد دکمه همان قبلی است…

    w.onclick=function(){

        // ساخت لایه چت
        let box=document.createElement('div');
        box.id="befirChatBox";
        box.style.position="fixed";
        box.style.bottom="90px";
        box.style.right="20px";
        box.style.width="320px";
        box.style.height="420px";
        box.style.background="#ffffff";
        box.style.borderRadius="12px";
        box.style.boxShadow="0 0 14px rgba(0,0,0,0.2)";
        box.style.zIndex="999999";
        box.style.display="flex";
        box.style.flexDirection="column";
        box.style.fontFamily="Tahoma, sans-serif";
        document.body.appendChild(box);

        box.innerHTML=`
        <div style="background:#ffcc00;padding:12px;border-radius:12px 12px 0 0;font-weight:bold;text-align:center">
            💬 ارتباط با بفر — آنلاین
        </div>
        <div style="padding:10px;text-align:right;direction:rtl;color:#555;font-size:14px;">
            لطفا نام و شماره تماس خود را جهت شروع گفتگو وارد کنید
        </div>
        <div style="padding:10px;">
            <input id="fn" type="text" placeholder="نام شما" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;text-align:right;">
            <input id="pn" type="text" placeholder="شماره تماس" style="width:100%;padding:8px;margin-bottom:8px;border:1px solid #ccc;border-radius:6px;text-align:right;">
            <button id="startChat" style="width:100%;padding:8px;background:#ffcc00;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">شروع گفتگو</button>
        </div>
        `;

        document.getElementById("startChat").onclick = function(){
            let name=document.getElementById("fn").value;
            let phone=document.getElementById("pn").value;
            alert("نام: "+name+" — شماره: "+phone);
        }
    };

})();
