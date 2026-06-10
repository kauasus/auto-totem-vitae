// src/mocks/api.ts
import type { Appointment, PatientData } from "../types";

/** util helpers */
const onlyNumbers = (s: string) => (s ?? "").replace(/\D/g, "");

/** Lista de pacientes mock (fictícios) */
export const mockPatients: PatientData[] = [
  {
    nomeCompleto: "Isabela Veloso Duarte",
    cpf: "123.456.789-00",
    rg: "12345678",
    dataNascimento: "01/01/1990",
    estadoCivil: "Solteira",
    sexo: "Feminino",
    telefone: "(31) 99999-9999",
    telefone2: "(31) 98888-8888",
    email: "isabela.veloso@example.com",
  },
  {
    nomeCompleto: "Lucas Pereira da Silva",
    cpf: "987.654.321-00",
    rg: "87654321",
    dataNascimento: "15/05/1985",
    estadoCivil: "Casado",
    sexo: "Masculino",
    telefone: "(31) 97777-7777",
    telefone2: "(31) 96666-6666",
    email: "lucas.pereira@example.com",
  },
  {
    nomeCompleto: "Carolina Almeida Rocha",
    cpf: "111.222.333-44",
    rg: "11223344",
    dataNascimento: "20/10/1992",
    estadoCivil: "Solteira",
    sexo: "Feminino",
    telefone: "(31) 95555-5555",
    telefone2: "(31) 94444-4444",
    email: "carolina.almeida@example.com",
  },
  {
    nomeCompleto: "Rafael Gonçalves Costa",
    cpf: "222.333.444-55",
    rg: "22334455",
    dataNascimento: "08/08/1980",
    estadoCivil: "Casado",
    sexo: "Masculino",
    telefone: "(31) 94444-1234",
    telefone2: "(31) 93333-5678",
    email: "rafael.goncalves@example.com",
  },
  {
    nomeCompleto: "Mariana Souza Lima",
    cpf: "333.444.555-66",
    rg: "33445566",
    dataNascimento: "30/03/1995",
    estadoCivil: "Solteira",
    sexo: "Feminino",
    telefone: "(31) 93333-2222",
    telefone2: "(31) 92222-3333",
    email: "mariana.souza@example.com",
  },
  {
    nomeCompleto: "Pedro Henrique Almeida",
    cpf: "444.555.666-77",
    rg: "44556677",
    dataNascimento: "12/12/1978",
    estadoCivil: "Divorciado",
    sexo: "Masculino",
    telefone: "(31) 91111-4444",
    telefone2: "(31) 90000-5555",
    email: "pedro.henrique@example.com",
  },
  {
    nomeCompleto: "Beatriz Costa Ferreira",
    cpf: "555.666.777-88",
    rg: "55667788",
    dataNascimento: "05/07/1989",
    estadoCivil: "Casada",
    sexo: "Feminino",
    telefone: "(31) 90000-6666",
    telefone2: "(31) 98888-7777",
    email: "beatriz.costa@example.com",
  },
  {
    nomeCompleto: "Gabriel Rocha Martins",
    cpf: "666.777.888-99",
    rg: "66778899",
    dataNascimento: "23/11/1991",
    estadoCivil: "Solteiro",
    sexo: "Masculino",
    telefone: "(31) 98877-1234",
    telefone2: "(31) 97766-4321",
    email: "gabriel.rocha@example.com",
  },
  {
    nomeCompleto: "Ana Paula Mendes",
    cpf: "777.888.999-00",
    rg: "77889900",
    dataNascimento: "17/02/1975",
    estadoCivil: "Viúva",
    sexo: "Feminino",
    telefone: "(31) 97777-8888",
    telefone2: "(31) 96666-9999",
    email: "ana.paula@example.com",
  },
  {
    nomeCompleto: "Felipe Nunes Cardoso",
    cpf: "888.999.000-11",
    rg: "88990011",
    dataNascimento: "29/09/1982",
    estadoCivil: "Casado",
    sexo: "Masculino",
    telefone: "(31) 96666-1111",
    telefone2: "(31) 95555-2222",
    email: "felipe.nunes@example.com",
  },
  {
    nomeCompleto: "Sofia Martins Oliveira",
    cpf: "999.000.111-22",
    rg: "99001122",
    dataNascimento: "02/06/1997",
    estadoCivil: "Solteira",
    sexo: "Feminino",
    telefone: "(31) 95555-3333",
    telefone2: "(31) 94444-4444",
    email: "sofia.martins@example.com",
  },
  {
    nomeCompleto: "Thiago Rodrigues Azevedo",
    cpf: "101.202.303-44",
    rg: "10203044",
    dataNascimento: "11/04/1970",
    estadoCivil: "Casado",
    sexo: "Masculino",
    telefone: "(31) 94444-5555",
    telefone2: "(31) 93333-6666",
    email: "thiago.rodrigues@example.com",
  },
];

const mockAppointmentsByCpf: Record<string, Appointment> = {
  "12345678900": {
    medico: "Dr. Roberto Almeida",
    especialidade: "Clínico Geral",
    procedimento: "Consulta de rotina",
    horario: "08:30",
    consultorio: "3",
    valor: 120,
  },
  "98765432100": {
    medico: "Dra. Fernanda Lima",
    especialidade: "Cardiologia",
    procedimento: "Avaliação cardiológica",
    horario: "09:10",
    consultorio: "4",
    valor: 180,
  },
  "11122233344": {
    medico: "Dr. Paulo Martins",
    especialidade: "Dermatologia",
    procedimento: "Consulta dermatológica",
    horario: "09:50",
    consultorio: "2",
    valor: 150,
  },
  "22233344455": {
    medico: "Dra. Camila Santos",
    especialidade: "Ortopedia",
    procedimento: "Avaliação ortopédica",
    horario: "10:20",
    consultorio: "5",
    valor: 190,
  },
  "33344455566": {
    medico: "Dr. Henrique Costa",
    especialidade: "Gastroenterologia",
    procedimento: "Consulta gastro",
    horario: "10:50",
    consultorio: "6",
    valor: 170,
  },
  "44455566677": {
    medico: "Dra. Juliana Rocha",
    especialidade: "Ginecologia",
    procedimento: "Consulta ginecológica",
    horario: "11:30",
    consultorio: "1",
    valor: 160,
  },
  "55566677788": {
    medico: "Dr. Marcelo Azevedo",
    especialidade: "Urologia",
    procedimento: "Avaliação urológica",
    horario: "13:00",
    consultorio: "7",
    valor: 175,
  },
  "66677788899": {
    medico: "Dra. Patricia Nunes",
    especialidade: "Pediatria",
    procedimento: "Consulta pediátrica",
    horario: "13:40",
    consultorio: "8",
    valor: 130,
  },
  "77788899900": {
    medico: "Dr. Ricardo Teixeira",
    especialidade: "Neurologia",
    procedimento: "Consulta neurológica",
    horario: "14:10",
    consultorio: "9",
    valor: 210,
  },
  "88899900011": {
    medico: "Dra. Beatriz Fonseca",
    especialidade: "Endocrinologia",
    procedimento: "Consulta endocrinológica",
    horario: "15:00",
    consultorio: "10",
    valor: 165,
  },
  "99900011122": {
    medico: "Dr. Gustavo Ribeiro",
    especialidade: "Otorrinolaringologia",
    procedimento: "Avaliação otorrino",
    horario: "15:40",
    consultorio: "11",
    valor: 155,
  },
  "10120230344": {
    medico: "Dra. Alessandra Melo",
    especialidade: "Reumatologia",
    procedimento: "Consulta reumatológica",
    horario: "16:20",
    consultorio: "12",
    valor: 185,
  },
};

/**
 * Busca por CPF (recebe string com dígitos ou formatado).
 * Retorna { found, patient?, message? }.
 */
export async function searchPatientByCpf(
  cpfInput: string,
): Promise<{
  found: boolean;
  patient?: PatientData;
  appointment?: Appointment;
  message?: string;
}> {
  // simula latência
  await new Promise((r) => setTimeout(r, 900));

  const norm = onlyNumbers(cpfInput);
  if (!norm || norm.length !== 11) {
    return { found: false, message: "CPF inválido" };
  }

  const found = mockPatients.find((p) => onlyNumbers(p.cpf) === norm);
  if (!found) {
    return { found: false, message: "Paciente não encontrado" };
  }

  return {
    found: true,
    patient: found,
    appointment: mockAppointmentsByCpf[norm] ?? {
      medico: "Dr. Atendimento",
      especialidade: "Clínico Geral",
      procedimento: "Consulta",
      horario: "08:00",
      consultorio: "1",
      valor: 120,
    },
  };
}
