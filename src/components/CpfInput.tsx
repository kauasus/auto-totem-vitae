/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { User, Loader2 } from 'lucide-react';

type SearchResult =
  | { found: true; patient?: any }
  | { found: false; message?: string };

interface CpfInputProps {
  cpf: string; // only numbers representation or empty
  setCpf: (cpfOnlyNumbers: string) => void;
  onSubmit: (cpfOnlyNumbers: string) => Promise<SearchResult>;
}

const formatCPF = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
};

const onlyNumbers = (s: string) => s.replace(/\D/g, '');

const CpfInput: React.FC<CpfInputProps> = ({ cpf, setCpf, onSubmit }) => {
  const [local, setLocal] = useState<string>(() => formatCPF(cpf || ''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => setLocal(formatCPF(cpf || '')), [cpf]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCPF(value);
    setLocal(formatted);
    setCpf(onlyNumbers(formatted));
    setError(null);
  };

  const triggerError = (msg?: string) => {
    setError(msg ?? 'CPF inválido');
    // pequeno timeout para animação de shake
    setTimeout(() => {
      // mantém a mensagem até novo input
    }, 400);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nums = onlyNumbers(local);
    if (nums.length !== 11) {
      triggerError('Digite um CPF com 11 dígitos.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await onSubmit(nums);
      if (!res.found) {
        triggerError(res.message ?? 'Paciente não encontrado');
        setIsSubmitting(false);
      } else {
        // sucesso: o App irá tratar a navegação
      }
    } catch (err) {
      triggerError('Erro de rede. Tente novamente.');
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

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl shadow-md p-6 animate-fade-slide-up ${error ? 'animate-shake' : ''}`}
        aria-labelledby="cpf-title"
      >
        <h2 id="cpf-title" className="text-2xl font-extrabold text-[#8b0f0f] mb-4">
          Digite seu CPF
        </h2>

        <label className="flex items-center gap-3 text-gray-600 font-medium mb-2">
          <User className="w-5 h-5 text-[#b91c1c]" />
          <span>CPF</span>
        </label>

        <div className="mb-4">
          <input
            inputMode="numeric"
            value={local}
            onChange={handleChange}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full text-lg p-4 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[#fceaea] outline-none transition duration-150"
            disabled={isSubmitting}
            aria-label="CPF"
          />
          <p className="text-xs text-gray-400 mt-2">Apenas números. Ex.: 123.456.789-00</p>
        </div>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { setLocal(''); setCpf(''); setError(null); }}
            className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 text-lg hover:bg-gray-200 transition"
            disabled={isSubmitting}
          >
            Limpar
          </button>

          <button
            type="submit"
            className="flex-1 py-3 rounded-lg bg-[color:var(--accent)] text-white text-lg font-semibold shadow-md hover:bg-[color:var(--accent-dark)] transition flex items-center justify-center gap-3"
            disabled={isSubmitting}
            aria-label="Buscar Agendamento"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Buscando...</span>
              </>
            ) : (
              <span>Buscar Agendamento</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CpfInput;