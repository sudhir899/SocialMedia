import axios from "axios";

// Text Moderation
export const moderateText = async (req, res) => {
  try {
    const { text } = req.body;
    console.log("Enters moderateText");
    // Use HuggingFace API for zero-shot classification (text)
    const response = await axios.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
          inputs: text,
          parameters: {
            candidate_labels: ["technology","computer science","sports","movies","politics","fashion","others"],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      

    const labels = response.data.labels;
    const scores = response.data.scores;
     console.log("Conpleted moderateText");
    if (labels[0] === "technology" || labels[0] === "computer science") {
      console.log(labels[0]);
      return res.status(200).json({ status: "allowed" });
    } else {
        console.log(labels[0]);
      return res.status(200).json({ status: "flagged"});
    }
  } catch (error) {
    console.log("Some Error Occurs");
    res.status(500).json({ error: "Moderation failed." });
  }
};


// Image Moderation

import fs from "fs";
import path from "path";
// import axios from "axios";

export const moderateImage = async (req, res) => {
  try {
    console.log("Enters moderateImage");

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = path.join("public", "assets", req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

    // Send image to Hugging Face API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      { inputs: base64Image },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || !response.data.length) {
      throw new Error("Unexpected API response");
    }

    const topPrediction = response.data[0];
    console.log(response.data);
    console.log("Top predicted label:", topPrediction.label, "with score:", topPrediction.score);

    const techLabels = [
  'web site, website, internet site, site',
  'desktop computer',
  'screen, crt screen',
  'hand-held computer, hand-held microcomputer',
  'laptop',
  'computer keyboard',
  'cellular telephone',
  'modem',
  'printer'
];

const normalized = topPrediction.label.toLowerCase().trim();
const isTech = techLabels.includes(normalized);
    res.status(200).json({
      status: isTech ? "allowed" : "flagged",
    });
  } catch (error) {
    console.error("Moderation Failed:", error.message);
    res.status(500).json({
      error: "Image moderation failed",
      details: error.message,
    });
  } finally {
    if (req.file) {
      try {
        fs.unlinkSync(path.join("public", "assets", req.file.filename));
      } catch (err) {
        console.error("Failed to delete image file:", err);
      }
    }
  }
};





//toxic comment Moderation

export const moderateComment = async (req, res) => {
  try {
    const { text } = req.body;
    console.log("Enters moderateComment");
    const response = await axios.post("https://api-inference.huggingface.co/models/unitary/toxic-bert",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
      }
    );

    // Check if output exists
    const predictions = response.data[0];
    console.log('Predictions:', predictions);

    const toxicLabels = ['toxicity', 'insult', 'obscene', 'identity_attack', 'threat'];

    // Flag as toxic if any of the key labels are above a threshold
    for (const labelObj of predictions) {
      if (toxicLabels.includes(labelObj.label.toLowerCase()) && labelObj.score >= 0.7) {
        return res.status(200).json({ status: "flagged" });
        
      }
    }

    return res.status(200).json({ status: "allowed" });
  } catch (error) {
    console.error('Error checking comment:', error.message);
    res.status(500).json({ error: "Comment Moderation failed." });
  }
}

