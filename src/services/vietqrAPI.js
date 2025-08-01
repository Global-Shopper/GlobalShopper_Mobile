import axios from "axios";

const vietqrApi = axios.create({
	baseURL: "https://api.vietqr.io/v2",
	timeout: 10000,
});

let cachedBanks = null;

async function fetchData() {
	try {
		const response = await vietqrApi.get("/banks");
		console.log("VietQR API response:", {
			code: response.data.code,
			dataExists: !!response.data.data,
			dataLength: response.data.data?.length,
			firstBank: response.data.data?.[0],
			sampleBanks: response.data.data?.slice(0, 3),
		});

		if (response.data.code === "00" && response.data.data) {
			return response.data.data;
		}
		throw new Error("API Error");
	} catch (error) {
		console.log("VietQR API failed:", error.message);
		return [];
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
