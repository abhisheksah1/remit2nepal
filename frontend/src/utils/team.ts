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
  return { board, team: [...leads, ...staff], leads, staff };
}

export function personInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
