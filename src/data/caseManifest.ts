import type { CaseManifest, SeasonInfo } from "@/types";

// ─── Season Definitions ───────────────────────────────────────────────────────

export const SEASONS: SeasonInfo[] = [
  {
    number: 1,
    title: "Foundations",
    subtitle: "Season One",
    tone: "Wealth. Old money. Hidden family secrets. Buried lies.",
    crypticHint: "Every great lie begins with a family.",
    caseIds: ["thornwood", "blackwood-inheritance", "coldwater-file", "ashford-merger"],
  },
  {
    number: 2,
    title: "Deception",
    subtitle: "Season Two",
    tone: "Luxury. Corruption. Psychological manipulation. Glamorous danger.",
    crypticHint: "The most elegant crimes leave no fingerprints.",
    caseIds: ["bellamy-gala", "red-ledger", "hollow-watchman", "saint-vale-disappearance"],
  },
  {
    number: 3,
    title: "The Red Thread",
    subtitle: "Season Three",
    tone: "Conspiracy. Institutions. Political secrets. Hidden networks.",
    crypticHint: "You were never solving separate cases.",
    caseIds: [
      "midnight-passenger",
      "kingsport-doctrine",
      "obsidian-trial",
      "last-broadcast",
    ],
  },
];

// ─── Case Manifest — All 12 Cases ─────────────────────────────────────────────

export const CASE_MANIFEST: CaseManifest[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // SEASON 1 — FOUNDATIONS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "thornwood",
    title: "The Thornwood Affair",
    subtitle: "A death in the family. Everyone had reason to lie.",
    category: "country-house",
    difficulty: 3,
    estimatedMinutes: 45,
    season: 1,
    location: "Thornwood Hall, Yorkshire",
    teaserDescription:
      "Edmund Thornwood was found dead in his locked study on a Friday evening. The family had gathered for the weekend. By morning, someone had ensured he would never change his will again.",
    openingNarrative:
      "The telegram arrives at half past ten on a Friday evening. Edmund Thornwood, patriarch of one of Yorkshire's oldest families, has been found dead in his locked study. Brandy glass beside him. Door sealed from inside. A house full of suspects who each claim to have seen nothing, heard nothing, known nothing. The will, you are told, was recently amended. Everyone in the house already knows what it says. Everyone in the house had reason to wish it hadn't been written.",
    teaserSuspects: [
      { initials: "J.T.", role: "Son & Heir", isRedacted: false },
      { initials: "E.M.", role: "Personal Secretary", isRedacted: false },
      { initials: "A.V.", role: "Family Physician", isRedacted: false },
      { initials: "C.T.", role: "Estranged Wife", isRedacted: false },
      { initials: "V.T.", role: "Daughter", isRedacted: false },
      { initials: "S.C.", role: "Solicitor's Assistant", isRedacted: false },
    ],
    teaserEvidence: [
      { label: "Brandy Glass — East Study", type: "forensic", isRedacted: false },
      { label: "Banking Ledger — Eleanor's Office", type: "document", isRedacted: false },
      { label: "Foxglove Cuttings — Greenhouse", type: "physical", isRedacted: false },
      { label: "Telephoto Photographs — Guest Wing", type: "physical", isRedacted: false },
    ],
    visualTags: ["High Profile"],
    prestigeReward:
      "Archive Access Level II — Season 1 progression begins. The Blackwood Inheritance is now accessible.",
    suspectCount: 6,
    clueCount: 12,
    isNew: true,
    isFeatured: true,
    hiddenTwist:
      "A recurring company name appears in the banking ledger. You will not think to note it. You should.",
  },

  {
    id: "blackwood-inheritance",
    title: "The Blackwood Inheritance",
    subtitle: "The will changed three days after the funeral.",
    category: "country-house",
    difficulty: 3,
    estimatedMinutes: 50,
    season: 1,
    location: "Blackwood Manor, Derbyshire",
    unlockRequires: "thornwood",
    teaserDescription:
      "The patriarch of the Blackwood family was barely in the ground when the solicitors arrived with revised paperwork. The will had been altered. Someone in the house knew it was coming — and may have ensured they benefited from the timing.",
    openingNarrative:
      "Blackwood Manor sits at the edge of a moor that appears on no modern map. The family has owned it for three centuries. The family has kept secrets for equally as long. The patriarch died on a Tuesday. By Friday, the solicitors had arrived with a new document. Someone had been very prepared.",
    teaserSuspects: [
      { initials: "R.B.", role: "Eldest Son", isRedacted: false },
      { initials: "M.B.", role: "Second Wife", isRedacted: false },
      { initials: "P.H.", role: "[POSITION REDACTED]", isRedacted: true },
      { initials: "D.C.", role: "[POSITION REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY CLASSIFIED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "Original Will — Dated [REDACTED]", type: "document", isRedacted: false },
      { label: "Exhibit B — [RESTRICTED]", type: "physical", isRedacted: true },
      { label: "Exhibit C — [RESTRICTED]", type: "forensic", isRedacted: true },
      { label: "Exhibit D — [RESTRICTED]", type: "document", isRedacted: true },
    ],
    visualTags: ["Classified", "Requires Clearance"],
    prestigeReward:
      "The Blackwood Seal — awarded to those who understand the weight of inherited guilt.",
    suspectCount: 5,
    clueCount: 11,
    hiddenTwist:
      "The solicitor's firm appears in another case file. Their client list would be illuminating.",
  },

  {
    id: "coldwater-file",
    title: "The Coldwater File",
    subtitle: "The missing child case was never truly closed.",
    category: "cold-case",
    difficulty: 4,
    estimatedMinutes: 60,
    season: 1,
    location: "Coldwater, Maine",
    unlockRequires: "blackwood-inheritance",
    teaserDescription:
      "In 1983, a nine-year-old girl vanished from a coastal town that kept its own counsel. The official case was closed within the year. Forty years later, a box arrives without a return address. Inside: everything the police were never supposed to find.",
    openingNarrative:
      "The box arrives packed in newspaper dated April 14th, 1983. Someone has been holding this for forty years. They chose now to let it go. Inside: crime scene photographs that were never logged, a witness statement that was never filed, and a note in handwriting that matches the case detective — written six months after he was supposed to have stopped looking.",
    teaserSuspects: [
      { initials: "T.H.", role: "Former Sheriff", isRedacted: false },
      { initials: "??.", role: "[FILE SEALED — 1983]", isRedacted: true },
      { initials: "??.", role: "[FILE SEALED — 1983]", isRedacted: true },
      { initials: "??.", role: "[FILE SEALED — 1983]", isRedacted: true },
      { initials: "??.", role: "[FILE SEALED — 1983]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "Original Police Report — April 1983", type: "document", isRedacted: false },
      { label: "Exhibit B — [SEALED 40 YEARS]", type: "physical", isRedacted: true },
      { label: "Exhibit C — [SEALED 40 YEARS]", type: "testimony", isRedacted: true },
      { label: "Exhibit D — [SEALED 40 YEARS]", type: "forensic", isRedacted: true },
    ],
    visualTags: ["Cold Case", "Restricted", "Under Review"],
    prestigeReward:
      "The Cold Case Commendation — awarded to those who refuse to let truth die with the investigation.",
    suspectCount: 5,
    clueCount: 14,
    hiddenTwist:
      "The girl's name appears in a document in Season 3. You will not be expecting it. You should have been.",
  },

  {
    id: "ashford-merger",
    title: "The Ashford Merger",
    subtitle: "The deal closes in 48 hours. The CEO is already dead.",
    category: "conspiracy",
    difficulty: 4,
    estimatedMinutes: 55,
    season: 1,
    location: "New York City",
    unlockRequires: "coldwater-file",
    teaserDescription:
      "The Ashford–Vantec merger would have created the largest private intelligence firm in North America. Then the CEO was found in his office with no pulse and no signs of forced entry. The deal doesn't stop. Someone very powerful needs it to close.",
    openingNarrative:
      "Forty-eight hours before the signing ceremony, someone turned off the lights in the corner office on the 57th floor and waited. When they left, a man lay dead in his chair — and a deal worth nine billion dollars was still scheduled to proceed. The board is not grieving. The board is not stopping. Someone on that board knew this was coming.",
    teaserSuspects: [
      { initials: "V.A.", role: "CFO, Ashford Group", isRedacted: false },
      { initials: "??.", role: "[POSITION REDACTED]", isRedacted: true },
      { initials: "??.", role: "[POSITION REDACTED]", isRedacted: true },
      { initials: "??.", role: "[POSITION REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY CLASSIFIED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY CLASSIFIED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY CLASSIFIED]", isRedacted: true },
    ],
    teaserEvidence: [
      {
        label: "Board Meeting Minutes — [REDACTED DATE]",
        type: "document",
        isRedacted: false,
      },
      { label: "Exhibit B — [CLASSIFIED]", type: "physical", isRedacted: true },
      { label: "Exhibit C — [CLASSIFIED]", type: "forensic", isRedacted: true },
      { label: "Exhibit D — [CLASSIFIED]", type: "document", isRedacted: true },
    ],
    visualTags: ["Classified", "High Profile", "Requires Clearance"],
    prestigeReward:
      "Season One Complete — Archive Access Level III unlocked. Season Two: Deception is now open.",
    suspectCount: 7,
    clueCount: 12,
    hiddenTwist:
      "The acquiring company's subsidiary name resurfaces in every subsequent season. Begin noting it now.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEASON 2 — DECEPTION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "bellamy-gala",
    title: "The Bellamy Gala",
    subtitle: "Champagne, poison, and a room full of perfect alibis.",
    category: "noir",
    difficulty: 4,
    estimatedMinutes: 50,
    season: 2,
    location: "Paris, 1928",
    unlockRequiresSeason: 1,
    teaserDescription:
      "The Bellamy estate held its annual winter gala on a Thursday in December. By midnight, the champagne had been drunk, the orchestra had fallen silent, and a man was dead at a table where thirty guests claimed to have watched him all evening.",
    openingNarrative:
      "Paris in December. The kind of cold that makes the wealthy draw their furs tighter and their secrets closer. The Bellamy Gala is the event of the winter season — and someone used it as cover for a perfect crime. Thirty witnesses. Thirty alibis. One body. The murderer is still in the room.",
    teaserSuspects: [
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "Exhibit A — [SEASON LOCKED]", type: "physical", isRedacted: true },
      { label: "Exhibit B — [SEASON LOCKED]", type: "document", isRedacted: true },
      { label: "Exhibit C — [SEASON LOCKED]", type: "forensic", isRedacted: true },
      { label: "Exhibit D — [SEASON LOCKED]", type: "testimony", isRedacted: true },
    ],
    visualTags: ["Season Locked", "High Profile"],
    prestigeReward: "The Bellamy Citation — mastery of alibi analysis under social pressure.",
    suspectCount: 6,
    clueCount: 10,
    hiddenTwist:
      "One attendee at the gala shares a surname with a figure in Season 1. This is not a coincidence.",
  },

  {
    id: "red-ledger",
    title: "The Red Ledger",
    subtitle: "The notebook existed. Every patient says otherwise.",
    category: "psychological",
    difficulty: 5,
    estimatedMinutes: 65,
    season: 2,
    location: "London",
    unlockRequires: "bellamy-gala",
    teaserDescription:
      "A therapist was found dead in her Mayfair office. Her patient files had been methodically destroyed. Her patients — all seven — deny that any red notebook ever existed. They cannot all be lying. And yet they are.",
    openingNarrative:
      "The office smells of old paper and lavender. The files are gone. The couch has been cleaned. The only thing that remains is a single red thread caught on the edge of the desk drawer — as if someone reached in and could not quite take everything. Seven patients. Seven denials. One missing notebook that everyone claims never existed.",
    teaserSuspects: [
      { initials: "??.", role: "[PATIENT — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[PATIENT — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[PATIENT — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[PATIENT — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "Exhibit A — [SEASON LOCKED]", type: "document", isRedacted: true },
      { label: "Exhibit B — [SEASON LOCKED]", type: "testimony", isRedacted: true },
      { label: "Exhibit C — [SEASON LOCKED]", type: "forensic", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Restricted", "Under Review"],
    prestigeReward:
      "The Red Ledger Cipher — recognises the ability to decode deception at its most intimate.",
    suspectCount: 5,
    clueCount: 13,
    hiddenTwist:
      "The therapist's patient list overlaps with names from Season 1. Read the names carefully.",
  },

  {
    id: "hollow-watchman",
    title: "The Hollow Watchman",
    subtitle: "The body was found inside a sealed church tower.",
    category: "locked-room",
    difficulty: 5,
    estimatedMinutes: 70,
    season: 2,
    location: "Edinburgh",
    unlockRequires: "red-ledger",
    teaserDescription:
      "The tower of St. Callum's Church had not been opened in eleven years. The door was bolted from the inside. Inside, a man was found seated at a writing desk, mid-sentence. No windows. No second entrance. No explanation that satisfies the laws of physics.",
    openingNarrative:
      "The minister heard footsteps in a tower that was supposed to be empty. When they broke the door open at dawn, they found the impossible: a dead man, a burning candle, and a letter addressed to no one. The mechanism that sealed the door had been destroyed from inside. The man had been dead for at least twelve hours.",
    teaserSuspects: [
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY REDACTED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "Exhibit A — [SEASON LOCKED]", type: "physical", isRedacted: true },
      { label: "Exhibit B — [SEASON LOCKED]", type: "document", isRedacted: true },
      { label: "Exhibit C — [SEASON LOCKED]", type: "forensic", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Classified"],
    prestigeReward:
      "The Watchman's Key — proof that no room is truly sealed to the prepared mind.",
    suspectCount: 4,
    clueCount: 11,
    hiddenTwist:
      "The unaddressed letter found in the tower is written in a cipher. By Season 3, you will know to whom it was meant.",
  },

  {
    id: "saint-vale-disappearance",
    title: "The Saint Vale Disappearance",
    subtitle: "Five people vanished from a retreat. Four returned.",
    category: "psychological",
    difficulty: 5,
    estimatedMinutes: 80,
    season: 2,
    location: "Swiss Alps",
    unlockRequires: "hollow-watchman",
    teaserDescription:
      "The Saint Vale Institute offers psychological retreat at an altitude where no one asks questions. Five guests checked in on a Monday. Four signed the departure log on Friday. The fifth has not been seen since. The Institute insists there was no fifth guest.",
    openingNarrative:
      "Above two thousand metres, the air becomes very clear and the lies become very obvious. Or so the brochure promises. Someone at Saint Vale understood that altitude is also very good for making things disappear permanently.",
    teaserSuspects: [
      { initials: "??.", role: "[GUEST — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[GUEST — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[GUEST — IDENTITY PROTECTED]", isRedacted: true },
      { initials: "??.", role: "[STAFF — IDENTITY REDACTED]", isRedacted: true },
      { initials: "??.", role: "[IDENTITY CLASSIFIED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "Exhibit A — [SEASON LOCKED]", type: "document", isRedacted: true },
      { label: "Exhibit B — [SEASON LOCKED]", type: "testimony", isRedacted: true },
      { label: "Exhibit C — [SEASON LOCKED]", type: "physical", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Classified", "Requires Clearance"],
    prestigeReward:
      "Season Two Complete — Clearance elevated. Season Three: The Red Thread is now accessible.",
    suspectCount: 5,
    clueCount: 15,
    hiddenTwist:
      "The Institute's founding board includes a name from Season 1's corporate archive. It should not be there.",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SEASON 3 — THE RED THREAD
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "midnight-passenger",
    title: "The Midnight Passenger",
    subtitle: "Everyone on the train remembers him. No one can prove he existed.",
    category: "conspiracy",
    difficulty: 5,
    estimatedMinutes: 75,
    season: 3,
    location: "Eastern Europe",
    unlockRequiresSeason: 2,
    teaserDescription:
      "A man boarded the overnight train from Vienna to Bucharest. Twenty-two passengers remember him distinctly. He sat in car six, smoked imported cigarettes, spoke to the conductor twice. According to every official record, no such passenger was ever on board.",
    openingNarrative:
      "The train arrives on time. The passengers disembark. And somewhere in the gap between memory and documentation, a man ceases to exist. Twenty-two independent witnesses. Twenty-two consistent descriptions. Zero evidence he ever boarded. Someone erased him — which means someone very powerful had reason to.",
    teaserSuspects: [
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "document", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "testimony", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "physical", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Classified", "Requires Clearance"],
    prestigeReward:
      "The Midnight Citation — awarded to those who follow the thread into total darkness.",
    suspectCount: 5,
    clueCount: 16,
    hiddenTwist:
      "The passenger's description matches a figure who appeared briefly in Season 1 and was never identified.",
  },

  {
    id: "kingsport-doctrine",
    title: "The Kingsport Doctrine",
    subtitle: "The government buried the original report for a reason.",
    category: "cold-case",
    difficulty: 5,
    estimatedMinutes: 80,
    season: 3,
    location: "Coastal Massachusetts",
    unlockRequires: "midnight-passenger",
    teaserDescription:
      "A declassified FOIA request reveals a federal report was suppressed in 1971. The original finding: three deaths in Kingsport were connected to a classified project. The report was rewritten. The project renamed. The people involved reassigned. One of them is still alive.",
    openingNarrative:
      "The document arrives in a plain manila envelope. The pages are numbered sequentially. Pages 17 through 34 are absent. Someone decided that was sufficient to release. Someone else will decide it was too much.",
    teaserSuspects: [
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "document", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "forensic", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "document", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Classified", "Cold Case", "Restricted"],
    prestigeReward:
      "The Kingsport Seal — for those who understand that some truths survive every attempt to bury them.",
    suspectCount: 4,
    clueCount: 14,
    hiddenTwist:
      "The classified project name matches a subsidiary mentioned in the Ashford Merger documents. Pull that thread.",
  },

  {
    id: "obsidian-trial",
    title: "The Obsidian Trial",
    subtitle: "Twelve jurors. Eleven verdicts. One missing hour.",
    category: "psychological",
    difficulty: 5,
    estimatedMinutes: 85,
    season: 3,
    location: "Chicago",
    unlockRequires: "kingsport-doctrine",
    teaserDescription:
      "A murder trial concluded with a unanimous verdict — except juror eight's record shows no vote at all. The court reporter's notes describe an hour of deliberation that the surveillance footage does not contain. The convicted man says something happened in that room. He is almost certainly correct.",
    openingNarrative:
      "Justice is supposed to be transparent. Someone in Chicago forgot that — or counted on everyone else forgetting it. Twelve citizens. One sealed chamber. One hour that left no evidence of itself except the gap where it should have been.",
    teaserSuspects: [
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "document", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "testimony", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "observation", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Classified", "Requires Clearance", "Under Review"],
    prestigeReward:
      "The Obsidian Gavel — awarded to those who hold the institution accountable for the hour it erased.",
    suspectCount: 5,
    clueCount: 15,
    hiddenTwist:
      "The defendant's attorney worked at a firm that appears in the Ashford documents. Begin pulling the thread now.",
  },

  {
    id: "last-broadcast",
    title: "The Last Broadcast",
    subtitle: "The anchor went missing during a live transmission.",
    category: "conspiracy",
    difficulty: 5,
    estimatedMinutes: 90,
    season: 3,
    location: "Washington, D.C.",
    unlockRequires: "obsidian-trial",
    teaserDescription:
      "At 11:47 PM on a Tuesday, a news anchor was delivering a live broadcast when the signal died. The studio was sealed. The crew was in the booth. No one saw her leave. Twelve hours later, every record of the transmission had been erased from every major archive. Someone very powerful had been watching.",
    openingNarrative:
      "The broadcast lasted eleven minutes and forty-seven seconds before the signal died. Somewhere in those eleven minutes, she said something that could not be allowed to stand. This is the case that connects everything. You were never investigating separate crimes. You were always following a single thread — and this is where it ends.",
    teaserSuspects: [
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
      { initials: "??.", role: "[CLEARANCE III REQUIRED]", isRedacted: true },
    ],
    teaserEvidence: [
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "document", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "physical", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "forensic", isRedacted: true },
      { label: "[CLASSIFIED — LEVEL III REQUIRED]", type: "testimony", isRedacted: true },
    ],
    visualTags: ["Season Locked", "Classified", "Requires Clearance", "High Profile"],
    prestigeReward:
      "Master Detective — You followed the Red Thread to its source. The archive is yours.",
    suspectCount: 6,
    clueCount: 18,
    hiddenTwist:
      "The broadcast contained names. Names you have already encountered across twelve cases. This was always one investigation.",
  },
];
