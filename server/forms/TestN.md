---
title: "Wie kann KI in der Pflege helfen?"
description: "Ihre Erfahrung mit Künstlicher Intelligenz in der Pflege."
thankYou:
  heading: "Vielen Dank!"
  body: "Ihre Antworten wurden erfolgreich gespeichert."
---

# Datenschutz-Einwilligung ⚖️
- type: single_choice
- required: true
- id: consent
- options:
  - text: Ich stimme der anonymen Auswertung meiner Antworten zu.
    description: Pflichtfeld zur Teilnahme

---

# Land? 🌍
- type: single_choice
- required: false
- id: country_of_activity
- has_other: true
- help: In welchem Land sind Sie aktuell beruflich tätig?
- options:
  - 🇨🇭 Schweiz
  - 🇩🇪 Deutschland
  - 🇦🇹 Österreich

---

# Wie alt sind Sie? 🎂
- type: single_choice
- required: false
- id: alter
- options:
  - Unter 20
  - 20 - 29
  - 30 - 39
  - 40 - 49
  - 50 - 59
  - 60 - 69
  - 70 oder älter

---

# Ihr Geschlecht? 👤
- type: single_choice
- required: false
- id: geschlecht
- help: Welchem Geschlecht ordnen Sie sich zu?
- options:
  - Weiblich
  - Männlich
  - Divers
  - Keine Angabe

---

# Ihr Arbeitsumfeld? 🏥
- type: single_choice
- required: false
- id: arbeitsumfeld_pflege
- has_other: true
- help: In welchem Bereich waren Sie in den letzten 6 Monaten primär tätig?
- options:
  - Krankenhaus (Stationär)
  - Krankenhaus (Funktionsbereich / Notaufnahme / OP)
  - Pflegeheim / Stationäre Altenpflege
  - Ambulanter Pflegedienst
  - Tagespflege / Betreutes Wohnen

---

# Ihre Position / Qualifikation? 🎓
- type: single_choice
- required: false
- id: qualifikation
- has_other: true
- help: Was ist Ihre höchste Qualifikation?
- options:
  - Auszubildende/r
  - Pflegehelfer / Pflegeassistent
  - Fachperson für Gesundheit (FaGe)
  - Pflegefachkraft (Examiniert/Diplomiert)
  - Nachdiplomstudium

---

# Anzahl der Mitarbeitenden in Ihrer Einrichtung? 👥
- type: single_choice
- required: false
- id: mitarbeiter_anzahl
- help: Bitte schätzen Sie die Gesamtzahl aller Mitarbeitenden in Ihrer Einrichtung.
- options:
  - 1 – 9 (z. B. Einzelpraxis)
  - 10 – 49 (z. B. Gemeinschaftspraxis / MVZ)
  - 50 – 249 (z. B. Großes MVZ / Fachklinik)
  - 250 – 999 (z. B. Allgemeines Krankenhaus)
  - 1.000 – 5.000 (z. B. Großklinikum)
  - Über 5.000 (z. B. Maximalversorger)
  - Ich weiß es nicht

---

# Anzahl zu betreuender Patienten? 🛌
- type: single_choice
- required: false
- id: patienten_ratio
- help: Für wie viele Patienten sind Sie während einer Schicht durchschnittlich verantwortlich?
- options:
  - 1 – 5
  - 6 – 10
  - 11 – 15
  - 16 – 20
  - 21 – 30
  - Mehr als 30

---

# Aktuelles Dokumentationssystem? 💻
- type: short_text
- required: false
- id: doku_software
- placeholder: "z.B. KISIM, SAP, Orbis, Papier..."
- help: Welche Software nutzen Sie überwiegend für die Pflegedokumentation?

---

# Zeitaufwand für Dokumentation? ⏱️
- type: single_choice
- required: false
- id: anteil_doku_zeit
- help: Wie viel Zeit Ihrer Schicht verbringen Sie schätzungsweise mit Administration?
- options:
  - < 10%
  - 10 – 20%
  - 20 – 30%
  - 30 – 40%
  - 40 – 50%
  - > 50%

---

# KI-Chatbot Nutzung PRIVAT (z.B. ChatGPT)? 🏠
- type: single_choice
- required: false
- id: ki_nutzung_privat
- help: Nutzen Sie generative KI-Tools im PRIVATEN Umfeld?
- options:
  - Täglich
  - Wöchentlich
  - Monatlich
  - Weniger als 1x im Monat
  - Nie

---

# KI-Chatbot Nutzung BERUFLICH (Häufigkeit)? 💼
- type: single_choice
- required: false
- id: ki_nutzung_beruf_frequenz
- help: Wie häufig nutzen Sie generative KI-Tools im BERUFLICHEN Kontext?
- options:
  - Täglich
  - Wöchentlich
  - Monatlich
  - Weniger als 1x im Monat
  - Nie

---

# Wofür nutzen Sie KI-Chatbots aktuell BERUFLICH? 🛠️
- type: multiple_choice
- required: false
- id: ki_nutzung_pflege_inhalte
- depends_on: ki_nutzung_beruf_frequenz
- show_when: [Täglich, Wöchentlich, Monatlich, Weniger als 1x im Monat]
- has_other: true
- help: Für welche Aufgaben setzen Sie die KI ein?
- options:
  - text: Pflegeberichte formulieren
    description: Hilfe bei Formulierungen
  - text: Übersetzungen
    description: Kommunikation mit fremdsprachigen Patienten
  - text: Fachwissen & Recherche
    description: Infos zu Medikamenten oder Krankheitsbildern
  - text: E-Mails & Schriftverkehr
    description: Kommunikation mit Ärzten oder Verwaltung
  - text: Übergabe vorbereiten
    description: Zusammenfassen von Informationen
  - text: Pflegeprozess
    description: Ideen für Maßnahmenplanung
  - text: Dienstplan / Orga
    description: Tauschwünsche oder organisatorische Fragen
  - text: Angehörigen-Kommunikation
    description: Formulieren von Briefen oder Infos

---

# Hindernisse für KI-Nutzung in der Pflege? 🛑
- type: multiple_choice
- required: false
- id: ki_hindernisse_pflege
- has_other: true
- help: Warum nutzen Sie KI-Tools bisher nicht im Dienst?
- options:
  - text: Keine Hardware verfügbar
    description: Kein Zugang zu PC/Tablet/Smartphone am Bett
  - text: Datenschutz
    description: Sorge um Patientendaten
  - text: Hygiene / Keimverschleppung
    description: Tastatur/Screen im Patientenkontakt unpraktisch
  - text: Verbot durch Arbeitgeber
    description: Nutzung ist untersagt
  - text: Zu kompliziert
    description: Keine Zeit für Einarbeitung im Stress
  - text: Fehlende Integration
    description: Nicht in bestehende Software eingebunden
  - text: Mangelndes Wissen
    description: Unsicherheit bei der Bedienung
  - text: Sorge vor Fehlern
    description: Angst vor falschen Infos durch KI

---

# Wo wünschen Sie mehr KI-Unterstützung? 🚀
- type: grid
- required: false
- id: ki_wunsch_pflege
- help: Wo wünschen Sie sich künftig (mehr) Unterstützung durch KI?
- options:
  - text: Unbedingt
    description: Dringende Entlastung nötig
  - text: Gerne
    description: Wäre hilfreich
  - Egal
  - text: Ungern
    description: Dafür möchte ich eher keine KI
  - text: Nein
    description: Mache ich lieber selbst
  - text: Vorhanden
    description: Hier nutze ich bereits KI
- statements:
  - Sprache-zu-Bericht für Pflegeberichte
  - Automatisierte Dienstplan-Erstellung
  - Wunddokumentation (Analyse per Foto)
  - Übersetzung (Dolmetscher-Funktion)
  - Angehörigengespräche
  - Übergabe-Protokoll
  - Medikamenten-Check
  - Interpretation Vitalwerte
  - Sturzerkennung
  - Einarbeitung neuer Kollegen

---

# Fühlen Sie sich vorbereitet? 📖
- type: single_choice
- required: false
- id: ki_kompetenz_training
- help: Wie gut fühlen Sie sich auf den Einsatz von KI vorbereitet?
- options:
  - text: Sehr gut vorbereitet
    description: Regelmäßige Schulungen
  - text: Eher gut
    description: Gelegentliche Angebote
  - text: Mittelmäßig
    description: Grundwissen, aber keine Vertiefung
  - text: Schlecht
    description: Kaum Berührungspunkte
  - text: Gar nicht
    description: Thema existiert nicht

---

# Führen Sie Anamnesen durch? 📋
- type: single_choice
- required: false
- id: performs_anamnesis
- help: Erfassen Sie gesundheitliche Beschwerden der Patienten?
- options:
  - Ja
  - Nein

---

# Wie häufig sind Dritte in Hörweite? 👂
- type: single_choice
- required: false
- id: problem_privatsphaere
- depends_on: performs_anamnesis
- show_when: Ja
- help: Wie oft führen Sie sensible Gespräche, während Dritte mithören können?
- options:
  - Täglich
  - Wöchentlich
  - Selten
  - Nie

---

# Wie oft ist die Anamnese unvollständig? 🔍
- type: single_choice
- required: false
- id: problem_datenluecken
- help: Wie oft fehlen wichtige Details im Erstgespräch?
- options:
  - Sehr oft (Fast täglich)
  - Gelegentlich
  - Selten
  - Nie

---

# Größter Zeitfresser? ⏳
- type: long_text
- required: false
- id: zeitfresser_pflege
- placeholder: "Beschreiben Sie die Tätigkeit..."
- help: Welche Tätigkeit würden Sie am liebsten sofort an eine KI abgeben?

---

# Ergebnisse erhalten? 📨
- type: single_choice
- required: false
- id: whitepaper_optin
- help: Möchten Sie die Ergebnisse dieser Studie erhalten?
- options:
  - Ja, gerne
  - Nein, danke

---

# E-Mail-Adresse? 📧
- type: short_text
- required: false
- id: whitepaper_email
- placeholder: "name@pflege.de"
- depends_on: whitepaper_optin
- show_when: "Ja, gerne"
- help: An welche E-Mail-Adresse dürfen wir die Ergebnisse senden?

---

# Interview? 💬
- type: single_choice
- required: false
- id: interested_in_interview
- depends_on: whitepaper_optin
- show_when: "Ja, gerne"
- help: Dürfen wir Sie zu einem 15-minütigen Expertengespräch einladen?
- options:
  - Ja, gerne
  - Nein, danke
