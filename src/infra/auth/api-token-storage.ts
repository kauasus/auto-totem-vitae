const API_TOKEN_STORAGE_KEY = "auto_totem_api_token";

export const getApiToken = () => localStorage.getItem(API_TOKEN_STORAGE_KEY) ?? "";

export const setApiToken = (token: string) => {
  localStorage.setItem(API_TOKEN_STORAGE_KEY, token.trim());
};

export const clearApiToken = () => {
  localStorage.removeItem(API_TOKEN_STORAGE_KEY);
};
