const { v4: uuidv4 } = require("uuid");

// In-memory store — swap for a DB in production
const diagnosisStore = new Map();

exports.analyzeImage = async (base64Image, mimeType = "image/jpeg") => {
  const response = await fetch(process.env.LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LLM_API_KEY && { Authorization: `Bearer ${process.env.LLM_API_KEY}` }),
    },
    body: JSON.stringify({
      image: {
        data: base64Image,
        mimeType,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`LLM request failed (${response.status}): ${err}`);
  }

  const data = await response.json();

  // Adjust this line to match whatever field LLM returns the text in
  const raw = data.output ?? data.text ?? data.result ?? data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Unexpected LLM response shape — check the field mapping above");

  const analysis = JSON.parse(raw.replace(/```json|```/g, "").trim());

  const record = {
    diagnosisId: uuidv4(),
    timestamp:   new Date().toISOString(),
    analysis,
  };

  diagnosisStore.set(record.diagnosisId, record);
  return record;
};

