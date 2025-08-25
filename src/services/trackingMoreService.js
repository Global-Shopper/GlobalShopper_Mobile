import axios from "axios";

// Use Expo environment variable with proper fallback
const trackingMoreApiKey =
	process.env.EXPO_PUBLIC_TRACKINGMORE_APIKEY ||
	"h8lfp95f-0qdj-iwep-kdhm-02rnccm11as6";

// Validate tracking number format based on carrier
const validateTrackingNumber = (trackingNumber, carrier) => {
	if (!trackingNumber || trackingNumber.trim() === "") {
		return { isValid: false, message: "Tracking number is required" };
	}

	const cleanNumber = trackingNumber.trim();
	let suggestedCarrier = carrier;

	// Auto-detect carrier based on tracking number format
	if (cleanNumber.match(/^SPX[A-Z]{2}\d{9,12}$/)) {
		suggestedCarrier = "spx";
	} else if (cleanNumber.match(/^(EMS|CP|RA|RR)\d{9}VN$/)) {
		suggestedCarrier = "vietnam-post";
	} else if (cleanNumber.match(/^GHN\d{8,}$/)) {
		suggestedCarrier = "ghn";
	} else if (cleanNumber.match(/^JT\d{10,}$/)) {
		suggestedCarrier = "jt-express";
	}

	return {
		isValid: true,
		message: "",
		suggestedCarrier,
	};
};

// Create tracking first (required by TrackingMore API)
export const createTracking = async (tracking_number, carrier = null) => {
	const validation = validateTrackingNumber(tracking_number, carrier);
	if (!validation.isValid) {
		throw new Error(validation.message);
	}

	const requestBody = {
		tracking_number: tracking_number.trim(),
		carrier_code: validation.suggestedCarrier || carrier || "spx",
	};

	try {
		const response = await axios.post(
			"https://api.trackingmore.com/v4/trackings/create",
			requestBody,
			{
				headers: {
					"Content-Type": "application/json",
					"Tracking-Api-Key": trackingMoreApiKey,
				},
				timeout: 15000,
			}
		);

		return response;
	} catch (error) {
		// If tracking already exists, that's OK
		if (
			error.response?.status === 400 &&
			error.response?.data?.meta?.message?.includes("already exists")
		) {
			return {
				status: 200,
				data: { message: "Tracking already exists" },
			};
		}

		throw error;
	}
};

export const getTracking = async (tracking_number, carrier = null) => {
	// Validate tracking number
	const validation = validateTrackingNumber(tracking_number, carrier);
	if (!validation.isValid) {
		throw new Error(validation.message);
	}

	const cleanTrackingNumber = tracking_number.trim();
	const requestUrl = `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${cleanTrackingNumber}`;

	const requestConfig = {
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
			"Tracking-Api-Key": trackingMoreApiKey,
		},
		timeout: 15000,
	};

	try {
		const response = await axios.get(requestUrl, requestConfig);

		if (response.data?.data?.[0]) {
			const trackingItem = response.data.data[0];

			console.log(
				"Tracking Events Count:",
				trackingItem.origin_info?.trackinfo?.length || 0
			);

			if (trackingItem.origin_info?.trackinfo) {
			}
		}

		return response;
	} catch (error) {
		// If tracking doesn't exist, try creating it first
		if (
			error.response?.status === 400 &&
			error.response?.data?.meta?.message?.includes("no exists")
		) {
			try {
				await createTracking(
					tracking_number,
					validation.suggestedCarrier || carrier
				);

				// Retry GET after creating
				const retryResponse = await axios.get(
					requestUrl,
					requestConfig
				);

				return retryResponse;
			} catch (createError) {
				throw createError;
			}
		}

		// Enhanced error messages for other cases
		if (error.response?.status === 401) {
			throw new Error("TrackingMore API: Invalid or missing API key");
		} else if (error.response?.status === 429) {
			throw new Error(
				"TrackingMore API: Rate limit exceeded. Try again later"
			);
		} else if (error.code === "ECONNABORTED") {
			throw new Error("TrackingMore API: Request timeout");
		} else if (!error.response) {
			throw new Error(
				"TrackingMore API: Network error - check internet connection"
			);
		} else {
			throw new Error(
				`TrackingMore API: ${error.response?.status} - ${error.message}`
			);
		}
	}
};
