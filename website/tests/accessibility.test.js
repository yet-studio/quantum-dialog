const axe = require('axe-core');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function runA11yTests(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Injecter axe-core
  await page.goto(url);
  await page.addScriptTag({ path: require.resolve('axe-core') });
  
  // Exécuter les tests d'accessibilité
  const results = await page.evaluate(() => {
    return new Promise(resolve => {
      axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
        }
      }, (err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });
  
  await browser.close();
  return results;
}

async function saveReport(results) {
  const reportPath = path.join(__dirname, '../reports');
  await fs.mkdir(reportPath, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(reportPath, `a11y-${timestamp}.json`);
  
  await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
  console.log(`Report saved to ${reportFile}`);
}

async function main() {
  try {
    console.log('Running accessibility tests...');
    const results = await runA11yTests('http://localhost:3000');
    
    // Vérifier les violations
    if (results.violations.length > 0) {
      console.error('Accessibility violations found:');
      results.violations.forEach(violation => {
        console.error(`\n${violation.help} - ${violation.impact} impact`);
        console.error(`WCAG: ${violation.tags.filter(tag => tag.startsWith('wcag')).join(', ')}`);
        violation.nodes.forEach(node => {
          console.error(`- ${node.html}`);
          console.error(`  ${node.failureSummary}`);
        });
      });
      throw new Error(`${results.violations.length} accessibility violations found`);
    }
    
    await saveReport(results);
    console.log('All accessibility tests passed!');
    console.log(`Passes: ${results.passes.length}`);
    console.log(`Incomplete: ${results.incomplete.length}`);
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
