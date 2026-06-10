export type AddressData = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type PatientData = {
  nomeCompleto: string;
  cpf: string;
  rg?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  sexo?: string;
  telefone?: string;
  telefone2?: string;
  email?: string;
  address?: AddressData;
};

export type Appointment = {
  medico: string;
  especialidade: string;
  procedimento: string;
  horario: string;
  consultorio: string;
  valor: number; // em centavos ou reais conforme preferir; aqui usaremos reais (number)
  sala?: string;
};
