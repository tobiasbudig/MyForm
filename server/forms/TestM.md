---
title: Wie kann KI in der Praxis helfen?
description: Ihre Erfahrung mit Künstlicher Intelligenz in medizinischen Fachberufen
thankYou:
  heading: Vielen Dank!
  body: Ihre Antworten wurden erfolgreich gespeichert.
---

# Datenschutz-Einwilligung ⚖️
- type: single_choice
- required: true
- id: consent
- options:
  - text: Ich stimme der anonymen Auswertung meiner Antworten zu.
    description: Pflichtfeld zur Teilnahme

---

# Land? 📍
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

# Ihr Tätigkeitsumfeld? 🏥
- type: single_choice
- required: false
- id: arbeitsumfeld
- has_other: true
- help: In welchem Setting sind Sie primär tätig?
- options:
  - Einzelpraxis
  - Gemeinschaftspraxis / MVZ
  - Klinik (Stationär)
  - Klinik (Ambulanz / Notaufnahme)

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

# Ihre Fachrichtung? 🩺
- type: short_text
- required: false
- id: fachrichtung
- placeholder: z.B. Kardiologie, Allgemeinmedizin...
- help: In welcher Fachrichtung ist Ihre Praxis oder Abteilung tätig?

---

# Aktuelles Praxisverwaltungssystem (PVS)? 💻
- type: short_text
- required: false
- id: pvs_system
- placeholder: z.B. Tomedo, Medistar, Turbomed...
- help: Welches PVS / KIS nutzen Sie überwiegend?

---

# Anteil Dokumentations- bzw. Admin-Zeit? ⏳
- type: single_choice
- required: false
- id: anteil_admin
- help: Wie hoch schätzen Sie den Anteil Ihrer täglichen Arbeitszeit für Administration?
- options:
  - < 10%
  - 10 – 25%
  - 26 – 50%
  - 51 – 75%
  - > 75%

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

# KI-Chatbot-Nutzung BERUFLICH (Häufigkeit)? 💼
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

# Wofür nutzen Sie KI-Chatbots aktuell? 🔍
- type: multiple_choice
- required: false
- id: ki_nutzung_beruflich_inhalte
- depends_on: ki_nutzung_beruf_frequenz
- show_when: Täglich
- has_other: true
- help: Für welche Aufgaben setzen Sie die KI ein?
- options:
  - text: E-Mail & Schriftverkehr
    description: Formulierung von E-Mails, Anschreiben oder Eltern-Infos
  - text: Rechtschreibung & Korrektur
    description: Überprüfung von Texten auf Fehler und Grammatik
  - text: Terminmanagement / Telefonassistent
    description: Nutzung von KI-Telefonassistenten (z.B. Aaron)
  - text: Abrechnung & Versicherung
    description: Kommunikation mit Krankenkassen
  - text: Gesprächsleitfäden
    description: Formulierungshilfen für schwierige Gespräche
  - text: Übersetzungen
    description: Kommunikation mit Patienten
  - text: Recherche
    description: Suche nach Fachinfos
  - text: Zusammenfassungen
    description: Zusammenfassen von längeren Texten
  - text: Social Media & Marketing
    description: Texte für Praxis-Website oder Instagram
  - text: Organisation
    description: Hilfe bei Dienstplänen oder Checklisten

---

# Hauptgründe gegen die häufigere berufliche Nutzung von Chatbots? 🛑
- type: multiple_choice
- required: false
- id: ki_hindernisse
- has_other: true
- help: Was sind die Hauptgründe für die bisher geringe Nutzung?
- options:
  - text: Datenschutz
    description: Datenschutzrechtliche Bedenken
  - text: Keine Freigabe durch Arbeitgeber
    description: Verbot oder fehlende Freigabe
  - text: Sorge: Falschinformationen
    description: Sorge vor falschen Informationen
  - text: Zu kompliziert
    description: Zu kompliziert im stressigen Tagesgeschäft
  - text: Fehlende Integration
    description: Mangelnde Integration in Praxissoftware
  - text: Mangelndes Wissen
    description: Ich kenne mich damit nicht gut genug aus
  - text: Kein Mehrwert
    description: Kein erkennbarer Mehrwert
  - text: Kein Budget
    description: Kein Budget für solche Tools vorhanden

---

# Wo wünschen Sie mehr KI-Unterstützung? 💡
- type: grid
- required: false
- id: ki_wunsch_support
- help: Wo wünschen Sie sich künftig (mehr) Unterstützung?
- options:
  - text: Unbedingt
    description: Brauche ich dringend
  - text: Gerne
    description: Nice to have
  - text: Egal
  - text: Ungern
    description: Dafür möchte ich eher keine KI
  - text: Nein
    description: Mache ich lieber selbst
  - text: Vorhanden
    description: Erfolgt bei uns schon mit KI
- statements:
  - Telefon-Entlastung
  - E-Mail-Management
  - Erhebung der Vor-Anamnese
  - Abrechnungshilfe
  - Schreiben von Berichten
  - Dokumentenverarbeitung
  - Kommunikation mit Versicherungen
  - Praxisorganisation
  - Patientenaufklärung
  - Übersetzung

---

# Fühlen Sie sich vorbereitet? 🎓
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
    description: Grundwissen vorhanden
  - text: Schlecht
    description: Kaum Berührungspunkte
  - text: Gar nicht
    description: Thema existiert nicht

---

# Führen Sie Anamnesen durch? 📋
- type: single_choice
- required: false
- id: performs_anamnesis
- help: Erfassen Sie im Rahmen Ihrer Arbeit gesundheitliche Beschwerden?
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
- help: Wie oft können Dritte bei sensiblen Gesprächen mithören?
- options:
  - Täglich
  - Wöchentlich
  - Selten
  - Nie

---

# Wie wird die Anamnese aktuell erhoben? 📝
- type: multiple_choice
- required: false
- id: anamnese_status_quo
- has_other: true
- options:
  - text: Durch den Arzt
    description: Persönliches Gespräch mit Arzt
  - text: MFA Interview
    description: Vor-Anamnese durch MFA
  - text: Papierbogen
    description: Patient füllt Papierbogen aus
  - text: Digital (zu Hause)
    description: Digitales Formular vorab
  - text: Digital (Wartezimmer)
    description: Tablet in der Praxis

---

# KI-Anamnese Gespräch: Akzeptanz? 🤝
- type: multiple_choice
- required: false
- id: patienten_akzeptanz
- has_other: true
- help: Welchen Weg einer KI-Vor-Anamnese würden Patienten am ehesten akzeptieren?
- options:
  - text: Smartphone (Home)
    description: Link für eigenes Gerät zu Hause
  - text: Telefon-Interview
    description: Automatisierter KI-Anruf
  - text: Tablet (Praxis)
    description: Tablet mit Kopfhörern im Wartebereich
  - text: Kabine im Wartezimmer
    description: Schallisolierte Kabine
  - text: Eigener Raum
    description: Separater Raum in der Praxis
  - text: Ablehnung
    description: Patienten würden das ablehnen

---

# Wege der Terminbuchung? 📅
- type: multiple_choice
- required: false
- has_other: true
- id: terminbuchung_kanale
- options:
  - Telefonisch
  - Online-Buchung
  - E-Mail
  - Persönlich vor Ort
  - KI-Telefonassistent

---

# Größter Zeitfresser? 👾
- type: long_text
- required: false
- id: zeitfresser_freitext
- placeholder: Beschreiben Sie die Tätigkeit...

---

# Ergebnisse erhalten? 📧
- type: single_choice
- required: false
- id: whitepaper_optin
- options:
  - Ja, gerne
  - Nein, danke

---

# E-Mail-Adresse? ✉️
- type: short_text
- required: false
- id: whitepaper_email
- placeholder: ihre.email@beispiel.de
- depends_on: whitepaper_optin
- show_when: Ja, gerne

---

# Interview? 💬
- type: single_choice
- required: false
- depends_on: whitepaper_optin
- show_when: Ja, gerne
- id: interested_in_interview
- options:
  - Ja, gerne
  - Nein, danke
