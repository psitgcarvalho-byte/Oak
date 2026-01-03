
import { Patient, PatientStatus, Session, SessionType, NeuroTest, TestResult } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'João Silva',
    birthDate: '1995-05-15',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    status: PatientStatus.ACTIVE,
    referralSource: 'Neurologist Dr. Smith',
    anamnesis: 'Paciente relata dificuldade de concentração e lapsos de memória frequentes nos últimos 6 meses. Histórico de ansiedade leve.',
    createdAt: '2023-10-01'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    birthDate: '2010-08-22',
    email: 'maria.parents@email.com',
    phone: '(11) 91234-5678',
    status: PatientStatus.WAITING,
    referralSource: 'School Teacher',
    anamnesis: 'Dificuldades de leitura e ansiedade social no ambiente escolar. Suspeita de TDAH.',
    createdAt: '2023-11-15'
  }
];

export const MOCK_TESTS: NeuroTest[] = [
  { id: 'rey', name: 'Figuras Complexas de Rey', domain: 'Memória Visual / Visuoconstrução', description: 'Avalia percepção visual e memória imediata/tardia.' },
  { id: 'stroop-ad', name: 'Stroop Test (Adulto)', domain: 'Funções Executivas', description: 'Avalia atenção seletiva, controle inibitório e flexibilidade cognitiva.' },
  { id: 'tol', name: 'Torre de Londres', domain: 'Funções Executivas', description: 'Avalia planejamento e resolução de problemas.' },
  { id: 'vineland3', name: 'Vineland-3', domain: 'Comportamento Adaptativo', description: 'Escalas de Comportamento Adaptativo para avaliação de autonomia.' },
  { id: 'wasi', name: 'WASI', domain: 'Inteligência', description: 'Escala de Inteligência Wechsler Abreviada.' },
  { id: 'wais', name: 'WAIS-IV', domain: 'Inteligência', description: 'Escala de Inteligência Wechsler para Adultos.' },
  { id: 'srs2', name: 'SRS-2', domain: 'Responsividade Social', description: 'Escala de Responsividade Social para triagem de TEA.' },
  { id: 'etdah-ad', name: 'ETDAH-AD (Autoinforme)', domain: 'Atenção / Hiperatividade', description: 'Escala de TDAH para adultos.' },
  { id: 'etdah-pais', name: 'ETDAH (Pais)', domain: 'Atenção / Hiperatividade', description: 'Escala de TDAH preenchida pelos pais.' },
  { id: 'etdah-criad', name: 'ETDAH (Criadores/Professores)', domain: 'Atenção / Hiperatividade', description: 'Escala de TDAH preenchida por educadores.' },
  { id: 'fdt', name: 'FDT (Teste dos Cinco Dígitos)', domain: 'Velocidade de Processamento', description: 'Avalia velocidade cognitiva e flexibilidade.' },
];

export const MOCK_RESULTS: TestResult[] = [
  { id: 'r1', patientId: '1', testId: 'stroop-ad', rawScore: 45, standardScore: 105, percentile: 63, date: '2023-12-01', observations: 'Hesitação leve na condição de interferência.' },
  { id: 'r2', patientId: '1', testId: 'fdt', rawScore: 30, standardScore: 112, percentile: 79, date: '2023-12-05', observations: 'Respostas rápidas, bom controle motor.' }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    patientId: '1',
    professionalId: 'p1',
    dateTime: '2024-05-20T10:00:00',
    type: SessionType.EVALUATION,
    durationMinutes: 60,
    notes: 'Continuar administração do Stroop.',
    status: 'scheduled'
  },
  {
    id: 's2',
    patientId: '2',
    professionalId: 'p1',
    dateTime: '2024-05-21T14:30:00',
    type: SessionType.ANAMNESIS,
    durationMinutes: 90,
    notes: 'Entrevista inicial com os responsáveis.',
    status: 'confirmed'
  }
];
