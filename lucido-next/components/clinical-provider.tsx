"use client";

// ============================================================================
// CLINICAL PROVIDER - Context para dados clínicos (prontuário)
// ============================================================================

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type {
  User,
  Patient,
  Session,
  Objective,
  TherapeuticActivity,
  ActivityExecution,
  Comment,
  PatientSummary,
  TimelineEvent,
  LinkRequest,
  ProfessionalProfile,
  CaseProfessional,
} from "@/lib/types/clinical";

import {
  MOCK_SESSIONS,
  MOCK_OBJECTIVES,
  MOCK_THERAPEUTIC_ACTIVITIES,
  MOCK_ACTIVITY_EXECUTIONS,
  MOCK_COMMENTS,
  getSessionsByPatient,
  getObjectivesByPatient,
  getEventsByPatient,
  getUserById,
  getSessionById,
  getActivityById,
  getPatientsByGuardian,
  getGuardiansByPatient,
  getPatientById,
  MOCK_CASE_PROFESSIONALS,
  MOCK_PROFESSIONAL_PROFILES,
  MOCK_LINK_REQUESTS,
} from "@/lib/clinical-data";

import { GlobalRole, ObjectiveStatus, LinkRequestOrigin, LinkRequestStatus } from "@/lib/types/clinical";
import { getSession, type AuthSession } from "@/lib/auth/auth-service";

// ============================================================================
// TIPOS DO CONTEXT
// ============================================================================

interface ClinicalContextValue {
  // Auth
  session: AuthSession | null;
  currentUser: User | null;

  // Pacientes
  patients: Patient[];
  getPatientSummary: (patientId: string) => PatientSummary | null;

  // Sessões
  sessions: Session[];
  getSessionsByPatient: (patientId: string) => Session[];
  addSession: (session: Omit<Session, "id" | "createdAt" | "updatedAt">) => void;

  // Objetivos
  objectives: Objective[];
  getObjectivesByPatient: (patientId: string) => Objective[];

  // Atividades
  activities: TherapeuticActivity[];
  activityExecutions: ActivityExecution[];

  // Timeline
  getTimelineEvents: (patientId: string) => TimelineEvent[];

  // Comentários
  getCommentsBySession: (sessionId: string) => (Comment & { user: User })[];
  addComment: (sessionId: string, content: string) => void;

  // Rede / Marketplace
  linkRequests: LinkRequest[];
  respondLinkRequest: (requestId: string, action: "ACCEPT" | "REJECT") => void;
  addLinkRequest: (patientId: string, professionalId: string, origin: LinkRequestOrigin) => void;
  getMarketplaceProfessionals: () => ProfessionalProfile[];
  getProfessionalProfileByUserId: (userId: string) => ProfessionalProfile | undefined;
  updateProfessionalProfile: (profile: ProfessionalProfile) => void;
  getNetworkForPatient: (patientId: string) => (CaseProfessional & { user: User })[];
}

const ClinicalContext = createContext<ClinicalContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function ClinicalProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Estados (em produção, viriam do backend)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [objectives] = useState<Objective[]>(MOCK_OBJECTIVES);
  const [activities] = useState<TherapeuticActivity[]>(MOCK_THERAPEUTIC_ACTIVITIES);
  const [activityExecutions] = useState<ActivityExecution[]>(MOCK_ACTIVITY_EXECUTIONS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [caseProfessionals, setCaseProfessionals] =
    useState<(CaseProfessional & { user: User })[]>(() =>
      MOCK_CASE_PROFESSIONALS.map((cp) => {
        const user = getUserById(cp.userId);
        if (!user) return null;
        return { ...cp, user };
      }).filter((item): item is CaseProfessional & { user: User } => item !== null)
    );
  const [professionalProfiles, setProfessionalProfiles] =
    useState<ProfessionalProfile[]>(MOCK_PROFESSIONAL_PROFILES);
  const [linkRequests, setLinkRequests] = useState<LinkRequest[]>(MOCK_LINK_REQUESTS);

  // Carregar sessão ao montar
  useEffect(() => {
    const authSession = getSession();
    setSession(authSession);

    if (authSession) {
      const user = getUserById(authSession.userId);
      setCurrentUser(user || null);

      if (user) {
        const professionalPatients = caseProfessionals
          .filter((cp) => cp.userId === user.id && cp.isActive)
          .map((cp) => cp.patientId)
          .map((id) => getPatientById(id))
          .filter((p): p is Patient => Boolean(p));

        const guardianPatients =
          user.globalRole === GlobalRole.GUARDIAN ? getPatientsByGuardian(user.id) : [];

        const mergedPatients = [...professionalPatients, ...guardianPatients].filter(
          (patient, index, self) => self.findIndex((p) => p.id === patient.id) === index
        );

        setPatients(mergedPatients);
      }
    }
  }, [caseProfessionals]);

  // ============================================================================
  // FUNÇÕES DE NEGÓCIO
  // ============================================================================

  /**
   * Obter resumo completo de um paciente
   */
  const getPatientSummary = useCallback(
    (patientId: string): PatientSummary | null => {
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) return null;

      const activeProfessionals = caseProfessionals.filter(
        (cp) => cp.patientId === patientId && cp.isActive
      );
      const guardians = getGuardiansByPatient(patientId);
      const activeObjectives = getObjectivesByPatient(patientId).filter(
        (o) => o.status === ObjectiveStatus.IN_PROGRESS
      );
      const recentSessions = getSessionsByPatient(patientId).slice(0, 5);
      const totalSessions = getSessionsByPatient(patientId).length;
      const totalActivities = MOCK_ACTIVITY_EXECUTIONS.filter((e) => e.patientId === patientId).length;

      return {
        patient,
        activeProfessionals,
        guardians,
        activeObjectives,
        recentSessions,
        totalSessions,
        totalActivities,
      };
    },
    [patients, caseProfessionals]
  );

  /**
   * Obter eventos da timeline de um paciente
   */
  const getTimelineEvents = useCallback((patientId: string): TimelineEvent[] => {
    const events = getEventsByPatient(patientId);

    return events.map((event) => {
      const timelineEvent: TimelineEvent = {
        id: event.id,
        type: event.type,
        date: event.eventDate,
        title: event.title,
        description: event.description,
        metadata: {},
      };

      // Enriquecer com dados relacionados
      if (event.sessionId) {
        const session = getSessionById(event.sessionId);
        if (session) {
          timelineEvent.metadata!.session = session;
          timelineEvent.metadata!.professional = getUserById(session.professionalId);
        }
      }

      if (event.activityExecutionId) {
        const execution = MOCK_ACTIVITY_EXECUTIONS.find((e) => e.id === event.activityExecutionId);
        if (execution) {
          timelineEvent.metadata!.activityExecution = execution;
          timelineEvent.metadata!.activity = getActivityById(execution.activityId);
        }
      }

      return timelineEvent;
    });
  }, []);

  /**
   * Adicionar nova sessão (mock)
   */
  const addSession = useCallback((sessionData: Omit<Session, "id" | "createdAt" | "updatedAt">) => {
    const newSession: Session = {
      ...sessionData,
      id: `session-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions((prev) => [newSession, ...prev]);

    // Criar evento na timeline
    // TODO: adicionar ao MOCK_EVENTS
  }, []);

  /**
   * Adicionar comentário a uma sessão
   */
  const addComment = useCallback(
    (sessionId: string, content: string) => {
      if (!currentUser) return;

      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        sessionId,
        userId: currentUser.id,
        content,
        mentions: [], // TODO: extrair @mentions do conteúdo
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setComments((prev) => [...prev, newComment]);
    },
    [currentUser]
  );

  /**
   * Obter sessões por paciente (do estado local)
   */
  const getSessionsByPatientLocal = useCallback(
    (patientId: string) => {
      return sessions.filter((s) => s.patientId === patientId);
    },
    [sessions]
  );

  /**
   * Obter objetivos por paciente (do estado local)
   */
  const getObjectivesByPatientLocal = useCallback(
    (patientId: string) => {
      return objectives.filter((o) => o.patientId === patientId);
    },
    [objectives]
  );

  /**
   * Obter comentários de uma sessão (com dados de usuário)
   */
  const getCommentsBySessionLocal = useCallback(
    (sessionId: string) => {
      return comments
        .filter((c) => c.sessionId === sessionId)
        .map((c) => {
          const user = getUserById(c.userId);
          if (!user) return null;
          return { ...c, user };
        })
        .filter((item): item is Comment & { user: User } => item !== null);
    },
    [comments]
  );

  /**
   * Rede e marketplace
   */
  const getNetworkForPatient = useCallback(
    (patientId: string) => caseProfessionals.filter((cp) => cp.patientId === patientId),
    [caseProfessionals]
  );

  const respondLinkRequest = useCallback(
    (requestId: string, action: "ACCEPT" | "REJECT") => {
      let acceptedRequest: LinkRequest | undefined;
      setLinkRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            const updated = {
              ...req,
              status: action === "ACCEPT" ? LinkRequestStatus.ACCEPTED : LinkRequestStatus.REJECTED,
              updatedAt: new Date(),
            };
            acceptedRequest = updated;
            return updated;
          }
          return req;
        })
      );

      if (action === "ACCEPT" && acceptedRequest) {
        const user = getUserById(acceptedRequest.professionalId);
        const patient = getPatientById(acceptedRequest.patientId);
        if (user && patient) {
          setCaseProfessionals((prev) => [
            ...prev,
            {
              id: `cp-${Date.now()}`,
              patientId: patient.id,
              userId: user.id,
              user,
              roleInCase: "Profissional da Rede",
              isActive: true,
              origin: acceptedRequest?.origin ?? LinkRequestOrigin.FAMILY,
              startDate: new Date(),
            },
          ]);
          setPatients((prev) => {
            if (prev.find((p) => p.id === patient.id)) return prev;
            return [...prev, patient];
          });
        }
      }
    },
    []
  );

  const addLinkRequest = useCallback(
    (patientId: string, professionalId: string, origin: LinkRequestOrigin) => {
      setLinkRequests((prev) => [
        ...prev,
        {
          id: `lr-${Date.now()}`,
          patientId,
          professionalId,
          origin,
          status: LinkRequestStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    },
    []
  );

  const getMarketplaceProfessionals = useCallback(() => {
    return professionalProfiles.filter((p) => p.appearInMarketplace);
  }, [professionalProfiles]);

  const getProfessionalProfileByUserId = useCallback(
    (userId: string) => professionalProfiles.find((p) => p.userId === userId),
    [professionalProfiles]
  );

  const updateProfessionalProfile = useCallback(
    (profile: ProfessionalProfile) => {
      setProfessionalProfiles((prev) => {
        const existing = prev.find((p) => p.userId === profile.userId);
        if (existing) {
          return prev.map((p) => (p.userId === profile.userId ? profile : p));
        }
        return [...prev, profile];
      });
    },
    []
  );

  // ============================================================================
  // VALOR DO CONTEXT
  // ============================================================================

  const value: ClinicalContextValue = {
    session,
    currentUser,
    patients,
    getPatientSummary,
    sessions,
    getSessionsByPatient: getSessionsByPatientLocal,
    addSession,
    objectives,
    getObjectivesByPatient: getObjectivesByPatientLocal,
    activities,
    activityExecutions,
    getTimelineEvents,
    getCommentsBySession: getCommentsBySessionLocal,
    addComment,
    linkRequests,
    respondLinkRequest,
    addLinkRequest,
    getMarketplaceProfessionals,
    getProfessionalProfileByUserId,
    updateProfessionalProfile,
    getNetworkForPatient,
  };

  return <ClinicalContext.Provider value={value}>{children}</ClinicalContext.Provider>;
}

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

export function useClinical() {
  const context = useContext(ClinicalContext);

  if (!context) {
    throw new Error("useClinical must be used within ClinicalProvider");
  }

  return context;
}
