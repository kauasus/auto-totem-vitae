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
  valor?: number;
  sala?: string;
  local?: string;
  dataAgenda?: string;
  dataMarcacao?: string;
};

export type SearchPatientResult = {
  found: boolean;
  patient?: PatientData;
  appointment?: Appointment;
  message?: string;
};
