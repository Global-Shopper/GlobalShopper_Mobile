/**
 * VietQR Service - Quản lý API liên quan đến ngân hàng Việt Nam
 */
import axios from "axios";

const vietqrApi = axios.create({
	baseURL: "https://api.vietqr.io/v2",
	timeout: 10000,
});

// Cache đơn giản
let cachedBanks = null;

async function fetchData() {
	try {
		const response = await vietqrApi.get("/banks");

		if (response.data.code === "00" && response.data.data) {
			// Sử dụng logo URL từ API, không override
			return response.data.data;
		}
		throw new Error("API Error");
	} catch (error) {
		console.log("VietQR API failed:", error.message);
		return []; // Trả về mảng rỗng thay vì fallback data
	}
}

export async function getBanks() {
	if (!cachedBanks) {
		cachedBanks = await fetchData();
	}
	return cachedBanks;
}

export async function searchBanks(query) {
	const banks = await getBanks();
	if (!query) return banks;

	const searchTerm = query.toLowerCase();
	return banks.filter(
		(bank) =>
			bank.shortName.toLowerCase().includes(searchTerm) ||
			bank.name.toLowerCase().includes(searchTerm) ||
			bank.code.toLowerCase().includes(searchTerm)
	);
}

export function clearCache() {
	cachedBanks = null;
}
