export type SchoolPhase = "Primary" | "High" | "All";

const STOPWORDS = new Set([
  "all",
  "lead",
  "leads",
  "submission",
  "bb24",
  "campaign",
  "adset",
  "ad",
  "set",
  "broad",
  "retargeting",
  "remarketing",
  "lookalike",
  "messages",
  "message",
  "whatsapp",
  "traffic",
  "awareness",
  "conversion",
  "conversions",
  "enrolment",
  "enrollment",
  "enrolments",
  "enrollments",
]);

let knownSchools: string[] = [];

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeForCompare(value: string): string {
  return collapseSpaces(value)
    .toLowerCase()
    .replace(/^spark\s+/i, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function detectPhase(adsetName: string, school: string | null): SchoolPhase {
  const normalized = adsetName.toLowerCase();

  if (/\bprimary\b/i.test(normalized)) {
    return "Primary";
  }

  if (/\bhigh\b/i.test(normalized)) {
    return "High";
  }

  const primaryGradeSignal =
    /\br\s*[-–]\s*1\b|\br\s*to\s*1\b|\br1\b|\bgr\s*r\b|\bgrade\s*r\b|\bgr\s*[1-7]\b|\bgrade\s*[1-7]\b|\br\s*[-–]\s*7\b|\b1\s*[-–]\s*7\b/i.test(
      normalized,
    );

  if (primaryGradeSignal) {
    return "Primary";
  }

  const highGradeSignal =
    /\b8\s*[-–]\s*12\b|\bgr\s*(8|9|10|11|12)\b|\bgrade\s*(8|9|10|11|12)\b/i.test(normalized);

  if (highGradeSignal) {
    return "High";
  }

  if (school && /\bhigh\b/i.test(school)) {
    return "High";
  }

  return "Primary";
}

export function buildSchoolCatalog(adsetNames: string[]): string[] {
  const counts = new Map<string, number>();

  for (const originalName of adsetNames) {
    const normalized = normalizeForCompare(originalName);
    const sparkPattern = /(?:^|\b)spark\s+([a-z][a-z\s-]{1,80})/gi;
    const sparkMatches = [...normalizeForCompare(originalName).matchAll(sparkPattern)];

    for (const match of sparkMatches) {
      const phrase = collapseSpaces((match[1] || "").split(/[-|/]/)[0]);
      const tokens = phrase
        .split(" ")
        .filter((token) => token && !STOPWORDS.has(token) && !/^\d+$/.test(token));

      if (tokens.length > 0) {
        const candidate = toTitleCase(tokens.slice(0, 3).join(" "));
        counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
      }
    }

    const directTokens = normalized
      .split(/[|/,-]/)
      .map((part) => collapseSpaces(part))
      .filter(Boolean)
      .map((part) => part.replace(/^spark\s+/i, ""));

    for (const tokenPhrase of directTokens) {
      const tokens = tokenPhrase
        .split(" ")
        .filter((token) => token && !STOPWORDS.has(token) && !/^\d+$/.test(token));

      if (tokens.length >= 1 && tokens.length <= 3) {
        const candidate = toTitleCase(tokens.join(" "));
        if (!/^(Primary|High|General)$/i.test(candidate)) {
          counts.set(candidate, (counts.get(candidate) ?? 0) + 1);
        }
      }
    }
  }

  const candidates = [...counts.entries()]
    .filter(([name, count]) => count >= 1 && name.length >= 3)
    .map(([name]) => name);

  if (candidates.includes("Rivonia") && !candidates.includes("Rivonia High")) {
    candidates.push("Rivonia High");
  }

  return [...new Set(candidates)].sort((a, b) => b.length - a.length);
}

export function setKnownSchools(schools: string[]): void {
  knownSchools = [...new Set(schools)].sort((a, b) => b.length - a.length);
}

export function classifyMetaRow(adsetName: string): { school: string; phase: SchoolPhase } {
  const raw = collapseSpaces(adsetName);
  const compare = ` ${normalizeForCompare(raw)} `;

  let matchedSchool: string | null = null;

  for (const school of knownSchools) {
    const schoolKey = normalizeForCompare(school);
    const pattern = new RegExp(`\\b${schoolKey.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");

    if (pattern.test(compare)) {
      matchedSchool = school.replace(/^SPARK\s+/i, "").trim();
      break;
    }
  }

  const phase = detectPhase(raw, matchedSchool);

  if (!matchedSchool) {
    if (phase === "Primary" || phase === "High") {
      return { school: "General", phase };
    }

    return { school: "General", phase: "All" };
  }

  return {
    school: matchedSchool,
    phase,
  };
}
