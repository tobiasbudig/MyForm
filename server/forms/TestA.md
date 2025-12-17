title: Wie kann KI dem Arzt helfen?
description: Nutzung und Akzeptanz von künstlicher Intelligenz im ärztlichen Alltag.
thankYou:
  heading: Vielen Dank!
  body: Ihre Antworten wurden erfolgreich gespeichert.
questions:
  - id: consent
    type: single_choice
    text: Datenschutz-Einwilligung ⚖️
    required: true
    options:
      - text: Ich stimme der anonymen Auswertung meiner Antworten zu.
        description: Pflichtfeld zur Teilnahme

  - id: country_of_activity
    type: single_choice
    text: Land? 📍
    required: false
    has_other: true
    help: In welchem Land sind Sie aktuell beruflich tätig?
    options:
      - text: 🇨🇭 Schweiz
      - text: 🇩🇪 Deutschland
      - text: 🇦🇹 Österreich

  - id: alter
    type: single_choice
    text: Wie alt sind Sie? 🎂
    required: false
    options:
      - text: Unter 20
      - text: 20 - 29
      - text: 30 - 39
      - text: 40 - 49
      - text: 50 - 59
      - text: 60 - 69
      - text: 70 oder älter

  - id: geschlecht
    type: single_choice
    text: Ihr Geschlecht? 👥
    required: false
    help: Welchem Geschlecht ordnen Sie sich zu?
    options:
      - text: Weiblich
      - text: Männlich
      - text: Divers
      - text: Keine Angabe

  - id: work_setting
    type: single_choice
    text: Ihr Tätigkeitsumfeld? 🏥
    required: false
    has_other: true
    help: In welchem Setting waren Sie in den letzten 6 Monaten primär tätig?
    options:
      - text: Einzelpraxis
      - text: Gemeinschaftspraxis / MVZ
      - text: Klinik (Ambulanz / Notaufnahme)
      - text: Klinik (Stationär)

  - id: fachrichtung
    type: short_text
    text: Ihre Fachrichtung? 🩺
    required: false
    placeholder: z.B. Allgemeinmedizin, Kardiologie...
    help: Welcher Fachrichtung gehören Sie an?

  - id: mitarbeiter_anzahl
    type: single_choice
    text: Anzahl Mitarbeitende? 👥
    required: false
    help: Bitte schätzen Sie die Gesamtzahl aller Mitarbeitenden in Ihrer Einrichtung.
    options:
      - text: 1 – 3 (z. B. Einzelpraxis)
      - text: 4 – 9 (z. B. Kleine Praxis)
      - text: 10 – 49 (z. B. Gemeinschaftspraxis / MVZ)
      - text: 50 – 249 (z. B. Großes MVZ / Fachklinik)
      - text: 250 – 999 (z. B. Allgemeines Krankenhaus)
      - text: 1.000 – 5.000 (z. B. Großklinikum)
      - text: Über 5.000 (z. B. Maximalversorger)
      - text: Ich weiß es nicht

  - id: patienten_volumen
    type: single_choice
    text: Patienten pro Tag? 📈
    required: false
    help: Wie viele Patienten konsultieren Sie durchschnittlich pro vollem Arbeitstag?
    options:
      - text: 0 – 5
      - text: 6 – 10
      - text: 11 – 15
      - text: 16 – 20
      - text: 21 – 30
      - text: 31 – 40
      - text: 41 – 50
      - text: Mehr als 50

  - id: pvs_system
    type: short_text
    text: Welche Software? 💻
    required: false
    placeholder: z.B. Tomedo, Medistar, Turbomed...
    help: Welches Praxis- oder Klinikinformationssystem nutzen Sie überwiegend?

  - id: admin_anteil
    type: single_choice
    text: Anteil Admin-Zeit? ⏳
    required: false
    help: Anteil der täglichen Arbeitszeit für Dokumentation und Verwaltung.
    options:
      - text: Weniger als 10%
      - text: 10% – 20%
      - text: 21% – 30%
      - text: 31% – 40%
      - text: 41% – 50%
      - text: Mehr als 50%

  - id: ki_nutzung_privat
    type: single_choice
    text: Privatnutzung KI? 🏠
    required: false
    help: Nutzen Sie generative KI-Tools im PRIVATEN Umfeld?
    options:
      - text: Täglich
      - text: Wöchentlich
      - text: Monatlich
      - text: Weniger als 1x im Monat
      - text: Nie

  - id: ki_nutzung_beruf_frequenz
    type: single_choice
    text: Berufsnutzung KI? 💼
    required: false
    help: Wie häufig nutzen Sie generative KI-Tools im BERUFLICHEN Kontext?
    options:
      - text: Täglich
      - text: Wöchentlich
      - text: Monatlich
      - text: Weniger als 1x im Monat
      - text: Nie

  - id: ki_nutzung_beruf_inhalte
    type: multiple_choice
    text: Wofür nutzen Sie beruflich KI? 🛠️
    required: false
    depends_on: ki_nutzung_beruf_frequenz
    show_when: [Täglich, Wöchentlich, Monatlich, Weniger als 1x im Monat]
    has_other: true
    options:
      - text: Recherche & Wissen
      - text: Arztbriefe & Berichte
      - text: Krankenkassen & MDK
      - text: Zusammenfassungen
      - text: Labor & Befunde
      - text: Differentialdiagnose
      - text: Patientenaufklärung
      - text: Abrechnung & Kodierung
      - text: Kommunikation
      - text: Übersetzungen
      - text: Admin & Orga

  - id: ki_barrieren
    type: multiple_choice
    text: Hindernisse beruflicher KI Nutzung? 🛑
    required: false
    has_other: true
    options:
      - text: Datenschutz
      - text: Keine Freigabe durch Arbeitgeber
      - text: Fehlende Abrechenbarkeit
      - text: Haftungsfragen
      - text: Fehlende Validierung
      - text: Sorge: Falschinformationen
      - text: Fehlende Integration
      - text: Zeitaufwand Ergebnisprüfung
      - text: Mangelndes Wissen
      - text: Kein Mehrwert
      - text: Kosten

  - id: ki_wuensche_grid
    type: grid
    text: Wo wünschen Sie mehr KI-Hilfe? ✨
    required: false
    options:
      - text: Unbedingt
      - text: Gerne
      - text: Egal
      - text: Ungern
      - text: Nein
      - text: Vorhanden
    statements:
      - Arztbriefe schreiben
      - Erhebung einer Anamnese vor dem Gespräch
      - Diagnosen kodieren
      - Externe Befunde Zusammenfassen
      - Dokumentation während des Gesprächs
      - Medikamenten Wechselwirkungen
      - Beantworten von Anfragen des Versicherers
      - Therapieentscheidung treffen
      - Patientenaufklärung
      - Interpretation von Befunden

  - id: performs_anamnesis
    type: single_choice
    text: Führen Sie Anamnesen durch? 💬
    required: false
    options:
      - text: Ja
      - text: Nein

  - id: problem_privatsphaere
    type: single_choice
    text: Hören Dritte mit? 👂
    required: false
    depends_on: performs_anamnesis
    show_when: Ja
    options:
      - text: Täglich
      - text: Wöchentlich
      - text: Monatlich
      - text: Weniger als 1x im Monat
      - text: Nie

  - id: skipped_questions_privacy
    type: single_choice
    text: Verzicht auf Fragen durch Diskretionsmangel? 🤐
    required: false
    depends_on: problem_privatsphaere
    show_when: [Täglich, Wöchentlich, Monatlich, Weniger als 1x im Monat]
    options:
      - text: Ja
      - text: Nein

  - id: anamnese_status_quo
    type: multiple_choice
    text: Wie wird die Anamnese aktuell erhoben? 📋
    required: false
    has_other: true
    options:
      - text: Persönliches Gespräch
      - text: Papierbogen
      - text: Digital (zu Hause)
      - text: Digital (Wartezimmer)
      - text: Assistenzpersonal

  - id: ki_anamnese_channel
    type: multiple_choice
    text: KI-Anamnese Gespräch: Akzeptanz? 🤖
    required: false
    has_other: true
    options:
      - text: Smartphone (Home)
      - text: Telefon-Interview
      - text: Tablet (Praxis)
      - text: Kabine im Wartezimmer
      - text: Eigener Raum
      - text: Ablehnung

  - id: past_exposure
    type: single_choice
    text: Haben Patienten schon einmal Zusammenfassungen mitgebracht? 📄
    required: false
    options:
      - text: Ja
      - text: Nein

  - id: efficiency_net_impact
    type: likert
    text: Zeitersparnis durch mitgebrachte Zusammenfassung? ⏱️
    required: false
    depends_on: past_exposure
    show_when: Ja
    scale: 5
    labels:
      - Deutlicher Mehraufwand
      - Eher Mehraufwand
      - Neutral
      - Eher Zeitersparnis
      - Deutliche Zeitersparnis

  - id: ki_anamnese_interesse
    type: multiple_choice
    text: Interesse an KI-Anamnese? 🤔
    required: false
    has_other: true
    options:
      - text: Aktive Suche
      - text: Bedarf
      - text: Skepsis
      - text: Kein Bedarf

  - id: software_entscheidung
    type: single_choice
    text: Entscheiden Sie mit? 🗳️
    required: false
    options:
      - text: Ja
      - text: Nein

  - id: ablehnungsgruende
    type: multiple_choice
    text: Software abgelehnt? ❌
    required: false
    depends_on: software_entscheidung
    show_when: Ja
    has_other: true
    options:
      - text: Cloud-Zwang
      - text: Fehlende Integration
      - text: Patienten-Barriere
      - text: Zu hohe Kosten
      - text: Anbieter-Herkunft
      - text: Nicht zutreffend

  - id: terminbuchung_wege
    type: multiple_choice
    text: Wege der Terminbuchung? 📅
    required: false
    options:
      - text: Telefonisch
      - text: Online-Buchung
      - text: E-Mail
      - text: Persönlich vor Ort
      - text: KI-Telefonassistent

  - id: zeitfresser_freitext
    type: long_text
    text: Größter Zeitfresser? 🦖
    required: false
    placeholder: Beschreiben Sie die Tätigkeit kurz...

  - id: whitepaper_opt_in
    type: single_choice
    text: Ergebnisse erhalten? 📧
    required: false
    options:
      - text: Ja, gerne
      - text: Nein, danke

  - id: whitepaper_email
    type: short_text
    text: E-Mail-Adresse? 📬
    required: false
    depends_on: whitepaper_opt_in
    show_when: Ja, gerne
    placeholder: name@praxis.de

  - id: interested_in_interview
    type: single_choice
    text: Interview? 🎙️
    required: false
    depends_on: whitepaper_opt_in
    show_when: Ja, gerne
    options:
      - text: Ja, gerne
      - text: Nein, danke
