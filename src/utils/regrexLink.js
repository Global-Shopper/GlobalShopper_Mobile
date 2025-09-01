export const URL_REGEX =
	/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;

export const STRICT_URL_REGEX =
	/^https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;

export const PLATFORM_PATTERNS = {
	amazon: /amazon\.(com|ca|co\.uk|de|fr|it|es|co\.jp|in|com\.au|com\.mx|com\.br)/i,
	aliexpress: /aliexpress\.com/i,
	ebay: /ebay\.(com|ca|co\.uk|de|fr|it|es|com\.au)/i,
	asos: /asos\.com/i,
	dhgate: /dhgate\.com/i,
	gmarket: /gmarket\.co\.kr/i,
	shein: /shein\.com/i,
	shopee: /shopee\.(vn|sg|my|th|ph|tw|co\.id|com\.br)/i,
	lazada: /lazada\.(vn|sg|my|th|ph|co\.id)/i,
	tiki: /tiki\.vn/i,
	sendo: /sendo\.vn/i,
};

export const isValidUrl = (url, requireProtocol = false) => {
	if (!url || typeof url !== "string") {
		return false;
	}

	const trimmedUrl = url.trim();
	if (trimmedUrl === "") {
		return false;
	}

	if (requireProtocol) {
		return STRICT_URL_REGEX.test(trimmedUrl);
	}

	return URL_REGEX.test(trimmedUrl);
};

export const extractPlatformFromUrl = (url) => {
	if (!url || typeof url !== "string") {
		return "Unknown";
	}
	const urlLower = url.toLowerCase();

	for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
		if (pattern.test(urlLower)) {
			return platform.charAt(0).toUpperCase() + platform.slice(1);
		}
	}

	return "Unknown";
};

export const normalizeUrl = (url) => {
	if (!url || typeof url !== "string") {
		return "";
	}

	const trimmedUrl = url.trim();
	if (trimmedUrl === "") {
		return "";
	}

	if (/^https?:\/\//i.test(trimmedUrl)) {
		return trimmedUrl;
	}

	return `https://${trimmedUrl}`;
};

export const isSupportedPlatform = (url) => {
	if (!url || typeof url !== "string") {
		return false;
	}

	return extractPlatformFromUrl(url) !== "Unknown";
};
