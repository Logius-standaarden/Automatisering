const puppeteer = require('puppeteer');
const fs = require('node:fs/promises');

const CONSULTATIE_TEMPLATE = `# Consultatie **<TITEL-VAN-CONSULTATIE>**

In het kader van het beheer en de doorontwikkeling van [**<STANDAARD-NAAM>**](https://gitdocumentatie.logius.nl/publicatie/**<PUBLICATIE-URL>**) houdt Logius een openbare consultatie.
Via deze consultatie nodigen wij u uit om feedback te geven op de standaard. De consultatie loopt tot **<EIND-DATUM>**.

Bij het Technisch Overleg (TO) **<NAAM-VAN-TO>** ([notulen](https://github.com/Logius-standaarden/Overleg/tree/main/**<NAAM-VAN-TO>**)) wordt gewerkt aan de nieuwe versie van **<STANDAARD-NAAM>**.
**<KORTE-SAMENVATTING>**.

Met deze openbare consultatie bieden wij belanghebbenden de gelegenheid om kennis te nemen van deze nieuwe versie en te reageren op de bijbehorende wijzigingen.

## Reageren?

Feedback en suggesties zijn welkom via [**<EMAIL>**](mailto:**<EMAIL>**) of via [issues](https://github.com/Logius-standaarden/**<REPOSITORY-NAAM>**/issues) op GitHub.
Help mee versie **<VERSIE-NUMMER>** klaar te maken ter vaststelling.

## Wijzigingen

De volgende wijzigingen zijn onderdeel van de voorgestelde volgende release.

<!-- De volgende sectie moeten worden gerepeteerd voor elk document -->

### **<STANDAARD-NAAM>**

[Consultatieversie](./**<REPOSITORY-NAAM>**) <!-- Het document wordt gepubliceerd vanaf een "consultatie/" branch, zie CONTRIBUTING.md -->

Wijzigingen:
 * **<TEKSTUELE BESCHRIJVING VAN EEN WIJZIGING>**
 * **<TEKSTUELE BESCHRIJVING VAN EEN WIJZIGING>**
 * **<TEKSTUELE BESCHRIJVING VAN EEN WIJZIGING>**

**<TOELICHTING>** <!-- optionele toelichting -->
`;

const PROCESS_ARGUMENTS = require('minimist')(process.argv.slice(2));
const {
  ['repository-naam']: REPOSITORY_NAAM,
} = PROCESS_ARGUMENTS;

(async () => {
  // The following is based on code from
  // https://www.bannerbear.com/blog/how-to-convert-html-into-pdf-with-node-js-and-puppeteer/
  const browser = await puppeteer.launch({
    dumpio: true,
  });
  const page = await browser.newPage();
  const website_url = `http://localhost:8080/`;
  await page.goto(website_url, { waitUntil: 'networkidle0' });

  const { pubDomain, shortName, publishVersion, github, emailForConsultation, technischOverleg, standaardNaam } = await page.evaluate(async () => {
    let element = null;
    // Respec heeft niet gelijk de user config beschikbaar. Daarom moeten we
    // (met een timeout van 1 seconde) checken of we het al hebben. Zo niet,
    // dan falen we alsnog.
    await Promise.race([
      new Promise(resolve => {
        setTimeout(resolve, 1000)
      }),
      new Promise(resolve => {
        setInterval(() => {
          element = document.getElementById('initialUserConfig');
          if (element) {
            resolve();
          }
        }, 100);
      })
    ]);
    if (element === null) {
      throw new Error("Unable to obtain Respec configuration");
    }
    const initialUserConfig = JSON.parse(element.innerText);
    const standaardNaam = document.title.replace(' ' + initialUserConfig.publishVersion, '');
    return {
      standaardNaam,
      ...initialUserConfig,
    };
  });
  console.log(`We hebben: ${pubDomain} ${shortName} ${publishVersion} ${github} ${emailForConsultation} ${technischOverleg} ${standaardNaam}`);

  const newTemplate = CONSULTATIE_TEMPLATE.replaceAll("**<NAAM-VAN-TO>**", technischOverleg)
    .replaceAll("**<STANDAARD-NAAM>**", standaardNaam)
    .replaceAll("**<EMAIL>**", emailForConsultation)
    .replaceAll("**<REPOSITORY-NAAM>**", REPOSITORY_NAAM)
    .replaceAll("**<VERSIE-NUMMER>**", publishVersion)
    .replaceAll("**<PUBLICATIE-URL>**", `${pubDomain}/${shortName}`)
    .replaceAll("**<TITEL-VAN-CONSULTATIE>**", `${standaardNaam} ${publishVersion}`);

  await fs.writeFile('README.md', newTemplate);

  await browser.close();
})();
