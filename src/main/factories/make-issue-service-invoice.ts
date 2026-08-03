import { RemoteIssueServiceInvoice } from "../../data/usecases/remote-issue-service-invoice";
import { createFetchHttpClient } from "../../infra/http/fetch-http-client";
import { getApiToken } from "../../infra/auth/api-token-storage";
import { env } from "../config/env";

const ISSUE_SERVICE_INVOICE_PATH = "/nota-fiscal/emitir";

export const makeIssueServiceInvoice = () => {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, "");

  return new RemoteIssueServiceInvoice(
    createFetchHttpClient({ getAuthToken: getApiToken }),
    env.issueServiceInvoiceApiUrl ||
      `${baseUrl}${ISSUE_SERVICE_INVOICE_PATH}`,
  );
};
