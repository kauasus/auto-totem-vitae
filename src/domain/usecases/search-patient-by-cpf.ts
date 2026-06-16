import type { SearchPatientResult } from "../entities/check-in";

export interface SearchPatientByCpfUseCase {
  execute(cpf: string): Promise<SearchPatientResult>;
}
