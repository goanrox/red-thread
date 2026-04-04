import type { Case } from "@/types";

// Phase 1 Case — The Thornwood Affair
// Full data will be authored in Phase 1 build.
// This stub ensures the data registry compiles.

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
    },
  },

  setting: "Thornwood Hall, Yorkshire",
  settingDescription:
    "A Victorian country estate on the edge of the moors. The house smells of old paper and older grievances. The staff have been dismissed for the weekend. It is raining.",

  briefing:
    "Edmund Thornwood was found dead at 11:14 PM on Saturday, November 9th, slumped in his leather chair in the East Study. The door was locked from the inside. A glass of brandy — half-finished — sat on the desk beside him. The will, which his solicitor confirms was amended three days prior, is nowhere to be found.\n\nThe attending physician, Dr. Aldous Vane, noted the cause of death as cardiac arrest — but the toxicology screen is still pending. Four people were in the house that evening. All four have motives. All four are lying about something.\n\nFind the thread. Pull it.",

  suspects: [],
  scenes: [],
  clues: [],
  timeline: [],

  solution: {
    killerId: "eleanor-marsh",
    motive: "Thornwood discovered she had been embezzling from his estate for six years. The amended will would have exposed everything.",
    method:
      "A slow-acting cardiac glycoside introduced into his evening brandy. Undetectable without a targeted toxicology screen — which she intended to prevent by stealing the medical records.",
    narrativeReveal:
      "Eleanor Marsh had served Edmund Thornwood faithfully for twelve years — and stolen from him for six. She was meticulous, composed, and nearly invisible. That was her greatest weapon and her deepest tell.",
    twist:
      "The amended will did not disinherit James. It left everything to a charitable trust — cutting out the entire family. Eleanor was the sole named executor. She would have controlled millions.",
    endings: [
      {
        condition: "correct",
        title: "Justice Served",
        narrative:
          "You placed the accusation before the inspector with the quiet confidence of someone who had earned it. Eleanor Marsh was taken into custody at 3:47 AM. She did not resist. She had, she said, been waiting for someone to look closely enough.",
      },
      {
        condition: "wrong",
        title: "The Thread Slipped",
        narrative:
          "The person you accused looked at you with something between pity and contempt. The real killer watched from across the room, composed as ever. You had followed the wrong thread — and now the right one had gone cold.",
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
