import fs from 'node:fs';
import { exit } from 'node:process';

try {
  const configText = fs.readFileSync('./js/config.mjs', 'utf8');

  const pubDomain = configText.match(/pubDomain['"]?:\s*['"](?<domain>[^'"]+)/).groups.domain;
  const shortName = configText.match(/shortName['"]?:\s*['"](?<shortname>[^'"]+)/).groups.shortname;

  if (process.argv.includes("--previous-url")) {
    const previousPublishVersion = configText.match(/previousPublishVersion['"]?:\s*['"](?<previouspublishversion>[^'"]+)/)?.groups.previouspublishversion;

    if (previousPublishVersion) {
      console.log(`https://gitdocumentatie.logius.nl/publicatie/${pubDomain}/${shortName}/${previousPublishVersion}`);
    }
  } else {
    const publishVersion = configText.match(/publishVersion['"]?:\s*['"](?<publishversion>[^'"]+)/).groups.publishversion;

    console.log(`https://gitdocumentatie.logius.nl/publicatie/${pubDomain}/${shortName}/${publishVersion}`);
  }
} catch (err) {
  console.error(err);
  exit(1);
}
