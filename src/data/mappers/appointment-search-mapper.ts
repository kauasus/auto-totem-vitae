import type {
  Appointment,
  PatientData,
  SearchPatientResult,
} from "../../domain/entities/check-in";
import type { AppointmentSearchResponseDto } from "../dtos/appointment-search-response.dto";
import {
  formatApiDate,
  formatApiTime,
  formatCpf,
  normalizeCpf,
} from "../../validation";

const asString = (value: string | number | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

const pickDisplayCpf = (cpfInput: string) => {
  const cpf = normalizeCpf(cpfInput);
  return cpf ? formatCpf(cpf) : cpfInput;
};

const mapPatient = (
  response: AppointmentSearchResponseDto,
  cpfInput: string,
): PatientData => ({
  nomeCompleto: response.nom_solicitante || response.Nom_Usuario || "",
  cpf: pickDisplayCpf(cpfInput),
  telefone: asString(response.num_telefone),
  telefone2: asString(response.Num_Telefone2),
  email: asString(response.e_mail),
  dataNascimento: formatApiDate(
    asString(response.Dat_Nasc || response.dat_nascimento),
  ),
  address: {
    cep: asString(response.Cod_Endrcmnt_Pstl),
    logradouro: asString(response.Nom_Logradouro),
    numero: asString(response.Num_Predio),
    complemento: asString(response.Dsc_Cmplmnt_Endrc),
    bairro: asString(response.Nom_Bairro),
    cidade: asString(response.Cod_Municipio),
    uf: asString(response.Sig_Unidade_Federacao),
  },
});

const mapAppointment = (response: AppointmentSearchResponseDto): Appointment => ({
  medico: response.Nom_medico || "",
  especialidade: response.dsc_especialidade || "",
  procedimento: response.Nom_Procedimento || "",
  horario: formatApiTime(response.Hor_Inicio || ""),
  consultorio: asString(response.Num_Sala || response.Cod_Local),
  sala: asString(response.Num_Sala),
  local: response.nom_local || "",
  dataAgenda: formatApiDate(response.Dat_Agenda || ""),
  dataMarcacao: formatApiDate(response.Dat_Marcacao || ""),
});

export const mapAppointmentSearchResponse = (
  response: AppointmentSearchResponseDto,
  cpfInput: string,
): SearchPatientResult => {
  const patient = mapPatient(response, cpfInput);
  const appointment = mapAppointment(response);

  return {
    found: true,
    patient,
    appointment,
  };
};
