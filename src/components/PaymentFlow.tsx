import { useEffect, useRef, useState } from "react";
import {
  isPaymentFinished, paymentRequest, activatePaymentService, canRetryPayment, getPaymentOutcome,
  type PaymentStatus,
} from "../infra/payment/payment-service";

interface Props {
  payload: { amount: number; paymentMethod: number; installments: number };
  onApproved: (status: PaymentStatus) => void;
  onClose: () => void;
}

export default function PaymentFlow({ payload, onApproved, onClose }: Props) {
  const started = useRef(false);
  const approvalHandled = useRef(false);
  const [status, setStatus] = useState<PaymentStatus>({ message: "Enviando pagamento à maquininha..." });
  const [accepted, setAccepted] = useState(false);
  const [serviceBusy, setServiceBusy] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [safeToClose, setSafeToClose] = useState(false);
  const terminal = isPaymentFinished(status);
  const outcome = getPaymentOutcome(status);
  const finalMessages: Record<string, string> = {
    APPROVED: "Pagamento aprovado. Preparando a impressão e a recepção...",
    CANCELED: "Pagamento cancelado. Você pode tentar novamente.",
    CANCELLED: "Pagamento cancelado. Você pode tentar novamente.",
    REJECTED: "Pagamento recusado. Você pode tentar novamente com outro cartão ou forma de pagamento.",
    REFUNDED: "Pagamento estornado. Você pode tentar novamente.",
  };

  useEffect(() => {
    if (serviceBusy || !terminal || outcome !== "APPROVED" || approvalHandled.current) return;
    approvalHandled.current = true;
    onApproved(status);
  }, [serviceBusy, terminal, outcome, onApproved, status]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let paymentDispatched = false;
    void activatePaymentService().then(() => {
      paymentDispatched = true;
      return paymentRequest("/payment", payload);
    }).then((result) => {
      if (result.message === "Pagamento em andamento") {
        setServiceBusy(true);
        setAccepted(true);
        setPolling(true);
        return;
      }
      setAccepted(true);
      setPolling(true);
    }).catch((cause: Error) => {
      if (!paymentDispatched) {
        setError(`Não foi possível ativar a maquininha. ${cause.message}`);
        setSafeToClose(true);
        return;
      }
      // A resposta pode ter se perdido depois de o serviço iniciar a cobrança.
      // Não reenviar automaticamente nem liberar outra cobrança neste fluxo.
      setError(`${cause.message} Solicite ajuda à recepção para verificar se a cobrança foi iniciada.`);
    });
  }, [payload]);

  useEffect(() => {
    if (!polling) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const next = await paymentRequest("/status");
        if (!active) return;
        setStatus(next);
        setError("");
        if (isPaymentFinished(next)) {
          setPolling(false);
          setSafeToClose(serviceBusy || canRetryPayment(next));
          return;
        }
        timer = setTimeout(() => void poll(), 800);
      } catch (cause) {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : "Erro ao consultar pagamento.");
        setPolling(false);
      }
    };
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [polling, serviceBusy]);

  const retryStart = async () => {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      const result = await paymentRequest("/payment", payload);
      if (result.message === "Pagamento em andamento") {
        setError("O serviço ainda está ocupado. Aguarde a operação anterior terminar antes de tentar iniciar o pagamento.");
        setPolling(true);
        return;
      }
      setServiceBusy(false);
      setSafeToClose(false);
      setStatus({ message: "Siga as instruções da maquininha." });
      setError("");
      setPolling(true);
    } catch (cause) {
      // Sem resposta, não sabemos se esta tentativa iniciou uma cobrança.
      setServiceBusy(false);
      setSafeToClose(false);
      setAccepted(false);
      setPolling(false);
      setStatus({ message: "Não foi possível confirmar o início do pagamento." });
      setError(`${cause instanceof Error ? cause.message : "Falha de comunicação."} Solicite ajuda à recepção antes de tentar outra cobrança.`);
    } finally { setActionBusy(false); }
  };

  const action = async (path: string, body: object = {}) => {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      await paymentRequest(path, body);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Erro ao executar ação.");
    } finally { setActionBusy(false); }
  };
  const buttonClass = "rounded-xl border border-gray-300 px-6 py-4 text-lg font-bold disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-5" role="dialog" aria-modal="true" aria-labelledby="payment-flow-title">
      <div className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl bg-white p-8">
        <h2 id="payment-flow-title" className="text-2xl font-bold text-[#a31515]">Pagamento na maquininha</h2>
        {serviceBusy && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-amber-900">O serviço recusou o início desta cobrança porque está ocupado com outra operação, que pode ser a ativação. Nenhum novo pagamento foi iniciado por esta tentativa. Aguarde antes de tentar iniciar novamente. O resultado abaixo pertence à operação anterior; confira qualquer aprovação com a recepção para evitar uma cobrança repetida.</p>}
        <p className="text-xl" aria-live="polite">{serviceBusy ? (terminal ? "A operação anterior terminou. Confira o pagamento anterior antes de iniciar outro." : status.message || "Aguardando o serviço liberar...") : (terminal && finalMessages[outcome || ""]) || status.message || "Siga as instruções da maquininha."}</p>
        {!serviceBusy && status.showQrCode && status.qrCodeString && (
          <div className="space-y-3">
            <p>PIX copia e cola (o QR Code também pode ser exibido na maquininha):</p>
            <pre className="whitespace-pre-wrap break-all rounded-xl bg-gray-100 p-4">{status.qrCodeString}</pre>
            <button className={buttonClass} onClick={() => void navigator.clipboard?.writeText(status.qrCodeString!).catch(() => setError("Não foi possível copiar o código PIX."))}>Copiar código PIX</button>
          </div>
        )}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
        {outcome?.startsWith("APPROVED_WITH_") && (
          <p role="alert" className="text-red-700">O serviço informou aprovação com erro. Não repita o pagamento. Solicite ajuda à recepção para verificar a transação e concluir o atendimento.</p>
        )}
        <div className="flex flex-wrap gap-3">
          {serviceBusy && <button disabled={actionBusy} className={buttonClass} onClick={() => void retryStart()}>Tentar iniciar pagamento</button>}
          {!serviceBusy && !terminal && status.showCancelButton && <button disabled={actionBusy} className={buttonClass} onClick={() => void action("/cancel-payment")}>Cancelar pagamento</button>}
          {!serviceBusy && !terminal && status.showButtonsAfterSitefError && <button disabled={actionBusy} className={buttonClass} onClick={() => void action("/confirm-yes")}>OK, continuar</button>}
          {!serviceBusy && !terminal && !status.showButtonsAfterSitefError && status.showConfirmationButtons && <>
            <button disabled={actionBusy} className={buttonClass} onClick={() => void action("/confirm-yes")}>Sim, cancelar</button>
            <button disabled={actionBusy} className={buttonClass} onClick={() => void action("/confirm-no")}>Não</button>
          </>}
          {!polling && !terminal && accepted && <button className={buttonClass} onClick={() => setPolling(true)}>Consultar novamente</button>}
          {safeToClose && <button disabled={actionBusy} className={buttonClass} onClick={onClose}>Voltar ao pagamento</button>}
        </div>
      </div>
    </div>
  );
}
