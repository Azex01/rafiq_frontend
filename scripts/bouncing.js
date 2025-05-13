document.addEventListener("DOMContentLoaded", () => {
  // إضافة حاوية العبارات المتحركة داخل قسم المؤقت
  const timerView = document.getElementById("timer-view");
  const quotesContainer = document.createElement("div");
  quotesContainer.id = "bouncing-quotes-container";
  timerView.appendChild(quotesContainer);

  // العبارات التحفيزية (نفس العبارات الموجودة حالياً)
  const quotes = [
    "اليوم فرصة جديدة 🌤️",
    "خطوة صغيرة = تقدّم كبير 🚶",
    "كل يوم تقاوم فيه، أنت تنجح ✨",
    "استمر، فأنت تتحسّن فعلًا 🙌",
    "ما دمت تحاول، فأنت بخير 🤍",
    "أنت أقرب مما تظن 🌱",
    "كل لحظة صبر تصنع فرقًا 🌟",
    "النقاء عادة تبنيها بهدوء 🕊️",
    "شجاعتك في الاستمرار، لا الكمال 💡",
    "لا أحد كامل… لكنك تبذل 💪",
    "أنت لست وحدك، نحن معك 🤝",
    "يوم نقي = خطوة نحو السلام 🧘",
    "اهدأ، وواصل 💭",
    "النمو بطيء… لكنه حقيقي 🍃",
    "ما تفعله اليوم يهم كثيرًا 📆",
    "كل مقاومة تُظهر قوتك 💎",
    "إنك تكبر من الداخل، لا تتوقف 📈",
    "بعض الأيام تحتاج فقط صبر 🤍",
    "كل يوم يمر… يزيدك وعيًا ☀️",
    "أنت تتغير فعلًا، ولو ببطء 🔄",
    "رحلة النقاء تبدأ من اليوم 🚪",
    "تذكّر: التقدّم أهم من الكمال 🛤️",
    "اهدِ نفسك يومًا نقيًا 🎁",
    "التحسّن لا يكون دفعة واحدة ⏳",
    "كل دقيقة طهارة لها أثر ✨",
    "اختر اليوم أن تستمر 🙏",
    "غدًا ستشكر نفسك 💌",
    "النية الطيبة تصنع طريقًا 🌈",
    "لست مطالبًا أن تكون قويًا دائمًا 💫",
    "اللطف مع نفسك جزء من العلاج 🌷",
    "أنت تتحرّر بهدوء، وصدق 🌿",
    "استمرارك شهادة على قوتك 🔒",
    "كل صباح بداية جديدة 🌅",
    "نقطة تحوّل اليوم تبدأ باختيار 🤍",
    "أنت تتقدم، حتى إن لم تلاحظ 💭",
    "قاوِم بلطف، واستمر بخفة 🍂",
    "تُشفى حين تُكمل 💠",
    "كل وقفة نقية، نصر صامت 🌙",
    "اهدأ… الأمر يحتاج وقتًا 🌼",
    "طريقك ليس خطيًا… لكنك فيه 🚶",
    "ثباتك دليل حبك لنفسك 💗",
    "حتى الخطوات المترددة تُحسب ✅",
    "تباطؤك لا يعني الفشل ⏱️",
    "احفظ نقاءك للغد 🌄",
    "التحسّن لا يُقاس بالكمال 📉",
    "المهم أنك هنا الآن ⏳",
    "حافظ على المسار، لا السرعة 🛤️",
    "أنت تتحرر من الداخل 💡",
    "الصبر اليوم = راحة الغد ☁️",
    "انظر للجانب المضيء دائمًا 🔆",
    "ما زلت تنجح، لا تنس ذلك 💙",
    "أنت تستحق السلام 🍀",
    "أنت أقوى مما تعتقد 🌟",
    "خطوتك القادمة أهم من سقطتك السابقة 🛑➡️",
    "لا أحد يحكم عليك… ولا حتى نفسك 🤲",
    "التجربة لا تُلغي القيمة 🌻",
    "تقدّمك مهما بدا بسيط… حقيقي ✅",
    "تذكّر: التعافي ليس مسابقة 🐢",
    "امنح نفسك فرصة أخرى اليوم 🔁",
    "الحياة تبدأ حين تختار أن تستمر ❤️",
    "النور ما زال بداخلك 💫",
    "لا تبحث عن الكمال، بل عن الاستمرار 🔄",
    "كل يوم تضيفه = بناء جديد 🧱",
    "في داخلك طاقة جميلة تنتظر الدعم ☀️",
    "ابتعد عن القسوة، اقترب من الرفق 🤍",
    "أنت في الطريق الصحيح، فقط لا تستعجل ⏳",
    "الحلم ما زال يستحق 💤✨",
    "كل نفس طاهر يُنعشك 💨",
    "جمالك في سعيك، لا في نتيجتك 🌼",
    "كفى بك صبرًا أنك لا تستسلم 🌿",
    "لا زلت تحاول؟ إذًا أنت ناجٍ 💪",
    "امنح نفسك احتضانًا اليوم 🤗",
    "لا تُقلّل من صبرك، فهو انتصار ✨",
    "أنت تنمو بصمت، وهذا عظيم 🌱",
    "الهدوء في قلبك، لا حولك 🧘",
    "تأخّرت؟ لا بأس، ابدأ الآن 🚦",
    "كل يوم تصمد فيه، تنضج أكثر 🕰️",
    "بعض النقاء يغيّر شعورك بالكامل 🌤️",
    "النية أهم من الخطوة 🚶‍♂️",
    "لا تقارن، فقط كمل طريقك 🛤️",
    "استمر... حتى وأنت مرتبك 🌙",
    "كل ما تحتاجه: نية جديدة وصبر 🤲",
    "الصبر الآن يصنع شخصًا أجمل غدًا ⛅",
    "أنت جدير بالتحرر من كل قيد 🔓",
    "مهما تعثّرت… المسار ما زال متاحًا 🛣️",
    "أنت كافي، وأنت في الطريق 🌾",
    "البداية اليوم، ولو متأخرة، عظيمة 🕊️",
    "اختر النقاء اليوم، دون ضغط 🌸",
    "كل مرة تختار فيها نفسك، تربح ❤️",
    "أنت تستحق أيامًا أنقى وأهدأ 🤍",
    "حتى أضعف استمرارية… هي استمرارية 🔁",
    "أنت تتحسن… ولو لم يشعر بك أحد 🌟",
  ];
  // استبدلها بقائمتك

  // المتغيرات الرئيسية
  let activeQuotes = []; // العبارات النشطة
  let recoveryStartDate = null; // تاريخ بدء التعافي
  let displayedDays = new Set(); // مجموعة لتتبع الأيام التي تم عرض عباراتها
  let animationFrame = null; // للتحكم في التحريك

  // الحصول على تاريخ بدء التعافي من localStorage
  // function loadRecoveryDate() {
  //   const savedISO = window.appHelpers.getData("recoveryStartDate");
  //   if (savedISO) {
  //     recoveryStartDate = new Date(savedISO);
  //     return true;
  //   }
  //   return false;
  // }
  // الحصول على تاريخ بدء التعافي من localStorage
  function loadRecoveryDate() {
    // const savedISO = window.appHelpers.getData("recoveryStartDate"); // Old line
    const savedISO = localStorage.getItem("recoveryStartDate"); // *** MODIFIED LINE ***
    if (savedISO) {
      try {
        // Add validation in case localStorage has invalid data
        const date = new Date(savedISO);
        if (!isNaN(date.getTime())) {
          // Check if date is valid
          recoveryStartDate = date;
          return true;
        } else {
          console.warn(
            "Bouncing Quotes: Invalid date found in localStorage for recoveryStartDate."
          );
          localStorage.removeItem("recoveryStartDate"); // Clean up invalid data
          return false;
        }
      } catch (e) {
        console.error(
          "Bouncing Quotes: Error parsing date from localStorage.",
          e
        );
        localStorage.removeItem("recoveryStartDate"); // Clean up invalid data
        return false;
      }
    }
    return false;
  }

  // حساب عدد أيام التعافي
  function calculateRecoveryDays() {
    if (!recoveryStartDate) return 0;
    const diff = Date.now() - recoveryStartDate.getTime();
    return Math.floor(diff / 864e5); // تحويل إلى أيام
  }

  // إضافة عبارات جديدة لكل يوم مر
  function addNewQuotes() {
    const currentDays = calculateRecoveryDays();

    // تخطي إذا لم يكن هناك أيام
    if (currentDays <= 0) return;

    // إضافة عبارة لكل يوم لم يتم عرضه بعد
    for (let day = 1; day <= currentDays; day++) {
      // تخطي الأيام التي تم عرضها بالفعل
      if (displayedDays.has(day)) continue;

      // إضافة اليوم لمجموعة الأيام المعروضة
      displayedDays.add(day);

      // التأكد من وجود عبارات متاحة
      if (day <= quotes.length) {
        const quoteText = quotes[day - 1]; // اختيار العبارة بناءً على اليوم

        // إنشاء عنصر العبارة
        const quoteElement = document.createElement("div");
        quoteElement.className = "bouncing-quote quote-appearing";
        quoteElement.textContent = quoteText;

        // تحديد موقع عشوائي داخل الحاوية
        const containerRect = quotesContainer.getBoundingClientRect();
        const quoteWidth = 180;
        const quoteHeight = 60;

        // تعيين موضع أولي
        const x = Math.random() * (containerRect.width - quoteWidth);
        const y = Math.random() * (containerRect.height - quoteHeight);

        // تعيين خصائص الحركة العشوائية
        const speed = {
          x: 1 + Math.random() * 0.5,
          y: 1 + Math.random() * 0.5,
        };

        // تطبيق الموضع
        quoteElement.style.left = `${x}px`;
        quoteElement.style.top = `${y}px`;

        // إضافة إلى الحاوية
        quotesContainer.appendChild(quoteElement);

        // إضافة العبارة إلى المصفوفة النشطة مع بيانات الحركة
        activeQuotes.push({
          element: quoteElement,
          x,
          y,
          speed,
          day: day, // تخزين اليوم المرتبط بهذه العبارة
        });
      }
    }
  }

  // تحريك العبارات وجعلها ترتد عند الحدود
  function moveQuotes() {
    if (!quotesContainer.offsetParent) {
      // إذا كانت الحاوية غير مرئية، لا تحرك العبارات
      animationFrame = requestAnimationFrame(moveQuotes);
      return;
    }

    const containerRect = quotesContainer.getBoundingClientRect();
    const maxX = containerRect.width;
    const maxY = containerRect.height;

    activeQuotes.forEach((quote) => {
      // حساب الموضع الجديد
      quote.x += quote.speed.x;
      quote.y += quote.speed.y;

      const element = quote.element;
      const elementRect = element.getBoundingClientRect();
      const quoteWidth = elementRect.width;
      const quoteHeight = elementRect.height;

      // الارتداد عند الحدود
      if (quote.x <= 0) {
        quote.x = 0;
        quote.speed.x = Math.abs(quote.speed.x);
      } else if (quote.x + quoteWidth >= maxX) {
        quote.x = maxX - quoteWidth;
        quote.speed.x = -Math.abs(quote.speed.x);
      }

      if (quote.y <= 0) {
        quote.y = 0;
        quote.speed.y = Math.abs(quote.speed.y);
      } else if (quote.y + quoteHeight >= maxY) {
        quote.y = maxY - quoteHeight;
        quote.speed.y = -Math.abs(quote.speed.y);
      }

      // تحديث موضع العنصر
      element.style.left = `${quote.x}px`;
      element.style.top = `${quote.y}px`;
    });

    animationFrame = requestAnimationFrame(moveQuotes);
  }

  // مسح جميع العبارات
  function clearAllQuotes() {
    // تنظيف الحاوية مباشرة إذا لم تكن هناك عبارات نشطة
    if (activeQuotes.length === 0) {
      quotesContainer.innerHTML = "";
      return;
    }

    // إضافة تأثير الاختفاء لكل العبارات
    activeQuotes.forEach((quote) => {
      if (quote.element) {
        quote.element.classList.remove("quote-appearing");
        quote.element.classList.add("quote-disappearing");
      }
    });

    // إزالة العناصر بعد اكتمال تأثير الإختفاء
    setTimeout(() => {
      quotesContainer.innerHTML = "";
      activeQuotes = [];
      displayedDays.clear(); // مسح الأيام المعروضة

      // إعادة تهيئة المتغيرات الرئيسية
      recoveryStartDate = null;
    }, 800);
  }

  // دالة التهيئة
  function initBouncingQuotes() {
    if (loadRecoveryDate()) {
      // إضافة العبارات للأيام المنقضية
      addNewQuotes();

      // بدء تحريك العبارات
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(moveQuotes);

      // إعداد الفحص الدوري لإضافة عبارات جديدة
      setInterval(addNewQuotes, 1000); // فحص كل ثانية

      // الفحص المباشر عند تحميل الصفحة
      addNewQuotes();
    }
  }

  // ربط دوال الحدث مع زر البدء وزر الانتكاس
  const startBtn = document.getElementById("start-recovery-btn");
  const resetBtn = document.getElementById("reset-recovery-btn");
  const confirmRelapseBtn = document.getElementById("confirm-relapse-btn");

  // عند النقر على زر بدء التعافي
  startBtn.addEventListener("click", function () {
    // إعادة تهيئة العبارات المتحركة
    setTimeout(initBouncingQuotes, 500);
  });

  // ضمان التعامل الصحيح مع الانتكاسة
  confirmRelapseBtn.addEventListener("click", function () {
    // مسح جميع العبارات
    clearAllQuotes();

    // إيقاف التحريك
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  });

  // استمع أيضًا للتغييرات في localStorage للتنسيق مع timer.js
  window.addEventListener("storage", function (e) {
    if (e.key === "recoveryStartDate" && !e.newValue) {
      // إذا تم مسح تاريخ البدء، قم بمسح العبارات
      clearAllQuotes();

      // إيقاف التحريك
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }
  });

  // التهيئة الأولية
  initBouncingQuotes();

  // إعادة ضبط حجم الحاوية عند تغيير حجم النافذة
  window.addEventListener("resize", function () {
    // إعادة حساب حجم الحاوية وموضع العبارات
    const containerRect = quotesContainer.getBoundingClientRect();
    const maxX = containerRect.width;
    const maxY = containerRect.height;

    activeQuotes.forEach((quote) => {
      const element = quote.element;
      if (!element) return; // تخطي إذا كان العنصر غير موجود

      const elementRect = element.getBoundingClientRect();

      // التأكد من أن العبارة داخل حدود الحاوية
      if (quote.x + elementRect.width > maxX) {
        quote.x = maxX - elementRect.width;
      }

      if (quote.y + elementRect.height > maxY) {
        quote.y = maxY - elementRect.height;
      }

      element.style.left = `${quote.x}px`;
      element.style.top = `${quote.y}px`;
    });
  });
});
