export const env = {
  paymentIntegrationEnabled:
    import.meta.env.VITE_PAYMENT_INTEGRATION_ENABLED?.trim().toLowerCase() === "true",
  paymentServiceUrl:
    import.meta.env.VITE_PAYMENT_SERVICE_URL?.trim() || "https://127.0.0.1",
  paymentActivation: {
    ip: import.meta.env.VITE_PAYMENT_SITEF_IP?.trim() ?? "",
    storeId: import.meta.env.VITE_PAYMENT_STORE_ID?.trim() ?? "",
    terminalId: import.meta.env.VITE_PAYMENT_TERMINAL_ID?.trim() ?? "",
    shopCnpj: import.meta.env.VITE_PAYMENT_SHOP_CNPJ?.trim() ?? "",
    devCnpj: import.meta.env.VITE_PAYMENT_DEV_CNPJ?.trim() ?? "",
    configurationParameters: import.meta.env.VITE_PAYMENT_CONFIGURATION_PARAMETERS?.trim() ?? "",
    additionalParameters: import.meta.env.VITE_PAYMENT_ADDITIONAL_PARAMETERS?.trim() ?? "",
    pinpadMessage: import.meta.env.VITE_PAYMENT_PINPAD_MESSAGE?.trim() ?? "",
  },
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
  paymentReceiptPrintApiUrl:
    import.meta.env.VITE_PAYMENT_RECEIPT_PRINT_URL?.trim() ||
    (import.meta.env.VITE_PRINT_API_URL?.trim() || "http://localhost:5501/api-py/v1/print")
      .replace(/\/print\/?$/, "/print-payment"),
  attendanceCodTipoGuia:
    Number(import.meta.env.VITE_ATENDIMENTO_COD_TIPO_GUIA?.trim()) || 1,
};
