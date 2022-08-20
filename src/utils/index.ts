import sharp from "sharp";

export const resizeImage = async (base64: string): Promise<string> => {
  const parts = base64.split(";");
  const mimType = parts[0].split(":")[1];
  const imageData = parts[1].split(",")[1];

  const img = Buffer.from(imageData, "base64");

  const resizedImage = await sharp(img).resize(500).toBuffer();
  const resizedImageData = resizedImage.toString("base64");
  
  return `data:${mimType};base64,${resizedImageData}`;
};
