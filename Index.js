require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// RULE đơn giản
function autoReply(message) {
  message = message.toLowerCase();

  if (message.includes("giá")) {
    return "Bên mình có gói từ 500k - 2 triệu nhé!";
  }

  if (message.includes("liên hệ")) {
    return "Bạn để lại SĐT, bên mình gọi ngay!";
  }

  return null;
}

// AI
async function askAI(message) {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Bạn là nhân viên CSKH thân thiện."
          },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (e) {
    return "Hệ thống đang bận, bạn thử lại sau!";
  }
}

// API chat
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  let reply = autoReply(message);

  if (!reply) {
    reply = await askAI(message);
  }

  res.json({
    input: message,
    output: reply
  });
});

// test server
app.get("/", (req, res) => {
  res.send("Chatbot đang chạy 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});