/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import NumericKeyboard from "./NumericKeyboard";

interface CpfInputProps {
  cpf: string; // só números
  setCpf: (cpfOnlyNumbers: string) => void;
  onSubmit: (
    cpfOnlyNumbers: string,
  ) => Promise<{ found: boolean; patient?: any; message?: string }>;
}

const formatCPF = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
};

const onlyNumbers = (s: string) => s.replace(/\D/g, "");

const CpfInput: React.FC<CpfInputProps> = ({ cpf, setCpf, onSubmit }) => {
  // local armazena SOMENTE os dígitos (sem formatação)
  const [local, setLocal] = useState<string>(() => cpf || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocal(cpf || "");
  }, [cpf]);

  const triggerError = (msg?: string) => {
    setError(msg ?? "CPF inválido");
  };

  const handleSubmit = async () => {
    const nums = onlyNumbers(local);
    if (nums.length !== 11) {
      triggerError("Digite um CPF com 11 dígitos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await onSubmit(nums);
      if (!res.found) {
        triggerError(res.message ?? "Paciente não encontrado");
        setIsSubmitting(false);
      }
      // se encontrado, o App tratará a navegação
    } catch {
      triggerError("Erro de rede. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  // auto-submit quando completar 11 dígitos (com debounce)
  useEffect(() => {
    const nums = onlyNumbers(local);
    if (nums.length === 11 && !isSubmitting) {
      const t = setTimeout(() => {
        handleSubmit();
      }, 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  // Função para lidar com teclas do teclado customizado
  const handleKeyPress = (key: string) => {
    // current numeric string
    const current = onlyNumbers(local);

    if (key === "backspace") {
      const newNums = current.slice(0, -1);
      setLocal(newNums);
      setCpf(newNums);
      setError(null);
    } else if (key === "clear") {
      setLocal("");
      setCpf("");
      setError(null);
    } else if (/\d/.test(key) && current.length < 11) {
      const newNums = current + key;
      setLocal(newNums);
      setCpf(newNums);
      setError(null);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className={`bg-white rounded-2xl shadow-md p-6 md:p-8 animate-fade-slide-up ${error ? "animate-shake" : ""}`}
        aria-labelledby="cpf-title"
      >
        <h2
          id="cpf-title"
          className="text-3xl md:text-4xl font-extrabold text-[#8b0f0f] mb-5 uppercase"
        >
          Digite seu CPF
        </h2>

        <input
          type="text"
          value={formatCPF(local)}
          readOnly
          className="w-full text-3xl md:text-4xl p-5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#b91c1c] focus:ring-2 focus:ring-[#fceaea] outline-none transition duration-150 mb-3"
          aria-label="Campo CPF"
          placeholder=""
          maxLength={14}
          disabled={isSubmitting}
        />

        <p className="text-sm text-gray-400 mb-5">
          Apenas números. Ex.: 12345678900
        </p>

        {error && <div className="text-base text-red-600 mb-3">{error}</div>}

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setLocal("");
              setCpf("");
              setError(null);
            }}
            className="flex-1 py-4 rounded-lg bg-gray-100 text-gray-700 text-xl hover:bg-gray-200 transition"
            disabled={isSubmitting}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="flex-1 py-4 rounded-lg bg-[#b91c1c] text-white text-xl font-semibold shadow-md hover:bg-[#991414] transition flex items-center justify-center gap-3"
            disabled={isSubmitting}
            aria-label="Buscar Agendamento"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <span>Buscar Agendamento</span>
            )}
          </button>
        </div>

        {/* Teclado numérico customizado */}
        <NumericKeyboard onKeyPress={handleKeyPress} className="max-w-none" />
      </form>
    </div>
  );
};

export default CpfInput;
