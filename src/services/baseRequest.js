import axios from "axios";
import axiosRetry from "axios-retry";
import { setOnLineStatus } from "../features/app";
import { setUser } from "../features/user";

// Axios instance setup
const url = process.env.EXPO_PUBLIC_SERVER_URL;

export const axiosInstance = axios.create({
	baseURL: url,
	headers: {
		"Content-Type": "application/json",
	},
	responseType: "json",
	timeout: 300000,
	timeoutErrorMessage: "Connection is timeout exceeded",
});

// Lưu ý: baseurl không cần truyền vào vì đã được định nghĩa trong axiosInstance
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

// Lưu ý dùng hàm này vì thực thi store của redux ngay module này sẽ bị lỗi circular dependency
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
			if (status === 503) {
				return false;
			}

			return (
				(status >= 100 && status <= 199) ||
				(status >= 500 && status <= 599) ||
				axiosRetry.isNetworkOrIdempotentRequestError(error) ||
				status === 429 ||
				status === 408 ||
				status === 400
			);
		},
	});
	// Request interceptor
	axiosInstance.interceptors.request.use(
		async (config) => {
			// Skip auth for AI endpoints (they might be public)
			const isAIEndpoint = config.url?.includes("/ai/");

			if (!isAIEndpoint) {
				const appState = await store.getState();
				const accessToken = appState?.rootReducer?.user?.accessToken;
				const refreshToken = appState?.rootReducer?.user?.refreshToken;

				if (accessToken) {
					config.headers["Authorization"] = `Bearer ${accessToken}`;
				}

				if (isTokenExpired(accessToken)) {
					const newAccessToken = await refreshAccessToken(
						refreshToken
					);
					if (newAccessToken) {
						config.headers[
							"Authorization"
						] = `Bearer ${newAccessToken}`;
						store.dispatch(
							setUser({ ...newAccessToken, isLoggedIn: true })
						);
					}
				}
			}

			// Debug logging for purchase request
			if (config.url?.includes("purchase-request")) {
				console.log("=== AXIOS REQUEST DEBUG ===");
				console.log("URL:", config.baseURL + config.url);
				console.log("Method:", config.method);
				console.log("Headers:", config.headers);
				console.log("Data:", JSON.stringify(config.data, null, 2));
			}

			if (config.data) {
				// Check if data is FormData (React Native)
				if (config.data instanceof FormData) {
					// Let browser set Content-Type with boundary for multipart/form-data
					delete config.headers["Content-Type"];
				} else {
					// Check if data contains file objects (fallback)
					const haveFile = Object.values(config.data).some(
						(e) =>
							e &&
							(e.toString() === "[object File]" ||
								(e.uri && e.type && e.name))
					);
					if (haveFile) {
						config.headers["Content-Type"] = "multipart/form-data";
					}
				}
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// Response interceptor to handle 403 errors
	axiosInstance.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			// Handle 403 Forbidden errors
			if (error.response?.status === 403) {
				console.log(
					"🚨 403 Forbidden - Token likely expired, forcing logout..."
				);

				// Import signout action
				const { signout } = await import("../features/user");

				// Clear user data and navigate to login
				store.dispatch(signout());

				// Optional: Show alert to user
				console.log("User has been logged out due to expired session");
			}

			return Promise.reject(error);
		}
	);
};

// Function to check if the token is expired
const isTokenExpired = (token) => {
	// Implement your logic to check token expiration
	// Return true if expired, false otherwise
};

// Function to refresh the access token
const refreshAccessToken = async (refreshToken) => {
	// Implement your logic to refresh the access token using the refresh token
	// Return the new access token
};

export default setUpInterceptor;
