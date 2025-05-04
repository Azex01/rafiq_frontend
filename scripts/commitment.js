// document.addEventListener("DOMContentLoaded", function () {
//   const commitmentWelcome = document.getElementById("commitment-welcome");
//   const commitmentDocument = document.getElementById("commitment-document");
//   const createCommitmentBtn = document.getElementById("create-commitment-btn");
//   const saveCommitmentBtn = document.getElementById("save-commitment-btn");
//   const editCommitmentBtn = document.getElementById("edit-commitment-btn");
//   const negativeImpactTextarea = document.getElementById("negative-impact");
//   const recoveryBenefitsTextarea = document.getElementById("recovery-benefits");
//   const motivationImage = document.getElementById("motivation-image");
//   const imageUploadLabel = document.getElementById("image-upload-label");
//   const imagePreview = document.getElementById("image-preview");
//   const previewImage = document.getElementById("preview-image");
//   const replaceImageBtn = document.getElementById("replace-image");
//   const deleteImageBtn = document.getElementById("delete-image");
//   const dailyQuote = document.getElementById("daily-quote");

//   const motivationalQuotes = [
//     "التعافي لا يعني الكمال — بل يعني العودة إلى ذاتك الحقيقية.",
//     "كل يوم هو فرصة جديدة لاختيار نفسك.",
//     "القوة ليست في عدم السقوط، بل في النهوض في كل مرة تسقط فيها.",
//     "رحلة الألف ميل تبدأ بخطوة واحدة.",
//     "أنت أقوى مما تظن، وأكثر شجاعة مما تعتقد.",
//     "التغيير صعب في البداية، فوضوي في المنتصف، وجميل في النهاية.",
//     "ليس المهم أين كنت، بل أين أنت ذاهب.",
//     "الصبر والمثابرة لهما تأثير سحري يمكن من خلالهما التغلب على الصعوبات.",
//     "لحظة من الصبر يمكن أن تمنع سنوات من الندم.",
//     "التعافي هو رحلة، وليست نقطة وصول.",
//     "قوتنا تأتي من تجاوز المعاناة، وليس من تجنبها.",
//     "لا يمكن للعواصف أن تستمر للأبد، فالشمس ستشرق مجدداً.",
//     "الرحلة هي المكافأة.",
//     "عندما تشعر بالرغبة في الاستسلام، تذكر سبب استمرارك حتى الآن.",
//   ];

//   function loadCommitmentData() {
//     const data = JSON.parse(localStorage.getItem("commitmentData"));
//     if (!data) return;

//     commitmentWelcome.classList.add("hidden");
//     commitmentDocument.classList.remove("hidden");

//     negativeImpactTextarea.value = data.negativeImpact || "";
//     recoveryBenefitsTextarea.value = data.recoveryBenefits || "";

//     if (data.motivationImage) {
//       previewImage.src = data.motivationImage;
//       imageUploadLabel.classList.add("hidden");
//       imagePreview.classList.add("visible");
//     }

//     setReadOnlyMode(true);
//   }

//   function displayRandomQuote() {
//     const i = Math.floor(Math.random() * motivationalQuotes.length);
//     dailyQuote.textContent = motivationalQuotes[i];
//   }

//   function setReadOnlyMode(isReadOnly) {
//     negativeImpactTextarea.readOnly = isReadOnly;
//     recoveryBenefitsTextarea.readOnly = isReadOnly;

//     // Enable/disable the file input itself
//     motivationImage.disabled = isReadOnly;

//     if (isReadOnly) {
//       negativeImpactTextarea.classList.add("readonly");
//       recoveryBenefitsTextarea.classList.add("readonly");
//       editCommitmentBtn.classList.remove("hidden");
//       saveCommitmentBtn.classList.add("hidden");
//     } else {
//       negativeImpactTextarea.classList.remove("readonly");
//       recoveryBenefitsTextarea.classList.remove("readonly");
//       editCommitmentBtn.classList.add("hidden");
//       saveCommitmentBtn.classList.remove("hidden");
//     }
//   }

//   function initCommitment() {
//     loadCommitmentData();
//     displayRandomQuote();
//   }

//   function createCommitment() {
//     commitmentWelcome.classList.add("hidden");
//     commitmentDocument.classList.remove("hidden");
//     setReadOnlyMode(false);
//   }

//   function saveCommitment() {
//     const neg = negativeImpactTextarea.value.trim();
//     const rec = recoveryBenefitsTextarea.value.trim();
//     if (!neg || !rec) {
//       alert("الرجاء ملء جميع الحقول المطلوبة");
//       return;
//     }
//     const data = {
//       negativeImpact: neg,
//       recoveryBenefits: rec,
//       motivationImage: previewImage.src || null,
//       createdAt: new Date().toISOString(),
//       lastUpdated: new Date().toISOString(),
//     };
//     localStorage.setItem("commitmentData", JSON.stringify(data));
//     setReadOnlyMode(true);
//   }

//   function editCommitment() {
//     setReadOnlyMode(false);
//   }

//   function handleImageUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = function (evt) {
//       previewImage.src = evt.target.result;
//       imageUploadLabel.classList.add("hidden");
//       imagePreview.classList.add("visible");
//     };
//     reader.readAsDataURL(file);
//   }

//   function replaceImage() {
//     // If we’re in read-only, switch into edit mode first
//     if (motivationImage.disabled) {
//       setReadOnlyMode(false);
//     }
//     // Now open the file chooser
//     motivationImage.click();
//   }

//   function deleteImage() {
//     previewImage.src = "";
//     imagePreview.classList.remove("visible");
//     imageUploadLabel.classList.remove("hidden");
//     motivationImage.value = "";
//   }

//   // Event bindings
//   createCommitmentBtn.addEventListener("click", createCommitment);
//   saveCommitmentBtn.addEventListener("click", saveCommitment);
//   editCommitmentBtn.addEventListener("click", editCommitment);
//   motivationImage.addEventListener("change", handleImageUpload);
//   replaceImageBtn.addEventListener("click", replaceImage);
//   deleteImageBtn.addEventListener("click", deleteImage);

//   initCommitment();
// });

// scripts/commitment.js

// document.addEventListener("DOMContentLoaded", function () {
//   // Elements
//   const commitmentWelcome = document.getElementById("commitment-welcome");
//   const commitmentDocument = document.getElementById("commitment-document");
//   const negativeImpactTextarea = document.getElementById("negative-impact");
//   const recoveryBenefitsTextarea = document.getElementById("recovery-benefits");
//   const motivationImageInput = document.getElementById("motivation-image");
//   const previewContainer = document.getElementById("image-preview");
//   const replaceBtn = document.getElementById("replace-image");
//   const deleteBtn = document.getElementById("delete-image");
//   const dailyQuoteEl = document.getElementById("daily-quote");

//   // Motivational quotes
//   const motivationalQuotes = [
//     "التعافي لا يعني الكمال — بل يعني العودة إلى ذاتك الحقيقية.",
//     "كل يوم هو فرصة جديدة لاختيار نفسك.",
//     "القوة ليست في عدم السقوط، بل في النهوض في كل مرة تسقط فيها.",
//     "رحلة الألف ميل تبدأ بخطوة واحدة.",
//     "أنت أقوى مما تظن، وأكثر شجاعة مما تعتقد.",
//     "التغيير صعب في البداية، فوضوي في المنتصف، وجميل في النهاية.",
//     "ليس المهم أين كنت، بل أين أنت ذاهب.",
//     "الصبر والمثابرة لهما تأثير سحري يمكن من خلالهما التغلب على الصعوبات.",
//     "لحظة من الصبر يمكن أن تمنع سنوات من الندم.",
//     "التعافي هو رحلة، وليست نقطة وصول.",
//     "قوتنا تأتي من تجاوز المعاناة، وليس من تجنبها.",
//     "لا يمكن للعواصف أن تستمر للأبد، فالشمس ستشرق مجدداً.",
//     "الرحلة هي المكافأة.",
//     "عندما تشعر بالرغبة في الاستسلام، تذكر سبب استمرارك حتى الآن.",
//   ];

//   // 1) Show the form immediately, hide welcome screen
//   if (commitmentWelcome) commitmentWelcome.classList.add("hidden");
//   if (commitmentDocument) commitmentDocument.classList.remove("hidden");

//   // 2) Remove action buttons & preview UI so the dashed upload box stays always visible
//   [
//     "create-commitment-btn",
//     "save-commitment-btn",
//     "edit-commitment-btn",
//   ].forEach((id) => {
//     const btn = document.getElementById(id);
//     if (btn) btn.remove();
//   });
//   if (previewContainer) previewContainer.remove();
//   if (replaceBtn) replaceBtn.remove();
//   if (deleteBtn) deleteBtn.remove();

//   // 3) Display a random daily quote
//   if (dailyQuoteEl) {
//     const idx = Math.floor(Math.random() * motivationalQuotes.length);
//     dailyQuoteEl.textContent = motivationalQuotes[idx];
//   }

//   // 4) Load any existing text data from localStorage
//   const savedData = JSON.parse(localStorage.getItem("commitmentData")) || {};
//   if (negativeImpactTextarea)
//     negativeImpactTextarea.value = savedData.negativeImpact || "";
//   if (recoveryBenefitsTextarea)
//     recoveryBenefitsTextarea.value = savedData.recoveryBenefits || "";

//   // 5) Helper: save everything (with optional image override)
//   function saveData(partial = {}) {
//     const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
//     const full = {
//       negativeImpact: negativeImpactTextarea.value.trim(),
//       recoveryBenefits: recoveryBenefitsTextarea.value.trim(),
//       motivationImage: prev.motivationImage || null,
//       createdAt: prev.createdAt || new Date().toISOString(),
//       lastUpdated: new Date().toISOString(),
//       ...partial,
//     };
//     localStorage.setItem("commitmentData", JSON.stringify(full));
//   }

//   // 6) Auto-save on each keystroke
//   if (negativeImpactTextarea)
//     negativeImpactTextarea.addEventListener("input", () => saveData());
//   if (recoveryBenefitsTextarea)
//     recoveryBenefitsTextarea.addEventListener("input", () => saveData());

//   // 7) Auto-save when an image is selected (keeps dashed-box UI)
//   if (motivationImageInput) {
//     motivationImageInput.addEventListener("change", function (e) {
//       const file = e.target.files[0];
//       if (!file) return;
//       const reader = new FileReader();
//       reader.onload = function (evt) {
//         saveData({ motivationImage: evt.target.result });
//       };
//       reader.readAsDataURL(file);
//     });
//   }
// });

// scripts/commitment.js

// document.addEventListener("DOMContentLoaded", function () {
//   // Elements
//   const commitmentWelcome = document.getElementById("commitment-welcome");
//   const commitmentDocument = document.getElementById("commitment-document");
//   const negativeImpactTextarea = document.getElementById("negative-impact");
//   const recoveryBenefitsTextarea = document.getElementById("recovery-benefits");
//   const motivationImageInput = document.getElementById("motivation-image");
//   const imageUploadLabel = document.getElementById("image-upload-label");
//   const previewContainer = document.getElementById("image-preview");
//   const previewImage = document.getElementById("preview-image");
//   const dailyQuoteEl = document.getElementById("daily-quote");

//   // Quotes array
//   const quotes = [
//     "التعافي لا يعني الكمال — بل يعني العودة إلى ذاتك الحقيقية.",
//     "كل يوم هو فرصة جديدة لاختيار نفسك.",
//     "القوة ليست في عدم السقوط، بل في النهوض في كل مرة تسقط فيها.",
//     "رحلة الألف ميل تبدأ بخطوة واحدة.",
//     "أنت أقوى مما تظن، وأكثر شجاعة مما تعتقد.",
//     "التغيير صعب في البداية، فوضوي في المنتصف، وجميل في النهاية.",
//     "ليس المهم أين كنت، بل أين أنت ذاهب.",
//     "الصبر والمثابرة لهما تأثير سحري يمكن من خلالهما التغلب على الصعوبات.",
//     "لحظة من الصبر يمكن أن تمنع سنوات من الندم.",
//     "التعافي هو رحلة، وليست نقطة وصول.",
//     "قوتنا تأتي من تجاوز المعاناة، وليس من تجنبها.",
//     "لا يمكن للعواصف أن تستمر للأبد، فالشمس ستشرق مجدداً.",
//     "الرحلة هي المكافأة.",
//     "عندما تشعر بالرغبة في الاستسلام، تذكر سبب استمرارك حتى الآن.",
//   ];

//   // 1) Show the form, hide the welcome screen
//   if (commitmentWelcome) commitmentWelcome.classList.add("hidden");
//   if (commitmentDocument) commitmentDocument.classList.remove("hidden");

//   // 2) Remove only the action buttons
//   document
//     .querySelectorAll(
//       "#create-commitment-btn, #edit-commitment-btn, #save-commitment-btn"
//     )
//     .forEach((el) => el.remove());

//   // 3) Display a random daily quote
//   if (dailyQuoteEl) {
//     dailyQuoteEl.textContent =
//       quotes[Math.floor(Math.random() * quotes.length)];
//   }

//   // 4) Load any existing data
//   const saved = JSON.parse(localStorage.getItem("commitmentData")) || {};
//   negativeImpactTextarea.value = saved.negativeImpact || "";
//   recoveryBenefitsTextarea.value = saved.recoveryBenefits || "";

//   // If there’s already an image, show it
//   if (saved.motivationImage) {
//     previewImage.src = saved.motivationImage;
//     imageUploadLabel.classList.add("hidden");
//     previewContainer.classList.add("visible");
//   }

//   // 5) saveData helper
//   function saveData(partial = {}) {
//     const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
//     const full = {
//       negativeImpact: negativeImpactTextarea.value.trim(),
//       recoveryBenefits: recoveryBenefitsTextarea.value.trim(),
//       motivationImage: prev.motivationImage || null,
//       createdAt: prev.createdAt || new Date().toISOString(),
//       lastUpdated: new Date().toISOString(),
//       ...partial,
//     };
//     localStorage.setItem("commitmentData", JSON.stringify(full));
//   }

//   // 6) Auto-save on text input
//   negativeImpactTextarea.addEventListener("input", () => saveData());
//   recoveryBenefitsTextarea.addEventListener("input", () => saveData());

//   // 7) Auto-save + preview on image select
//   motivationImageInput.addEventListener("change", function (e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function (evt) {
//       // 7a) Save to storage
//       saveData({ motivationImage: evt.target.result });

//       // 7b) Show the preview
//       previewImage.src = evt.target.result;
//       imageUploadLabel.classList.add("hidden");
//       previewContainer.classList.add("visible");
//     };
//     reader.readAsDataURL(file);
//   });
// });

// scripts/commitment.js

document.addEventListener("DOMContentLoaded", function () {
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

  // 3) Whenever text changes, auto-save
  function saveText() {
    const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
    const updated = {
      negativeImpact: negativeImpactTextarea.value.trim(),
      recoveryBenefits: recoveryBenefitsTextarea.value.trim(),
      motivationImage: prev.motivationImage || null,
      createdAt: prev.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("commitmentData", JSON.stringify(updated));
  }
  negativeImpactTextarea.addEventListener("input", saveText);
  recoveryBenefitsTextarea.addEventListener("input", saveText);

  // 4) Image upload handler: preview + save
  motivationImage.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      // show preview
      previewImage.src = evt.target.result;
      imageUploadLabel.classList.add("hidden");
      imagePreview.classList.add("visible");
      // save
      const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
      const updated = {
        ...prev,
        motivationImage: evt.target.result,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("commitmentData", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  });

  // 5) Replace button: always open file picker
  replaceImageBtn?.addEventListener("click", () => {
    motivationImage.disabled = false; // ensure enabled
    motivationImage.click();
  });

  // 6) Delete button: clear preview + reset to dashed box + remove from storage
  deleteImageBtn?.addEventListener("click", () => {
    // clear UI
    previewImage.src = "";
    imagePreview.classList.remove("visible");
    imageUploadLabel.classList.remove("hidden");
    motivationImage.value = "";
    // clear storage
    const prev = JSON.parse(localStorage.getItem("commitmentData")) || {};
    const updated = {
      ...prev,
      motivationImage: null,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("commitmentData", JSON.stringify(updated));
  });
});
