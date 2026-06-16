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

export const normalizeCpf = (value: string) => onlyDigits(value).slice(0, 11);

export const formatCpf = (value: string) => {
  const digits = normalizeCpf(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const isValidCpf = (value: string) => normalizeCpf(value).length === 11;

export const formatApiTime = (value: string) => {
  const digits = String(value ?? "").trim();
  if (!digits) return "";

  const match = digits.match(/^(\d{2}):(\d{2})(?::\d{2}(?:\.\d{3})?)?$/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  const date = new Date(digits);
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);
  }

  return digits.length >= 5 ? digits.slice(0, 5) : digits;
};

export const formatApiDate = (value: string) => {
  const input = String(value ?? "").trim();
  if (!input) return "";

  const directMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (directMatch) {
    return `${directMatch[3]}/${directMatch[2]}/${directMatch[1]}`;
  }

  const alreadyFormatted = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (alreadyFormatted) {
    return input;
  }

  const date = new Date(input);
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  return input;
};
