import { RemotePrintAppointment } from "../../data/usecases/remote-print-appointment";
import { createPrinterFetchHttpClient } from "../../infra/http/printer-fetch-http-client";
import { env } from "../config/env";

export const makePrintAppointment = () => {
  return new RemotePrintAppointment(
    createPrinterFetchHttpClient(),
    env.printApiUrl,
  );
};
