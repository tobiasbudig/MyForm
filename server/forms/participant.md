---
title: Technologie beim Arztbesuch
description: Ihre Erfahrungen und Wünsche bezüglich künstlicher Intelligenz in Arztpraxen.
thankYou:
  heading: Vielen Dank!
  body: Ihre Antworten wurden erfolgreich gespeichert.
---

# Datenschutz-Einwilligung
- type: single_choice
- required: true
- id: consent
- options:
  - text: Ich stimme der anonymen Auswertung meiner Antworten zu.
    description: Pflichtfeld zur Teilnahme

---

# Wohnort?
- type: single_choice
- required: false
- id: country_of_activity
- has_other: true
- help: In welchem Land sind Sie aktuell wohnhaft?
- options:
  - 🇨🇭 Schweiz
  - 🇩🇪 Deutschland
  - 🇦🇹 Österreich
  
---

# Tätigkeit im Gesundheitswesen?
- type: single_choice
- required: false
- id: works_in_healthcare
- help: Arbeiten Sie selbst im Gesundheitswesen?
- options:
  - 🏥 Ja
  - 🙅 Nein

---

# In welchem Bereich?
- type: short_text
- required: false
- id: healthcare_role_details
- depends_on: works_in_healthcare
- show_when: 🏥 Ja
- placeholder: z.B. Physiotherapie, Psychotherapie, Bildung ...
- help: In welchem Bereich sind Sie tätig?

---

# Wie alt sind Sie?
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

# Welches Geschlecht?
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
# Nutzen Sie eine KI?
- type: single_choice
- required: false
- id: ki_nutzung_privat
- help: Wie oft nutzen Sie privat generative KI-Tools (z. B. ChatGPT, Claude, Gemini, Perplexity) ?
- options:
  - Täglich
  - Wöchentlich
  - Monatlich
  - Weniger als 1x im Monat
  - Nie
  

---
# Haben Sie eine KI schon zu Gesundheitsthemen gefragt?
- type: single_choice
- required: false
- id: ai_usage_medical_past
- help: Haben Sie in den letzten 2 Jahren eine KI wie z.B. ChatGPT mindestens einmal zu gesundheitlichen Themen befragt?
- options:
  - Ja
  - Nein

---
# Für was haben Sie die KI genutzt?
- type: multiple_choice
- required: false
- id: ai_usage_type
- depends_on: ai_usage_medical_past
- show_when: Ja
- help: Bitte wählen Sie alle Situationen aus, die tatsächlich so vorgekommen sind.
- options:
  - text: Symptome prüfen
    description: Ich habe meine Beschwerden eingegeben, um herauszufinden: Muss ich zum Arzt oder geht das von alleine weg?
  - text: Erklärungen verstehen
    description: Ich habe einen Arztbrief oder schwere Fachwörter hineinkopiert, damit ChatGPT sie mir einfach erklärt.
  - text: Vorbereitung auf den Arzt
    description: Ich habe mir eine Liste mit Fragen schreiben lassen, die ich meinem Arzt stellen soll.
  - text: Tipps für den Alltag
    description: Ich habe nach Hausmitteln, Ernährungstipps oder Sportübungen für meine Gesundheit gefragt.
  - text: Arztsuche
    description: Ich habe gefragt, zu welchem Facharzt ich mit meinen Beschwerden überhaupt gehen muss.
---
# Was verhindert mehr KI-Nutzung in Gesundheitsfragen?
- type: multiple_choice
- required: false
- id: barrier_primary_reason
- has_other: true
- help: Denken Sie an das letzte Mal, als Sie eine Gesundheits-Frage hatten, aber eine KI nicht dazu befragt haben. Was war der Grund?
- options:
  - text: Sorge um meine Daten
    description: Ich wollte meine privaten Gesundheits-Infos nicht in eine fremde Software eintippen.
  - text: Angst vor falschen Antworten
    description: Ich hatte Sorge, dass ChatGPT Quatsch erzählt oder Dinge erfindet.
  - text: Antworten sind zu allgemein
    description: ChatGPT sagt oft nur Gehen Sie zum Arzt – das hilft mir in dem Moment nicht weiter.
  - text: Ich wollte einen echten Menschen
    description: Wenn ich krank bin, vertraue ich nur echten Personen, keiner Maschine.
  - text: Zu kompliziert / Anmeldung
    description: Ich wollte mich nicht extra anmelden (Konto erstellen) oder mich erst einloggen müssen.
  - text: Nicht daran gedacht
    description: In dem Moment ist mir gar nicht eingefallen, dass ich dafür auch eine KI fragen könnte.
---
# Wie buchen Sie Termine?
- type: multiple_choice
- required: false
- id: terminbuchung_wege_patient
- help: Auf welchem Weg machen Sie ambulante Arzttermine aktuell meistens aus?
- options:
  - Telefonanruf in der Praxis
  - Online-Buchungsportal
  - E-Mail
  - Persönlich vor Ort
---
# Wie lange warten Sie?
- type: single_choice
- required: false
- id: wartezeit_total_bis_arzt
- help: Durchschnittliche Zeit vom Eintreffen bis zum Beginn des Arztgesprächs (Wartezimmer + Behandlungszimmer).
- options:
  - Weniger als 5 Minuten
  - 5 – 10 Minuten
  - 11 – 15 Minuten
  - 16 – 20 Minuten
  - 21 – 25 Minuten
  - 26 – 30 Minuten
  - Mehr als 30 Minuten
---
# Wie schildern Sie Beschwerden?
- type: multiple_choice
- required: false
- id: anamnese_status_quo_patient
- help: Wie geben Sie beim ersten Besuch in einer Praxis Ihre Beschwerden und Vorerkrankungen an?
- options:
  - text: Im Arztgespräch
    description: Ich erzähle meine Beschwerden dem Arzt
  - text: Papierbogen
    description: Ich fülle einen Zettel/Klemmbrett im Wartezimmer aus
  - text: Gespräch mit Personal
    description: Eine Assistenzkraft (MPA) befragt mich, bevor ich den Arzt sehe
  - text: Digital (von zu Hause)
    description: Ich fülle einen digitalen Fragebogen zu Hause aus
  - text: Digital (in der Praxis)
    description: Ich fülle einen digitalen Fragebogen in der Praxis aus
---
# Sind Sie damit zufrieden?
- type: single_choice
- required: false
- id: zufriedenheit_symptomerhebung_vorab
- help: Wie zufrieden sind Sie damit, wie Sie Ihre Beschwerden aktuell vor dem Arztgespräch mitteilen können (z.B. am Empfang)?
- options:
  - Sehr zufrieden
  - Eher zufrieden
  - Teils / Teils
  - Eher unzufrieden
  - Sehr unzufrieden

---
# Dauer des reinen Arztgesprächs?
- type: single_choice
- required: false
- id: dauer_arztgespraech_netto
- help: Wie viele Minuten sprechen Sie durchschnittlich mit dem Arzt (reine Gesprächszeit, ohne körperliche Untersuchung oder Warten)?
- options:
  - Weniger als 2 Minuten
  - 2 – 5 Minuten
  - 6 – 10 Minuten
  - 11 – 15 Minuten
  - 16 – 20 Minuten
  - Mehr als 20 Minuten

---

# Fühlen Sie sich gehört?
- type: single_choice
- required: false
- id: gefuehl_zeit_anamnese
- help: Haben Sie das Gefühl, dass sich der Arzt genug Zeit nimmt, um sich Ihre Beschwerden und Sorgen wirklich in Ruhe anzuhören?
- options:
  - Ja, immer
  - Meistens
  - Teils / Teils
  - Selten
  - Nein, fast nie
  ---

---
# Hören Fremde mit?
- type: single_choice
- required: false
- id: frequenz_diskretion
- help: Wie oft kommt es vor, dass andere Personen Gespräche am Empfang oder im Wartebereich zum Teil mithören können?
- options:
  - Fast bei jedem Besuch
  - Häufig
  - Selten
  - Nie
---

# Szenario: Das KI-Vorgespräch
- type: information
- description: |
    Bitte stellen Sie sich folgendes Szenario vor:

    Sie kommen in eine Praxis. Bevor Sie den Arzt sehen, führen Sie ein kurzes Gespräch mit einer **medizinischen Sprach-KI**.

    Die KI stellt Ihnen gezielte Fragen zu Ihren aktuellen Beschwerden (wie ein erfahrener Arzt).
    Der Arzt erhält danach sofort eine Zusammenfassung.

---
# Wo möchten Sie mit einer KI über Ihre Symptome sprechen?
- type: multiple_choice
- required: false
- id: ki_anamnese_ort_praeferenz
- help: Welchen Ort/Weg würden Sie für eine mündliche Symptomabfrage vor dem Arztgespräch nutzen wollen?
- options:
  - text: Kabine im Wartebereich
    description: Schallisolierte Kabine im Wartebereich
  - text: Im Wartebereich
    description: z.B. durch Nutzung eines Tablet im Wartebereich mit Kopfhörern
  - text: Zuhause (Smartphone)
    description: Vor dem Termin von zuhause aus auf meinem eigenen Gerät (Link per SMS/Mail)
  - text: Telefonanruf
    description: Ich telefoniere mit der KI vor dem Termin
  - text: Gar nicht
    description: Ich lehne ein vorgängiges Gespräch mit einer KI ab
