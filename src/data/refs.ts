/**
 * Quick-Refs aus dem HTML-MVP übernommen.
 * body ist HTML — wird via dangerouslySetInnerHTML gerendert.
 * Inhalt ist von Mats kuratiert, kein User-Input → XSS-Risiko irrelevant.
 */

export type RefKey =
  | 'zones'
  | 'warmup'
  | 'strength'
  | 'supplements'
  | 'blood'
  | 'blackroll'
  | 'knee';

export interface QuickRef {
  title: string;
  body: string;
}

export const REFS: Record<RefKey, QuickRef> = {
  zones: {
    title: 'HF-Zonen',
    body: `<table style="width: 100%; font-size: 14px;">
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 10px 0;"><strong>Z1</strong></td><td>&lt; 133</td><td>Aufwärmen, Hund</td></tr>
      <tr style="background: var(--accent-bg); border-radius: 6px;"><td style="padding: 10px 8px;"><strong>Z2</strong></td><td>134–147</td><td><strong>Long Runs · 80%</strong></td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 10px 0;"><strong>Z3</strong></td><td>148–160</td><td>Mittelhart</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 10px 0;"><strong>Z4</strong></td><td>161–173</td><td>Tempo · Schwelle</td></tr>
      <tr><td style="padding: 10px 0;"><strong>Z5</strong></td><td>174 +</td><td>Intervalle</td></tr>
    </table>`,
  },

  warmup: {
    title: 'Aufwärm-Protokoll · 8 Min',
    body: `<ul class="bullets">
      <li><strong>0–3 Min:</strong> Locker gehen → leicht traben (Puls auf ~110–120)</li>
      <li><strong>3–7 Min:</strong> Beinpendel vorne/hinten + seitlich · Hüftkreisen · Walking Lunges m. Rotation · High Knees · Butt Kicks · je 30 Sek</li>
      <li><strong>7–8 Min:</strong> Übergang in Lauf-Tempo, gemütlich starten</li>
    </ul>
    <p style="margin-top: 14px; padding: 12px; background: var(--accent-bg); border-radius: 8px; font-size: 13px;"><strong>Vor Quality:</strong> + 4×100m Steigerungen + 2 Min Pause</p>
    <p style="margin-top: 10px; font-size: 12px; color: var(--ink-muted);">Statisches Dehnen vorher → weglassen (Leistungseinbuße belegt).</p>`,
  },

  strength: {
    title: 'Krafttraining · 25–30 Min',
    body: `<h3 class="h-sub">Mo · Beine + Core</h3>
    <ul class="bullets">
      <li>Kniebeuge · 3 × 15</li>
      <li>Ausfallschritte rückwärts · 3 × 10/Bein</li>
      <li>Single-Leg Glute Bridge · 3 × 12/Bein</li>
      <li>Wadenheben einbeinig · 3 × 15/Bein</li>
      <li>Plank · 3 × 45 Sek</li>
      <li>Bird Dog · 3 × 10/Seite</li>
      <li>Side Plank · 2 × 30 Sek/Seite</li>
    </ul>
    <h3 class="h-sub">Mi · Oberkörper + Core</h3>
    <ul class="bullets">
      <li>Liegestütze · 3 × 10–15</li>
      <li>Pike Push-Ups · 3 × 8</li>
      <li>Superman · 3 × 12</li>
      <li>Dead Bug · 3 × 10/Seite</li>
      <li>Hollow Hold · 3 × 30 Sek</li>
      <li>Russian Twist · 3 × 20</li>
    </ul>`,
  },

  supplements: {
    title: 'Supplement-Stack · ~20 €/Mt',
    body: `<table style="width: 100%; font-size: 13px;">
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Vitamin D3</strong> Okt–März</td><td>1000–2000 IU/Tag</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Vitamin B12</strong></td><td>1000 µg/Woche</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Omega-3 Algenöl</strong></td><td>1g EPA/DHA/Tag</td></tr>
      <tr><td style="padding: 8px 0;"><strong>Magnesium</strong></td><td>300 mg abends</td></tr>
    </table>
    <p style="margin-top: 14px; padding: 12px; background: var(--warn-bg); border-radius: 8px; font-size: 13px;"><strong>Eisen NUR nach Test</strong> · wenn Ferritin &lt; 30 ng/ml</p>
    <p style="margin-top: 10px; font-size: 12px; color: var(--ink-muted);">Marken: DM Mivolis (Basics), NaturTreu / Sunday Natural (Omega-3).</p>`,
  },

  blood: {
    title: 'Bluttest-Sportlerwerte',
    body: `<ul class="bullets">
      <li><strong>Ferritin</strong> · Ziel 40–90 ng/ml (NICHT Bevölkerungs-Normalbereich!)</li>
      <li><strong>25-OH-Vitamin D</strong> · Ziel &gt; 40 ng/ml</li>
      <li><strong>Vitamin B12 (Holo-TC)</strong> · Ziel &gt; 50 pmol/l</li>
      <li><strong>Hämoglobin · TSH · Großes Blutbild</strong></li>
    </ul>
    <h3 class="h-sub">Wo</h3>
    <ul class="bullets">
      <li>Hausarzt + IGeL · ~50–80 €</li>
      <li>cerascreen Heimtest · ~80 €</li>
    </ul>
    <h3 class="h-sub">Wann</h3>
    <ul class="bullets">
      <li>Jetzt · Baseline</li>
      <li>Spätwinter · Vit-D-Tief</li>
      <li>Spätsommer · Eisenstatus</li>
    </ul>`,
  },

  blackroll: {
    title: 'Blackroll · 3 Slots',
    body: `<h3 class="h-sub">Slot 1 · Nach jedem Lauf · 5 Min</h3>
    <table style="width: 100%; font-size: 13px;">
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Waden</strong></td><td>60 Sek/Bein</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Quadrizeps</strong></td><td>60 Sek/Bein, Bauchlage</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Hamstrings</strong></td><td>45 Sek/Bein, sitzend</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>IT-Band</strong> (außen)</td><td>30 Sek/Bein · darf weh</td></tr>
      <tr><td style="padding: 8px 0;"><strong>Po</strong> (Figur 4)</td><td>30 Sek/Seite</td></tr>
    </table>

    <h3 class="h-sub">Slot 2 · Mi oder Fr · 10 Min</h3>
    <p style="font-size: 13px; color: var(--ink-soft); margin-bottom: 8px;">Wie Slot 1 mit 90 Sek/Bereich, plus:</p>
    <ul class="bullets">
      <li>Oberer Rücken (Roller quer, Arme verschränkt) · 60 Sek</li>
      <li>BWS mobilisieren (Roller quer, Arme über Kopf) · 60 Sek · NICHT in Lendenbereich!</li>
    </ul>

    <h3 class="h-sub">Knie-Spezial · Sa/So · +5 Min</h3>
    <ul class="bullets">
      <li><strong>Quadrizeps</strong> alle 4 Stränge – außen, mittig, innen</li>
      <li><strong>IT-Band</strong> gründlich · Hauptverdächtiger bei Läufer-Knie</li>
      <li><strong>Vastus Medialis</strong> (innerer Quad direkt überm Knie) mit Ball · sanft</li>
      <li><strong>Wadenmuskulatur tief</strong> mit Ball · Triggerpunkte suchen</li>
    </ul>

    <h3 class="h-sub">Massageball · Spot-Treatment</h3>
    <table style="width: 100%; font-size: 13px;">
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Plantarfaszie</strong></td><td>60 Sek/Fuß · morgens</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Po-Triggerpunkt</strong></td><td>60 Sek/Seite</td></tr>
      <tr style="border-bottom: 1px solid var(--line);"><td style="padding: 8px 0;"><strong>Tibialis</strong> (Schienbein außen)</td><td>45 Sek/Bein · sanft</td></tr>
      <tr><td style="padding: 8px 0;"><strong>Schulterblatt an Wand</strong></td><td>60 Sek/Seite</td></tr>
    </table>

    <p style="margin-top: 14px; padding: 12px; background: var(--warn-bg); border-radius: 8px; font-size: 13px;"><strong>Nicht rollen:</strong> direkt auf Gelenken · Wirbelsäule (nur Muskeln daneben) · Innenseite Oberschenkel · bei akuten Verletzungen</p>

    <p style="margin-top: 10px; font-size: 12px; color: var(--ink-muted);">Bei schmerzhaften Punkten 20–30 Sek bleiben und atmen, bis der Schmerz nachlässt.</p>`,
  },

  knee: {
    title: 'Knie · sofort pausieren',
    body: `<ul class="bullets">
      <li>Schmerz hinter der Kniescheibe beim Bergablaufen</li>
      <li>Knirschen mit Schmerz</li>
      <li>Schmerz nach 10 Min Lauf nicht weg / wird schlimmer</li>
    </ul>
    <p style="margin-top: 14px; padding: 12px; background: var(--warn-bg); border-radius: 8px; font-size: 13px;"><strong>1 Woche Pause</strong> + Kraft + Spazieren. Nach 1 Woche nicht weg → <strong>Physio</strong>.</p>`,
  },
};
