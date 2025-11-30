"use client";

import { useClinical } from "@/components/clinical-provider";
import { MOCK_ORGANIZATIONS, MOCK_ORGANIZATION_USERS, MOCK_USERS } from "@/lib/clinical-data";
import { OrgType } from "@/lib/types/clinical";

const ORG_TYPE_LABELS: Record<OrgType, string> = {
  [OrgType.CLINIC]: "Clínica",
  [OrgType.SCHOOL]: "Escola",
  [OrgType.HOSPITAL]: "Hospital",
  [OrgType.PRIVATE_PRACTICE]: "Consultório Particular",
  [OrgType.OTHER]: "Outro",
};

export default function OrganizationsPage() {
  const { currentUser, patients } = useClinical();

  // Obter organizações do usuário
  const userOrgs = MOCK_ORGANIZATION_USERS.filter((ou) => ou.userId === currentUser?.id).map(
    (ou) => {
      const org = MOCK_ORGANIZATIONS.find((o) => o.id === ou.organizationId);
      return { ...ou, organization: org };
    }
  );

  // Para cada organização, obter membros
  const orgsWithMembers = userOrgs.map((userOrg) => {
    if (!userOrg.organization) return null;

    const members = MOCK_ORGANIZATION_USERS.filter(
      (ou) => ou.organizationId === userOrg.organization!.id
    ).map((ou) => {
      const user = MOCK_USERS.find((u) => u.id === ou.userId);
      return { ...ou, user };
    });

    const professionals = members.filter((m) => m.role === "PROFESSIONAL");
    const admins = members.filter((m) => m.role === "ADMIN");

    return {
      ...userOrg.organization,
      role: userOrg.role,
      totalMembers: members.length,
      professionals: professionals.length,
      admins: admins.length,
      members,
    };
  }).filter((o) => o !== null);

  const getOrgIcon = (type: OrgType) => {
    switch (type) {
      case OrgType.CLINIC:
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case OrgType.SCHOOL:
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      case OrgType.HOSPITAL:
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case OrgType.PRIVATE_PRACTICE:
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Organizações</h1>
        <p className="mt-1 text-gray-600">
          Gerenciamento de clínicas, escolas e equipes multidisciplinares
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="text-3xl font-bold">{orgsWithMembers.length}</div>
          <div className="text-sm text-indigo-100 font-medium">Organizações</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-sm border border-blue-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {orgsWithMembers.reduce((sum, org) => sum + org.totalMembers, 0)}
          </div>
          <div className="text-sm text-blue-100 font-medium">Membros Total</div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 text-white shadow-sm border border-indigo-200">
          <div className="mb-3">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            {orgsWithMembers.reduce((sum, org) => sum + org.professionals, 0)}
          </div>
          <div className="text-sm text-indigo-100 font-medium">Profissionais</div>
        </div>
      </div>

      {/* Lista de Organizações */}
      {orgsWithMembers.map((org) => (
        <div key={org.id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                {getOrgIcon(org.type)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{org.name}</h2>
                <div className="mt-1 flex items-center gap-3">
                  <span className="rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 border border-indigo-200">
                    {ORG_TYPE_LABELS[org.type]}
                  </span>
                  <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 border border-gray-200">
                    {org.role === "ADMIN" ? "Administrador" : "Profissional"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas da Organização */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="rounded-md bg-indigo-50 p-4 border border-indigo-200">
              <div className="text-sm text-gray-700 font-medium">Total de Membros</div>
              <div className="mt-1 text-2xl font-bold text-indigo-700">{org.totalMembers}</div>
            </div>
            <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
              <div className="text-sm text-gray-700 font-medium">Profissionais</div>
              <div className="mt-1 text-2xl font-bold text-blue-700">{org.professionals}</div>
            </div>
            <div className="rounded-md bg-indigo-50 p-4 border border-indigo-200">
              <div className="text-sm text-gray-700 font-medium">Administradores</div>
              <div className="mt-1 text-2xl font-bold text-indigo-700">{org.admins}</div>
            </div>
            <div className="rounded-md bg-gray-50 p-4 border border-gray-200">
              <div className="text-sm text-gray-700 font-medium">Pacientes Ativos</div>
              <div className="mt-1 text-2xl font-bold text-gray-700">
                {patients.filter((p) => p.organizationId === org.id).length}
              </div>
            </div>
          </div>

          {/* Membros da Equipe */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Equipe</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {org.members
                .filter((m) => m.user)
                .map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-md border border-gray-200 p-3 hover:border-indigo-300 transition"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{member.user!.name}</p>
                      <p className="text-xs text-gray-600">{member.user!.email}</p>
                      <span
                        className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium border ${
                          member.role === "ADMIN"
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                      >
                        {member.role === "ADMIN" ? "Admin" : "Profissional"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Ações */}
          {org.role === "ADMIN" && (
            <div className="mt-6 flex gap-3">
              <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition border border-indigo-700">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Membro
                </span>
              </button>
              <button className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition border border-gray-300">
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Configurações
                </span>
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Criar Nova Organização */}
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 p-8 text-center shadow-sm border border-indigo-200">
        <div className="mb-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">Criar Nova Organização</h3>
        <p className="mb-4 text-sm text-gray-600">
          Configure uma nova clínica, escola ou equipe multidisciplinar
        </p>
        <button className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700 transition border border-indigo-700">
          Criar Organização
        </button>
      </div>
    </div>
  );
}
