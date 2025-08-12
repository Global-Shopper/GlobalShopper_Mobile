// Cloudinary configuration
export const CLOUDINARY_NAME =
	process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "gshop";
export const CLOUDINARY_UPLOAD_PRESET =
	process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";
export const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI || "";

// Cloudinary upload URL
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`;
