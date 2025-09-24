const puppeteer = require('puppeteer');
const FILE_NAME = process.argv[2];

(async () => {
    // The following is based on code from
    // https://www.bannerbear.com/blog/how-to-convert-html-into-pdf-with-node-js-and-puppeteer/
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const website_url = `http://localhost:8080/${FILE_NAME}`;
    await page.goto(website_url, { waitUntil: 'networkidle0' });

    const pdfName = await page.evaluate(() => {
      const element = document.getElementById('initialUserConfig');
      const initialUserConfig = JSON.parse(element.innerText);
      return `${initialUserConfig.pubDomain}-${initialUserConfig.shortName}-${initialUserConfig.publishVersion}.pdf`;
    });
    if (typeof pdfName !== 'string') {
      throw new Error(`Couldn't obtain the name in ${FILE_NAME}. Got ${pdfName} instead`);
    }
    console.log(`Printing PDF for ${FILE_NAME} with path ${pdfName}`);

    await page.emulateMediaType('print');
    await page.addStyleTag({ content: '.sidelabel {position: absolute}' })
    await page.pdf({
      path: pdfName,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    await browser.close();
})();
