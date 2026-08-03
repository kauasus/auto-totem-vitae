export type PatientDto = {
  codPaciente?: number;
  nomPaciente?: string;
  numIdentidade?: string;
  codCpf?: string;
  abrLogradouro?: string;
  nomLogradouro?: string;
  numPredio?: string;
  dscCmplmntEndrc?: string;
  nomBairro?: string;
  codMunicipio?: number;
  dscMunicipo: string;
  sigUnidadeFederacao?: string;
  codEndrcmntPstl?: string;
  datNascimento?: string;
  numTelefone?: string;
  numTelefone2?: string;
  numProntuario?: number;
  codConvenio?: number;
  datValidadeMatricula?: string | null;
  codIdentificacao?: string;
  dscEstCivil?: string;
  indBloqueio?: boolean;
  email?: string;
  Municipio: MunicipioDto;
};

export type ConvenioDto = {
  codConvenio?: number;
  nomConvenio?: string;
  indAtivo?: boolean;
  indLanCaixa?: boolean | number | string;
  indFatura?: boolean;
  dscObservacao?: string;
  diasCarenciaRet?: number;
};

export type MedicoDto = {
  codMedico?: number;
  nomMedico?: string;
  sglConselho?: string;
  numCrmMedico?: number;
  sigUf?: string;
  indAtivo?: boolean;
  obsMedico?: string;
  indSexo?: string;
};

export type ProcedimentoDto = {
  codProcedimento?: number;
  nomProcedimento?: string;
  indexame?: number | boolean | string;
  indExame?: number | boolean | string;
  procedimentoTabela?: Array<{
    codEmpresa?: number;
    valProcedimento?: number;
  }>;
};

export type AppointmentSearchResponseDto = {
  codAgenda?: number;
  codMedico?: number;
  codEspecialidade?: number;
  codProcedimento?: number;
  codLocal?: number;
  codGrade?: number;
  numSala?: number;
  datAgenda?: string;
  datMarcacao?: string;
  horInicio?: string;
  horTermino?: string;
  codPaciente?: number;
  nomSolicitante?: string;
  numMatricula?: string;
  numTelefone?: string;
  numTelefone2?: string;
  indRetorno?: boolean;
  indEncaixe?: boolean;
  indBloqueio?: boolean;
  indCancelado?: boolean;
  dscObservacao?: string;
  codAtendimento?: number;
  usuarioMarcacao?: string;
  nomUsuario?: string;
  usuarioBloqueio?: string;
  codTipoGuia?: number;
  dscEspecie?: string;
  indConfirmacao?: boolean;
  codSituacaoConfirmacao?: number;
  nomMedico?: string;
  indSexo?: string;
  dscEspecialidade?: string;
  sigEspecialidade?: string;
  nomProcedimento?: string;
  nomConvenio?: string;
  codConvenio?: number;
  indFatura?: boolean;
  indLanCaixa?: boolean | number | string;
  indexame?: number | boolean | string;
  indExame?: number | boolean | string;
  nomLocal?: string;
  datNasc?: string;
  numCaixa?: number;
  numItemCaixa?: number;
  Paciente?: PatientDto;
  Convenio?: ConvenioDto;
  Medico?: MedicoDto;
  Procedimento?: ProcedimentoDto;
  Sala: Sala;
};

export type MunicipioDto = {
  codMunicipio: number;
  dscMunicipio: string;
  dscDistrito: string;
};

export type LogDTO = {
  dscAcao: string;
  nomUsuario: string;
};

export type Sala = {
  codLocal: number;
  numSala: number;
  dscSala: string;
  dscObservacao: string;
  dscAndar: string;
  codSetor: number;
  Setor: Setor;
};

export type Setor = {
  codSetor: number;
  codLocal: number;
  dscSetor: string;
  nomUsuario: string | null;
  datCadastro: string | null;
  datUltimaAlteracao: string | null;
  corLinha: string;
};
