import type { Case } from "@/types";

export const thornwoodCase: Case = {
  id: "thornwood",
  title: "The Thornwood Affair",
  subtitle: "A death in the family. Everyone had reason to lie.",
  category: "country-house",
  difficulty: 3,
  estimatedMinutes: 45,
  isFeatured: true,
  isNew: true,

  victim: {
    name: "Edmund Thornwood",
    age: 68,
    occupation: "Retired industrialist",
    description:
      "Found dead in his study at Thornwood Hall. Initial reports suggest heart failure — but the locked door, the missing will, and the brandy glass suggest otherwise.",
    relationships: {
      "james-thornwood": "Son",
      "eleanor-marsh": "Personal secretary of 12 years",
      "dr-aldous-vane": "Family physician",
      "constance-thornwood": "Estranged wife",
      "victoria-thornwood": "Daughter",
      "sophie-caldwell": "Estate solicitor's assistant",
    },
  },

  setting: "Thornwood Hall, Yorkshire",
  settingDescription:
    "A Victorian country estate on the edge of the moors. The house smells of old paper and older grievances. The staff have been dismissed for the weekend. It is raining.",

  briefing:
    "Edmund Thornwood was found dead at 11:14 PM on Saturday, November 9th, slumped in his leather chair in the East Study. The door was locked from the inside. A glass of brandy — half-finished — sat on the desk beside him. The will, which his solicitor confirms was amended three days prior, is nowhere to be found.\n\nThe attending physician, Dr. Aldous Vane, noted the cause of death as cardiac arrest — but the toxicology screen is still pending. Four people were in the house that evening. All four have motives. All four are lying about something.\n\nFind the thread. Pull it.",

  suspects: [
    {
      id: "james-thornwood",
      name: "James Thornwood",
      age: 41,
      occupation: "Barrister",
      relation: "Son and heir",
      description:
        "Edmund's eldest son. Charming, over-educated, and perpetually short of money. He arrived Friday evening — supposedly to reconcile. His father amended the will three days prior.",
      physicalDescription:
        "Tall, dark-haired, well-dressed but fraying at the cuffs. Restless hands.",
      initialTone: "nervous",
      questions: [
        {
          id: "james-q1",
          text: "Tell me about your relationship with your father.",
          response:
            "Complicated. As most father-son relationships are, I suppose — particularly when one party holds the money and the other holds the expectations. We were estranged for a period. I came this weekend because he asked me to. He said we needed to talk about the estate. I thought perhaps it was a reconciliation. Now I'm not sure what it was.",
          tone: "nervous",
        },
        {
          id: "james-q2",
          text: "Where were you when your father died?",
          response:
            "In the library. East wing, first floor. I was reading — Trollope, if it matters — and I hadn't heard anything unusual until I noticed the time was past eleven and Father hadn't appeared. That's when I went to check on him. I knocked. No answer. I noticed light under the door. I broke the glass panel to reach the bolt.",
          tone: "nervous",
        },
        {
          id: "james-q3",
          text: "When did you last speak with him that evening?",
          response:
            "At dinner. Around half-seven. He was quiet — more so than usual. He spoke briefly with Eleanor about some papers, then retired early. Said he had correspondence to deal with. I tried to catch him afterward, but he'd already locked himself in the study.",
          tone: "nervous",
          requiresQuestionId: "james-q2",
        },
        {
          id: "james-q4",
          text: "We found a document indicating a substantial debt. Eighty thousand pounds.",
          response:
            "Where did you find that? That was — that's a private matter. Yes. There were some financial difficulties. Investments that didn't perform as expected. A professional setback earlier this year. I came to ask Father for help. He refused, actually. Said I needed to learn to live within my means. Rather rich, given what Eleanor was doing with his accounts.",
          tone: "nervous",
          requiresClueId: "james-gambling-debt",
          isKeyQuestion: true,
        },
        {
          id: "james-q5",
          text: "Did your father know about your financial difficulties?",
          response:
            "I'd told him some of it. Not the full extent. He wasn't an easy man to confide in — everything became a lesson about responsibility. But he knew I was struggling. That's partly why I'm certain the amended will wasn't intended to cut me off. He wouldn't do that. At least, that's what I thought until this morning.",
          tone: "nervous",
          requiresQuestionId: "james-q4",
        },
        {
          id: "james-q6",
          text: "You mentioned Eleanor's name just now. What do you know about her involvement with the estate accounts?",
          response:
            "I suspected something for a while. The household expenditure never quite matched what I'd have expected. I mentioned it to Father once — about two years ago. He dismissed me. Said Eleanor was exemplary and I was looking for someone else to blame for my own failures. I let it go. I shouldn't have let it go.",
          tone: "grief-stricken",
          requiresClueId: "banking-records",
          isKeyQuestion: true,
        },
      ],
      alibi: "Claims to have been in the library all evening, reading.",
      tells: [
        "Over-explains his movements without being asked.",
        "Refers to his father in the past tense before the body was found.",
      ],
      isGuilty: false,
    },
    {
      id: "eleanor-marsh",
      name: "Eleanor Marsh",
      age: 44,
      occupation: "Personal secretary",
      relation: "Secretary of 12 years",
      description:
        "Edmund's private secretary for over a decade. Efficient, loyal, almost invisible — which is precisely how she preferred it. She knew the house, the accounts, and the man better than anyone.",
      physicalDescription:
        "Slim, dark-suited, with the watchful stillness of someone accustomed to waiting.",
      initialTone: "cold",
      questions: [
        {
          id: "eleanor-q1",
          text: "Walk me through your exact movements last evening.",
          response:
            "After dinner I cleared the dining room, then prepared the evening tray — brandy for Mr. Thornwood, as was his custom. I left the tray outside the study at approximately nine-fifteen. I then returned to the kitchen and remained there until I heard James shouting at about eleven-fifteen. I went directly to the study.",
          tone: "cold",
        },
        {
          id: "eleanor-q2",
          text: "Was anyone with you in the kitchen during that time?",
          response:
            "No. The staff had been dismissed for the evening. I was alone. I'm accustomed to being alone in the house — it's the nature of the position. Mr. Thornwood valued his privacy. As did I.",
          tone: "cold",
          requiresQuestionId: "eleanor-q1",
        },
        {
          id: "eleanor-q3",
          text: "You left the tray outside the study. You didn't bring it in yourself?",
          response:
            "He preferred to collect it himself when he was working. A private man. I respected that. Always.",
          tone: "cold",
          requiresQuestionId: "eleanor-q1",
        },
        {
          id: "eleanor-q4",
          text: "We have a photograph placing you inside the East Study at 10:15 PM — not in the kitchen.",
          response:
            "I don't know what photograph you're referring to. I was in the kitchen. If someone claims otherwise, they are mistaken. Or lying.",
          tone: "cold",
          requiresClueId: "victorias-photographs",
          isKeyQuestion: true,
        },
        {
          id: "eleanor-q5",
          text: "These banking records show transfers from the Thornwood estate to a private holding company over six years. The correspondence address is your flat in York.",
          response:
            "I would like to speak with a solicitor before answering any further questions.",
          tone: "cold",
          requiresClueId: "banking-records",
          isKeyQuestion: true,
        },
        {
          id: "eleanor-q6",
          text: "The foxglove in the greenhouse was recently harvested. You manage the greenhouse. You know what foxglove contains.",
          response:
            "I tend the gardens because no one else does. That's all. I won't speculate about what you're suggesting.",
          tone: "cold",
          requiresClueId: "foxglove-cuttings",
          isKeyQuestion: true,
        },
        {
          id: "eleanor-q7",
          text: "Sophie Caldwell wrote to you that Edmund 'intends to act by Monday.' What was he about to expose?",
          response:
            "Nothing to say. Nothing at all.",
          tone: "cold",
          requiresClueId: "sophies-letter",
          isKeyQuestion: true,
        },
      ],
      alibi: "Says she was in the staff kitchen preparing the evening tray.",
      tells: [
        "Never volunteers information. Answers only the exact question asked.",
        "Her composure intensifies under pressure rather than breaking.",
      ],
      isGuilty: true,
    },
    {
      id: "dr-aldous-vane",
      name: "Dr. Aldous Vane",
      age: 62,
      occupation: "Physician",
      relation: "Family physician of 30 years",
      description:
        "Edmund's doctor for three decades. He pronounced the death as cardiac arrest — perhaps too quickly. He has been prescribing Edmund sedatives for months, and the prescription records are missing.",
      physicalDescription:
        "Silver-haired, heavyset, with the air of a man whose confidence has calcified into arrogance.",
      initialTone: "cooperative",
      questions: [
        {
          id: "vane-q1",
          text: "You pronounced death as cardiac arrest within minutes. How could you be certain?",
          response:
            "Edmund had a documented cardiac history. Arrhythmia, progressive over the last two years. When I examined him, the presentation was entirely consistent. Lividity, pallor, the position of the body — a physician of thirty years can recognise a natural death. I stand by my assessment.",
          tone: "cooperative",
        },
        {
          id: "vane-q2",
          text: "Edmund's prescription records are not in your medical bag.",
          response:
            "I must have left them in the car. I'll retrieve them this morning. It's a clerical matter — I'm sure you understand that patient records travel with the physician, not the police.",
          tone: "cooperative",
        },
        {
          id: "vane-q3",
          text: "The records weren't in your vehicle. We searched it.",
          response:
            "Then they must be at my practice. I've had a long evening and I may be misremembering where I last had them. I'll have my secretary locate them first thing Monday.",
          tone: "cooperative",
          requiresClueId: "missing-prescription",
          isKeyQuestion: true,
        },
        {
          id: "vane-q4",
          text: "Could Edmund's cardiac condition have caused sudden death without warning?",
          response:
            "Theoretically, yes. Cardiac arrhythmias can be unpredictable. A sudden event, particularly under stress — an argument, emotional distress — could precipitate fatal arrest. That's the honest medical answer.",
          tone: "cooperative",
          requiresQuestionId: "vane-q1",
        },
        {
          id: "vane-q5",
          text: "The toxicology report confirms digoxin poisoning at eight times the therapeutic maximum. Edmund was murdered.",
          response:
            "That — I see. If that's correct, then someone tampered with his medication or introduced it by other means. I prescribed therapeutic doses only. Whatever the toxicology shows, I had nothing to do with it.",
          tone: "nervous",
          requiresClueId: "toxicology-report",
          isKeyQuestion: true,
        },
        {
          id: "vane-q6",
          text: "Did Eleanor Marsh ever ask you about Edmund's medications or cardiac treatment?",
          response:
            "She was his secretary. She managed his appointments, including medical ones. She may have asked general questions — a professional courtesy, I assumed. I never discussed dosages with her specifically. Or so I believed at the time.",
          tone: "nervous",
          requiresClueId: "toxicology-report",
          isKeyQuestion: true,
        },
      ],
      alibi: "Was in his car, he says, taking a telephone call when Edmund died.",
      tells: [
        "Deflects questions about toxicology with medical jargon.",
        "Becomes unusually formal when asked about the prescription records.",
      ],
      isGuilty: false,
    },
    {
      id: "constance-thornwood",
      name: "Constance Thornwood",
      age: 58,
      occupation: "Socialite",
      relation: "Estranged wife",
      description:
        "Edmund's wife of thirty years, from whom he separated six months prior. She claims she came to retrieve personal documents. She and Edmund were seen arguing at dinner.",
      physicalDescription:
        "Elegant, composed, with grief worn like a garment she cannot quite remove.",
      initialTone: "evasive",
      questions: [
        {
          id: "constance-q1",
          text: "You and Edmund were heard arguing at dinner. What was the argument about?",
          response:
            "We weren't arguing. We were having a discussion. A heated one, perhaps, but married people — separated people — have those. It was about the house. About arrangements. Nothing that would be of interest to you.",
          tone: "evasive",
        },
        {
          id: "constance-q2",
          text: "Why did you come to Thornwood Hall this weekend specifically?",
          response:
            "Edmund asked me to come. Said there were matters to discuss regarding the separation. Personal documents he wanted to return to me. I didn't expect to spend the night, but the weather made leaving impractical.",
          tone: "evasive",
        },
        {
          id: "constance-q3",
          text: "You asked James about the will before the police arrived. Why?",
          response:
            "I was asking because my husband had just died and I was frightened. One naturally thinks about these things. It's not evidence of anything.",
          tone: "evasive",
          isKeyQuestion: true,
        },
        {
          id: "constance-q4",
          text: "The estate accounts were being embezzled for six years. Were you aware of this?",
          response:
            "I was not. Edmund handled the finances entirely — he always had. I had a household allowance. Whatever Eleanor was doing happened without my knowledge, I assure you.",
          tone: "nervous",
          requiresClueId: "banking-records",
          isKeyQuestion: true,
        },
        {
          id: "constance-q5",
          text: "Did Edmund seem frightened to you at dinner? As if he knew something was wrong?",
          response:
            "He seemed — resolved. That's the word. As if he'd made a decision he wasn't sure was right. I didn't ask him what it was. Perhaps I should have.",
          tone: "grief-stricken",
          requiresQuestionId: "constance-q1",
        },
      ],
      alibi: "Says she retired to the guest room at 9 PM and heard nothing.",
      tells: [
        "Cries easily — but only when discussing money, not her husband.",
        "Asks about the will unprompted.",
      ],
      isGuilty: false,
    },
    {
      id: "victoria-thornwood",
      name: "Victoria Thornwood",
      age: 29,
      occupation: "Journalist",
      relation: "Daughter",
      description:
        "Edmund's daughter. She had not spoken to him in two years following a public falling-out over the estate finances. Her presence at Thornwood Hall this weekend was unannounced.",
      physicalDescription:
        "Sharp-featured, dark eyes, perpetually recording — even without a notebook.",
      initialTone: "hostile",
      questions: [
        {
          id: "victoria-q1",
          text: "You weren't expected this weekend. Why did you come?",
          response:
            "Because I suspected something was wrong. My father and I hadn't spoken in two years — not since the falling out over the estate review I wrote. But I'd heard from a source at the solicitor's office that the will had been changed. I came to understand what that meant. For the family.",
          tone: "hostile",
        },
        {
          id: "victoria-q2",
          text: "When did you last see your father alive?",
          response:
            "Dinner. He looked at me once, across the table, and I think he was surprised I came. Or perhaps relieved. It's difficult to say with Edmund. He wasn't a man who showed what he felt. He excused himself early.",
          tone: "hostile",
        },
        {
          id: "victoria-q3",
          text: "You were in the garden alone from nine to eleven? No one can corroborate that?",
          response:
            "I was smoking. I don't announce it. I was thinking. I wanted to observe the house — who was moving, which lights were on. It's a habit from the job. I notice things. Perhaps you should be asking me what I noticed.",
          tone: "hostile",
          requiresQuestionId: "victoria-q1",
        },
        {
          id: "victoria-q4",
          text: "These photographs — you took them deliberately with a telephoto lens. You were watching the study.",
          response:
            "Yes. I was watching the study. I saw Eleanor enter at ten-fifteen. She carried a small tray. She was inside for approximately twelve minutes. I know what that means now. At the time I wasn't sure.",
          tone: "hostile",
          requiresClueId: "victorias-photographs",
          isKeyQuestion: true,
        },
        {
          id: "victoria-q5",
          text: "Why didn't you come forward with these photographs immediately?",
          response:
            "Because I wanted to understand what I had before I showed it to anyone. I've been burned before, in my work — going to the wrong person with the right evidence. I wasn't going to make that mistake again. I was going to give them to the police in the morning. And now I'm doing exactly that.",
          tone: "hostile",
          requiresQuestionId: "victoria-q4",
          isKeyQuestion: true,
        },
        {
          id: "victoria-q6",
          text: "Do you know Sophie Caldwell?",
          response:
            "By name. She works for Father's solicitor. I never met her directly. Why do you ask?",
          tone: "hostile",
          requiresClueId: "sophies-letter",
        },
      ],
      alibi: "Claims to have been in the garden smoking between 9 and 11 PM.",
      tells: [
        "Uses her phone compulsively, then stops entirely once she knows she's being watched.",
        "Her animosity toward her father is too performative to be real grief.",
      ],
      isGuilty: false,
    },
    {
      id: "sophie-caldwell",
      name: "Sophie Caldwell",
      age: 35,
      occupation: "Estate solicitor's assistant",
      relation: "Legal representative",
      description:
        "An assistant to Edmund's solicitor, she arrived Saturday afternoon to witness the amended will. She claims to have left by 7 PM. The guest register says otherwise.",
      physicalDescription:
        "Quietly professional, unremarkable — except for the letter she tried to have destroyed.",
      initialTone: "nervous",
      questions: [
        {
          id: "sophie-q1",
          text: "You came to witness the amended will. What did it contain?",
          response:
            "I'm bound by solicitor-client confidentiality. I can confirm that I came to witness Mr. Thornwood's signature on an amended document. The contents are — I'm not at liberty to say.",
          tone: "nervous",
        },
        {
          id: "sophie-q2",
          text: "You claim you left before dinner. A staff member places you in the east wing corridor at 10:45 PM.",
          response:
            "I — I may have returned briefly. I left something behind. A document. I came back for it. I didn't want to disturb anyone. I let myself in through the side entrance. I was only a few minutes.",
          tone: "nervous",
          isKeyQuestion: true,
        },
        {
          id: "sophie-q3",
          text: "What is your relationship with Eleanor Marsh, outside of professional dealings?",
          response:
            "She's a contact. We've spoken over the years in the course of managing Mr. Thornwood's affairs. Nothing beyond that.",
          tone: "nervous",
        },
        {
          id: "sophie-q4",
          text: "We found your letter. 'He knows, E. He intends to act by Monday. Burn this.' You wrote this to Eleanor.",
          response:
            "I need — I need a moment. I should tell you — I was frightened. I'd realised what Eleanor had been doing, what the amended will would expose. I made a terrible mistake writing that letter. I panicked. I didn't know she would — I didn't know what she would do.",
          tone: "nervous",
          requiresClueId: "sophies-letter",
          isKeyQuestion: true,
        },
        {
          id: "sophie-q5",
          text: "The amended will would have named Eleanor as sole executor and given her control of millions. You helped draft that document.",
          response:
            "Eleanor asked us to prepare it that way. She said Mr. Thornwood had directed her — that he trusted no one else. We had no reason to question it at the time. When I finally looked at the estate accounts and realised what she'd been doing, I tried to warn Mr. Thornwood indirectly. I failed him. I know that.",
          tone: "nervous",
          requiresClueId: "banking-records",
          isKeyQuestion: true,
        },
      ],
      alibi: "Says she left before dinner. A staff member places her in the east wing corridor at 10:45 PM.",
      tells: [
        "Contradicts herself on the exact time she departed.",
        "She knows what was in the will — and is frightened by it.",
      ],
      isGuilty: false,
    },
  ],

  scenes: [
    {
      id: "east-study",
      name: "The East Study",
      description:
        "Edmund Thornwood's private study. A heavy mahogany desk dominates the room, its surface ordered with the discipline of a man who controlled everything — until he didn't. The leather chair still holds the impression of where he died. The brandy glass has been moved. It should not have been.\n\nThe door lock is a simple deadbolt. The key was found in Edmund's waistcoat pocket. There is no second key. The window latch is secure from the inside.",
      clueIds: ["brandy-glass", "locked-door", "telephone-log"],
      isLocked: false,
    },
    {
      id: "greenhouse",
      name: "The Greenhouse",
      description:
        "A Victorian conservatory attached to the east wing. Glass panels fog in the cold night air. Rows of winter plants, carefully tended — and one conspicuous gap where a clump of foxglove has been recently cut back. The soil around it is still disturbed.\n\nA pair of pruning shears, recently used, rests on the potting bench. The cuttings are gone. Someone was here before the rain came.",
      clueIds: ["foxglove-cuttings", "pruning-shears"],
      isLocked: false,
    },
    {
      id: "eleanors-desk",
      name: "Eleanor's Office",
      description:
        "A small, precise room adjacent to the main study. Everything in its place — which makes the single displaced drawer all the more conspicuous. The filing cabinet has been accessed recently; the lock shows fresh scratches.\n\nA leather ledger on the desk has had three pages removed. The torn edges are flush, surgical. Someone who knew exactly what they were looking for.",
      clueIds: ["banking-records", "missing-ledger-pages"],
      isLocked: true,
    },
    {
      id: "guest-wing",
      name: "The Guest Wing",
      description:
        "The corridor where Edmund's guests were housed for the weekend. Victoria's room shows signs of a hasty search — drawers slightly open, a rug shifted. Her camera bag contains photographs she has not yet explained.\n\nAt the far end of the corridor, a locked door leads to the attic staircase. The lock has been opened recently. The key is missing from the housekeeping board.",
      clueIds: ["victorias-photographs", "sophies-letter"],
      isLocked: true,
    },
  ],

  clues: [
    {
      id: "brandy-glass",
      title: "The Brandy Glass",
      description:
        "Edmund's half-finished glass of brandy, found on his desk beside the body. The laboratory analysis, now returned, confirms the presence of a concentrated cardiac glycoside — specifically digoxin — in the residue. The concentration is consistent with a lethal dose introduced directly into the liquid, not a medicinal level from prescribed tablets.\n\nThe glass was handled after death. Fingerprints on the stem were partially wiped. One partial print remains, in a position inconsistent with drinking.",
      type: "forensic",
      severity: "critical",
      sceneId: "east-study",
      relatedSuspectIds: ["eleanor-marsh", "dr-aldous-vane"],
      relatedClueIds: ["foxglove-cuttings", "toxicology-report"],
    },
    {
      id: "locked-door",
      title: "The Locked Study Door",
      description:
        "The East Study door was locked from the inside with a deadbolt. The single key was found in Edmund's waistcoat pocket. The window was latched from inside. The chimney flue is sealed.\n\nThere is no mechanism by which the door could have been locked from outside — unless it was locked before Edmund died. A man who knew he was in danger might lock his own door. Or someone with sufficient knowledge of the household could have engineered the situation.",
      type: "observation",
      severity: "high",
      sceneId: "east-study",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["brandy-glass"],
    },
    {
      id: "telephone-log",
      title: "The Telephone Log",
      description:
        "The hall telephone at Thornwood Hall recorded a call placed at 10:52 PM — to a London number registered to a private holding company. Edmund Thornwood was already dead by 10:52 PM, according to Dr. Vane's estimate of time of death.\n\nSomeone in this house made a telephone call in the minutes following Edmund's death and before his body was discovered. The holding company's registered director is not publicly listed.",
      type: "document",
      severity: "high",
      sceneId: "east-study",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["banking-records"],
    },
    {
      id: "foxglove-cuttings",
      title: "Foxglove in the Greenhouse",
      description:
        "A clump of foxglove plants in the Thornwood greenhouse has been recently and deliberately pruned — not trimmed for growth, but harvested. Several thick stems have been removed and the cuttings disposed of. Foxglove (Digitalis purpurea) contains cardiac glycosides, including digoxin.\n\nA sufficiently concentrated preparation from fresh foxglove material, introduced into a liquid, would not be detectable by standard post-mortem examination without a targeted toxicology screen. This is not common knowledge. This is specific knowledge.",
      type: "physical",
      severity: "critical",
      sceneId: "greenhouse",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["brandy-glass", "toxicology-report"],
    },
    {
      id: "pruning-shears",
      title: "The Pruning Shears",
      description:
        "A pair of gardening shears found on the potting bench in the greenhouse. Recently used — the blades are clean but still faintly damp, and a single foxglove leaf is caught in the hinge. The shears are part of the household tool set, accessible to anyone with knowledge of the greenhouse.\n\nThe staff were dismissed Friday evening. Only household members and guests remained. The greenhouse key hangs in the kitchen passage — Eleanor Marsh would know exactly where.",
      type: "physical",
      severity: "medium",
      sceneId: "greenhouse",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["foxglove-cuttings"],
    },
    {
      id: "banking-records",
      title: "Eleanor's Banking Records",
      description:
        "Bank transfer records found in Eleanor Marsh's office filing cabinet, partially destroyed but reconstructed. They document a series of transfers from Thornwood estate accounts to a private holding company over the past six years. The amounts are consistent — never large enough to trigger a formal audit, always structured to appear as legitimate operational expenses.\n\nThe holding company is registered to a nominee director. But the correspondence address on the earliest documents is Eleanor Marsh's private flat in York.",
      type: "document",
      severity: "critical",
      sceneId: "eleanors-desk",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["telephone-log", "sophies-letter"],
    },
    {
      id: "missing-ledger-pages",
      title: "The Missing Ledger Pages",
      description:
        "Three pages have been excised from the household accounts ledger in Eleanor's office. The removal is precise — a single straight cut close to the binding, the kind made with a letter opener or blade rather than torn by hand. The remaining entries show nothing unusual for the weeks surrounding the removed pages.\n\nThe gap in the ledger's sequence corresponds to the months in which the estate's solicitor first flagged a discrepancy in the accounts — a discrepancy Edmund Thornwood apparently chose to investigate personally.",
      type: "document",
      severity: "high",
      sceneId: "eleanors-desk",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["banking-records"],
    },
    {
      id: "sophies-letter",
      title: "Sophie's Warning Letter",
      description:
        "A handwritten note, partially charred, retrieved from behind the fireplace grate in the guest wing attic. Written in a hurried hand on solicitor's notepaper: *'He knows, E. He intends to act by Monday. Burn this.'*\n\nThe 'E' is almost certainly Eleanor Marsh. Sophie Caldwell, who claims to have left before dinner, is the only person in the house connected to the solicitor's office. The amended will — the one Edmund signed three days ago — would have exposed everything.",
      type: "document",
      severity: "critical",
      sceneId: "guest-wing",
      relatedSuspectIds: ["eleanor-marsh", "sophie-caldwell"],
      relatedClueIds: ["banking-records", "telephone-log"],
    },
    {
      id: "victorias-photographs",
      title: "Victoria's Photographs",
      description:
        "A set of photographs found in Victoria Thornwood's camera bag. She is a photojournalist by profession and, apparently, habit. The photographs, taken from her room window with a telephoto lens, show Eleanor Marsh entering the East Study at 10:15 PM — nearly an hour before Edmund was found dead, and at least 45 minutes after Eleanor claims she was in the kitchen.\n\nVictoria has not volunteered these photographs. She knows what they show.",
      type: "physical",
      severity: "high",
      sceneId: "guest-wing",
      relatedSuspectIds: ["eleanor-marsh", "victoria-thornwood"],
      relatedClueIds: ["locked-door"],
    },
    {
      id: "james-gambling-debt",
      title: "James's Gambling Debt",
      description:
        "A handwritten IOU found in James Thornwood's room. £80,000 owed to a name his housekeeper will later identify as associated with a London loan operation. The debt is three months overdue.\n\nJames Thornwood had the most obvious motive for his father's death — a will he expected to inherit from. But the amended will, had it stood, would have left him nothing. He is a man under extreme financial pressure. He is not, however, a poisoner. His panic is the panic of debt, not guilt.",
      type: "testimony",
      severity: "medium",
      sceneId: "guest-wing",
      relatedSuspectIds: ["james-thornwood"],
      relatedClueIds: [],
    },
    {
      id: "missing-prescription",
      title: "The Missing Prescription Records",
      description:
        "Dr. Vane's medical bag, examined at the request of the investigating officer, contains no prescription records for Edmund Thornwood. Vane claims he left them in his car. His car has been searched. They are not there.\n\nVane prescribed Edmund sedatives — specifically digitalis-derived compounds — for a cardiac arrhythmia diagnosed eighteen months ago. If those records showed the prescribed dosage, they would establish a baseline against which the toxicology results could be measured. Without them, the lethal dose is harder to prove was externally introduced.",
      type: "document",
      severity: "high",
      sceneId: "east-study",
      relatedSuspectIds: ["dr-aldous-vane", "eleanor-marsh"],
      relatedClueIds: ["brandy-glass", "toxicology-report"],
    },
    {
      id: "toxicology-report",
      title: "The Toxicology Report",
      description:
        "The pending toxicology screen, now returned from the laboratory, confirms what the brandy glass suggested. Edmund Thornwood's blood contains digoxin at a level eight times the therapeutic maximum — far in excess of any prescribed dosage, and consistent with acute poisoning.\n\nThe method of introduction was almost certainly oral. The brandy was the vehicle. The cardiac arrest was not natural. Edmund Thornwood was murdered.",
      type: "forensic",
      severity: "critical",
      sceneId: "east-study",
      relatedSuspectIds: ["eleanor-marsh"],
      relatedClueIds: ["brandy-glass", "foxglove-cuttings"],
    },
  ],

  timeline: [
    {
      id: "dinner",
      time: "6:30 PM",
      sortKey: 1_830,
      description:
        "Edmund Thornwood hosts dinner for family and guests in the main dining room. The atmosphere is described as 'civil but brittle.' Edmund drinks wine. Eleanor Marsh serves.",
      suspectIds: ["james-thornwood", "eleanor-marsh", "dr-aldous-vane", "constance-thornwood", "victoria-thornwood", "sophie-caldwell"],
      clueIds: [],
      isKeyEvent: false,
    },
    {
      id: "argument",
      time: "8:15 PM",
      sortKey: 2_015,
      description:
        "Edmund and Constance are overheard arguing in the drawing room. The subject, according to James who was passing in the corridor, was 'money — it was always money.' Constance later denies the argument took place.",
      suspectIds: ["constance-thornwood", "james-thornwood"],
      clueIds: [],
      isKeyEvent: false,
    },
    {
      id: "staff-dismissed",
      time: "9:00 PM",
      sortKey: 2_100,
      description:
        "Edmund dismisses the household staff for the evening. From this point, only Edmund, his guests, and Eleanor Marsh remain in the house.",
      suspectIds: [],
      clueIds: [],
      isKeyEvent: false,
    },
    {
      id: "eleanor-enters-study",
      time: "10:15 PM",
      sortKey: 2_215,
      description:
        "Eleanor Marsh is photographed entering the East Study. This directly contradicts her stated alibi of being in the kitchen. She is seen carrying a small tray — consistent with the brandy glass. She remains inside for an estimated 12 minutes.",
      suspectIds: ["eleanor-marsh"],
      clueIds: ["victorias-photographs", "brandy-glass"],
      isKeyEvent: true,
    },
    {
      id: "telephone-call",
      time: "10:52 PM",
      sortKey: 2_252,
      description:
        "The hall telephone is used to place a call to a London number. Edmund Thornwood is already dead at this time. The call lasts four minutes. No one has admitted to making it.",
      suspectIds: ["eleanor-marsh"],
      clueIds: ["telephone-log"],
      isKeyEvent: true,
    },
    {
      id: "body-found",
      time: "11:14 PM",
      sortKey: 2_314,
      description:
        "Edmund Thornwood is found dead in the East Study by James Thornwood, who became concerned when his father did not answer his knock. The door is locked. James breaks the upper glass panel to reach the inside bolt.",
      suspectIds: ["james-thornwood"],
      clueIds: ["locked-door"],
      isKeyEvent: true,
    },
    {
      id: "vane-pronounces",
      time: "11:20 PM",
      sortKey: 2_320,
      description:
        "Dr. Vane examines the body and pronounces cause of death as cardiac arrest, consistent with Edmund's known cardiac condition. He does not immediately recommend a toxicology screen. James Thornwood later insists one was ordered regardless.",
      suspectIds: ["dr-aldous-vane"],
      clueIds: ["missing-prescription"],
      isKeyEvent: false,
    },
    {
      id: "police-arrive",
      time: "11:45 PM",
      sortKey: 2_345,
      description:
        "Police arrive at Thornwood Hall following a call placed by James Thornwood. All guests are asked to remain on the premises. Eleanor Marsh is calm. She has, she will later say, been waiting.",
      suspectIds: [],
      clueIds: [],
      isKeyEvent: false,
    },
  ],

  solution: {
    killerId: "eleanor-marsh",
    motive:
      "Thornwood discovered she had been embezzling from his estate for six years. The amended will would have exposed everything — it named Eleanor as sole executor, a provision she had inserted herself when Edmund trusted her completely. Once Edmund discovered the fraud, he intended to revoke the will and expose her on Monday.",
    method:
      "A concentrated preparation of digoxin extracted from fresh foxglove cuttings taken from the greenhouse, introduced into Edmund's evening brandy. Undetectable without a targeted toxicology screen — which Eleanor attempted to prevent by stealing Dr. Vane's prescription records and destroying the ledger entries that would have established the financial motive.",
    narrativeReveal:
      "Eleanor Marsh had served Edmund Thornwood faithfully for twelve years — and stolen from him for six. She was meticulous, composed, and nearly invisible. That was her greatest weapon and her deepest tell. The composure that read as loyalty was the composure of a woman who had been rehearsing this scenario for years.",
    twist:
      "The amended will did not disinherit James. It left everything to a charitable trust — cutting out the entire family. Eleanor was the sole named executor. She would have controlled millions. She had drafted the amendment herself, months earlier, waiting for the right moment to present it. Edmund had signed it without understanding what he was signing.",
    endings: [
      {
        condition: "correct",
        title: "Justice Served",
        narrative:
          "You placed the accusation before the inspector with the quiet confidence of someone who had earned it. Eleanor Marsh was taken into custody at 3:47 AM. She did not resist. She had, she said, been waiting for someone to look closely enough. The thread, once found, had pulled everything with it.",
      },
      {
        condition: "wrong",
        title: "The Thread Slipped",
        narrative:
          "The person you accused looked at you with something between pity and contempt. The real killer watched from across the room, composed as ever. You had followed the wrong thread — and now the right one had gone cold forever.",
      },
      {
        condition: "incomplete",
        title: "Case Unsolved",
        narrative:
          "You made your accusation before the evidence was ready. The inspector shook his head slowly. 'Not enough,' he said. 'Not nearly enough.' Somewhere in Thornwood Hall, a door closed softly.",
      },
    ],
  },
};
