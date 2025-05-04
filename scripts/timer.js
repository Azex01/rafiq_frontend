document.addEventListener("DOMContentLoaded", () => {
  /* عناصر المؤقّت */
  const recoveryDaysEl = document.getElementById("recovery-days");
  const recoveryTimeDetails = document.getElementById("recovery-time-details");
  const startBtn = document.getElementById("start-recovery-btn");
  const resetBtn = document.getElementById("reset-recovery-btn");

  /* نافذة الانتكاسة */
  const relapseModal = document.getElementById("relapse-modal");
  const confirmRelapseBtn = document.getElementById("confirm-relapse-btn");
  document
    .querySelectorAll(".close-modal")
    .forEach(
      (b) => (b.onclick = () => relapseModal.classList.remove("active"))
    );

  /* مؤقّت */
  let timerInterval;
  const savedISO = window.appHelpers.getData("recoveryStartDate");
  if (savedISO) initExisting(savedISO);
  startBtn.onclick = () => {
    const iso = new Date().toISOString();
    window.appHelpers.saveData("recoveryStartDate", iso);
    initExisting(iso);

    // إرسال إشعار بالتغيير للمستمعين الآخرين (مثل bouncing.js)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "recoveryStartDate",
        newValue: iso,
      })
    );
  };

  /* الانتكاسة */
  resetBtn.onclick = () => relapseModal.classList.add("active");
  confirmRelapseBtn.onclick = () => {
    // حفظ قيمة null لتاريخ البدء
    window.appHelpers.saveData("recoveryStartDate", null);

    // إيقاف المؤقت
    clearInterval(timerInterval);

    // إعادة تعيين عناصر العرض
    recoveryDaysEl.textContent = "0";
    recoveryTimeDetails.textContent = "⌛ 0 ساعة و 0 دقيقة و 0 ثانية";

    // إظهار زر البدء وإخفاء زر الإعادة
    startBtn.style.display = "inline-block";
    resetBtn.style.display = "none";

    // إغلاق نافذة التأكيد
    relapseModal.classList.remove("active");

    // إرسال إشعار صريح إلى المستمعين الآخرين للتأكد من إعادة الضبط
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "recoveryStartDate",
        newValue: null,
      })
    );
  };

  /* ————— الدوال ————— */
  function initExisting(iso) {
    startBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
    startTimer(new Date(iso));
  }

  function startTimer(startDate) {
    clearInterval(timerInterval);
    updateTimer(startDate);
    timerInterval = setInterval(() => updateTimer(startDate), 1000);
  }

  function updateTimer(startDate) {
    const diff = Date.now() - startDate.getTime();
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff / 36e5) % 24);
    const m = Math.floor((diff / 6e4) % 60);
    const s = Math.floor((diff / 1e3) % 60);
    recoveryDaysEl.textContent = d;
    recoveryTimeDetails.textContent = `⌛ ${h} ساعة و ${m} دقيقة و ${s} ثانية`;
  }
});
