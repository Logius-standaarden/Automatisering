import fs from 'node:fs';
import { exit } from 'node:process';

try {
  const data = fs.readFileSync('./js/config.mjs', 'utf8');
  const pubDomain = configText.match(/pubDomain['"]?:\s*['"](?<domain>[^'"]+)/).groups.domain;
  const shortName = configText.match(/shortName['"]?:\s*['"](?<shortname>[^'"]+)/).groups.shortname;
  const publishVersion = configText.match(/publishVersion['"]?:\s*['"](?<publishversion>[^'"]+)/).groups.publishversion;
  console.log(`${pubDomain}/${shortName}/${publishVersion}`);
} catch (err) {
  console.error(err);
  exit(1);
}
