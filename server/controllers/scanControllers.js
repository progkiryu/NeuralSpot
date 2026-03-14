const { extractBase64, extractMimeType } = require("../utils/imageUtils")
const { analyzeImage } = require("../services/strokeDetectionService")

exports.scanController = async (req, res, next) => {
  const { image } = req.body;
  try {
    if (!image) {
      return res.status(400).json({ success: false, error: "image is required" });
    }

    const base64 = extractBase64(image);   // strips "data:image/jpeg;base64," prefix
    const mimeType = extractMimeType(image); // extracts "image/jpeg" etc.

    const result = await analyzeImage(base64, mimeType);

    return res.status(200).json({
      success: true,
      diagnosisId: result.diagnosisId,
      timestamp: result.timestamp,
      analysis: result.analysis,
    });
  } catch (error) {
    next(error);
  }
};




