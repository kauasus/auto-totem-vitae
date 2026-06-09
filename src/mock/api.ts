import type { PatientData } from '../types';

/**
 * Mock simples de busca de paciente por CPF.
 * Retorna após ~900ms para simular rede.
 *
 * Use CPF numérico '12345678900' para testar paciente encontrado.
 */
const mockPatient: PatientData = {
  nomeCompleto: 'Isabela Veloso Duarte',
  cpf: '111.111.111-11',
  rg: '12345678',
  dataNascimento: '01/01/1990',
  estadoCivil: 'Solteira',
  sexo: 'Feminino',
  telefone: '(31) 99999-9999',
  telefone2: '(31) 98888-8888',
  email: 'isabela@example.com',
};

export async function searchPatientByCpf(cpfOnlyNumbers: string): Promise<{ found: boolean; patient?: PatientData; message?: string }> {
  // simula latência
  await new Promise((r) => setTimeout(r, 900));

  if (cpfOnlyNumbers === '11111111111') {
    return { found: true, patient: mockPatient };
  }

  // paciente não encontrado
  return { found: false, message: 'CPF não encontrado. Verifique os dígitos e tente novamente.' };
}
