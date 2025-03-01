const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const multer = require("multer");
const tesseract = require("node-tesseract-ocr");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies (for non-multipart requests)
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle image upload and prompt processing
app.post("/generate-image", upload.single("image"), async (req, res) => {
  const prompt = req.body.prompt || "";
  let imageText = "";

  try {
    // If an image file is provided, process it with OCR
    if (req.file) {
      const imagePath = req.file.path; // Temporary file path provided by multer
      
      const config = {
        lang: "eng",    // language setting; adjust if needed
        oem: 1,
        psm: 3,
      };

      // Extract text from the image
      imageText = await tesseract.recognize(imagePath, config);
      console.log("Extracted text:", imageText);
    }

    // Combine the prompt with the extracted image text
    const combinedPrompt = `${prompt}\n\nImage description: ${imageText}`;

    // Send combined prompt to Ollama API
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.1:8b",
      prompt: combinedPrompt,
    });
    
    // The API response might be streamed or aggregated as before.
    // For simplicity, assume response.data.response (or adjust if needed).
    console.log("Ollama API response:", response.data);
    res.json({ response: typeof response.data === "string" ? response.data : response.data.response });
  } catch (error) {
    console.error("Error processing image or generating response:", error);
    res.status(500).json({ error: "Image processing or generation failed" });
  }
});

// Existing text-only endpoint (if needed)
app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.1:8b",
      prompt: prompt,
    });
    res.json({ response: typeof response.data === "string" ? response.data : response.data.response });
  } catch (error) {
    console.error("Error from Ollama API:", error);
    res.status(500).json({ error: "Failed to communicate with Ollama API" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
