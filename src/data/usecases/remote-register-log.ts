import type { RunLog } from "../../domain/usecases/run-log";
import type { LogPrograma } from "../../domain/entities/check-in";
import type { HttpClient } from "../../infra/http/fetch-http-client";

export class RemoteRunLog implements RunLog {
  private readonly httpClient: HttpClient;
  private readonly endpoint: string;

  constructor(httpClient: HttpClient, endpoint: string) {
    this.httpClient = httpClient;
    this.endpoint = endpoint;
  }

  async execute(log: LogPrograma): Promise<void> {
    if (!this.endpoint.trim()) {
      throw new Error("Defina a URL da API em `VITE_API_BASE_URL`.");
    }

    await this.httpClient.post(this.endpoint, log);
  }
}
