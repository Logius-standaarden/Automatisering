# Automatisering documentatie

In deze repository worden scripts bijgehouden om het publicatie- en controleproces van documenten te automatiseren.

## Wijzigingsvoorstellen

Een overzicht van de openstaande wijzigingsvoorstellen wordt dagelijks bijgewerkt in [Logius-standaarden/Overleg](https://github.com/Logius-standaarden/Overleg).

## Automatische tests

### Publicatie
In de repository van iedere [ReSpec](https://respec.org/)-publicatie is een [script](scripts/build.yml) te vinden dat de volgende handelingen uitvoert:
* Genereer statische HTML-pagina
* Controleer op WCAG-criteria
* Genereer PDF-bestand
* Publiceer naar _logius.nl_ via [Logius-standaarden/publicatie](https://github.com/Logius-standaarden/publicatie)


### Gebroken links
Iedere maandagochtend draait een controle op gebroken links in de [deze gepubliceerde documenten](https://gitdocumentatie.logius.nl/publicatie/scripts/paths.html).

De resultaten worden gedeeld via e-mail.
