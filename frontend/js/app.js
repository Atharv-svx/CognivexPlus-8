const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menu-btn");
const overlay = document.getElementById("overlay");

/* ---------------- SIDEBAR ---------------- */
menuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

/* ---------------- MESSAGE ---------------- */
function addMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.innerHTML = marked.parse(text || "");
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

/* ---------------- ENTER FIX ---------------- */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

/* ---------------- SEND MESSAGE ---------------- */
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  const aiMsg = addMessage("assistant", "Thinking...");

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    aiMsg.innerHTML = marked.parse(data.reply || "No response");

  } catch (err) {
    aiMsg.innerText = "Error connecting to backend.";
  }
}

sendBtn.addEventListener("click", sendMessage);