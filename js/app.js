// تسجيل الـ Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/shiaha-menu-v2/service-worker.js')
    .then(registration => {
      console.log('✅ Service Worker تسجل بنجاح');
    })
    .catch(error => {
      console.error('❌ فشل التسجيل:', error);
    });

  // إظهار إشعار عند وجود تحديث وتفعيل SW جديد
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const notice = document.createElement('div');
    notice.textContent = "🚀 تحديث جديد متاح، يتم التحميل الآن...";
    notice.style.position = 'fixed';
    notice.style.bottom = '10px';
    notice.style.left = '10px';
    notice.style.padding = '10px';
    notice.style.background = 'black';
    notice.style.color = 'white';
    notice.style.borderRadius = '5px';
    notice.style.zIndex = '9999';
    document.body.appendChild(notice);

    setTimeout(() => window.location.reload(), 1500);
  });
}
