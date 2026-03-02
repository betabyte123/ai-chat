const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [
            { role: "user", content: req.body.message }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.json({ reply: JSON.stringify(data) });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response from model.";

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Server error: " + err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});