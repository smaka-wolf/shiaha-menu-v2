// تسجيل Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/shiaha-menu-v2/service-worker.js')
    .then(registration => {
      console.log('✅ Service Worker تسجل بنجاح');

      // التحقق من وجود تحديثات
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateNotice(); // إظهار إشعار التحديث
          }
        };
      };
    })
    .catch(error => {
      console.error('❌ فشل التسجيل:', error);
    });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔁 Controller changed');
  });
}

// دالة عرض الإشعار مع عد تنازلي
function showUpdateNotice() {
  const notice = document.createElement('div');
  notice.innerHTML = `
    <div style="
      position:fixed;
      bottom:20px;
      left:50%;
      transform:translateX(-50%);
      background:black;
      color:white;
      padding:12px 20px;
      border-radius:8px;
      box-shadow:0 4px 10px rgba(0,0,0,0.3);
      z-index:9999;
      font-size:14px;
    ">
      🔄 تم تحديث الموقع. سيتم إعادة التحميل خلال <span id="update-timer">5</span> ثوانٍ...
    </div>
  `;
  document.body.appendChild(notice);

  let countdown = 5;
  const interval = setInterval(() => {
    countdown--;
    document.getElementById('update-timer').textContent = countdown;
    if (countdown === 0) {
      clearInterval(interval);
      window.location.reload(true);
    }
  }, 1000);
}
