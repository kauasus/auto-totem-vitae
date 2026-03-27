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
};

export type Appointment = {
  especialidade: string;
  procedimento: string;
  valor: number; // em centavos ou reais conforme preferir; aqui usaremos reais (number)
  sala?: string;
};