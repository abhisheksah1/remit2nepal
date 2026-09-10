export const defaultCurrencies = [
  { code: "USD", name: "U.S. Dollar", symbol: "$", country: "United States", flag: "🇺🇸", unit: 1, displayOrder: 1 },
  { code: "EUR", name: "European Euro", symbol: "€", country: "Eurozone", flag: "🇪🇺", unit: 1, displayOrder: 2 },
  { code: "GBP", name: "UK Pound Sterling", symbol: "£", country: "United Kingdom", flag: "🇬🇧", unit: 1, displayOrder: 3 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", country: "United Arab Emirates", flag: "🇦🇪", unit: 1, displayOrder: 4 },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق", country: "Qatar", flag: "🇶🇦", unit: 1, displayOrder: 5 },
  { code: "SAR", name: "Saudi Arabian Riyal", symbol: "ر.س", country: "Saudi Arabia", flag: "🇸🇦", unit: 1, displayOrder: 6 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", country: "Australia", flag: "🇦🇺", unit: 1, displayOrder: 7 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", country: "India", flag: "🇮🇳", unit: 100, displayOrder: 8 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", country: "Japan", flag: "🇯🇵", unit: 10, displayOrder: 9 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", country: "Malaysia", flag: "🇲🇾", unit: 1, displayOrder: 10 }
];

export const defaultNavigation = [
  { label: "Home", path: "/", displayOrder: 1, location: "HEADER" },
  { label: "About Us", path: "/about", displayOrder: 2, location: "HEADER" },
  { label: "Services", path: "/services", displayOrder: 3, location: "HEADER" },
  { label: "Exchange Rate", path: "/exchange-rate", displayOrder: 4, location: "HEADER" },
  { label: "Our Agent", path: "/branches", displayOrder: 5, location: "HEADER" },
  { label: "Become a Agent", path: "/partners", displayOrder: 6, location: "HEADER" },
  { label: "News & Notices", path: "/news", displayOrder: 7, location: "HEADER" },
  { label: "FAQ", path: "/faq", displayOrder: 8, location: "HEADER" },
  { label: "Gallery", path: "/gallery", displayOrder: 9, location: "HEADER" },
  { label: "Contact Us", path: "/contact", displayOrder: 10, location: "HEADER" },
  { label: "Privacy Policy", path: "/privacy", displayOrder: 1, location: "FOOTER" },
  { label: "Terms of Service", path: "/terms", displayOrder: 2, location: "FOOTER" },
  { label: "Service Charge", path: "/service-charge", displayOrder: 3, location: "FOOTER" }
];

export const receivingHeroCopy = {
  heading: "Receiving from abroad. // Paying families in Nepal.",
  subheading: "Remittance receiving company in Nepal",
  description:
    "Remit2Nepal receives remittance sent from overseas and pays families in Nepal. Collect as cash pickup, bank deposit, or wallet.",
  buttonLabel: "Track",
  buttonUrl: "/track",
  secondaryButtonLabel: "How It Works",
  secondaryButtonUrl: "#how-it-works",
  items: [
    { title: "Cash pickup" },
    { title: "Bank deposit" },
    { title: "Wallet credit" },
    { title: "Nationwide payout" }
  ]
};

export const receivingRemittanceCopy = {
  heading: "Remittance to Nepal",
  subheading: "Sent from abroad. Collected in Nepal.",
  description:
    "When a transfer is sent from overseas, Remit2Nepal pays it out in Nepal as cash pickup, bank deposit, or wallet. Check today’s rate before you collect.",
  icon: "Receive in Nepal",
  buttonLabel: "View exchange rate",
  buttonUrl: "/exchange-rate",
  secondaryButtonLabel: "Our Agent",
  secondaryButtonUrl: "/branches",
  items: [
    { word: "REMITTANCE" },
    { title: "Bank deposit", description: "Credit to a Nepali bank account when the name and number match." },
    { title: "Cash pickup", description: "Collect at a Remit2Nepal branch or agent." },
    { title: "NPR payout", description: "Receive the amount in Nepali rupees." },
    { title: "Published rates", description: "See the rate on the exchange rate page before you collect." }
  ]
};

export const receivingWhyCopy = {
  heading: "Why families choose Remit2Nepal",
  icon: "Why Remit2Nepal",
  subheading: "Nationwide payout. Built for families.",
  items: [
    { title: "Secure", description: "Documented payout processes and protected customer data." },
    { title: "Fast", description: "Same-day payout corridors with live branch and partner status." },
    { title: "Reliable", description: "A nationwide payout map that still works when you need it most." },
    { title: "Nationwide Network", description: "Urban hubs and district branches across all seven provinces." },
    { title: "Competitive Rates", description: "Transparent buy/sell pricing with NRB comparison." },
    { title: "Trusted Service", description: "A receiving desk that pays families across Nepal." }
  ]
};

export const receivingPartnersCopy = {
  heading: "Global remittance partners",
  icon: "Our network",
  subheading: "हाम्रा विश्वव्यापी साझेदार",
  description: "Overseas partners send remittance. We pay families in Nepal.",
  buttonLabel: "Become a Agent",
  buttonUrl: "/partners",
  displayOrder: 5.5
};

export const receivingCompanyCopy = {
  tagline: "Remitting Happiness...",
  footerAbout:
    "Remit2Nepal is a remittance receiving company in Nepal. Transfers sent from abroad are paid out here as cash pickup, bank deposit, or wallet."
};

export const receivingSeoCopy = {
  siteTitle: "Remit2Nepal | Remittance receiving in Nepal",
  metaDescription:
    "Remit2Nepal receives remittance sent from abroad and pays families in Nepal through cash pickup, bank deposit, and wallet, with published NRB-referenced rates.",
  keywords: "remittance, Nepal, receive, payout, cash pickup, bank deposit, wallet"
};

export const receivingAboutCopy = {
  introduction:
    "Remit2Nepal is a remittance receiving company in Nepal. We pay out money that families receive from relatives working abroad — as cash pickup, bank deposit, or wallet across the country.",
  whoBody:
    "Our work starts when a transfer is sent from overseas. We identify the payout, confirm the beneficiary, and complete the payment in Nepal with published rates and clear branch hours.",
  whoHighlights: [
    { title: "Nationwide payout", description: "", icon: "globe" },
    { title: "Cash, bank, and wallet", description: "", icon: "banknote" },
    { title: "Published rates", description: "", icon: "check" },
    { title: "Family first", description: "", icon: "heart" }
  ],
  mission:
    "To receive remittance from abroad and pay families in Nepal quickly, clearly, and with care.",
  missionBody:
    "Every payout is a household waiting at home. We keep collection simple for beneficiaries in Nepal.",
  missionPoints: [
    { title: "Receive", description: "Accept transfers sent from overseas partners." },
    { title: "Pay out", description: "Cash pickup, bank deposit, or wallet in Nepal." },
    { title: "Care", description: "Staff who explain each step at the counter." }
  ],
  vision:
    "To be the payout desk families in Nepal trust when money is sent from abroad.",
  visionBody:
    "We want every beneficiary in Nepal to collect with confidence — clear rates, a nearby desk, and a process that is easy to follow.",
  visionChips: ["Payout in Nepal", "Sent from abroad", "Families first"],
  whySubheading:
    "Remit2Nepal receives remittance from abroad and pays it to families across Nepal.",
  whyItems: [
    { title: "Fast payout", description: "Collect the same day when the transfer is ready.", icon: "zap" },
    { title: "Secure collection", description: "ID checks at the counter before we pay.", icon: "shield" },
    { title: "Clear rates", description: "Published NPR rates you can check before you collect.", icon: "banknote" },
    { title: "Easy to collect", description: "Branch, agent, bank deposit, or wallet.", icon: "sparkles" },
    { title: "Trusted desk", description: "Staff who explain each step at payout.", icon: "check" },
    { title: "Built for Nepal", description: "A receiving network across the country.", icon: "globe" }
  ],
  heroTitle: "Receiving from abroad. // Paying families in Nepal.",
  heroDescription:
    "Remit2Nepal receives remittance sent from overseas and pays families in Nepal. Collect as cash pickup, bank deposit, or wallet.",
  heroPrimaryLabel: "Track",
  heroPrimaryUrl: "/track",
  steps: [
    { title: "Sent abroad", description: "A relative or partner sends the transfer from overseas." },
    { title: "We receive it", description: "Remit2Nepal receives the payout instruction in Nepal." },
    { title: "Confirm", description: "The beneficiary is identified before payment." },
    { title: "Collect", description: "Cash pickup, bank deposit, or wallet — paid out in NPR." }
  ],
  teamAboutIntro:
    "Great service starts with great people. Our team runs the payout desk, branches, and partner corridors so families in Nepal can collect remittance sent from abroad.",
  teamAboutBody:
    "We work together across the receiving network to complete payouts, support beneficiaries, and keep collection in Nepal clear and dependable.",
  teamMotto: "One Team • One Goal • Families in Nepal",
  ctaHeading: "Collect in Nepal. Stay connected.",
  ctaBody: "Ask about a payout, branch hours, or today’s rate. Remit2Nepal receives remittance sent from abroad.",
  ctaPrimaryLabel: "Track",
  ctaPrimaryUrl: "/track",
  bestOfSubheading: "A nationwide payout desk and rates you can check against NRB.",
  chairmanMessage:
    "<p>Trust is earned in every payout. We built Remit2Nepal around transparent rates and people who answer the phone.</p>",
  history:
    "<p>Founded to serve families in Nepal who receive remittance from relatives working abroad, Remit2Nepal expanded from Kathmandu into a nationwide branch and partner payout network.</p>"
};

export const defaultSections = [
  {
    key: "hero",
    type: "HERO",
    ...receivingHeroCopy,
    backgroundUrl: "",
    overlay: true,
    displayOrder: 1
  },
  {
    key: "stats",
    type: "STATS",
    heading: "A nationwide payout network for remittance from abroad",
    displayOrder: 2,
    items: [
      { label: "Years of Experience", value: "18+" },
      { label: "Branches", value: "120+" },
      { label: "Countries Served", value: "25" },
      { label: "Customers", value: "1.2M+" },
      { label: "Partners", value: "40+" }
    ]
  },
  {
    key: "services",
    type: "SERVICES",
    heading: "How families collect remittance in Nepal",
    icon: "What we do",
    subheading: "Cash pickup, bank deposit, and wallet payout for transfers sent from abroad.",
    buttonLabel: "All services",
    buttonUrl: "/services",
    displayOrder: 3
  },
  {
    key: "rates",
    type: "RATES",
    heading: "Today's exchange rates",
    subheading: "Official NRB reference with company customer rates.",
    buttonLabel: "Full rate table",
    buttonUrl: "/exchange-rate",
    displayOrder: 4
  },
  {
    key: "remittance-stage",
    type: "REMITTANCE",
    ...receivingRemittanceCopy,
    overlay: true,
    alignment: "center",
    displayOrder: 4.5
  },
  {
    key: "why",
    type: "WHY_CHOOSE",
    ...receivingWhyCopy,
    displayOrder: 5
  },
  {
    key: "nepal-people",
    type: "NEPAL_MAP",
    heading: "People and families across Nepal",
    subheading: "Money sent from abroad. Families collecting at home — from the Himalaya to the Terai.",
    description: "",
    icon: "Our Nepal",
    backgroundUrl: "",
    overlay: false,
    alignment: "center",
    buttonLabel: "View gallery",
    buttonUrl: "/gallery",
    enabled: false,
    displayOrder: 6,
    items: [
      { imageUrl: "/images/nepal-map/scene-office.svg", alt: "Nepali professional on a call", title: "Working abroad" },
      { imageUrl: "/images/nepal-map/scene-family.svg", alt: "Nepali mother and child at home", title: "Family in Nepal" },
      { imageUrl: "/images/nepal-map/scene-worker.svg", alt: "Nepali industrial worker", title: "Building Nepal" },
      { imageUrl: "/images/nepal-map/scene-payout.svg", alt: "Receiving remittance in Nepal", title: "Funds received" }
    ]
  },
  {
    key: "partners",
    type: "PARTNERS",
    ...receivingPartnersCopy
  },
  {
    key: "news",
    type: "NEWS",
    heading: "News and notices",
    icon: "Desk",
    subheading: "Published for families and agents.",
    buttonLabel: "All notices",
    buttonUrl: "/news",
    displayOrder: 11
  },
  {
    key: "testimonials",
    type: "TESTIMONIALS",
    heading: "Stories from the corridor",
    icon: "Testimonials",
    subheading: "Families who send from abroad. Families who collect in Nepal.",
    alignment: "center",
    displayOrder: 8,
    items: [
      {
        name: "Sita Gurung",
        title: "Receiver",
        location: "Pokhara",
        headline: "The money reached home the same afternoon.",
        headlineNe: "सोही दिन दिउँसो पैसा घर आयो।",
        quote: "I did not have to wait at the branch twice. The payout was ready, and the staff explained every step.",
        quoteNe: "शाखामा दुईपटक कुर्नु परेन। पैसा तयार थियो र कर्मचारीले हरेक चरण स्पष्टसँग बुझाए।",
        imageUrl: "/images/testimonials/portrait-sita.svg"
      },
      {
        name: "Ramesh Adhikari",
        title: "Sender",
        location: "Doha to Kathmandu",
        headline: "What I saw on the rate page is what my family received.",
        headlineNe: "दर पृष्ठमा देखेको रकम परिवारले पायो।",
        quote: "I checked the published rate before I sent. There was no surprise at the counter in Kathmandu.",
        quoteNe: "पठाउनुअघि प्रकाशित दर हेरेँ। काठमाडौं काउन्टरमा कुनै अनपेक्षित कुरा भएन।",
        imageUrl: "/images/testimonials/portrait-ramesh.svg"
      },
      {
        name: "Amina Khatun",
        title: "Receiver",
        location: "Biratnagar",
        headline: "The agent called the moment the transfer was ready.",
        headlineNe: "ट्रान्सफर तयार हुनेबित्तिकै एजेन्टले फोन गरे।",
        quote: "Clear, fast, and close to home. I collected the funds the same day.",
        quoteNe: "छिटो, स्पष्ट र घर नजिक। सोही दिन रकम बुझिलिएँ।",
        imageUrl: "/images/testimonials/portrait-amina.svg"
      }
    ]
  },
  {
    key: "branches",
    type: "BRANCH_FINDER",
    heading: "Find a branch near you",
    subheading: "Search by province, district, city, or branch name.",
    displayOrder: 9
  },
  {
    key: "cta",
    type: "CONTACT_CTA",
    heading: "Need help with a payout?",
    description: "Our desk assists with branch hours, collection questions, and corporate remittance into Nepal.",
    buttonLabel: "Contact Us",
    buttonUrl: "/contact",
    displayOrder: 10
  }
];

export const defaultServices = [
  {
    title: "International Remittance",
    slug: "international-remittance",
    shortDescription: "Inbound remittance from overseas corridors, paid out in Nepal.",
    fullDescription: "<p>Remit2Nepal receives transfers sent from abroad and pays beneficiaries in Nepal with identification and payout tracking.</p>",
    icon: "globe",
    accentColor: "#F5A623",
    features: ["Inbound corridors", "ID verification", "Payout tracking"],
    countryAvailability: ["UAE", "Qatar", "Saudi Arabia", "Malaysia", "UK", "USA", "Australia"],
    displayOrder: 1
  },
  {
    title: "Money Transfer",
    slug: "money-transfer",
    shortDescription: "Person-to-person remittance into Nepal with SMS notification and receipt copies.",
    fullDescription: "<p>Simple inbound money transfer with reference numbers and beneficiary verification at payout.</p>",
    icon: "send",
    accentColor: "#6D28D9",
    features: ["Reference number", "SMS alert", "Beneficiary check"],
    displayOrder: 2
  },
  {
    title: "Cash Pickup",
    slug: "cash-pickup",
    shortDescription: "Collect cash at Remit2Nepal branches with original ID.",
    fullDescription: "<p>Walk-in cash payout during published branch hours.</p>",
    icon: "banknote",
    accentColor: "#2E3192",
    features: ["Same-day payout", "ID required", "Nationwide branches"],
    displayOrder: 3
  },
  {
    title: "Bank Deposit",
    slug: "bank-deposit",
    shortDescription: "Direct credit to Nepali bank accounts through partner banks.",
    fullDescription: "<p>Deposit to commercial bank accounts with account-name matching.</p>",
    icon: "building-2",
    accentColor: "#E31E24",
    features: ["Account credit", "Name match", "Partner banks"],
    displayOrder: 4
  },
  {
    title: "Mobile Wallet Transfer",
    slug: "mobile-wallet-transfer",
    shortDescription: "Payout to supported digital wallets where available.",
    fullDescription: "<p>Wallet payout for customers who prefer digital collection.</p>",
    icon: "smartphone",
    accentColor: "#0EA5E9",
    features: ["Digital payout", "Supported wallets", "Transaction SMS"],
    displayOrder: 5
  },
  {
    title: "Corporate Remittance",
    slug: "corporate-remittance",
    shortDescription: "Payroll and vendor payouts for companies with dedicated operations support.",
    fullDescription: "<p>Bulk payouts, reporting, and relationship management for employers.</p>",
    icon: "briefcase",
    accentColor: "#059669",
    features: ["Bulk payout", "Reporting", "Relationship manager"],
    displayOrder: 6
  }
];

export const defaultBranches = [
  {
    name: "Kathmandu Central",
    branchCode: "KTM-001",
    province: "Bagmati",
    district: "Kathmandu",
    municipality: "Kathmandu Metropolitan City",
    city: "Kathmandu",
    address: "New Baneshwor, Kathmandu",
    phone: "+977-1-5550101",
    email: "kathmandu@remit2nepal.com",
    googleMapUrl: "https://maps.google.com/?q=New+Baneshwor+Kathmandu",
    latitude: 27.6915,
    longitude: 85.342,
    managerName: "Sita Sharma",
    servicesAvailable: ["Cash Pickup", "Bank Deposit", "Corporate Remittance"],
    displayOrder: 1
  },
  {
    name: "Pokhara Lakeside",
    branchCode: "PKR-002",
    province: "Gandaki",
    district: "Kaski",
    municipality: "Pokhara Metropolitan City",
    city: "Pokhara",
    address: "Lakeside Road, Pokhara",
    phone: "+977-61-555202",
    email: "pokhara@remit2nepal.com",
    googleMapUrl: "https://maps.google.com/?q=Lakeside+Pokhara",
    managerName: "Bikash Gurung",
    servicesAvailable: ["Cash Pickup", "Bank Deposit"],
    displayOrder: 2
  },
  {
    name: "Biratnagar Main",
    branchCode: "BRT-003",
    province: "Koshi",
    district: "Morang",
    municipality: "Biratnagar Metropolitan City",
    city: "Biratnagar",
    address: "Main Road, Biratnagar",
    phone: "+977-21-555303",
    email: "biratnagar@remit2nepal.com",
    googleMapUrl: "https://maps.google.com/?q=Biratnagar",
    managerName: "Anil Karki",
    servicesAvailable: ["Cash Pickup", "Mobile Wallet Transfer"],
    displayOrder: 3
  },
  {
    name: "Butwal Highway",
    branchCode: "BTL-004",
    province: "Lumbini",
    district: "Rupandehi",
    municipality: "Butwal Sub-Metropolitan City",
    city: "Butwal",
    address: "Traffic Chowk, Butwal",
    phone: "+977-71-555404",
    email: "butwal@remit2nepal.com",
    googleMapUrl: "https://maps.google.com/?q=Butwal",
    managerName: "Nabin Thapa",
    servicesAvailable: ["Cash Pickup", "Bank Deposit"],
    displayOrder: 4
  }
];

export const defaultFaqs = [
  {
    question: "What identification is required for cash pickup?",
    answer: "<p>Bring original government-issued photo ID that matches the beneficiary name on the transfer.</p>",
    category: "Payout",
    displayOrder: 1
  },
  {
    question: "How often are exchange rates updated?",
    answer: "<p>Official NRB rates are synchronized from Nepal Rastra Bank. Company customer rates may be adjusted by authorized administrators and are historically tracked.</p>",
    category: "Rates",
    displayOrder: 2
  },
  {
    question: "Can I deposit directly to a bank account?",
    answer: "<p>Yes. Bank deposit is available through partner banks when account name and number are provided correctly.</p>",
    category: "Services",
    displayOrder: 3
  },
  {
    question: "What if a branch is closed?",
    answer: "<p>Check the branch page for opening hours and weekly holiday, or use another nearby branch from the finder.</p>",
    category: "Branches",
    displayOrder: 4
  }
];

export const defaultNews = [
  {
    title: "NRB rate desk now publishes company vs official comparison",
    titleNe: "एनआरबी दर डेस्कले कम्पनी र आधिकारिक दर तुलना सार्वजनिक गर्‍यो",
    slug: "nrb-rate-desk-comparison",
    punchLine: "Official NRB rates sit beside our customer rates — nothing hidden.",
    punchLineNe: "आधिकारिक एनआरबी दर र हाम्रो ग्राहक दर सँगै — केही लुकाइएको छैन।",
    summary: "Customers can view official NRB rates alongside Remit2Nepal customer rates.",
    summaryNe: "ग्राहकले नेपाल राष्ट्र बैंकको आधिकारिक दर र रेमिट२नेपालको ग्राहक दर सँगै हेर्न सक्छन्।",
    content: "<p>The public exchange-rate page now distinguishes official Nepal Rastra Bank rates from company customer rates.</p>",
    contentNe: "<p>सार्वजनिक विनिमय दर पृष्ठमा अब नेपाल राष्ट्र बैंकको आधिकारिक दर र कम्पनीको ग्राहक दर छुट्याएर देखाइन्छ।</p>",
    featuredImage: "/images/news/cover-rates.svg",
    category: "NEWS",
    status: "PUBLISHED",
    author: "Treasury Desk",
    publishedAt: new Date()
  },
  {
    title: "Dashain payout hours extended at selected branches",
    titleNe: "दशैंमा छानिएका शाखामा भुक्तानी समय थपियो",
    slug: "dashain-payout-hours",
    punchLine: "Festival hours, published before you travel.",
    punchLineNe: "चाडपर्वको समय यात्रा गर्नुअघि नै सार्वजनिक।",
    summary: "Selected high-volume branches will operate extended hours during the festival period.",
    summaryNe: "चाडपर्वको समयमा छानिएका व्यस्त शाखाले थप समयसम्म सेवा दिनेछन्।",
    content: "<p>Please check branch pages for holiday hours before travelling.</p>",
    contentNe: "<p>यात्रा गर्नुअघि शाखा पृष्ठमा बिदाको समय जाँच गर्नुहोस्।</p>",
    featuredImage: "/images/news/cover-hours.svg",
    category: "NOTICE",
    status: "PUBLISHED",
    author: "Operations",
    publishedAt: new Date()
  }
];

export const defaultBanners = [
  {
    title: "Cookies on this site",
    subtitle: "",
    body: "We store a small preference on this device so we do not keep showing the same notice.",
    imageUrl: "",
    altText: "",
    kind: "COOKIE",
    position: "BOTTOM",
    pageScope: "ALL",
    pagePath: "",
    linkUrl: "/privacy",
    buttonLabel: "Accept",
    secondaryButtonLabel: "Essential only",
    frequency: "ONCE",
    dismissible: true,
    status: "ACTIVE",
    displayOrder: 0
  }
];

export const defaultPartners = [
  { name: "Nepal Bank Limited", country: "Nepal", kind: "NATIONAL", description: "Payout and account credit partner.", website: "https://www.nepalbank.com.np", displayOrder: 1 },
  { name: "Nabil Bank", country: "Nepal", kind: "NATIONAL", description: "Bank deposit corridor partner.", website: "https://www.nabilbank.com", displayOrder: 2 },
  { name: "Global IME Bank", country: "Nepal", kind: "NATIONAL", description: "Nationwide account payout partner.", website: "https://www.globalimebank.com", displayOrder: 3 },
  { name: "Gulf Exchange", country: "United Arab Emirates", kind: "INTERNATIONAL", description: "Sending corridor partner from the UAE.", website: "", displayOrder: 4 },
  { name: "Qatar Exchange", country: "Qatar", kind: "INTERNATIONAL", description: "Sending corridor partner from Qatar.", website: "", displayOrder: 5 }
];
