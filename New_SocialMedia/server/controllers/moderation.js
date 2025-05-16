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

export const moderateImage = async (req, res) => {
  try {
    console.log("Enters moderateImage");

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Read image from disk
    const imagePath = path.join("public", "assets", req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64').replace(/^data:image\/\w+;base64,/, '');

    // Correct API request format for CLIP model
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/openai/clip-vit-large-patch14",
      {
        inputs: imageBase64, // Base64 string directly
        parameters: {
          candidate_labels: [
            "technology",
            "computer science", 
            "sports",
            "movies",
            "politics",
            "fashion",
            "meme",
            "random photo",
            "others"
          ],
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Handle API response
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Unexpected API response format");
    }

    // The CLIP API returns an array of results - take the first one
    const result = response.data[0];
    const labels = result.labels || [];
    const scores = result.scores || [];
    
    if (labels.length === 0) {
      throw new Error("No labels returned from API");
    }

    const topLabel = labels[0];
    console.log("Top predicted label:", topLabel);

    // Check if image is tech-related
    if (topLabel === "technology" || topLabel === "computer science") {
      return res.status(200).json({ 
        status: "allowed", 
        label: topLabel,
        confidence: scores[0] 
      });
    } else {
      return res.status(200).json({ 
        status: "flagged", 
        label: topLabel,
        confidence: scores[0]
      });
    }
  } catch (error) {
    console.error("Moderation Failed:", error?.response?.data || error.message);
    res.status(500).json({ 
      error: "Image moderation failed",
      details: error.message 
    });
  } finally {
    // Clean up: delete the uploaded file after processing
    if (req.file) {
      try {
        fs.unlinkSync(path.join("public", "assets", req.file.filename));
      } catch (cleanupError) {
        console.error("Failed to clean up image file:", cleanupError);
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

