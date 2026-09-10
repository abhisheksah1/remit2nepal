export const defaultChatbotQuestions = [
  {
    question: "How do I become an agent?",
    answer:
      "Open Become a Agent, choose Cooperative or Private Agent, and fill the form with full company details and documents. The desk verifies those files first. If they are in order, Remit2Nepal emails the company agreement. Sign it, stamp it, complete the required papers, scan them, and email them back to become an agent.",
    keywords: "become agent, national agent, apply, join, partner, create agent",
    category: "Agent",
    displayOrder: 1
  },
  {
    question: "What documents do I need to become an agent?",
    answer:
      "For the first form you typically need company registration, PAN, tax clearance, citizenship of both sides, and a cheque. After the desk verifies those, Remit2Nepal emails the company agreement. Sign it, stamp it, complete any remaining papers, scan them, and email them back.",
    keywords: "documents, papers, pan, citizenship, agreement, registration",
    category: "Agent",
    displayOrder: 2
  },
  {
    question: "How do I apply as a cooperative?",
    answer:
      "On Become a Agent choose Cooperative, fill the national form with full details, and upload your documents for verification. After review, Remit2Nepal emails the agreement. Sign, stamp, scan, and email it back.",
    keywords: "cooperative, sahakari, national type",
    category: "Agent",
    displayOrder: 3
  },
  {
    question: "How do I apply as a private agent?",
    answer:
      "On Become a Agent choose Private Agent, fill the national form with full details, and upload your documents for verification. After review, Remit2Nepal emails the agreement. Sign, stamp, scan, and email it back.",
    keywords: "private agent, individual agent",
    category: "Agent",
    displayOrder: 4
  },
  {
    question: "How do I install DC?",
    answer:
      "DC is installed on Windows 7, 8, or 10 using Internet Explorer and the Remit2Nepal certificate site.\n\n1. Open Internet Explorer.\n2. Go to https://www.remit2nepal.net/certsrv\n3. Click Continue to this website (not recommended).\n4. Enter your agent login details.\n5. Choose Request a certificate.\n6. If Submit does not work: Internet Explorer → Settings → Compatibility View Settings → add remit2nepal.net → Add.\n7. Click Yes, then Submit.\n8. Note the Request No and tell Remit2Nepal so the request can be approved.\n9. After approval, log in again, open View the status of a pending certificate request, and select Client authentication certificate.\n10. Click Yes, then Install this certificate. If you see Install this CA certificate, open it, click Install certificate, then OK.\n\nIf a step fails, send the exact error text. Operations: 01-5261598 / 01-5261493, info@remit2nepal.com.np.",
    keywords: "how dc install, dc installation, install dc, windows, certificate, internet explorer, certsrv, remit2nepal.net, setup, procedure, guide",
    category: "DC",
    displayOrder: 5
  },
  {
    question: "DC installation is failing. What should I do?",
    answer:
      "Tell me the exact error you see on the screen. I will match it against the DC installation guide. Common fixes: use Internet Explorer, open https://www.remit2nepal.net/certsrv, add remit2nepal.net in Compatibility View Settings if Submit does not work, then wait for the certificate request to be approved before installing it. If it still fails, send a screenshot to operations at 01-5261598 / 01-5261493.",
    keywords: "failing, failed, error, not working, problem, crash, cannot install, submit not working",
    category: "DC",
    displayOrder: 6
  },
  {
    question: "Who are the directors?",
    answer:
      "The Board of Directors sets policy and keeps the payout desk accountable. Open Board of Directors to see each director.",
    keywords: "director, directors, board, chairman, chairperson, governance, who is chairman",
    category: "About",
    displayOrder: 7
  },
  {
    question: "Who is on Our Team?",
    answer:
      "Our Team runs operations, compliance, and the payout desk. The first manager is the featured leader. Open Our Team to meet everyone.",
    keywords: "our team, staff, employees, department, manager, operations, leader, who is on the team",
    category: "About",
    displayOrder: 8
  }
];

export const defaultChatbotSteps = [
  {
    title: "Choose agent type",
    body: "Decide whether you will join as a Cooperative or a Private Agent, then fill the national form with full company and owner details.",
    displayOrder: 1
  },
  {
    title: "Collect documents",
    body: "Keep company registration, PAN, tax clearance, citizenship of both sides, and a cheque ready as clear files.",
    displayOrder: 2
  },
  {
    title: "Documents are verified first",
    body: "The partnership desk checks your uploaded files. The company agreement is not sent until those documents are verified.",
    displayOrder: 3
  },
  {
    title: "Company emails the agreement",
    body: "After verification, Remit2Nepal emails the company agreement. Sign it, add your stamp, complete the required papers, scan them, and email the scans back to become an agent.",
    displayOrder: 4
  },
  {
    title: "Wait for confirmation",
    body: "Operations confirms the signed papers. You will be contacted if a document needs to be replaced.",
    displayOrder: 5
  },
  {
    title: "Install DC and go live",
    body: "After approval, install DC using the uploaded installation PDF. If setup fails, ask this assistant with the error text.",
    displayOrder: 6
  }
];
