export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() ?? "",
  printApiUrl:
    import.meta.env.VITE_PRINT_API_URL?.trim() ??
    "http://localhost:5501/api-py/v1/print",
};
