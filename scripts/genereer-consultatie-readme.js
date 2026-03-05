const puppeteer = require('puppeteer');
const fs = require('node:fs/promises');

const CONSULTATIE_TEMPLATE = `# Consultatie **<TITEL-VAN-CONSULTATIE>**

In het kader van het beheer en de doorontwikkeling van [**<STANDAARD-NAAM>**](https://gitdocumentatie.logius.nl/publicatie/**<PUBLICATIE-URL>**) houdt Logius een openbare consultatie.
Via deze consultatie nodigen wij u uit om feedback te geven op de standaard. De consultatie loopt tot **<EIND-DATUM>**.

Bij het Technisch Overleg (TO) **<NAAM-VAN-TO>** ([notulen](https://github.com/Logius-standaarden/Overleg/tree/main/**<NAAM-VAN-TO>**)) wordt gewerkt aan de nieuwe versie van **<STANDAARD-NAAM>**, waarbij **<KORTE-SAMENVATTING>**.

Met deze openbare consultatie bieden wij belanghebbenden de gelegenheid om kennis te nemen van deze nieuwe versie en te reageren op de bijbehorende wijzigingen.

## Reageren?

Feedback en suggesties zijn welkom via [**<EMAIL>**@logius.nl](mailto:**<EMAIL>**@logius.nl) of via [issues](https://github.com/Logius-standaarden/**<REPOSITORY-NAAM>**/issues) op GitHub.
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
`;

const PROCESS_ARGUMENTS = require('minimist')(process.argv.slice(2));
const {
  ['file-name']: FILE_NAME,
  ['technisch-overleg']: TECHNISCH_OVERLEG,
  ['email-prefix']: EMAIL_PREFIX,
  ['eind-datum']: EIND_DATUM,
  ['repository-naam']: REPOSITORY_NAAM,
} = PROCESS_ARGUMENTS;

(async () => {
  // The following is based on code from
  // https://www.bannerbear.com/blog/how-to-convert-html-into-pdf-with-node-js-and-puppeteer/
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const website_url = `http://localhost:8080/${FILE_NAME}`;
  await page.goto(website_url, { waitUntil: 'networkidle0' });

  const { pubDomain, shortName, publishVersion, github, standaardNaam } = await page.evaluate(() => {
    const element = document.getElementById('initialUserConfig');
    const initialUserConfig = JSON.parse(element.innerText);
    const { pubDomain, shortName, publishVersion, github } = initialUserConfig;
    const standaardNaam = document.title.replace(' ' + publishVersion, '');
    return {
      pubDomain, shortName, publishVersion, github, standaardNaam,
    };
  });
  console.log(`We hebben: ${pubDomain} ${shortName} ${publishVersion} ${github} ${standaardNaam}`);

  const newTemplate = CONSULTATIE_TEMPLATE.replaceAll("**<NAAM-VAN-TO>**", TECHNISCH_OVERLEG)
    .replaceAll("**<STANDAARD-NAAM>**", standaardNaam)
    .replaceAll("**<EMAIL>**", EMAIL_PREFIX)
    .replaceAll("**<REPOSITORY-NAAM>**", REPOSITORY_NAAM)
    .replaceAll("**<VERSIE-NUMMER>**", publishVersion)
    .replaceAll("**<PUBLICATIE-URL>**", `${pubDomain}/${shortName}`)
    .replaceAll("**<EIND-DATUM>**", EIND_DATUM)
    .replaceAll("**<TITEL-VAN-CONSULTATIE>**", `${standaardNaam} ${publishVersion}`);

  await fs.writeFile('README.md', newTemplate);

  await browser.close();
})();
