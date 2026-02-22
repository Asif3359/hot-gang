/** Team member from Google Form → Sheet. Supports Jurcy/jersey Number, Name, Size, Phone Number */
export interface TeamMember {
  "Jurcy Number"?: string;
  "jersey Number"?: string;
  Name?: string;
  "Your Name (jersey name)"?: string;
  Size?: string; // XS, S, M, L, XL, XXL
  "Phone Number"?: string;
  [key: string]: string | undefined;
}

export function getJurcyNumber(m: TeamMember): string {
  return m["Jurcy Number"] ?? m["jersey Number"] ?? "—";
}

export function getName(m: TeamMember): string {
  return m.Name ?? m["Your Name (jersey name)"] ?? "—";
}

export function getSize(m: TeamMember): string {
  return m.Size ?? "—";
}

export function getPhone(m: TeamMember): string {
  return m["Phone Number"] ?? "—";
}
