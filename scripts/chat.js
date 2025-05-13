// This is using 50 but it is costly

// const API_URL = "http://localhost:3001/ask"; // نرسل إلى السيرفر المحلي

// const systemMessage = {
//   role: "system",
//   content: `أنت "رفيق"، مدرّب افتراضي مخصص لدعم التعافي من إدمان الإباحية والعادة السرية. وظيفتك أن تكون مستشارًا نفسيًا وداعمًا دينيًا، يشجع المستخدم دون تعنيف أو تهديد، ويوفر إرشادات عملية ودينية تساعده على التغيير.

// الردود يجب أن تكون:
// - عاطفية وداعمة، تُظهر التفهّم
// - قائمة على مبادئ نفسية (مثل: تقبل الذات، ضبط النفس، العادات)
// - مستندة إلى قيم دينية إسلامية (مثل التوبة، التقوى، المجاهدة، الصبر)
// - واضحة ومباشرة بدون مبالغة أو تكرار
// - بطول متوسط (حوالي 3-5 جمل فقط)

// لا تستخدم لهجة آمرة أو سلبية.
// ابدأ دائمًا بردّ يحتوي على دعم نفسي و/أو ديني، ثم اقترح خطوة عملية واحدة على الأقل يمكنه القيام بها الآن.

// إذا قال المستخدم "انتكست" أو "فشلت"، لا تقسو عليه، بل ذكّره بالرحمة والتوبة وفرصة البدء من جديد.
// `,
// };

// let chatHistory = [systemMessage];

// document.addEventListener("DOMContentLoaded", () => {
//   const chatInput = document.getElementById("chat-input");
//   const sendButton = document.getElementById("send-message");
//   const chatMessages = document.getElementById("chat-messages");
//   const suggestionBtns = document.querySelectorAll(".suggestion-button");

//   sendButton.addEventListener("click", sendMessage);
//   chatInput.addEventListener("keydown", (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   });

//   suggestionBtns.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       chatInput.value = btn.textContent;
//       sendMessage();
//     });
//   });

//   async function sendMessage() {
//     const content = chatInput.value.trim();
//     if (!content) return;

//     addMessage(content, "user");
//     chatInput.value = "";

//     chatHistory.push({ role: "user", content });
//     showTyping();

//     try {
//       const reply = await callLocalServer(chatHistory);
//       hideTyping();
//       addMessage(reply, "assistant");

//       chatHistory.push({ role: "assistant", content: reply });

//       if (chatHistory.length > 20) {
//         chatHistory = [systemMessage, ...chatHistory.slice(-18)];
//       }
//     } catch (err) {
//       console.error("Local Server Error:", err);
//       hideTyping();
//       addMessage("عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.", "assistant");
//     }
//   }

//   function addMessage(text, sender) {
//     const wrapper = document.createElement("div");
//     wrapper.classList.add("message", sender);

//     const bubble = document.createElement("div");
//     bubble.classList.add("message-content");
//     bubble.textContent = text;

//     wrapper.appendChild(bubble);
//     chatMessages.appendChild(wrapper);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }

//   function showTyping() {
//     const typing = document.createElement("div");
//     typing.classList.add("message", "assistant", "typing-indicator");
//     typing.innerHTML = `<div class="message-content"><span></span><span></span><span></span></div>`;
//     chatMessages.appendChild(typing);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }

//   function hideTyping() {
//     const typing = chatMessages.querySelector(".typing-indicator");
//     if (typing) chatMessages.removeChild(typing);
//   }
// });

// async function callLocalServer(messages) {
//   const response = await fetch(API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ messages }),
//   });

//   const data = await response.json();

//   if (!response.ok || !data.reply) {
//     console.error("Server response error:", data);
//     throw new Error("Failed to fetch reply from local server");
//   }

//   return data.reply;
// }

// // ✅ chat.js - مع دعم Gemini API (localhost:3001/ask)
// document.addEventListener("DOMContentLoaded", () => {
//   const chatInput = document.getElementById("chat-input");
//   const sendButton = document.getElementById("send-message");
//   const chatMessages = document.getElementById("chat-messages");
//   const suggestionBtns = document.querySelectorAll(".suggestion-button");

//   sendButton.addEventListener("click", sendMessage);
//   chatInput.addEventListener("keydown", (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   });

//   suggestionBtns.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       chatInput.value = btn.textContent;
//       sendMessage();
//     });
//   });

//   async function sendMessage() {
//     const content = chatInput.value.trim();
//     if (!content) return;

//     addMessage(content, "user");
//     chatInput.value = "";
//     showTyping();

//     try {
//       const response = await fetch("http://localhost:3001/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: content }),
//       });

//       const data = await response.json();
//       hideTyping();
//       addMessage(data.reply, "assistant");
//     } catch (err) {
//       console.error("Gemini Server Error:", err);
//       hideTyping();
//       addMessage("عذرًا، حدث خطأ أثناء الاتصال بالمساعد الذكي.", "assistant");
//     }
//   }

//   function addMessage(text, sender) {
//     const wrapper = document.createElement("div");
//     wrapper.classList.add("message", sender);

//     const bubble = document.createElement("div");
//     bubble.classList.add("message-content");
//     bubble.innerHTML = text; // ← لو احتجت دعم Markdown

//     wrapper.appendChild(bubble);
//     chatMessages.appendChild(wrapper);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }

//   function showTyping() {
//     const typing = document.createElement("div");
//     typing.classList.add("message", "assistant", "typing-indicator");
//     typing.innerHTML = `<div class="message-content"><span></span><span></span><span></span></div>`;
//     chatMessages.appendChild(typing);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }

//   function hideTyping() {
//     const typing = chatMessages.querySelector(".typing-indicator");
//     if (typing) chatMessages.removeChild(typing);
//   }
// });

// chatgpt 4o free using github
// ✅ chat.js - يربط الواجهة الأمامية بسيرفرك المحلي اللي يستخدم GitHub GPT-4o

document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");
  const suggestionBtns = document.querySelectorAll(".suggestion-button");

  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  suggestionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.textContent;
      sendMessage();
    });
  });

  async function sendMessage() {
    const content = chatInput.value.trim();
    if (!content) return;

    addMessage(content, "user");
    chatInput.value = "";
    showTyping();

    try {
      const response = await fetch("https://rafiq-backend.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      hideTyping();
      addMessage(data.reply, "assistant");
    } catch (err) {
      console.error("API Error:", err);
      hideTyping();
      addMessage("عذرًا، حدث خطأ أثناء الاتصال بالمساعد.", "assistant");
    }
  }

  function addMessage(text, sender) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message", sender);

    const bubble = document.createElement("div");
    bubble.classList.add("message-content");
    bubble.innerHTML = text;

    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.classList.add("message", "assistant", "typing-indicator");
    typing.innerHTML = `<div class="message-content"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    const typing = chatMessages.querySelector(".typing-indicator");
    if (typing) chatMessages.removeChild(typing);
  }
});
