import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

// Platform logo mappings
const PLATFORM_LOGOS: { [key: string]: any } = {
	// Amazon variations
	amazon: require("../assets/images/ecommerce/amazon-logo.png"),
	"amazon.com": require("../assets/images/ecommerce/amazon-logo.png"),
	"amazon.vn": require("../assets/images/ecommerce/amazon-logo.png"),

	// AliExpress variations
	aliexpress: require("../assets/images/ecommerce/aliexpress-logo.png"),
	"aliexpress.com": require("../assets/images/ecommerce/aliexpress-logo.png"),
	alibaba: require("../assets/images/ecommerce/aliexpress-logo.png"),

	// eBay variations
	ebay: require("../assets/images/ecommerce/ebay-logo.png"),
	"ebay.com": require("../assets/images/ecommerce/ebay-logo.png"),

	// ASOS variations
	asos: require("../assets/images/ecommerce/asos-logo.png"),
	"asos.com": require("../assets/images/ecommerce/asos-logo.png"),

	// Shein variations
	shein: require("../assets/images/ecommerce/shein-logo.png"),
	"shein.com": require("../assets/images/ecommerce/shein-logo.png"),

	// DHgate variations
	dhgate: require("../assets/images/ecommerce/dhgate-logo.png"),
	"dhgate.com": require("../assets/images/ecommerce/dhgate-logo.png"),

	// Gmarket variations
	gmarket: require("../assets/images/ecommerce/gmarket-logo.png"),
	"gmarket.co.kr": require("../assets/images/ecommerce/gmarket-logo.png"),
};

// Helper function to detect platform from URL
function detectPlatformFromUrl(url?: string): string | null {
	if (!url) return null;

	const lowerUrl = url.toLowerCase();

	if (lowerUrl.includes("amazon")) return "amazon";
	if (lowerUrl.includes("aliexpress") || lowerUrl.includes("alibaba"))
		return "aliexpress";
	if (lowerUrl.includes("ebay")) return "ebay";
	if (lowerUrl.includes("asos")) return "asos";
	if (lowerUrl.includes("shein")) return "shein";
	if (lowerUrl.includes("dhgate")) return "dhgate";
	if (lowerUrl.includes("gmarket")) return "gmarket";

	return null;
}

interface PlatformLogoProps {
	platform?: string;
	productUrl?: string;
	size?: number;
	color?: string;
	style?: any;
}

export default function PlatformLogo({
	platform,
	productUrl,
	size = 20,
	color = "#1976D2",
	style,
}: PlatformLogoProps) {
	// Normalize platform name for matching
	const normalizedPlatform = platform?.toLowerCase()?.trim();

	// Try to get platform from name first, then from URL
	let detectedPlatform = normalizedPlatform;
	if (!detectedPlatform) {
		const urlDetected = detectPlatformFromUrl(productUrl);
		detectedPlatform = urlDetected || undefined;
	}

	// Check if we have a logo for this platform
	const logoSource = detectedPlatform
		? PLATFORM_LOGOS[detectedPlatform]
		: null;

	if (logoSource) {
		return (
			<View style={[styles.logoContainer, style]}>
				<Image
					source={logoSource}
					style={[styles.logo, { width: size, height: size }]}
					resizeMode="contain"
				/>
			</View>
		);
	}

	// Fallback to storefront icon if no logo found
	return (
		<Ionicons
			name="storefront-outline"
			size={size}
			color={color}
			style={style}
		/>
	);
}

const styles = StyleSheet.create({
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		borderRadius: 4,
	},
});
