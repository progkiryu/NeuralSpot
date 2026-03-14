/**
 * Strips the data URL prefix from a base64 image string.
 * Accepts both raw base64 and "data:image/jpeg;base64,..." format.
 */
exports.extractBase64 = (image) => {
  if (!image) throw new Error("No image provided");
  return image.includes(",") ? image.split(",")[1] : image;
};

/**
 * Infers the MIME type from a data URL, defaulting to image/jpeg.
 */
exports.extractMimeType = (image) => {
  const match = image.match(/^data:(image\/\w+);base64,/);
  return match ? match[1] : "image/jpeg";
};