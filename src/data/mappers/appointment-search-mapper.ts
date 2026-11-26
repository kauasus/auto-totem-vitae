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
  formatPhone,
  isValidCpf,
  normalizeCpf,
} from "../../validation";

type PatientSource = Omit<AppointmentSearchResponseDto, "Sala">;

const asString = (value: string | number | boolean | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

const pickDisplayCpf = (cpfInput: string) => {
  const cpf = normalizeCpf(cpfInput);
  return cpf ? formatCpf(cpf) : cpfInput;
};

const pickCpf = (response: PatientSource, cpfInput: string) => {
  const responseCpf = String(
    response.Paciente?.codCpf ?? response.codCpf ?? "",
  );

  return isValidCpf(responseCpf) ? responseCpf : cpfInput;
};

const pickPatientName = (response: PatientSource) =>
  response.Paciente?.nomPaciente ||
  response.nomPaciente ||
  response.nomSolicitante ||
  response.nomUsuario ||
  "";

const pickBirthDate = (response: PatientSource) =>
  response.Paciente?.datNascimento ||
  response.datNascimento ||
  response.datNasc ||
  "";

const pickPatientSex = (response: PatientSource) => {
  const value = (
    response.Paciente?.dscSexo ||
    response.Paciente?.indSexo ||
    response.dscSexo ||
    ""
  ).trim();

  if (/^f(?:eminino)?$/i.test(value)) return "Feminino";
  if (/^m(?:asculino)?$/i.test(value)) return "Masculino";
  return value;
};

const pickAddress = (response: PatientSource) => {
  const patient = response.Paciente;
  const upper = (value: Parameters<typeof asString>[0]) => asString(value).toUpperCase();

  return {
    cep: asString(patient?.codEndrcmntPstl ?? response.codEndrcmntPstl),
    logradouro: upper(patient?.nomLogradouro ?? response.nomLogradouro).trim(),
    numero: upper(patient?.numPredio ?? response.numPredio),
    complemento: upper(
      patient?.dscCmplmntEndrc ?? response.dscCmplmntEndrc,
    ),
    bairro: upper(patient?.nomBairro ?? response.nomBairro),
    cidade: upper(
      patient?.Municipio?.dscMunicipio ?? response.dscMunicipio,
    ),
    municipio: upper(
      patient?.Municipio?.dscMunicipio ?? response.dscMunicipio,
    ),
    uf: upper(
      patient?.sigUnidadeFederacao ?? response.sigUnidadeFederacao,
    ),
    codMunicipio:
      patient?.Municipio?.codMunicipio ?? patient?.codMunicipio ?? response.codMunicipio,
  };
};

const pickAppointmentValue = (response: AppointmentSearchResponseDto) => {
  const tableValue =
    response.Procedimento?.procedimentoTabela?.valProcedimento;

  return typeof tableValue === "number" ? tableValue : undefined;
};

const pickCodTipoGuia = (response: AppointmentSearchResponseDto) => {
  const rawValue =
    response.Procedimento?.indexame ??
    response.Procedimento?.indExame ??
    response.indexame ??
    response.indExame;

  if (typeof rawValue === "number") {
    return rawValue;
  }

  if (typeof rawValue === "boolean") {
    return rawValue ? 1 : 0;
  }

  if (typeof rawValue === "string") {
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

export const mapPatient = (
  response: PatientSource,
  cpfInput: string,
): PatientData => ({
  codPaciente: response.codPaciente ?? response.Paciente?.codPaciente,
  nomeCompleto: pickPatientName(response),
  cpf: pickDisplayCpf(pickCpf(response, cpfInput)),
  telefone: formatPhone(
    response.Paciente?.numTelefone ?? response.numTelefone ?? "",
  ),
  telefone2: formatPhone(
    response.Paciente?.numTelefone2 ?? response.numTelefone2 ?? "",
  ),
  email: response.Paciente?.email ?? "",
  dataNascimento: formatApiDate(pickBirthDate(response)),
  sexo: pickPatientSex(response),
  address: pickAddress(response),
});

const mapAppointment = (
  response: AppointmentSearchResponseDto,
): Appointment => ({
  codAgenda: response.codAgenda,
  codAtendimento: response.codAtendimento,
  codPaciente: response.codPaciente ?? response.Paciente?.codPaciente,
  codMedico: response.codMedico ?? response.Medico?.codMedico,
  codEspecialidade: response.codEspecialidade,
  codProcedimento:
    response.codProcedimento ?? response.Procedimento?.codProcedimento,
  codConvenio:
    response.codConvenio ??
    response.Convenio?.codConvenio ??
    response.Paciente?.codConvenio,
  convenio: response.Convenio?.nomConvenio || "",
  indRetorno: response.indRetorno,
  nomUsuario: response.nomUsuario ?? response.usuarioMarcacao,
  codTipoGuia: pickCodTipoGuia(response),
  dscEspecie: response.dscEspecie,
  nomPaciente:
    response.Paciente?.nomPaciente ??
    response.nomSolicitante ??
    response.nomUsuario ??
    "",
  nomProcedimento:
    response.Procedimento?.nomProcedimento || response.nomProcedimento || "",
  valProcedimento: pickAppointmentValue(response),
  horInicio: response.horInicio || "",
  medico:
    response.Medico?.nomMedico ||
    response.nomMedico ||
    response.nomSolicitante ||
    "",
  indSexoMedico: response.Medico?.indSexo || "",
  especialidade: response.dscEspecialidade || "",
  procedimento:
    response.Procedimento?.nomProcedimento || response.nomProcedimento || "",
  horario: formatApiTime(response.horInicio || ""),
  numSala: response.numSala || 0,
  sala: asString(response.numSala),
  local: response.nomLocal || "",
  dataAgenda: formatApiDate(response.datAgenda || ""),
  dataMarcacao: formatApiDate(response.datMarcacao || ""),
  valor: pickAppointmentValue(response),
  andar: response.Sala.dscAndar || "",
  corLinha: response.Sala.Setor.corLinha || "",
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
