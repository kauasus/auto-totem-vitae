export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() ?? "",
  createAttendanceApiUrl:
    import.meta.env.VITE_CREATE_ATENDIMENTO_URL?.trim() ??
    "",
  updatePatientRegistrationApiUrl:
    import.meta.env.VITE_UPDATE_PATIENT_REGISTRATION_URL?.trim() ??
    "",
  issueServiceInvoiceApiUrl:
    import.meta.env.VITE_ISSUE_SERVICE_INVOICE_URL?.trim() ??
    "",
  printApiUrl:
    import.meta.env.VITE_PRINT_API_URL?.trim() ??
    "http://localhost:5501/api-py/v1/print",
  attendanceCodTipoGuia:
    Number(import.meta.env.VITE_ATENDIMENTO_COD_TIPO_GUIA?.trim()) || 1,
};
