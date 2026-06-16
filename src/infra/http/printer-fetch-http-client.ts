export interface PrinterHttpClient {
  post<TResponse>(url: string, body: unknown): Promise<TResponse>;
}

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

export const createPrinterFetchHttpClient = (): PrinterHttpClient => ({
  async post<TResponse>(url: string, body: unknown): Promise<TResponse> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
