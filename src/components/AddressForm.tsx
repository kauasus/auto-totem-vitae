import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, MapPin, Search, ShieldCheck, Keyboard } from 'lucide-react';
import type { AddressData } from '../types';
import { formatCep, isValidCep, normalizeCep, onlyDigits } from '../utils/validation';
import { playClick } from '../utils/sounds';
import FieldKeyboardModal from './FieldKeyboardModal';

interface AddressFormProps {
  value?: AddressData;
  onChange: (address: AddressData) => void;
  onBack: () => void;
  onNext: () => void;
}

type AddressField = keyof AddressData;

const emptyAddress: AddressData = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
};

const fieldConfig: Record<
  AddressField,
  { label: string; placeholder: string; keyboardKind: 'text' | 'numeric'; maxLength?: number; preview?: (v: string) => string }
> = {
  cep: {
    label: 'CEP',
    placeholder: '00000-000',
    keyboardKind: 'numeric',
    maxLength: 8,
    preview: (v) => formatCep(v),
  },
  logradouro: {
    label: 'Logradouro',
    placeholder: 'Rua, avenida, praça...',
    keyboardKind: 'text',
    maxLength: 60,
  },
  numero: {
    label: 'Número',
    placeholder: '123',
    keyboardKind: 'numeric',
    maxLength: 6,
  },
  complemento: {
    label: 'Complemento',
    placeholder: 'Apto, bloco...',
    keyboardKind: 'text',
    maxLength: 40,
  },
  bairro: {
    label: 'Bairro',
    placeholder: 'Bairro',
    keyboardKind: 'text',
    maxLength: 40,
  },
  cidade: {
    label: 'Cidade',
    placeholder: 'Cidade',
    keyboardKind: 'text',
    maxLength: 40,
  },
  uf: {
    label: 'UF',
    placeholder: 'MG',
    keyboardKind: 'text',
    maxLength: 2,
  },
};

const AddressForm: React.FC<AddressFormProps> = ({ value, onChange, onBack, onNext }) => {
  const [address, setAddress] = useState<AddressData>(value ?? emptyAddress);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepStatus, setCepStatus] = useState<'idle' | 'found' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<AddressField | null>(null);
  const lookupTokenRef = useRef(0);

  useEffect(() => {
    if (value) setAddress(value);
  }, [value]);

  const pushChange = (next: AddressData) => {
    setAddress(next);
    onChange(next);
  };

  const lookupCep = async (cepValue: string, baseAddress: AddressData) => {
    const cepDigits = normalizeCep(cepValue);
    if (!isValidCep(cepDigits)) {
      setCepStatus('idle');
      return;
    }

    const token = ++lookupTokenRef.current;
    setLoadingCep(true);
    setError(null);
    setCepStatus('idle');

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await response.json();

      if (token !== lookupTokenRef.current) return;

      if (data?.erro) {
        setCepStatus('error');
        setError('CEP não encontrado. Confira ou preencha o endereço manualmente.');
        return;
      }

      const nextAddress: AddressData = {
        ...baseAddress,
        cep: formatCep(cepDigits),
        logradouro: data.logradouro || baseAddress.logradouro,
        bairro: data.bairro || baseAddress.bairro,
        cidade: data.localidade || baseAddress.cidade,
        uf: data.uf || baseAddress.uf,
        numero: baseAddress.numero,
        complemento: baseAddress.complemento ?? '',
      };

      pushChange(nextAddress);
      setCepStatus('found');
      setError(null);
    } catch {
      if (token !== lookupTokenRef.current) return;
      setCepStatus('error');
      setError('Não foi possível consultar o CEP agora. Preencha os dados manualmente.');
    } finally {
      if (token === lookupTokenRef.current) {
        setLoadingCep(false);
      }
    }
  };

  const canProceed =
    isValidCep(address.cep) &&
    address.logradouro.trim().length > 0 &&
    address.numero.trim().length > 0 &&
    address.bairro.trim().length > 0 &&
    address.cidade.trim().length > 0 &&
    address.uf.trim().length > 0 &&
    !loadingCep;

  const openField = (field: AddressField) => {
    setActiveField(field);
    setError(null);
    playClick(0.08);
  };

  const closeField = () => setActiveField(null);

  const commitField = async (field: AddressField, rawValue: string) => {
    const config = fieldConfig[field];
    const valueToSave = rawValue.trim();

    if (field === 'cep') {
      const digits = normalizeCep(valueToSave);
      const baseAddress = {
        ...address,
        cep: formatCep(digits),
      };

      pushChange(baseAddress);
      setCepStatus('idle');
      closeField();

      if (digits.length === 8) {
        void lookupCep(digits, baseAddress);
      } else {
        setError(null);
      }

      return;
    }

    if (field === 'numero') {
      const digits = onlyDigits(valueToSave).slice(0, config.maxLength ?? 6);
      pushChange({ ...address, numero: digits });
      setError(null);
      closeField();
      return;
    }

    if (field === 'uf') {
      pushChange({ ...address, uf: valueToSave.toUpperCase().slice(0, 2) });
      setError(null);
      closeField();
      return;
    }

    const cleaned = valueToSave.replace(/\s+/g, ' ').toUpperCase();
    pushChange({ ...address, [field]: cleaned } as AddressData);
    setError(null);
    closeField();
  };

  const activeConfig = activeField ? fieldConfig[activeField] : null;
  const activeValue =
    activeField === 'cep'
      ? normalizeCep(address.cep)
      : activeField === 'numero'
        ? onlyDigits(address.numero)
        : activeField
          ? String(address[activeField] ?? '')
          : '';

  return (
    <div className="animate-fade-slide-up">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 text-[#a31515]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fef2f2]">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black text-lg uppercase tracking-widest">Endereço</h4>
            <p className="text-sm text-gray-500">Toque em cada campo para abrir o teclado correspondente</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-gray-100 bg-[#fbfbfb] p-5 md:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <FieldButton
              label={fieldConfig.cep.label}
              value={address.cep ? formatCep(address.cep) : ''}
              placeholder={fieldConfig.cep.placeholder}
              onClick={() => openField('cep')}
              className="md:col-span-3"
              suffix={
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  {loadingCep ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : cepStatus === 'found' ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Search className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              }
            />

            <FieldButton
              label={fieldConfig.logradouro.label}
              value={address.logradouro}
              placeholder={fieldConfig.logradouro.placeholder}
              onClick={() => openField('logradouro')}
              className="md:col-span-6"
            />

            <FieldButton
              label={fieldConfig.numero.label}
              value={address.numero}
              placeholder={fieldConfig.numero.placeholder}
              onClick={() => openField('numero')}
              className="md:col-span-3"
            />

            <FieldButton
              label={fieldConfig.complemento.label}
              value={address.complemento ?? ''}
              placeholder={fieldConfig.complemento.placeholder}
              onClick={() => openField('complemento')}
              className="md:col-span-3"
            />

            <FieldButton
              label={fieldConfig.bairro.label}
              value={address.bairro}
              placeholder={fieldConfig.bairro.placeholder}
              onClick={() => openField('bairro')}
              className="md:col-span-3"
            />

            <FieldButton
              label={fieldConfig.cidade.label}
              value={address.cidade}
              placeholder={fieldConfig.cidade.placeholder}
              onClick={() => openField('cidade')}
              className="md:col-span-4"
            />

            <FieldButton
              label={fieldConfig.uf.label}
              value={address.uf}
              placeholder={fieldConfig.uf.placeholder}
              onClick={() => openField('uf')}
              className="md:col-span-2"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>O CEP é validado automaticamente e os demais campos podem ser ajustados manualmente.</span>
          </div>

          {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
        </div>
      </div>

      <footer className="flex items-center justify-between p-6 border-t border-gray-100 bg-white">
        <button
          onClick={onBack}
          className="text-gray-700 font-semibold text-lg px-6 py-3 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
        >
          ← Voltar
        </button>

        <div className="flex flex-col items-end gap-2">
          {!canProceed && (
            <p className="text-sm font-semibold text-[#a31515] text-right">
              Preencha o CEP válido e os campos obrigatórios do endereço.
            </p>
          )}
          <button
            onClick={() => {
              if (!canProceed) return;
              playClick(0.08);
              onNext();
            }}
            disabled={!canProceed}
            className={[
              'rounded-xl px-12 py-3 text-xl font-bold transition-all',
              canProceed
                ? 'bg-[#a31515] text-white shadow-lg hover:bg-[#8b1212] active:scale-95'
                : 'cursor-not-allowed bg-gray-300 text-gray-500 shadow-none',
            ].join(' ')}
          >
            Próximo →
          </button>
        </div>
      </footer>

      <FieldKeyboardModal
        key={`${activeField ?? 'closed'}-${activeValue}`}
        open={activeField !== null}
        title={activeConfig?.label ?? ''}
        subtitle={
          activeField === 'cep'
            ? 'Digite o CEP para buscar o endereço automaticamente.'
            : activeField === 'uf'
              ? 'Somente duas letras.'
              : 'Use o teclado para preencher o campo.'
        }
        value={activeValue}
        keyboardKind={activeConfig?.keyboardKind ?? 'text'}
        placeholder={activeConfig?.placeholder ?? 'Digite aqui'}
        maxLength={activeField ? activeConfig?.maxLength : undefined}
        previewFormatter={activeField === 'cep' ? formatCep : undefined}
        onClose={closeField}
        onConfirm={(nextValue) => {
          if (!activeField) return;
          void commitField(activeField, nextValue);
        }}
      />
    </div>
  );
};

interface FieldButtonProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
  className?: string;
  suffix?: React.ReactNode;
}

const FieldButton: React.FC<FieldButtonProps> = ({ label, value, placeholder, onClick, className, suffix }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'relative w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition',
      'hover:border-[#b91c1c] hover:shadow-md active:scale-[0.99]',
      className ?? '',
    ].join(' ')}
  >
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase font-black tracking-[0.25em] text-gray-400">{label}</label>
          <Keyboard className="h-3.5 w-3.5 text-gray-300" />
        </div>
        <div className="mt-2 min-h-[1.75rem] text-lg font-semibold text-gray-800 break-words">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
      </div>
      {suffix}
    </div>
  </button>
);

export default AddressForm;
