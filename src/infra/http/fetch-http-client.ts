/* eslint-disable @typescript-eslint/no-unused-vars */
export interface HttpClient {
  post<TResponse>(url: string, body: unknown): Promise<TResponse>;
}

type FetchHttpClientOptions = {
  getAuthToken?: () => string;
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
  _options: FetchHttpClientOptions = {},
): HttpClient => ({
  async post<TResponse>(url: string, body: unknown): Promise<TResponse> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3OTMiLCJpYXQiOjE3ODM0NDY2ODB9.eqO1wF-xbvoOcAZtpHCq4gP3eRODXt2o0duFUlS7GTU",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
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
