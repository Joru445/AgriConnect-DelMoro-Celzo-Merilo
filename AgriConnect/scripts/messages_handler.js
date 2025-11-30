let currentUserId = null;
let refreshTimer = null;

function loadMessages(userId, initialLoad = false) {
  const messagesBox = document.querySelector(".messages");
  if (!messagesBox) return;

  const url = `backend/get_messages.php?conversation_with=${userId}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {

      messagesBox.innerHTML = "";

      if (!data.length) {
        messagesBox.innerHTML = `<p class="no-messages">No messages yet.</p>`;
        return;
      }

      data.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message " + (msg.is_sender ? "sent" : "received");

        div.innerHTML = `
          <strong>${msg.is_sender ? "You" : msg.username}:</strong>
          <p>${msg.message}</p>
        `;

        messagesBox.appendChild(div);
      });
      if (initialLoad) {
        messagesBox.scrollTop = messagesBox.scrollHeight;
      }
    })
    .catch(err => {
      console.error("Error fetching messages:", err);
    });
}

document.addEventListener("click", e => {
  const convo = e.target.closest(".conversation");
  if (!convo) return;

  document.querySelectorAll(".conversation.active")
    .forEach(c => c.classList.remove("active"));

  convo.classList.add("active");

  currentUserId = convo.dataset.userId;
  console.log("Selected conversation with user:", currentUserId);

  const form = document.querySelector(".message-form");
  if (form) form.dataset.userId = currentUserId;

  loadMessages(currentUserId, true);

  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    if (currentUserId) loadMessages(currentUserId);
  }, 2000);
});

document.addEventListener("submit", e => {
  if (!e.target.classList.contains("message-form")) return;
  e.preventDefault();

  const form = e.target;
  const input = form.querySelector("input");

  if (!currentUserId || !input.value.trim()) return;

  const postData = "receiver_id=" + encodeURIComponent(currentUserId) +
                  "&message=" + encodeURIComponent(input.value.trim());

  fetch("backend/send_messages.php", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: postData
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      input.value = "";
      loadMessages(currentUserId);
    }
  })
  .catch(err => console.error("Error sending message:", err));
});
