// ============================================================================
// TIPOS PARA SISTEMA CLÍNICO / PRONTUÁRIO COLABORATIVO
// ============================================================================

// ----------------------------------------------------------------------------
// ENUMS
// ----------------------------------------------------------------------------

export enum GlobalRole {
  SYSTEM_ADMIN = "SYSTEM_ADMIN",
  PROFESSIONAL = "PROFESSIONAL",
  GUARDIAN = "GUARDIAN",
}

export enum OrgType {
  CLINIC = "CLINIC",
  SCHOOL = "SCHOOL",
  HOSPITAL = "HOSPITAL",
  PRIVATE_PRACTICE = "PRIVATE_PRACTICE",
  OTHER = "OTHER",
}

export enum OrgRole {
  ADMIN = "ADMIN",
  PROFESSIONAL = "PROFESSIONAL",
  VIEWER = "VIEWER",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum SupportLevel {
  LEVEL_1 = "LEVEL_1", // Necessita apoio
  LEVEL_2 = "LEVEL_2", // Necessita apoio substancial
  LEVEL_3 = "LEVEL_3", // Necessita apoio muito substancial
}

export enum GuardianRelationship {
  MOTHER = "MOTHER",
  FATHER = "FATHER",
  LEGAL_GUARDIAN = "LEGAL_GUARDIAN",
  GRANDPARENT = "GRANDPARENT",
  OTHER = "OTHER",
}

export enum GuardianAccessLevel {
  READ_ONLY = "READ_ONLY",
  COMMENT_ONLY = "COMMENT_ONLY",
  FULL_ACCESS = "FULL_ACCESS",
}

export enum TherapeuticArea {
  BEHAVIOR = "BEHAVIOR",
  COMMUNICATION = "COMMUNICATION",
  SOCIAL_SKILLS = "SOCIAL_SKILLS",
  FINE_MOTOR = "FINE_MOTOR",
  GROSS_MOTOR = "GROSS_MOTOR",
  SENSORY = "SENSORY",
  COGNITIVE = "COGNITIVE",
  DAILY_LIVING = "DAILY_LIVING",
  ACADEMIC = "ACADEMIC",
  OTHER = "OTHER",
}

export enum ObjectiveStatus {
  IN_PROGRESS = "IN_PROGRESS",
  ACHIEVED = "ACHIEVED",
  PAUSED = "PAUSED",
  DISCONTINUED = "DISCONTINUED",
}

export enum SessionType {
  PSYCHOLOGY = "PSYCHOLOGY",
  SPEECH_THERAPY = "SPEECH_THERAPY",
  OCCUPATIONAL_THERAPY = "OCCUPATIONAL_THERAPY",
  SCHOOL = "SCHOOL",
  MEDICAL = "MEDICAL",
  ABA_THERAPY = "ABA_THERAPY",
  PHYSICAL_THERAPY = "PHYSICAL_THERAPY",
  PSYCHOPEDAGOGY = "PSYCHOPEDAGOGY",
  OTHER = "OTHER",
}

export enum ActivityType {
  DIGITAL = "DIGITAL",
  PHYSICAL = "PHYSICAL",
}

export enum EngagementLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum HelpLevel {
  INDEPENDENT = "INDEPENDENT",
  SOME_HELP = "SOME_HELP",
  CONSTANT_HELP = "CONSTANT_HELP",
}

export enum ActivityOutcome {
  COMPLETED = "COMPLETED",
  PARTIAL = "PARTIAL",
  NOT_COMPLETED = "NOT_COMPLETED",
}

export enum EventType {
  SESSION = "SESSION",
  ACTIVITY_EXECUTION = "ACTIVITY_EXECUTION",
  IMPORTANT_NOTE = "IMPORTANT_NOTE",
  CRISIS = "CRISIS",
  MILESTONE = "MILESTONE",
  MEDICATION_CHANGE = "MEDICATION_CHANGE",
  DIAGNOSIS_UPDATE = "DIAGNOSIS_UPDATE",
  OTHER = "OTHER",
}

export enum ConsentType {
  DATA_SHARING_PROFESSIONALS = "DATA_SHARING_PROFESSIONALS",
  ANONYMIZED_DATA_RESEARCH = "ANONYMIZED_DATA_RESEARCH",
  GUARDIAN_ACCESS = "GUARDIAN_ACCESS",
  DIGITAL_ACTIVITIES = "DIGITAL_ACTIVITIES",
}

// ----------------------------------------------------------------------------
// INTERFACES - USUÁRIOS E ORGANIZAÇÕES
// ----------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string;
  globalRole: GlobalRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgRole;
  createdAt: Date;
}

// ----------------------------------------------------------------------------
// INTERFACES - PACIENTES
// ----------------------------------------------------------------------------

export interface Patient {
  id: string;
  organizationId: string;
  internalCode?: string;
  name: string;
  birthDate: Date;
  sex?: Sex;
  diagnoses: string[];
  supportLevel?: SupportLevel;
  generalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseProfessional {
  id: string;
  patientId: string;
  userId: string;
  roleInCase: string; // ex: "Psicólogo", "Fonoaudiólogo"
  specialization?: string;
  isActive: boolean;
  origin?: "FAMILY" | "ORGANIZATION" | "MARKETPLACE";
  startDate: Date;
  endDate?: Date;
}

export interface PatientGuardian {
  id: string;
  patientId: string;
  userId: string;
  relationship: GuardianRelationship;
  accessLevel: GuardianAccessLevel;
  createdAt: Date;
}

// ----------------------------------------------------------------------------
// INTERFACES - OBJETIVOS E SESSÕES
// ----------------------------------------------------------------------------

export interface Objective {
  id: string;
  patientId: string;
  title: string;
  area: TherapeuticArea;
  status: ObjectiveStatus;
  description?: string;
  startDate: Date;
  reviewDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  patientId: string;
  professionalId: string;
  sessionType: SessionType;
  areaFocus?: TherapeuticArea;
  sessionDate: Date;
  duration?: number; // Em minutos
  observations?: string;
  plan?: string;
  objectiveIds: string[]; // IDs dos objetivos trabalhados
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionObjective {
  sessionId: string;
  objectiveId: string;
  progress?: string;
}

// ----------------------------------------------------------------------------
// INTERFACES - ATIVIDADES
// ----------------------------------------------------------------------------

export interface TherapeuticActivity {
  id: string;
  name: string;
  type: ActivityType;
  mainObjective: TherapeuticArea;
  description?: string;
  materials?: string[]; // Para atividades físicas
  gameModuleId?: string; // Referência ao módulo lúdico (ex: "vowels")
  suggestedAgeMin?: number; // Em meses
  suggestedAgeMax?: number; // Em meses
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityMetrics {
  correctAnswers?: number;
  totalQuestions?: number;
  averageResponseTime?: number;
  hintsUsed?: number;
  syllablesFormed?: number;
  totalAttempts?: number;
  timeToComplete?: number;
}

export interface ActivityExecution {
  id: string;
  patientId: string;
  sessionId?: string;
  activityId: string;
  executionDate: Date;
  duration?: number; // Em minutos
  engagement?: EngagementLevel;
  helpLevel?: HelpLevel;
  outcome?: ActivityOutcome;
  notes?: string;
  metricsJson?: ActivityMetrics; // Dados flexíveis de minigames
  createdAt: Date;
}

// ----------------------------------------------------------------------------
// REDE / MARKETPLACE
// ----------------------------------------------------------------------------

export interface ProfessionalProfile {
  userId: string;
  specialties: string[];
  approaches?: string[];
  city?: string;
  state?: string;
  modalities: Array<"ONLINE" | "IN_PERSON">;
  ageRange?: string;
  appearInMarketplace: boolean;
}

export enum LinkRequestOrigin {
  FAMILY = "FAMILY",
  ORGANIZATION = "ORGANIZATION",
}

export enum LinkRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface LinkRequest {
  id: string;
  patientId: string;
  professionalId: string;
  origin: LinkRequestOrigin;
  status: LinkRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------------------------------------------
// INTERFACES - COLABORAÇÃO E EVENTOS
// ----------------------------------------------------------------------------

export interface Comment {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  mentions: string[]; // User IDs mencionados
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  patientId: string;
  type: EventType;
  sessionId?: string;
  activityExecutionId?: string;
  eventDate: Date;
  title: string;
  description?: string;
  createdAt: Date;
}

// ----------------------------------------------------------------------------
// INTERFACES - CONSENTIMENTOS E AUDITORIA
// ----------------------------------------------------------------------------

export interface Consent {
  id: string;
  patientId: string;
  type: ConsentType;
  granted: boolean;
  grantedBy?: string;
  grantedAt?: Date;
  revokedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string; // ex: "READ_PATIENT", "UPDATE_SESSION"
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

// ----------------------------------------------------------------------------
// TIPOS AUXILIARES PARA UI
// ----------------------------------------------------------------------------

export interface TimelineEvent {
  id: string;
  type: EventType;
  date: Date;
  title: string;
  description?: string;
  metadata?: {
    session?: Session;
    activityExecution?: ActivityExecution;
    professional?: User;
    activity?: TherapeuticActivity;
  };
}

export interface PatientSummary {
  patient: Patient;
  activeProfessionals: (CaseProfessional & { user: User })[];
  guardians: (PatientGuardian & { user: User })[];
  activeObjectives: Objective[];
  recentSessions: Session[];
  totalSessions: number;
  totalActivities: number;
}

export interface SessionWithDetails extends Session {
  professional: User;
  objectives: Objective[];
  activities: ActivityExecution[];
  comments: (Comment & { user: User })[];
}

// ----------------------------------------------------------------------------
// HELPERS DE LABELS
// ----------------------------------------------------------------------------

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  [SessionType.PSYCHOLOGY]: "Psicologia",
  [SessionType.SPEECH_THERAPY]: "Fonoaudiologia",
  [SessionType.OCCUPATIONAL_THERAPY]: "Terapia Ocupacional",
  [SessionType.SCHOOL]: "Escola",
  [SessionType.MEDICAL]: "Médico",
  [SessionType.ABA_THERAPY]: "Terapia ABA",
  [SessionType.PHYSICAL_THERAPY]: "Fisioterapia",
  [SessionType.PSYCHOPEDAGOGY]: "Psicopedagogia",
  [SessionType.OTHER]: "Outro",
};

export const THERAPEUTIC_AREA_LABELS: Record<TherapeuticArea, string> = {
  [TherapeuticArea.BEHAVIOR]: "Comportamento",
  [TherapeuticArea.COMMUNICATION]: "Comunicação",
  [TherapeuticArea.SOCIAL_SKILLS]: "Habilidades Sociais",
  [TherapeuticArea.FINE_MOTOR]: "Motricidade Fina",
  [TherapeuticArea.GROSS_MOTOR]: "Motricidade Grossa",
  [TherapeuticArea.SENSORY]: "Sensorial",
  [TherapeuticArea.COGNITIVE]: "Cognitivo",
  [TherapeuticArea.DAILY_LIVING]: "Vida Diária",
  [TherapeuticArea.ACADEMIC]: "Acadêmico",
  [TherapeuticArea.OTHER]: "Outro",
};

export const ENGAGEMENT_LEVEL_LABELS: Record<EngagementLevel, string> = {
  [EngagementLevel.LOW]: "Baixo",
  [EngagementLevel.MEDIUM]: "Médio",
  [EngagementLevel.HIGH]: "Alto",
};

export const HELP_LEVEL_LABELS: Record<HelpLevel, string> = {
  [HelpLevel.INDEPENDENT]: "Independente",
  [HelpLevel.SOME_HELP]: "Alguma Ajuda",
  [HelpLevel.CONSTANT_HELP]: "Ajuda Constante",
};

export const OUTCOME_LABELS: Record<ActivityOutcome, string> = {
  [ActivityOutcome.COMPLETED]: "Concluído",
  [ActivityOutcome.PARTIAL]: "Parcial",
  [ActivityOutcome.NOT_COMPLETED]: "Não Concluído",
};

export const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  [SupportLevel.LEVEL_1]: "Nível 1 - Necessita Apoio",
  [SupportLevel.LEVEL_2]: "Nível 2 - Necessita Apoio Substancial",
  [SupportLevel.LEVEL_3]: "Nível 3 - Necessita Apoio Muito Substancial",
};
