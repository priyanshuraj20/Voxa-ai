import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle automatic token refresh if response is 401
  if (response.status === 401 && typeof window !== "undefined") {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        console.log("Token expired. Attempting token refresh...");
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${refreshToken}`,
          },
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          const newAccessToken = data.access_token;
          setAccessToken(newAccessToken);

          // Retry the request with the new token
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          console.warn("Refresh token invalid/expired. Logging out.");
          clearTokens();
          // Dispatch logout event and redirect
          window.dispatchEvent(new CustomEvent("auth-logout"));
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    }
  }

  return response;
}
