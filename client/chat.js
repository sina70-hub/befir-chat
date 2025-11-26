(function(){
    let d=document;
    let w=d.createElement('div');
    w.style.position='fixed';
    w.style.bottom='20px';
    w.style.right='20px';
    w.style.width='60px';
    w.style.height='60px';
    w.style.cursor='pointer';
    w.style.zIndex='999999';
    w.style.borderRadius='50%';
    w.style.background='#ffcc00';
    w.style.boxShadow='0 0 10px rgba(0,0,0,0.3)';
    w.innerHTML='💬';
    d.body.appendChild(w);

    w.onclick=function(){
        alert('Chat system test – اتصال موفق به فایل JS!');
    };
})();
