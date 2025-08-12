import axios from "axios";
import { CLOUDINARY_NAME, CLOUDINARY_UPLOAD_PRESET } from "../const/urlconst";

export const uploadToCloudinary = async (file) => {
	console.log("CLOUDINARY_NAME:", CLOUDINARY_NAME);
	console.log("CLOUDINARY_UPLOAD_PRESET:", CLOUDINARY_UPLOAD_PRESET);

	// Validate inputs
	if (!CLOUDINARY_NAME || !CLOUDINARY_UPLOAD_PRESET) {
		console.error("Missing Cloudinary configuration");
		return null;
	}

	if (!file || !file.uri) {
		console.error("Invalid file object");
		return null;
	}

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

	try {
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		console.log("Upload successful:", response.data.secure_url);
		return response.data.secure_url || response.data.url; // Prefer secure_url (HTTPS)
	} catch (error) {
		console.error("Upload failed:", error.response?.data || error.message);
		return null;
	}
};
