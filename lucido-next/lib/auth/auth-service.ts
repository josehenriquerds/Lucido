// ============================================================================
// SERVIÇO DE AUTENTICAÇÃO MOCK (LocalStorage)
// ============================================================================

import { readStorage, writeStorage, removeStorage } from "../storage";
import { MOCK_USERS, getUserById } from "../clinical-data";
import type { User } from "../types/clinical";
import { GlobalRole } from "../types/clinical";

const AUTH_STORAGE_KEY = "lucido:clinical-auth";

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: GlobalRole;
  avatar?: string;
  loginAt: Date;
}

// ============================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================================

/**
 * Login com email e senha (mock - em produção, usar bcrypt e JWT)
 */
export function login(email: string, password: string): AuthSession | null {
  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    console.warn("[auth] Usuário não encontrado");
    return null;
  }

  // Mock: qualquer senha funciona (em produção, usar bcrypt.compare)
  // if (user.passwordHash !== hashPassword(password)) {
  //   return null;
  // }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.globalRole,
    avatar: user.avatar,
    loginAt: new Date(),
  };

  writeStorage(AUTH_STORAGE_KEY, session);

  return session;
}

/**
 * Logout - remove sessão do localStorage
 */
export function logout(): void {
  removeStorage(AUTH_STORAGE_KEY);
}

/**
 * Obtém a sessão atual do localStorage
 */
export function getSession(): AuthSession | null {
  const session = readStorage<AuthSession | null>(AUTH_STORAGE_KEY, null);

  if (!session) return null;

  // Verificar se usuário ainda existe (pode ter sido removido)
  const user = getUserById(session.userId);
  if (!user) {
    logout();
    return null;
  }

  return session;
}

/**
 * Verifica se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Obtém o usuário completo da sessão atual
 */
export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;

  return getUserById(session.userId) || null;
}

/**
 * Verifica se o usuário tem uma role específica
 */
export function hasRole(role: GlobalRole): boolean {
  const session = getSession();
  return session?.role === role;
}

/**
 * Verifica se o usuário é profissional
 */
export function isProfessional(): boolean {
  return hasRole(GlobalRole.PROFESSIONAL) || hasRole(GlobalRole.SYSTEM_ADMIN);
}

/**
 * Verifica se o usuário é responsável
 */
export function isGuardian(): boolean {
  return hasRole(GlobalRole.GUARDIAN);
}

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(): boolean {
  return hasRole(GlobalRole.SYSTEM_ADMIN);
}

// ============================================================================
// USUÁRIOS PRÉ-DEFINIDOS PARA TESTE
// ============================================================================

export const TEST_CREDENTIALS = {
  professional: {
    email: "dra.ana@clinica.com",
    password: "123456",
    name: "Dra. Ana Silva",
    role: "Psicóloga",
  },
  guardian: {
    email: "maria.santos@email.com",
    password: "123456",
    name: "Maria Santos",
    role: "Mãe de Pedro",
  },
  admin: {
    email: "admin@clinica.com",
    password: "123456",
    name: "Admin Clínica",
    role: "Administrador",
  },
} as const;
