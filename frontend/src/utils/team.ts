import type { TeamGroup, TeamMember, TeamTier } from "@/types/content";

export function resolveTeamGroup(member: TeamMember): TeamGroup {
  if (member.group === "BOARD" || member.group === "TEAM") return member.group;
  if (/chairman|chairperson|director|board/i.test(member.title)) return "BOARD";
  return "TEAM";
}

export function resolveTeamTier(member: TeamMember): TeamTier {
  if (member.tier === "LEAD" || member.tier === "STAFF") return member.tier;
  if (/chief|ceo|coo|cfo|manager|head\b|president|officer/i.test(member.title)) return "LEAD";
  return "STAFF";
}

export function groupTeam(members: TeamMember[]) {
  const board: TeamMember[] = [];
  const leads: TeamMember[] = [];
  const staff: TeamMember[] = [];
  for (const member of members) {
    if (resolveTeamGroup(member) === "BOARD") {
      board.push(member);
      continue;
    }
    if (resolveTeamTier(member) === "LEAD") leads.push(member);
    else staff.push(member);
  }
  board.sort((a, b) => a.displayOrder - b.displayOrder);
  leads.sort((a, b) => a.displayOrder - b.displayOrder);
  staff.sort((a, b) => a.displayOrder - b.displayOrder);
  return { board, team: [...leads, ...staff], leads, staff };
}

export function isTeamCeo(member: TeamMember) {
  return /\bceo\b|chief executive officer/i.test(member.title);
}

export function isBoardChair(member: TeamMember) {
  return /chairman|chairperson|^chair\b|chair of/i.test(member.title);
}

export function splitBoard(members: TeamMember[]) {
  const ordered = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
  const chair = ordered.find(isBoardChair) ?? ordered[0] ?? null;
  const rest = chair ? ordered.filter((member) => member !== chair) : ordered;
  return { chair, rest };
}

export function personInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
