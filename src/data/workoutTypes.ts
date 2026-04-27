import type { WorkoutType, WorkoutTypeDetail } from '@/types';

export const WORKOUT_TYPES: Record<WorkoutType, WorkoutTypeDetail> = {
  easy: {
    name: 'Easy Run',
    flow: [
      {
        phase: 'Warm-up',
        duration: '8 Min',
        desc: '3 Min locker gehen → traben (Puls 110-120). Dann 4 Min dynamische Mobilisation: Beinpendel vor/zurück 30s · Beinpendel seitlich 30s · Hüftkreisen 30s · Walking Lunges mit Rotation 30s · High Knees 30s · Butt Kicks 30s. Dann 1 Min Übergang in Lauf-Tempo.',
      },
      {
        phase: 'Hauptteil',
        duration: 'siehe Plan',
        desc: 'Locker in Z2 (134–147 bpm). Du sollst durchgehend reden können. Wenn Puls über 150 geht – langsamer werden, notfalls gehen. Pace ist nicht relevant – Puls ist Master.',
      },
      {
        phase: 'Cool-Down',
        duration: '5 Min',
        desc: '3-5 Min ruhig auslaufen / locker gehen bis Puls unter 120. Danach Wasser trinken.',
      },
    ],
    blackroll:
      'Slot 1 (5 Min): Waden 60s/Bein, Quads 60s/Bein, Hamstrings 45s/Bein, IT-Band 30s/Bein, Po 30s/Seite',
    pre: {
      time: '30-60 Min vorher',
      options: [
        '1 Banane + 1 EL Erdnussmus (250 kcal)',
        '1 Scheibe Vollkornbrot mit Honig + 2 Datteln',
        'Bei <45 Min Easy Run: nüchtern + Glas Wasser + Kaffee ist auch okay',
      ],
    },
    post: {
      time: 'innerhalb 60 Min',
      options: [
        'Vollwertiges Frühstück: Haferbrei + Beeren + Quark + Nüsse',
        'Recovery-Smoothie: 200g Skyr + Banane + Beeren + 30g Hafer + Erdnussmus + Milch',
        'Eier + Vollkornbrot + Avocado',
      ],
    },
    notes:
      'Easy heißt EASY. Wenn die Pace dir zu langsam vorkommt, ist es genau richtig. Der ganze Trick von Phase 1: aerobe Basis aufbauen – später schnellere Pace bei gleichem Puls.',
  },

  long: {
    name: 'Long Run',
    flow: [
      {
        phase: 'Warm-up',
        duration: '8 Min',
        desc: 'Wie bei Easy Run: 3 Min gehen/traben + dynamische Mobilisation + Übergang in Lauftempo.',
      },
      {
        phase: 'Hauptteil',
        duration: 'siehe Plan',
        desc: 'Locker in Z2 (134–147 bpm). Erste 10 Min ganz bewusst SEHR langsam — lieber zu langsam starten. HF wird über die Zeit driften (cardiac drift), das ist normal. Bei Long Runs >90 Min: alle 30–40 Min eine Energy Ball oder Datteln essen.',
      },
      {
        phase: 'Cool-Down',
        duration: '5–10 Min',
        desc: '5 Min auslaufen + leichtes statisches Dehnen: Waden, Quads, Hüftbeuger, Hamstrings, Po (je 20–30s, sanft).',
      },
    ],
    blackroll:
      'Slot 1 + Knie-Spezial (10 Min): Standard-Routine + Vastus Medialis und IT-Band gründlich',
    pre: {
      time: '1,5–2 h vorher',
      options: [
        "Mats' Long-Run-Hafer (Standard): 80g Haferflocken + 250ml Milch + Banane + 1 EL Erdnussmus + 1 TL Honig + Zimt + Kaffee",
        '3 Scheiben Vollkornbrot mit Erdnussmus + Banane + Kaffee',
        '30 Min vorher zusätzlich: 2–3 Datteln',
      ],
    },
    during: {
      time: 'ab 75 Min Lauf',
      options: [
        '4–5 Datteln oder Rosinen alle 30–40 Min',
        '1 Energy Ball alle 40 Min',
        '500–750 ml/h Wasser mit Elektrolyten (DIY: Wasser + Prise Salz + 1 TL Honig + Zitrone)',
      ],
    },
    post: {
      time: 'innerhalb 30–60 Min · WICHTIG nach Long Run',
      options: [
        'Recovery-Smoothie als erstes (200g Skyr + Banane + Beeren + 30g Hafer + Erdnussmus + Milch)',
        'Großes Frühstück: Rührei + Vollkornbrot + Avocado + Smoothie mit Quark + Beeren',
        'Familien-Brunch: Eier + Brot + Käse + Obst + Kaffee',
      ],
    },
    notes:
      'Long Run ist der wichtigste Lauf der Woche. Lieber etwas kürzer und entspannt als zu hart. Frühstück wirklich 1,5h vorher — sonst Magenprobleme. Samstagabend früh ins Bett.',
  },

  tempo: {
    name: 'Tempo / Quality',
    flow: [
      {
        phase: 'Warm-up extended',
        duration: '12–15 Min',
        desc: '5 Min locker traben + dynamische Mobilisation + 4×100m Steigerungen (jeweils 100m: gemütlich → mittel → schnell, ohne Vollsprint) + 2 Min Pause vor Hauptbelastung.',
      },
      {
        phase: 'Hauptteil',
        duration: 'siehe Plan',
        desc: 'In Z4 (161–173 bpm) bzw. HM-Pace 5:40/km laut Plan. Bei Intervallen: Pace und Atmung beobachten. Trab-Pausen WIRKLICH locker (Z1–Z2). Wenn das letzte Intervall zerfällt — abbrechen, nicht Pace halten um den Preis.',
      },
      {
        phase: 'Cool-Down',
        duration: '5–10 Min',
        desc: '5 Min ruhig auslaufen + leichtes Dehnen.',
      },
    ],
    blackroll: 'Slot 1 + Knie-Spezial (10 Min): besonders gründlich nach Tempo-Einheiten',
    pre: {
      time: '60–90 Min vorher',
      options: [
        'Hafer-light: 50g Haferflocken + Milch + 1 Banane + 1 TL Honig (~50g Carbs)',
        '2 Scheiben Vollkornbrot mit Honig + 1 Banane',
        '30 Min vorher: 1 Espresso (Performance-Plus)',
      ],
    },
    post: {
      time: 'innerhalb 60 Min',
      options: [
        'Schnellverfügbare Carbs + Protein: Reis mit Linsen + Gemüse + Joghurt',
        'Pasta mit Tomatensauce + Käse + Salat',
        'Recovery-Smoothie + Brot mit Hummus',
      ],
    },
    notes:
      'Quality-Einheit. NICHT machen wenn schlecht geschlafen, krank oder mehrere Tage gestresst. Lieber auf Easy umlegen. Diese Einheit ist hochintensiv — Vorbelastung beachten.',
  },

  test: {
    name: 'Test',
    flow: [
      {
        phase: 'Warm-up extended',
        duration: '10–12 Min',
        desc: '8 Min locker traben + Mobilisation + 4×100m Steigerungen + 2 Min Pause.',
      },
      {
        phase: 'Hauptteil',
        duration: 'siehe Plan',
        desc: 'TEST A (W8): 30 Min konstant in Z2 (Ziel 142 bpm) — tracke Pace bei dieser HF.\nTEST B (W14): 10K Time Trial Race-Effort — Zeit + HF.\nTEST C (W20): 16K bei HM-Pace 5:40 — tracke HF-Drift (Ziel <5 bpm).',
      },
      {
        phase: 'Cool-Down',
        duration: '10 Min',
        desc: '10 Min ruhig auslaufen, Daten in App eintragen.',
      },
    ],
    blackroll: 'Slot 1 + Knie-Spezial (10 Min)',
    pre: {
      time: '90 Min vorher',
      options: [
        'Standard-Long-Run-Frühstück (siehe Long Run)',
        'Bei Test B (10K): zusätzlich 30 Min vorher 1 Espresso + 2 Datteln',
      ],
    },
    post: {
      time: 'innerhalb 60 Min',
      options: ['Recovery-Smoothie', 'Großes Frühstück mit viel Carbs und Protein'],
    },
    notes:
      'Test-Einheit. Möglichst flache Strecke wählen, Wetter beachten (nicht bei extremer Hitze/Kälte). Daten in App eintragen — wir verwenden sie zum Adapt der nächsten Phase.',
  },

  race: {
    name: 'Wettkampf',
    flow: [
      {
        phase: 'Warm-up',
        duration: '15–20 Min vor Start',
        desc: '10 Min locker traben + Mobilisation + 3–4×100m Steigerungen + 5 Min Pause vor Start.',
      },
      {
        phase: 'Wettkampf',
        duration: '21,1 km',
        desc: 'Ziel-Pace 5:40/km für Sub-2h. Erste 5 km BEWUSST nicht zu schnell (Adrenalin macht 10–15s schneller als gedacht). Mitte: Pace halten. Letzte 5 km: ggf. minimal beschleunigen wenn noch Reserven.',
      },
      {
        phase: 'Cool-Down',
        duration: '10–15 Min',
        desc: 'Lockeres Auslaufen + langes Dehnen + viel trinken.',
      },
    ],
    blackroll: 'Erst nach 24 h Erholung wieder rollen',
    pre: {
      time: '3 h vorher',
      options: [
        "Vertrautes Frühstück (Mats' Long-Run-Hafer)",
        '30 Min vorher: 1 Banane + Espresso',
        '10 Min vorher: 2 Datteln + Schluck Wasser',
      ],
    },
    during: {
      time: 'ab km 8–10',
      options: [
        'Alle 4 km Datteln/Energy Ball',
        'An Verpflegungsstationen Wasser + ggf. Iso-Getränk',
        'Bei Hitze: alle 2 km Wasser-Schluck',
      ],
    },
    post: {
      time: 'innerhalb 30 Min',
      options: [
        'Recovery-Smoothie',
        'Banane + Brötchen + Salzstange im Zielbereich',
        'Großes Mittagessen 2–3 h nach Lauf',
      ],
    },
    notes:
      'Wettkampf-Tag. Nichts Neues ausprobieren. Vertraute Schuhe, vertrautes Frühstück, vertrautes Iso-Getränk. Tag vorher kein Alkohol. Ankunft 60 Min vor Start.',
  },
};
