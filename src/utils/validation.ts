export const isValidEmail = (value: string) => {
  const email = value.trim().toLowerCase();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const onlyDigits = (value: string) => (value ?? "").replace(/\D/g, "");

export const formatCep = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export const normalizeCep = (value: string) => onlyDigits(value).slice(0, 8);

export const isValidCep = (value: string) => normalizeCep(value).length === 8;
