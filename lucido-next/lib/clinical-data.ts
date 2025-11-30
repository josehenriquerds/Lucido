// ============================================================================
// DADOS MOCK PARA SISTEMA CLÍNICO / PRONTUÁRIO COLABORATIVO
// ============================================================================

import type {
  User,
  Organization,
  OrganizationUser,
  Patient,
  CaseProfessional,
  PatientGuardian,
  Objective,
  Session,
  TherapeuticActivity,
  ActivityExecution,
  Comment,
  Event,
  Consent,
} from "./types/clinical";

import {
  GlobalRole,
  OrgType,
  OrgRole,
  Sex,
  SupportLevel,
  GuardianRelationship,
  GuardianAccessLevel,
  TherapeuticArea,
  ObjectiveStatus,
  SessionType,
  ActivityType,
  EngagementLevel,
  HelpLevel,
  ActivityOutcome,
  EventType,
  ConsentType,
} from "./types/clinical";

// ============================================================================
// USUÁRIOS MOCK
// ============================================================================

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    email: "dra.ana@clinica.com",
    passwordHash: "hash123", // Em produção, usar bcrypt
    name: "Dra. Ana Silva",
    avatar: "👩‍⚕️",
    globalRole: GlobalRole.PROFESSIONAL,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    email: "carlos.fono@clinica.com",
    passwordHash: "hash123",
    name: "Carlos Mendes",
    avatar: "👨‍⚕️",
    globalRole: GlobalRole.PROFESSIONAL,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "user-3",
    email: "lucia.to@clinica.com",
    passwordHash: "hash123",
    name: "Lúcia Fernandes",
    avatar: "👩‍⚕️",
    globalRole: GlobalRole.PROFESSIONAL,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "user-7",
    email: "roberto.fisio@clinica.com",
    passwordHash: "hash123",
    name: "Dr. Roberto Costa",
    avatar: "👨‍⚕️",
    globalRole: GlobalRole.PROFESSIONAL,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "user-8",
    email: "julia.psicopedagoga@clinica.com",
    passwordHash: "hash123",
    name: "Júlia Marques",
    avatar: "👩‍🏫",
    globalRole: GlobalRole.PROFESSIONAL,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "user-4",
    email: "maria.santos@email.com",
    passwordHash: "hash123",
    name: "Maria Santos",
    avatar: "👩",
    globalRole: GlobalRole.GUARDIAN,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "user-5",
    email: "joao.santos@email.com",
    passwordHash: "hash123",
    name: "João Santos",
    avatar: "👨",
    globalRole: GlobalRole.GUARDIAN,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "user-6",
    email: "admin@clinica.com",
    passwordHash: "hash123",
    name: "Admin Clínica",
    avatar: "🔧",
    globalRole: GlobalRole.SYSTEM_ADMIN,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// ORGANIZAÇÕES MOCK
// ============================================================================

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-1",
    name: "Clínica Crescer",
    type: OrgType.CLINIC,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "org-2",
    name: "Escola Aprender",
    type: OrgType.SCHOOL,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
];

export const MOCK_ORGANIZATION_USERS: OrganizationUser[] = [
  {
    id: "ou-1",
    organizationId: "org-1",
    userId: "user-1",
    role: OrgRole.PROFESSIONAL,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "ou-2",
    organizationId: "org-1",
    userId: "user-2",
    role: OrgRole.PROFESSIONAL,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "ou-3",
    organizationId: "org-1",
    userId: "user-3",
    role: OrgRole.PROFESSIONAL,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "ou-4",
    organizationId: "org-1",
    userId: "user-6",
    role: OrgRole.ADMIN,
    createdAt: new Date("2024-01-01"),
  },
];

// ============================================================================
// PACIENTES MOCK
// ============================================================================

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "patient-1",
    organizationId: "org-1",
    internalCode: "PAC-001",
    name: "Pedro Santos",
    birthDate: new Date("2019-05-15"),
    sex: Sex.MALE,
    diagnoses: ["TEA", "Atraso na Fala"],
    supportLevel: SupportLevel.LEVEL_2,
    generalNotes:
      "Criança comunicativa, interesse por dinossauros e cores. Responde bem a rotinas visuais.",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "patient-2",
    organizationId: "org-1",
    internalCode: "PAC-002",
    name: "Laura Oliveira",
    birthDate: new Date("2020-08-22"),
    sex: Sex.FEMALE,
    diagnoses: ["TEA"],
    supportLevel: SupportLevel.LEVEL_1,
    generalNotes: "Gosta de atividades musicais. Sensibilidade sensorial moderada.",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-11-18"),
  },
];

// ============================================================================
// CASE PROFESSIONALS (PROFISSIONAIS DO CASO)
// ============================================================================

export const MOCK_CASE_PROFESSIONALS: CaseProfessional[] = [
  {
    id: "cp-1",
    patientId: "patient-1",
    userId: "user-1",
    roleInCase: "Psicóloga",
    specialization: "Terapia ABA",
    isActive: true,
    startDate: new Date("2024-03-15"),
  },
  {
    id: "cp-2",
    patientId: "patient-1",
    userId: "user-2",
    roleInCase: "Fonoaudiólogo",
    specialization: "Linguagem Infantil",
    isActive: true,
    startDate: new Date("2024-03-20"),
  },
  {
    id: "cp-3",
    patientId: "patient-1",
    userId: "user-3",
    roleInCase: "Terapeuta Ocupacional",
    specialization: "Integração Sensorial",
    isActive: true,
    startDate: new Date("2024-04-01"),
  },
  {
    id: "cp-4",
    patientId: "patient-2",
    userId: "user-1",
    roleInCase: "Psicóloga",
    specialization: "Terapia ABA",
    isActive: true,
    startDate: new Date("2024-04-05"),
  },
];

// ============================================================================
// GUARDIANS (RESPONSÁVEIS)
// ============================================================================

export const MOCK_PATIENT_GUARDIANS: PatientGuardian[] = [
  {
    id: "pg-1",
    patientId: "patient-1",
    userId: "user-4",
    relationship: GuardianRelationship.MOTHER,
    accessLevel: GuardianAccessLevel.READ_ONLY,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "pg-2",
    patientId: "patient-1",
    userId: "user-5",
    relationship: GuardianRelationship.FATHER,
    accessLevel: GuardianAccessLevel.READ_ONLY,
    createdAt: new Date("2024-03-10"),
  },
];

// ============================================================================
// OBJETIVOS TERAPÊUTICOS
// ============================================================================

export const MOCK_OBJECTIVES: Objective[] = [
  {
    id: "obj-1",
    patientId: "patient-1",
    title: "Aumentar vocabulário expressivo",
    area: TherapeuticArea.COMMUNICATION,
    status: ObjectiveStatus.IN_PROGRESS,
    description:
      "Expandir repertório de palavras funcionais para comunicação do dia a dia (mínimo 20 novas palavras).",
    startDate: new Date("2024-03-15"),
    reviewDate: new Date("2024-06-15"),
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "obj-2",
    patientId: "patient-1",
    title: "Reduzir comportamentos de fuga em transições",
    area: TherapeuticArea.BEHAVIOR,
    status: ObjectiveStatus.IN_PROGRESS,
    description: "Usar timer visual e antecipação verbal para facilitar transições entre atividades.",
    startDate: new Date("2024-04-01"),
    reviewDate: new Date("2024-07-01"),
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "obj-3",
    patientId: "patient-1",
    title: "Desenvolver coordenação motora fina",
    area: TherapeuticArea.FINE_MOTOR,
    status: ObjectiveStatus.ACHIEVED,
    description: "Conseguir segurar lápis com preensão em pinça e traçar linhas básicas.",
    startDate: new Date("2024-04-10"),
    completedDate: new Date("2024-10-20"),
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-10-20"),
  },
];

// ============================================================================
// SESSÕES
// ============================================================================

export const MOCK_SESSIONS: Session[] = [
  {
    id: "session-1",
    patientId: "patient-1",
    professionalId: "user-1",
    sessionType: SessionType.PSYCHOLOGY,
    areaFocus: TherapeuticArea.COMMUNICATION,
    sessionDate: new Date("2024-11-25T10:00:00"),
    duration: 50,
    observations:
      "Pedro demonstrou boa participação nas atividades de nomeação. Utilizou 8 palavras espontaneamente durante brincadeira com dinossauros. Apresentou frustração moderada ao final (cansaço).",
    plan: "Próxima sessão: trabalhar turnos de fala com jogo de cores.",
    objectiveIds: ["obj-1", "obj-2"],
    createdAt: new Date("2024-11-25T11:00:00"),
    updatedAt: new Date("2024-11-25T11:00:00"),
  },
  {
    id: "session-2",
    patientId: "patient-1",
    professionalId: "user-2",
    sessionType: SessionType.SPEECH_THERAPY,
    areaFocus: TherapeuticArea.COMMUNICATION,
    sessionDate: new Date("2024-11-26T14:00:00"),
    duration: 45,
    observations:
      "Sessão focada em sons bilabiais (/p/, /b/, /m/). Pedro conseguiu imitar 'papá' e 'babá' com apoio visual. Boa atenção compartilhada.",
    plan: "Continuar com sons bilabiais, introduzir /t/ e /d/.",
    objectiveIds: ["obj-1"],
    createdAt: new Date("2024-11-26T15:00:00"),
    updatedAt: new Date("2024-11-26T15:00:00"),
  },
  {
    id: "session-3",
    patientId: "patient-1",
    professionalId: "user-3",
    sessionType: SessionType.OCCUPATIONAL_THERAPY,
    areaFocus: TherapeuticArea.FINE_MOTOR,
    sessionDate: new Date("2024-11-27T09:00:00"),
    duration: 40,
    observations:
      "Trabalho com massinha e pinça. Pedro conseguiu pegar pequenas peças com índice e polegar. Tolerou textura de tinta sem desconforto.",
    plan: "Introduzir atividades de traçado com giz de cera grosso.",
    objectiveIds: ["obj-3"],
    createdAt: new Date("2024-11-27T10:00:00"),
    updatedAt: new Date("2024-11-27T10:00:00"),
  },
  {
    id: "session-4",
    patientId: "patient-1",
    professionalId: "user-1",
    sessionType: SessionType.ABA_THERAPY,
    areaFocus: TherapeuticArea.BEHAVIOR,
    sessionDate: new Date("2024-11-20T10:00:00"),
    duration: 60,
    observations:
      "Trabalho intenso em comunicação funcional. Pedro aprendeu a usar cartões PECS para pedir água e brinquedos preferidos. 15 tentativas bem-sucedidas.",
    plan: "Expandir PECS para mais itens do cotidiano.",
    objectiveIds: ["obj-1", "obj-2"],
    createdAt: new Date("2024-11-20T11:00:00"),
    updatedAt: new Date("2024-11-20T11:00:00"),
  },
  {
    id: "session-5",
    patientId: "patient-1",
    professionalId: "user-2",
    sessionType: SessionType.SPEECH_THERAPY,
    areaFocus: TherapeuticArea.COMMUNICATION,
    sessionDate: new Date("2024-11-18T14:00:00"),
    duration: 45,
    observations:
      "Sessão com jogos de correspondência sonora. Pedro identificou corretamente 6/8 sons iniciais. Ótima concentração.",
    plan: "Introduzir rimas simples na próxima sessão.",
    objectiveIds: ["obj-1"],
    createdAt: new Date("2024-11-18T15:00:00"),
    updatedAt: new Date("2024-11-18T15:00:00"),
  },
  {
    id: "session-6",
    patientId: "patient-1",
    professionalId: "user-3",
    sessionType: SessionType.OCCUPATIONAL_THERAPY,
    areaFocus: TherapeuticArea.SENSORY,
    sessionDate: new Date("2024-11-15T09:00:00"),
    duration: 45,
    observations:
      "Exploração sensorial com diferentes texturas. Pedro mostrou preferência por superfícies macias e tolerou bem texturas ásperas por curtos períodos.",
    plan: "Continuar exposição gradual a texturas diversas.",
    objectiveIds: [],
    createdAt: new Date("2024-11-15T10:00:00"),
    updatedAt: new Date("2024-11-15T10:00:00"),
  },
  {
    id: "session-7",
    patientId: "patient-2",
    professionalId: "user-1",
    sessionType: SessionType.PSYCHOLOGY,
    areaFocus: TherapeuticArea.SOCIAL_SKILLS,
    sessionDate: new Date("2024-11-22T11:00:00"),
    duration: 50,
    observations:
      "Laura participou de atividades de reconhecimento de emoções. Identificou corretamente 'feliz', 'triste' e 'bravo'. Interagiu bem com a terapeuta.",
    plan: "Introduzir situações sociais com pares na próxima sessão.",
    objectiveIds: [],
    createdAt: new Date("2024-11-22T12:00:00"),
    updatedAt: new Date("2024-11-22T12:00:00"),
  },
];

// ============================================================================
// ATIVIDADES TERAPÊUTICAS (CATÁLOGO)
// ============================================================================

export const MOCK_THERAPEUTIC_ACTIVITIES: TherapeuticActivity[] = [
  {
    id: "act-1",
    name: "Vogais Luminosas (Digital)",
    type: ActivityType.DIGITAL,
    mainObjective: TherapeuticArea.COMMUNICATION,
    description: "Jogo digital de associação de vogais com imagens. Trabalha reconhecimento fonológico.",
    gameModuleId: "vowels", // Referência ao módulo lúdico existente
    suggestedAgeMin: 48, // 4 anos
    suggestedAgeMax: 84, // 7 anos
    tags: ["Fonologia", "Atenção Visual", "Associação"],
    isActive: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "act-2",
    name: "Sílabas Borbulhantes (Digital)",
    type: ActivityType.DIGITAL,
    mainObjective: TherapeuticArea.COMMUNICATION,
    description: "Formação de sílabas através de drag-and-drop. Consciência fonológica.",
    gameModuleId: "syllables",
    suggestedAgeMin: 60, // 5 anos
    suggestedAgeMax: 96, // 8 anos
    tags: ["Consciência Fonológica", "Coordenação Motora", "Leitura"],
    isActive: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "act-3",
    name: "Circuito Sensorial com Obstáculos",
    type: ActivityType.PHYSICAL,
    mainObjective: TherapeuticArea.GROSS_MOTOR,
    description: "Circuito com almofadas, túnel e rampas para integração sensorial e equilíbrio.",
    materials: ["Almofadas", "Túnel de tecido", "Rampa", "Tapete antiderrapante"],
    suggestedAgeMin: 36,
    suggestedAgeMax: 120,
    tags: ["Equilíbrio", "Propriocepção", "Planejamento Motor"],
    isActive: true,
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: "act-4",
    name: "Bingo das Emoções",
    type: ActivityType.PHYSICAL,
    mainObjective: TherapeuticArea.SOCIAL_SKILLS,
    description: "Jogo de bingo com cartas de expressões faciais. Trabalha reconhecimento de emoções.",
    materials: ["Cartelas de bingo", "Cartas com rostos", "Marcadores"],
    suggestedAgeMin: 48,
    suggestedAgeMax: 120,
    tags: ["Reconhecimento de Emoções", "Atenção Compartilhada", "Turnos"],
    isActive: true,
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "act-5",
    name: "Massinha com Ferramentas",
    type: ActivityType.PHYSICAL,
    mainObjective: TherapeuticArea.FINE_MOTOR,
    description: "Modelagem livre e dirigida com massinha, tesoura, cortadores.",
    materials: ["Massinha de modelar", "Tesoura infantil", "Cortadores", "Rolos"],
    suggestedAgeMin: 36,
    suggestedAgeMax: 96,
    tags: ["Coordenação Motora Fina", "Preensão", "Criatividade"],
    isActive: true,
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-04-20"),
  },
];

// ============================================================================
// EXECUÇÕES DE ATIVIDADES
// ============================================================================

export const MOCK_ACTIVITY_EXECUTIONS: ActivityExecution[] = [
  {
    id: "exec-1",
    patientId: "patient-1",
    sessionId: "session-1",
    activityId: "act-1",
    executionDate: new Date("2024-11-25T10:15:00"),
    duration: 15,
    engagement: EngagementLevel.HIGH,
    helpLevel: HelpLevel.SOME_HELP,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Pedro acertou 7/10 associações. Ficou empolgado com os sons.",
    metricsJson: {
      correctAnswers: 7,
      totalQuestions: 10,
      averageResponseTime: 3.5, // segundos
      hintsUsed: 2,
    },
    createdAt: new Date("2024-11-25T10:30:00"),
  },
  {
    id: "exec-2",
    patientId: "patient-1",
    sessionId: "session-2",
    activityId: "act-2",
    executionDate: new Date("2024-11-26T14:20:00"),
    duration: 12,
    engagement: EngagementLevel.MEDIUM,
    helpLevel: HelpLevel.SOME_HELP,
    outcome: ActivityOutcome.PARTIAL,
    notes: "Completou 3 sílabas. Perdeu interesse após 12 minutos.",
    metricsJson: {
      syllablesFormed: 3,
      totalAttempts: 5,
      timeToComplete: 12,
    },
    createdAt: new Date("2024-11-26T14:35:00"),
  },
  {
    id: "exec-3",
    patientId: "patient-1",
    sessionId: "session-3",
    activityId: "act-5",
    executionDate: new Date("2024-11-27T09:10:00"),
    duration: 20,
    engagement: EngagementLevel.HIGH,
    helpLevel: HelpLevel.INDEPENDENT,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Excelente preensão. Criou um dinossauro com a massinha de forma independente.",
    createdAt: new Date("2024-11-27T09:35:00"),
  },
  {
    id: "exec-4",
    patientId: "patient-1",
    sessionId: "session-4",
    activityId: "act-1",
    executionDate: new Date("2024-11-20T10:20:00"),
    duration: 18,
    engagement: EngagementLevel.HIGH,
    helpLevel: HelpLevel.SOME_HELP,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Melhor desempenho que a primeira vez. 9/10 acertos!",
    metricsJson: {
      correctAnswers: 9,
      totalQuestions: 10,
      averageResponseTime: 2.8,
      hintsUsed: 1,
    },
    createdAt: new Date("2024-11-20T10:40:00"),
  },
  {
    id: "exec-5",
    patientId: "patient-1",
    sessionId: "session-5",
    activityId: "act-2",
    executionDate: new Date("2024-11-18T14:15:00"),
    duration: 15,
    engagement: EngagementLevel.HIGH,
    helpLevel: HelpLevel.SOME_HELP,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Formou 5 sílabas corretamente. Boa evolução!",
    metricsJson: {
      syllablesFormed: 5,
      totalAttempts: 6,
      timeToComplete: 15,
    },
    createdAt: new Date("2024-11-18T14:30:00"),
  },
  {
    id: "exec-6",
    patientId: "patient-1",
    activityId: "act-1",
    executionDate: new Date("2024-11-22T16:00:00"),
    duration: 10,
    engagement: EngagementLevel.HIGH,
    helpLevel: HelpLevel.INDEPENDENT,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Atividade em casa. Pedro jogou sozinho e adorou!",
    metricsJson: {
      correctAnswers: 8,
      totalQuestions: 10,
      averageResponseTime: 3.0,
      hintsUsed: 0,
    },
    createdAt: new Date("2024-11-22T16:15:00"),
  },
  {
    id: "exec-7",
    patientId: "patient-1",
    activityId: "act-1",
    executionDate: new Date("2024-11-24T17:30:00"),
    duration: 12,
    engagement: EngagementLevel.MEDIUM,
    helpLevel: HelpLevel.INDEPENDENT,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Jogou após o jantar. Um pouco cansado mas completou.",
    metricsJson: {
      correctAnswers: 6,
      totalQuestions: 10,
      averageResponseTime: 4.2,
      hintsUsed: 3,
    },
    createdAt: new Date("2024-11-24T17:45:00"),
  },
  {
    id: "exec-8",
    patientId: "patient-2",
    activityId: "act-1",
    executionDate: new Date("2024-11-22T11:30:00"),
    duration: 14,
    engagement: EngagementLevel.HIGH,
    helpLevel: HelpLevel.SOME_HELP,
    outcome: ActivityOutcome.COMPLETED,
    notes: "Laura se saiu muito bem! Adorou os sons das vogais.",
    metricsJson: {
      correctAnswers: 9,
      totalQuestions: 10,
      averageResponseTime: 2.5,
      hintsUsed: 1,
    },
    createdAt: new Date("2024-11-22T11:45:00"),
  },
];

// ============================================================================
// COMENTÁRIOS (COLABORAÇÃO)
// ============================================================================

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    sessionId: "session-1",
    userId: "user-2",
    content:
      "Ana, notei que Pedro está usando mais palavras espontaneamente! Na minha sessão de fono também falou 'papá' sem prompt. Parabéns pelo trabalho!",
    mentions: ["user-1"],
    createdAt: new Date("2024-11-26T15:30:00"),
    updatedAt: new Date("2024-11-26T15:30:00"),
  },
  {
    id: "comment-2",
    sessionId: "session-1",
    userId: "user-1",
    content:
      "Obrigada, Carlos! Que legal essa evolução. Vamos continuar reforçando. Lúcia, podemos incluir nomeação de objetos na TO também?",
    mentions: ["user-2", "user-3"],
    createdAt: new Date("2024-11-26T16:00:00"),
    updatedAt: new Date("2024-11-26T16:00:00"),
  },
];

// ============================================================================
// EVENTOS (TIMELINE)
// ============================================================================

export const MOCK_EVENTS: Event[] = [
  {
    id: "event-1",
    patientId: "patient-1",
    type: EventType.SESSION,
    sessionId: "session-1",
    eventDate: new Date("2024-11-25T10:00:00"),
    title: "Sessão de Psicologia",
    description: "Terapia ABA - Comunicação e Comportamento",
    createdAt: new Date("2024-11-25T11:00:00"),
  },
  {
    id: "event-2",
    patientId: "patient-1",
    type: EventType.SESSION,
    sessionId: "session-2",
    eventDate: new Date("2024-11-26T14:00:00"),
    title: "Sessão de Fonoaudiologia",
    description: "Trabalho com sons bilabiais",
    createdAt: new Date("2024-11-26T15:00:00"),
  },
  {
    id: "event-3",
    patientId: "patient-1",
    type: EventType.SESSION,
    sessionId: "session-3",
    eventDate: new Date("2024-11-27T09:00:00"),
    title: "Sessão de Terapia Ocupacional",
    description: "Coordenação motora fina",
    createdAt: new Date("2024-11-27T10:00:00"),
  },
  {
    id: "event-4",
    patientId: "patient-1",
    type: EventType.MILESTONE,
    eventDate: new Date("2024-10-20T00:00:00"),
    title: "Marco Importante: Preensão em Pinça",
    description: "Pedro conseguiu segurar lápis com preensão adequada pela primeira vez!",
    createdAt: new Date("2024-10-20T10:00:00"),
  },
  {
    id: "event-5",
    patientId: "patient-1",
    type: EventType.IMPORTANT_NOTE,
    eventDate: new Date("2024-11-15T00:00:00"),
    title: "Observação da Família",
    description:
      "Mãe relatou que Pedro começou a nomear cores em casa espontaneamente. Parece ter gostado muito do jogo de cores do tablet.",
    createdAt: new Date("2024-11-15T14:30:00"),
  },
];

// ============================================================================
// CONSENTIMENTOS
// ============================================================================

export const MOCK_CONSENTS: Consent[] = [
  {
    id: "consent-1",
    patientId: "patient-1",
    type: ConsentType.DATA_SHARING_PROFESSIONALS,
    granted: true,
    grantedBy: "Maria Santos (Mãe)",
    grantedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "consent-2",
    patientId: "patient-1",
    type: ConsentType.DIGITAL_ACTIVITIES,
    granted: true,
    grantedBy: "Maria Santos (Mãe)",
    grantedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "consent-3",
    patientId: "patient-1",
    type: ConsentType.GUARDIAN_ACCESS,
    granted: true,
    grantedBy: "Maria Santos (Mãe)",
    grantedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
];

// ============================================================================
// HELPERS PARA ACESSAR DADOS RELACIONADOS
// ============================================================================

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getPatientById(id: string): Patient | undefined {
  return MOCK_PATIENTS.find((p) => p.id === id);
}

export function getOrganizationById(id: string): Organization | undefined {
  return MOCK_ORGANIZATIONS.find((o) => o.id === id);
}

export function getSessionById(id: string): Session | undefined {
  return MOCK_SESSIONS.find((s) => s.id === id);
}

export function getActivityById(id: string): TherapeuticActivity | undefined {
  return MOCK_THERAPEUTIC_ACTIVITIES.find((a) => a.id === id);
}

export function getPatientsByGuardian(guardianUserId: string): Patient[] {
  const patientIds = MOCK_PATIENT_GUARDIANS.filter((g) => g.userId === guardianUserId).map(
    (g) => g.patientId
  );
  return MOCK_PATIENTS.filter((p) => patientIds.includes(p.id));
}

export function getPatientsByProfessional(professionalId: string): Patient[] {
  const patientIds = MOCK_CASE_PROFESSIONALS.filter(
    (cp) => cp.userId === professionalId && cp.isActive
  ).map((cp) => cp.patientId);

  return MOCK_PATIENTS.filter((p) => patientIds.includes(p.id));
}

export function getProfessionalsByPatient(patientId: string): (CaseProfessional & { user: User })[] {
  return MOCK_CASE_PROFESSIONALS.filter((cp) => cp.patientId === patientId && cp.isActive)
    .map((cp) => {
      const user = getUserById(cp.userId);
      if (!user) return null;
      return { ...cp, user };
    })
    .filter((item): item is CaseProfessional & { user: User } => item !== null);
}

export function getGuardiansByPatient(patientId: string): (PatientGuardian & { user: User })[] {
  return MOCK_PATIENT_GUARDIANS.filter((g) => g.patientId === patientId)
    .map((guardian) => {
      const user = getUserById(guardian.userId);
      if (!user) return null;
      return { ...guardian, user };
    })
    .filter((item): item is PatientGuardian & { user: User } => item !== null);
}

export function getSessionsByPatient(patientId: string): Session[] {
  return MOCK_SESSIONS.filter((s) => s.patientId === patientId).sort(
    (a, b) => b.sessionDate.getTime() - a.sessionDate.getTime()
  );
}

export function getObjectivesByPatient(patientId: string): Objective[] {
  return MOCK_OBJECTIVES.filter((o) => o.patientId === patientId);
}

export function getEventsByPatient(patientId: string): Event[] {
  return MOCK_EVENTS.filter((e) => e.patientId === patientId).sort(
    (a, b) => b.eventDate.getTime() - a.eventDate.getTime()
  );
}

export function getCommentsBySession(sessionId: string): (Comment & { user: User })[] {
  return MOCK_COMMENTS.filter((c) => c.sessionId === sessionId)
    .map((c) => {
      const user = getUserById(c.userId);
      if (!user) return null;
      return { ...c, user };
    })
    .filter((item): item is Comment & { user: User } => item !== null);
}

export function getActivitiesByType(type: ActivityType): TherapeuticActivity[] {
  return MOCK_THERAPEUTIC_ACTIVITIES.filter((a) => a.type === type && a.isActive);
}
