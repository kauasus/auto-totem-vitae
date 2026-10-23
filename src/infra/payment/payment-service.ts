import { env } from "../../main/config/env";
import type { PaymentMethod } from "../../domain/entities/check-in";

export interface PaymentStatus {
  paymentStatus?: string;
  message?: string;
  showCancelButton?: boolean;
  showConfirmationButtons?: boolean;
  showButtonsAfterSitefError?: boolean;
  showQrCode?: boolean;
  qrCodeString?: string;
  transaction?: { receipt?: string; status?: string };
}

export const FINAL_PAYMENT_STATUSES = new Set([
  "APPROVED", "CANCELED", "CANCELLED", "REJECTED", "REFUNDED",
  "APPROVED_WITH_CONFIRMATION_ERROR", "APPROVED_WITH_RECEIPT_ERROR",
  "APPROVED_WITH_PRINTING_ERROR",
]);

export function canRetryPayment(status: PaymentStatus): boolean {
  const unsuccessful = ["CANCELED", "CANCELLED", "REJECTED", "REFUNDED"];
  return unsuccessful.includes(getPaymentOutcome(status) || "");
}

export function getPaymentOutcome(status: PaymentStatus): string | undefined {
  // FINISHED encerra o fluxo; o resultado financeiro vem na transação.
  return status.paymentStatus === "FINISHED"
    ? status.transaction?.status
    : status.paymentStatus;
}

export function isPaymentFinished(status: PaymentStatus): boolean {
  // O SiTef pode aguardar confirmação do erro antes de encerrar a operação.
  if (status.showButtonsAfterSitefError || status.showConfirmationButtons) return false;
  return FINAL_PAYMENT_STATUSES.has(getPaymentOutcome(status) || "");
}

let activationPromise: Promise<void> | undefined;

export function activatePaymentService(): Promise<void> {
  // Compartilha a ativação entre a inicialização e o pagamento, inclusive no StrictMode.
  if (!activationPromise) {
    activationPromise = (async () => {
      if (!env.paymentActivation.ip || !env.paymentActivation.storeId || !env.paymentActivation.terminalId) {
        throw new Error("Configure os parâmetros de ativação da maquininha no .env.");
      }
      const result = await paymentRequest("/activate", env.paymentActivation);
      if (result.message === "Pagamento em andamento") {
        throw new Error("Não foi possível ativar: existe um pagamento em andamento.");
      }
    })().catch((error: unknown) => {
      activationPromise = undefined;
      throw error;
    });
  }
  return activationPromise;
}

export async function paymentRequest(path: string, body?: object): Promise<PaymentStatus> {
  let response: Response;
  try {
    response = await fetch(`${env.paymentServiceUrl.replace(/\/+$/, "")}${path}`, {
      method: body === undefined ? "GET" : "POST",
      ...(body === undefined ? {} : {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error("Sem comunicação com a maquininha. Verifique o serviço e o certificado instalado neste totem.");
  }
  const text = await response.text();
  let data: PaymentStatus;
  try { data = text ? JSON.parse(text) : {}; }
  catch { data = { message: text }; }
  if (!data || typeof data !== "object") throw new Error("Resposta inválida do serviço de pagamento.");
  if (!response.ok) throw new Error(data.message || `Erro no serviço de pagamento (${response.status}).`);
  return data;
}

export function buildPaymentPayload(method: PaymentMethod, value?: number) {
  const methods = { "Cartão Débito": 0, "Cartão Crédito": 1, PIX: 2 };
  if (method === "Retorno" || typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error("Forma de pagamento ou valor inválido para cobrança.");
  }
  const amount = Math.round(value * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error("Valor inválido para cobrança.");
  return { amount, paymentMethod: methods[method], installments: 1 };
}
