import axios from "axios";
import axiosRetry from "axios-retry";
import Constants from "expo-constants";
import { setOnLineStatus } from "../features/app";
import { setUser, signout } from "../features/user";

// 🔹 Lấy URL từ app.config.js (đã inject từ .env)
const url = Constants.expoConfig?.extra?.serverUrl;

// Axios instance
export const axiosInstance = axios.create({
	baseURL: url,
	headers: { "Content-Type": "application/json" },
	responseType: "json",
	timeout: 30000, // 30s
	timeoutErrorMessage: "Connection timeout exceeded",
});

// Axios Base Query cho RTK Query
export const axiosBaseQuery =
	({ baseUrl } = { baseUrl: "" }) =>
	async ({ url, method, data, params }) => {
		try {
			const result = await axiosInstance({
				url: baseUrl + url,
				method,
				data,
				params,
			});
			return { data: result.data };
		} catch (axiosError) {
			let err = axiosError.response?.data || axiosError;
			return {
				error: {
					status: axiosError.response?.status || 500,
					data: err,
				},
			};
		}
	};

// Setup interceptor
const setUpInterceptor = (store) => {
	// Retry logic
	axiosRetry(axiosInstance, {
		retries: 1,
		retryDelay: (retryCount) => retryCount * 500,
		shouldResetTimeout: true,
		retryCondition: (error) => {
			if (!navigator.onLine) {
				store.dispatch(setOnLineStatus(false));
				return false;
			}
			const status = Number(error?.response?.status);
			if (status === 503) return false;

			return (
				(status >= 500 && status <= 599) ||
				axiosRetry.isNetworkOrIdempotentRequestError(error) ||
				status === 429 ||
				status === 408
			);
		},
	});

	// Request interceptor
	axiosInstance.interceptors.request.use(
		async (config) => {
			const appState = store.getState();
			const accessToken = appState?.rootReducer?.user?.accessToken;
			const refreshToken = appState?.rootReducer?.user?.refreshToken;

			if (accessToken) {
				config.headers["Authorization"] = `Bearer ${accessToken}`;
			}

			if (isTokenExpired(accessToken) && refreshToken) {
				const newAccessToken = await refreshAccessToken(refreshToken);
				if (newAccessToken) {
					config.headers[
						"Authorization"
					] = `Bearer ${newAccessToken}`;
					store.dispatch(
						setUser({
							accessToken: newAccessToken,
							isLoggedIn: true,
						})
					);
				} else {
					store.dispatch(signout());
				}
			}

			// Debug log cho purchase-request
			if (config.url?.includes("purchase-request")) {
				console.log("=== AXIOS REQUEST DEBUG ===");
				console.log("URL:", config.baseURL + config.url);
				console.log("Method:", config.method);
				console.log("Headers:", config.headers);
				console.log("Data:", JSON.stringify(config.data, null, 2));
			}

			// Nếu là FormData thì bỏ Content-Type mặc định
			if (config.data instanceof FormData) {
				delete config.headers["Content-Type"];
			}

			return config;
		},
		(error) => Promise.reject(error)
	);

	// Response interceptor
	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response?.status === 403) {
				store.dispatch(signout());
				console.log(
					"🚨 403 Forbidden - Logged out due to expired session"
				);
			}
			return Promise.reject(error);
		}
	);
};

// Check token expired
const isTokenExpired = (token) => {
	if (!token) return true;
	try {
		const [, payload] = token.split(".");
		const decoded = JSON.parse(atob(payload));
		return decoded.exp * 1000 < Date.now();
	} catch {
		return true;
	}
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
	try {
		const res = await axios.post(`${url}/auth/refresh`, { refreshToken });
		return res.data?.accessToken || null;
	} catch (err) {
		console.log("Refresh token failed", err);
		return null;
	}
};

export default setUpInterceptor;
