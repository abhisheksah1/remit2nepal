import type { WhyItem } from "@/types/content";

export const ABOUT_DEFAULTS = {
  heroKicker: "About Remit2Nepal",
  heroTitle: "Receiving from abroad. // Paying families in Nepal.",
  heroDescription:
    "Remit2Nepal receives remittance sent from overseas and pays families in Nepal. Collect as cash pickup, bank deposit, or wallet.",
  heroPrimaryLabel: "Track",
  heroPrimaryUrl: "/track",
  heroSecondaryLabel: "Learn More About Us",
  heroSecondaryUrl: "#who-we-are",
  storyKicker: "Our story",
  storyHeading: "Who We Are",
  introduction:
    "Remit2Nepal is a remittance receiving company in Nepal. We pay out money that families receive from relatives working abroad — as cash pickup, bank deposit, or wallet across the country.",
  whoBody:
    "Our work starts when a transfer is sent from overseas. We identify the payout, confirm the beneficiary, and complete the payment in Nepal with published rates and clear branch hours.",
  whoHighlights: [
    { title: "Nationwide payout", description: "", icon: "globe" },
    { title: "Cash, bank, and wallet", description: "", icon: "banknote" },
    { title: "Published rates", description: "", icon: "check" },
    { title: "Family first", description: "", icon: "heart" }
  ] as WhyItem[],
  missionKicker: "Purpose",
  missionHeading: "Our Mission",
  mission: "To receive remittance from abroad and pay families in Nepal quickly, clearly, and with care.",
  missionBody: "Every payout is a household waiting at home. We keep collection simple for beneficiaries in Nepal.",
  missionPoints: [
    { title: "Receive", description: "Accept transfers sent from overseas partners." },
    { title: "Pay out", description: "Cash pickup, bank deposit, or wallet in Nepal." },
    { title: "Care", description: "Staff who explain each step at the counter." }
  ] as WhyItem[],
  visionKicker: "Future",
  visionHeading: "Our Vision",
  vision: "To be the payout desk families in Nepal trust when money is sent from abroad.",
  visionBody:
    "We want every beneficiary in Nepal to collect with confidence — clear rates, a nearby desk, and a process that is easy to follow.",
  visionChips: ["Payout in Nepal", "Sent from abroad", "Families first"],
  whyKicker: "Why Remit2Nepal",
  whyHeading: "Why Choose Us?",
  whySubheading: "Remit2Nepal receives remittance from abroad and pays it to families across Nepal.",
  whyItems: [
    { title: "Fast payout", description: "Collect the same day when the transfer is ready.", icon: "zap" },
    { title: "Secure collection", description: "ID checks at the counter before we pay.", icon: "shield" },
    { title: "Clear rates", description: "Published NPR rates you can check before you collect.", icon: "banknote" },
    { title: "Easy to collect", description: "Branch, agent, bank deposit, or wallet.", icon: "sparkles" },
    { title: "Trusted desk", description: "Staff who explain each step at payout.", icon: "check" },
    { title: "Built for Nepal", description: "A receiving network across the country.", icon: "globe" }
  ] as WhyItem[],
  valuesKicker: "Culture",
  valuesHeading: "What We Stand For",
  valuesSubheading: "Our values guide every decision we make and every payout we complete.",
  coreValues: [
    { title: "Trust", description: "We build lasting relationships through honesty, transparency, and reliability.", icon: "shield" },
    { title: "Security", description: "We take the protection of your money and information seriously.", icon: "lock" },
    { title: "Customer First", description: "Your needs and experience are at the center of everything we do.", icon: "heart" },
    { title: "Innovation", description: "We continuously improve our technology and services to make collection in Nepal clearer.", icon: "sparkles" },
    { title: "Transparency", description: "We believe customers deserve clear information and straightforward transactions.", icon: "check" },
    { title: "Community", description: "We help strengthen connections between families abroad and homes in Nepal.", icon: "users" }
  ] as WhyItem[],
  stepsKicker: "How we work",
  stepsHeading: "Receive. // Confirm. // Pay out.",
  steps: [
    { title: "Sent abroad", description: "A relative or partner sends the transfer from overseas." },
    { title: "We receive it", description: "Remit2Nepal receives the payout instruction in Nepal." },
    { title: "Confirm", description: "The beneficiary is identified before payment." },
    { title: "Collect", description: "Cash pickup, bank deposit, or wallet — paid out in NPR." }
  ] as WhyItem[],
  teamKicker: "Team work",
  teamAboutKicker: "Team work",
  teamAboutHeading: "Together, We Make a Difference",
  teamDescription:
    "Great service starts with great people. Our team runs the payout desk, branches, and partner corridors so families in Nepal can collect remittance sent from abroad.",
  teamAboutIntro:
    "Great service starts with great people. Our team runs the payout desk, branches, and partner corridors so families in Nepal can collect remittance sent from abroad.",
  teamAboutBody:
    "We work together across the receiving network to complete payouts, support beneficiaries, and keep collection in Nepal clear and dependable.",
  teamMotto: "One Team • One Goal • Families in Nepal",
  teamAboutLinkLabel: "Meet the full team",
  teamAboutLinkUrl: "/about/team",
  commitmentKicker: "Promise",
  commitmentHeading: "Our Commitment to You",
  commitmentBody:
    "Your trust means everything to us. We are committed to a clear, dependable payout experience for families collecting remittance in Nepal.",
  commitmentItems: ["Security", "Transparency", "Reliability", "Customer Support", "Continuous Innovation"],
  storyBandKicker: "Every payout",
  storyBandHeading: "Because Every Transfer Has a Story.",
  storyBandBody:
    "Behind every payout is a family in Nepal waiting on money sent from abroad. We help make those connections possible — one collection at a time.",
  ctaHeading: "Collect in Nepal. Stay connected.",
  ctaBody: "Ask about a payout, branch hours, or today’s rate. Remit2Nepal receives remittance sent from abroad.",
  ctaPrimaryLabel: "Track",
  ctaPrimaryUrl: "/track",
  ctaSecondaryLabel: "Contact Us",
  ctaSecondaryUrl: "/contact"
};

const SEED_LINES = new Set([
  "Our institution",
  "Built for families who wait on a transfer",
  "Licensed remittance for people sending from abroad and families receiving across Nepal.",
  "Remit2Nepal is a regulated remittance company connecting overseas earners with families across Nepal. We operate a documented payout network, publish exchange rates with NRB comparison, and keep licenses visible to the public.",
  "Move money with care, speed, and accountability.",
  "To be Nepal's most trusted remittance institution.",
  "The company",
  "Who we are",
  "Connecting People. // Moving Money. // Building Trust.",
  "We make international money transfers simple, secure, fast, and accessible—helping people stay connected with the ones who matter most, wherever they are in the world.",
  "Send Money",
  "We are a trusted remittance company dedicated to making international money transfers easier, faster, and more reliable. Our goal is to remove the complexity from sending money across borders and provide a seamless experience for individuals, families, businesses, and communities.",
  "With technology, transparency, and customer care at the heart of everything we do, we help people send money with confidence and stay connected across countries.",
  "Our mission is to make cross-border money transfers simple, secure, and accessible for everyone. We work to deliver a reliable remittance experience powered by modern technology, transparent processes, and exceptional customer service.",
  "We believe sending money should be more than a transaction—it should be a simple way to support families, build opportunities, and stay connected.",
  "Our vision is to create a world where sending money across borders is effortless, trusted, and accessible to everyone.",
  "We aspire to become a leading remittance partner by combining innovative technology, human-centered service, and a commitment to transparency—making global financial connections easier for millions of people.",
  "Everything we do is designed around one simple goal: making your money transfer experience safer, faster, and easier.",
  "Great service starts with great people. Our team brings together technology, financial expertise, customer service, and a shared commitment to making international money transfers better.",
  "We work together across teams and borders to create simple solutions, solve problems, support our customers, and continuously improve the way money moves around the world.",
  "One Team • One Goal • Global Impact",
  "Move Money. Stay Connected.",
  "Experience a simpler, safer, and more reliable way to send money across borders.",
  "Simple. // Secure. // Seamless.",
  "Licensed operations, a nationwide payout desk, and rates you can check against NRB."
]);

function plain(value: string | undefined) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isOutboundCopy(text: string) {
  return /send money across borders|sending money across borders|send money quickly|people send money with confidence|way to send money|amount you want to send|preferred payment method|international money transfers simpler|You send from abroad/i.test(
    text
  );
}

export function aboutLine(value: string | undefined, fallback: string) {
  const text = plain(value);
  if (!text || SEED_LINES.has(text) || isOutboundCopy(text)) return fallback;
  return text;
}

function filledList<T>(value: T[] | undefined, hasContent: (item: T) => boolean) {
  return (value ?? []).filter(hasContent);
}

export function aboutList<T>(value: T[] | undefined, fallback: T[]) {
  const list = filledList(value, (item) => {
    if (typeof item === "string") return item.trim().length > 0;
    if (item && typeof item === "object" && "title" in item) {
      return String((item as { title?: string }).title || "").trim().length > 0;
    }
    return true;
  });
  return list.length ? list : fallback;
}

function listTitles(items?: WhyItem[]) {
  return filledList(items, (item) => Boolean(item.title?.trim()))
    .map((item) => item.title.trim().toLowerCase())
    .join(",");
}

export function isSeedCoreValues(values?: WhyItem[]) {
  const titles = listTitles(values);
  return !titles || titles === "integrity,security,access";
}

export function isSeedWhyItems(items?: WhyItem[]) {
  const titles = listTitles(items);
  return !titles || titles === "fast transfers,secure & protected,transparent pricing,easy to use,trusted service,global reach";
}

export function isSeedSteps(steps?: WhyItem[]) {
  const titles = listTitles(steps);
  return !titles || titles === "start,verify,send,connect";
}

export function isSeedWhoHighlights(items?: WhyItem[]) {
  const titles = listTitles(items);
  return !titles || titles === "fast & reliable transfers,secure transactions,global connectivity,customer first";
}

export function isSeedMissionPoints(items?: WhyItem[]) {
  const titles = listTitles(items);
  return !titles || titles === "simple,secure,reliable";
}

export function aboutValues(values: WhyItem[] | undefined, fallback: WhyItem[]) {
  return isSeedCoreValues(values) ? fallback : aboutList(values, fallback);
}

export function aboutWhy(items: WhyItem[] | undefined, fallback: WhyItem[]) {
  return isSeedWhyItems(items) ? fallback : aboutList(items, fallback);
}

export function aboutSteps(items: WhyItem[] | undefined, fallback: WhyItem[]) {
  return isSeedSteps(items) ? fallback : aboutList(items, fallback);
}

export function aboutHighlights(items: WhyItem[] | undefined, fallback: WhyItem[]) {
  return isSeedWhoHighlights(items) ? fallback : aboutList(items, fallback);
}

export function aboutMissionPoints(items: WhyItem[] | undefined, fallback: WhyItem[]) {
  return isSeedMissionPoints(items) ? fallback : aboutList(items, fallback);
}

export function aboutChips(value: string[] | undefined, fallback: string[]) {
  const list = (value ?? []).map((item) => item.trim()).filter(Boolean);
  if (!list.length || list.join(",") === "Global Access,Smart Technology,Stronger Connections") return fallback;
  return list;
}
