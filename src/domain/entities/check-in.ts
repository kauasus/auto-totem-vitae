export type AddressData = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type PaymentMethod = "PIX" | "CREDITO" | "DEBITO";

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
  codAgenda?: number;
  codAtendimento?: number;
  codPaciente?: number;
  codMedico?: number;
  codEspecialidade?: number;
  codProcedimento?: number;
  codConvenio?: number;
  indRetorno?: boolean;
  nomUsuario?: string;
  codTipoGuia?: number;
  dscEspecie?: string;
  nomPaciente?: string;
  nomProcedimento?: string;
  valProcedimento?: number;
  horInicio?: string;
  medico: string;
  especialidade: string;
  procedimento: string;
  horario: string;
  numSala: number;
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
