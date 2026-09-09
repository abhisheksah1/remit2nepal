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

export const defaultSections = [
  {
    key: "hero",
    type: "HERO",
    heading: "Trusted remittance to every corner of Nepal",
    subheading: "Licensed. Secure. Nationwide.",
    description:
      "Remit2Nepal delivers regulated money transfer with transparent rates, verified branches, and a network built for families who depend on funds arriving on time.",
    backgroundUrl: "/images/send-remittance.png",
    overlay: true,
    buttonLabel: "View Exchange Rate",
    buttonUrl: "/exchange-rate",
    secondaryButtonLabel: "Our Agent",
    secondaryButtonUrl: "/branches",
    displayOrder: 1
  },
  {
    key: "stats",
    type: "STATS",
    heading: "A national payment network with global reach",
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
    heading: "Remittance services designed for real journeys",
    subheading: "From cash pickup in Kathmandu to bank deposit in a remote municipality.",
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
    heading: "Remittance to Nepal",
    subheading: "Earn abroad, support home — into NPR through a licensed nationwide payout network.",
    description: "Hover each letter. The word is the work: regulated corridors, published rates, and families waiting on the other side.",
    icon: "Licensed transfer",
    overlay: true,
    alignment: "center",
    buttonLabel: "View exchange rate",
    buttonUrl: "/exchange-rate",
    displayOrder: 4.5,
    items: [{ word: "REMITTANCE" }]
  },
  {
    key: "why",
    type: "WHY_CHOOSE",
    heading: "Why families choose Remit2Nepal",
    displayOrder: 5,
    items: [
      { title: "Secure", description: "Regulated operations, audited processes, and protected customer data." },
      { title: "Fast", description: "Same-day payout corridors with live branch and partner status." },
      { title: "Reliable", description: "A nationwide payout map that still works when you need it most." },
      { title: "Nationwide Network", description: "Urban hubs and district branches across all seven provinces." },
      { title: "Competitive Rates", description: "Transparent buy/sell pricing with NRB comparison." },
      { title: "Trusted Service", description: "Licensed remittance with published documents and notices." }
    ]
  },
  {
    key: "nepal-people",
    type: "NEPAL_MAP",
    heading: "People and families across Nepal",
    subheading: "Earners abroad, families at home — from the Himalaya to the Terai.",
    description: "Illustrated scenes of Nepali families, workers, and payouts — clipped to the map of Nepal.",
    icon: "Our Nepal",
    backgroundUrl: "/images/nepal-map/cityscape.svg",
    overlay: true,
    alignment: "center",
    buttonLabel: "View gallery",
    buttonUrl: "/gallery",
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
    heading: "Become a partner",
    subheading: "International sending corridors and national payout partners across Nepal.",
    displayOrder: 7
  },
  {
    key: "news",
    type: "NEWS",
    heading: "News and notices",
    buttonLabel: "All notices",
    buttonUrl: "/news",
    displayOrder: 8
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
    heading: "Need help with a transfer?",
    description: "Our relationship desk assists with branch hours, rate queries, and corporate remittance.",
    buttonLabel: "Contact Us",
    buttonUrl: "/contact",
    displayOrder: 10
  }
];

export const defaultServices = [
  {
    title: "International Remittance",
    slug: "international-remittance",
    shortDescription: "Inbound transfers from major corridors into Nepal with documented compliance.",
    fullDescription: "<p>Send funds to Nepal through licensed corridors with verified identification and payout tracking.</p>",
    icon: "globe",
    features: ["Licensed corridors", "ID verification", "Payout tracking"],
    countryAvailability: ["UAE", "Qatar", "Saudi Arabia", "Malaysia", "UK", "USA", "Australia"],
    displayOrder: 1
  },
  {
    title: "Money Transfer",
    slug: "money-transfer",
    shortDescription: "Person-to-person transfers with SMS notification and receipt copies.",
    fullDescription: "<p>Simple P2P money transfer with reference numbers and beneficiary verification.</p>",
    icon: "send",
    features: ["Reference number", "SMS alert", "Beneficiary check"],
    displayOrder: 2
  },
  {
    title: "Cash Pickup",
    slug: "cash-pickup",
    shortDescription: "Collect cash at Remit2Nepal branches with original ID.",
    fullDescription: "<p>Walk-in cash payout during published branch hours.</p>",
    icon: "banknote",
    features: ["Same-day payout", "ID required", "Nationwide branches"],
    displayOrder: 3
  },
  {
    title: "Bank Deposit",
    slug: "bank-deposit",
    shortDescription: "Direct credit to Nepali bank accounts through partner banks.",
    fullDescription: "<p>Deposit to commercial bank accounts with account-name matching.</p>",
    icon: "building-2",
    features: ["Account credit", "Name match", "Partner banks"],
    displayOrder: 4
  },
  {
    title: "Mobile Wallet Transfer",
    slug: "mobile-wallet-transfer",
    shortDescription: "Payout to supported digital wallets where available.",
    fullDescription: "<p>Wallet payout for customers who prefer digital collection.</p>",
    icon: "smartphone",
    features: ["Digital payout", "Supported wallets", "Transaction SMS"],
    displayOrder: 5
  },
  {
    title: "Corporate Remittance",
    slug: "corporate-remittance",
    shortDescription: "Payroll and vendor payouts for companies with dedicated operations support.",
    fullDescription: "<p>Bulk payouts, reporting, and relationship management for employers.</p>",
    icon: "briefcase",
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
    slug: "nrb-rate-desk-comparison",
    summary: "Customers can view official NRB rates alongside Remit2Nepal customer rates.",
    content: "<p>The public exchange-rate page now distinguishes official Nepal Rastra Bank rates from company customer rates.</p>",
    category: "NEWS",
    status: "PUBLISHED",
    author: "Treasury Desk",
    publishedAt: new Date()
  },
  {
    title: "Dashain payout hours extended at selected branches",
    slug: "dashain-payout-hours",
    summary: "Selected high-volume branches will operate extended hours during the festival period.",
    content: "<p>Please check branch pages for holiday hours before travelling.</p>",
    category: "NOTICE",
    status: "PUBLISHED",
    author: "Operations",
    publishedAt: new Date()
  }
];

export const defaultPartners = [
  { name: "Nepal Bank Limited", country: "Nepal", kind: "NATIONAL", description: "Payout and account credit partner.", website: "https://www.nepalbank.com.np", displayOrder: 1 },
  { name: "Nabil Bank", country: "Nepal", kind: "NATIONAL", description: "Bank deposit corridor partner.", website: "https://www.nabilbank.com", displayOrder: 2 },
  { name: "Global IME Bank", country: "Nepal", kind: "NATIONAL", description: "Nationwide account payout partner.", website: "https://www.globalimebank.com", displayOrder: 3 },
  { name: "Gulf Exchange", country: "United Arab Emirates", kind: "INTERNATIONAL", description: "Sending corridor partner from the UAE.", website: "", displayOrder: 4 },
  { name: "Qatar Exchange", country: "Qatar", kind: "INTERNATIONAL", description: "Sending corridor partner from Qatar.", website: "", displayOrder: 5 }
];
