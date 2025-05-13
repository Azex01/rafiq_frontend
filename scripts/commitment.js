const API_URL = "https://rafiq-backend.onrender.com"; // أو رابط الإنتاج

function isGuest() {
  return localStorage.getItem("guest") === "true";
}

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function getAuthToken() {
  return localStorage.getItem("token");
}

async function apiRequest(endpoint, method = "GET", data = null) {
  const token = getAuthToken();

  if (!token) {
    console.warn("لا يوجد توكن - قد لا يكون المستخدم مسجلاً");
    throw new Error("يرجى تسجيل الدخول أولاً");
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      if (response.status === 401) {
        console.error("توكن غير صالح أو منتهي");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `فشل في الاتصال (${response.status})`
      );
    }
    return await response.json();
  } catch (err) {
    console.error("فشل الاتصال بالسيرفر:", err);
    throw err;
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // Elements
  const commitmentWelcome = document.getElementById("commitment-welcome");
  const commitmentDocument = document.getElementById("commitment-document");
  const createCommitmentBtn = document.getElementById("create-commitment-btn");
  const saveCommitmentBtn = document.getElementById("save-commitment-btn");
  const editCommitmentBtn = document.getElementById("edit-commitment-btn");
  const negativeImpactTextarea = document.getElementById("negative-impact");
  const recoveryBenefitsTextarea = document.getElementById("recovery-benefits");
  const motivationImage = document.getElementById("motivation-image");
  const imageUploadLabel = document.getElementById("image-upload-label");
  const imagePreview = document.getElementById("image-preview");
  const previewImage = document.getElementById("preview-image");
  const replaceImageBtn = document.getElementById("replace-image");
  const deleteImageBtn = document.getElementById("delete-image");
  const dailyQuote = document.getElementById("daily-quote");

  const motivationalQuotes = [
    "التعافي لا يعني الكمال — بل يعني العودة إلى ذاتك الحقيقية.",
    "كل يوم هو فرصة جديدة لاختيار نفسك.",
    "القوة ليست في عدم السقوط، بل في النهوض في كل مرة تسقط فيها.",
    "رحلة الألف ميل تبدأ بخطوة واحدة.",
    "أنت أقوى مما تظن، وأكثر شجاعة مما تعتقد.",
    "التغيير صعب في البداية، فوضوي في المنتصف، وجميل في النهاية.",
    "ليس المهم أين كنت، بل أين أنت ذاهب.",
    "الصبر والمثابرة لهما تأثير سحري يمكن من خلالهما التغلب على الصعوبات.",
    "لحظة من الصبر يمكن أن تمنع سنوات من الندم.",
    "التعافي هو رحلة، وليست نقطة وصول.",
    "قوتنا تأتي من تجاوز المعاناة، وليس من تجنبها.",
    "لا يمكن للعواصف أن تستمر للأبد، فالشمس ستشرق مجدداً.",
    "الرحلة هي المكافأة.",
    "عندما تشعر بالرغبة في الاستسلام، تذكر سبب استمرارك حتى الآن.",
  ];

  // Show the form & hide welcome screen
  commitmentWelcome?.classList.add("hidden");
  commitmentDocument?.classList.remove("hidden");

  // Remove create/edit/save buttons (if you still have them)
  [createCommitmentBtn, editCommitmentBtn, saveCommitmentBtn].forEach((btn) =>
    btn?.remove()
  );

  // 1) Display a random daily quote
  if (dailyQuote) {
    dailyQuote.textContent =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }

  // 2) Load existing data from localStorage
  // const data = JSON.parse(localStorage.getItem("commitmentData")) || {};
  // negativeImpactTextarea.value = data.negativeImpact || "";
  // recoveryBenefitsTextarea.value = data.recoveryBenefits || "";

  // if (data.motivationImage) {
  //   previewImage.src = data.motivationImage;
  //   imageUploadLabel.classList.add("hidden");
  //   imagePreview.classList.add("visible");
  // } else {
  //   previewImage.src = "";
  //   imageUploadLabel.classList.remove("hidden");
  //   imagePreview.classList.remove("visible");
  // }
  try {
    if (isLoggedIn() && !isGuest()) {
      const res = await apiRequest("/commitment");
      const data = res.commitment;

      if (data) {
        negativeImpactTextarea.value = data.negativeImpact || "";
        recoveryBenefitsTextarea.value = data.recoveryBenefits || "";
        if (data.motivationImage) {
          previewImage.src = data.motivationImage;
          imageUploadLabel.classList.add("hidden");
          imagePreview.classList.add("visible");
        } else {
          previewImage.src = "";
          imageUploadLabel.classList.remove("hidden");
          imagePreview.classList.remove("visible");
        }
      }
    } else {
      // زائر
      const data = JSON.parse(localStorage.getItem("commitmentData")) || {};
      negativeImpactTextarea.value = data.negativeImpact || "";
      recoveryBenefitsTextarea.value = data.recoveryBenefits || "";

      if (data.motivationImage) {
        previewImage.src = data.motivationImage;
        imageUploadLabel.classList.add("hidden");
        imagePreview.classList.add("visible");
      } else {
        previewImage.src = "";
        imageUploadLabel.classList.remove("hidden");
        imagePreview.classList.remove("visible");
      }
    }
  } catch (err) {
    console.error("فشل تحميل وثيقة الالتزام:", err);
  }

  // 3) Whenever text changes, auto-save
  // function saveText() {
  //   const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
  //   const updated = {
  //     negativeImpact: negativeImpactTextarea.value.trim(),
  //     recoveryBenefits: recoveryBenefitsTextarea.value.trim(),
  //     motivationImage: prev.motivationImage || null,
  //     createdAt: prev.createdAt || new Date().toISOString(),
  //     lastUpdated: new Date().toISOString(),
  //   };
  //   localStorage.setItem("commitmentData", JSON.stringify(updated));
  // }
  function saveText() {
    const payload = {
      negativeImpact: negativeImpactTextarea.value.trim(),
      recoveryBenefits: recoveryBenefitsTextarea.value.trim(),
    };

    if (isLoggedIn() && !isGuest()) {
      // حفظ في السيرفر
      apiRequest("/commitment", "POST", payload).catch((err) => {
        console.error("فشل الحفظ في السيرفر:", err);
      });
    } else {
      // حفظ محلي
      const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
      const updated = {
        ...prev,
        ...payload,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("commitmentData", JSON.stringify(updated));
    }
  }

  negativeImpactTextarea.addEventListener("input", saveText);
  recoveryBenefitsTextarea.addEventListener("input", saveText);

  // 4) Image upload handler: preview + save
  // motivationImage.addEventListener("change", function (e) {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = function (evt) {
  //     // show preview
  //     previewImage.src = evt.target.result;
  //     imageUploadLabel.classList.add("hidden");
  //     imagePreview.classList.add("visible");
  //     // save
  //     const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
  //     const updated = {
  //       ...prev,
  //       motivationImage: evt.target.result,
  //       lastUpdated: new Date().toISOString(),
  //     };
  //     localStorage.setItem("commitmentData", JSON.stringify(updated));
  //   };
  //   reader.readAsDataURL(file);
  // });
  motivationImage.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      const image = evt.target.result;

      // عرض المعاينة
      previewImage.src = image;
      imageUploadLabel.classList.add("hidden");
      imagePreview.classList.add("visible");

      if (isLoggedIn() && !isGuest()) {
        // حفظ في السيرفر
        apiRequest("/commitment", "POST", { motivationImage: image }).catch(
          (err) => {
            console.error("فشل رفع الصورة إلى السيرفر:", err);
          }
        );
      } else {
        // حفظ محلي
        const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
        const updated = {
          ...prev,
          motivationImage: image,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem("commitmentData", JSON.stringify(updated));
      }
    };

    reader.readAsDataURL(file);
  });

  // 5) Replace button: always open file picker
  replaceImageBtn?.addEventListener("click", () => {
    motivationImage.disabled = false; // ensure enabled
    motivationImage.click();
  });

  // 6) Delete button: clear preview + reset to dashed box + remove from storage
  // deleteImageBtn?.addEventListener("click", () => {
  //   // clear UI
  //   previewImage.src = "";
  //   imagePreview.classList.remove("visible");
  //   imageUploadLabel.classList.remove("hidden");
  //   motivationImage.value = "";
  //   // clear storage
  //   const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
  //   const updated = {
  //     ...prev,
  //     motivationImage: null,
  //     lastUpdated: new Date().toISOString(),
  //   };
  //   localStorage.setItem("commitmentData", JSON.stringify(updated));
  // });
  deleteImageBtn?.addEventListener("click", async () => {
    // 1. تحديث الواجهة
    previewImage.src = "";
    imagePreview.classList.remove("visible");
    imageUploadLabel.classList.remove("hidden");
    motivationImage.value = "";

    // 2. تحديث التخزين (سيرفر أو محلي)
    if (isLoggedIn() && !isGuest()) {
      try {
        await apiRequest("/commitment", "POST", {
          motivationImage: null,
        });
      } catch (err) {
        console.error("❌ فشل حذف الصورة من السيرفر:", err);
        alert("حدث خطأ أثناء حذف الصورة، حاول مرة أخرى.");
      }
    } else {
      const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
      const updated = {
        ...prev,
        motivationImage: null,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("commitmentData", JSON.stringify(updated));
    }
  });
});
