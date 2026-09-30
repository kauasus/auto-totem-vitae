import { getApiToken } from "../auth/api-token-storage";
export interface HttpClient {
  post<TResponse>(url: string, body: unknown): Promise<TResponse>;
  put<TResponse>(url: string, body: unknown): Promise<TResponse>;
}

type FetchHttpClientOptions = {
  getAuthToken?: () => string;
  onUnauthorized?: () => void;
};

const readResponseError = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const errorPayload = (await response.json()) as
        | { message?: string; error?: string }
        | string;

      if (typeof errorPayload === "string") {
        return errorPayload;
      }

      return errorPayload.message ?? errorPayload.error ?? "";
    } catch {
      return "";
    }
  }

  try {
    return await response.text();
  } catch {
    return "";
  }
};

export const createFetchHttpClient = (
  options: FetchHttpClientOptions = {},
): HttpClient => ({
  async put<TResponse>(url: string, body: unknown): Promise<TResponse> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token":
          (options.getAuthToken ?? getApiToken)(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) options.onUnauthorized?.();
      const detail = await readResponseError(response);
      throw new Error(
        detail || `A requisiÃ§Ã£o falhou com status ${response.status}.`,
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  },

  async post<TResponse>(url: string, body: unknown): Promise<TResponse> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token":
          (options.getAuthToken ?? getApiToken)(),
          
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 401) options.onUnauthorized?.();
      const detail = await readResponseError(response);
      throw new Error(
        detail || `A requisição falhou com status ${response.status}.`,
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  },
});
