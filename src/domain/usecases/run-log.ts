import type { LogPrograma } from "../entities/check-in";

export interface RunLog {
  execute(log: LogPrograma): Promise<void>;
}
