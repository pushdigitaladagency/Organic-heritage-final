import { asset } from "@/lib/asset";

const PRODUCT_IMAGE_DIR = "/images/webp";

const ensureWebpExtension = (filename) => {
  if (!filename) return null;
  if (filename.endsWith(".webp")) return filename;
  return `${filename}.webp`;
};

export const productImagePath = (image, variant = null) => {
  if (!image) return null;
  if (/^([a-z]+:)?\/\//i.test(image) || image.startsWith("data:")) {
    return image;
  }

  let filename = image.split("/").pop();

  if (variant) {
    const base = filename.replace(/\.(webp|svg|png|jpg|jpeg)$/i, "");
    filename = `${base}-${variant}.webp`;
  } else {
    filename = ensureWebpExtension(filename);
  }

  return `${PRODUCT_IMAGE_DIR}/${filename}`;
};

export const productImageSrc = (image, variant = null) => {
  const path = productImagePath(image, variant);
  if (!path || /^([a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }
  return asset(path);
};
