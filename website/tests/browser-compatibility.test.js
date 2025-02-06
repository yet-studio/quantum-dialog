const playwright = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const BROWSERS = ['chromium', 'firefox', 'webkit'];
const VIEWPORT_SIZES = [
  { width: 1920, height: 1080, name: 'desktop' },
  { width: 1024, height: 768, name: 'tablet' },
  { width: 375, height: 667, name: 'mobile' }
];

async function takeScreenshot(page, browserName, viewportSize) {
  const screenshotPath = path.join(__dirname, '../reports/screenshots');
  await fs.mkdir(screenshotPath, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${browserName}-${viewportSize.name}-${timestamp}.png`;
  await page.screenshot({
    path: path.join(screenshotPath, filename),
    fullPage: true
  });
}

async function testVisualRegression(url) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  for (const browserType of BROWSERS) {
    const browser = await playwright[browserType].launch();
    
    for (const viewport of VIEWPORT_SIZES) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 1
      });
      
      const page = await context.newPage();
      
      try {
        console.log(`Testing ${browserType} at ${viewport.name}...`);
        
        // Navigation et chargement
        const navStart = Date.now();
        const response = await page.goto(url);
        const loadTime = Date.now() - navStart;
        
        // Vérifier le status HTTP
        if (!response.ok()) {
          throw new Error(`Page load failed with status ${response.status()}`);
        }
        
        // Attendre que la page soit interactive
        await page.waitForLoadState('networkidle');
        
        // Tests de base
        const tests = [
          // Test de visibilité des éléments critiques
          async () => {
            const hero = await page.$('.hero');
            return hero && await hero.isVisible();
          },
          // Test des interactions
          async () => {
            const themeToggle = await page.$('.theme-toggle');
            await themeToggle.click();
            const isDark = await page.evaluate(() => 
              document.documentElement.classList.contains('dark-theme')
            );
            return isDark;
          },
          // Test de la navigation
          async () => {
            const nav = await page.$('nav');
            return nav && await nav.isVisible();
          }
        ];
        
        const testResults = await Promise.all(tests.map(async (test, index) => {
          try {
            const passed = await test();
            return { passed, error: null };
          } catch (error) {
            return { passed: false, error: error.message };
          }
        }));
        
        // Prendre une capture d'écran
        await takeScreenshot(page, browserType, viewport);
        
        results.tests.push({
          browser: browserType,
          viewport: viewport.name,
          loadTime,
          testResults,
          success: testResults.every(r => r.passed)
        });
        
      } catch (error) {
        results.tests.push({
          browser: browserType,
          viewport: viewport.name,
          error: error.message,
          success: false
        });
      }
      
      await context.close();
    }
    
    await browser.close();
  }
  
  return results;
}

async function saveReport(results) {
  const reportPath = path.join(__dirname, '../reports');
  await fs.mkdir(reportPath, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(reportPath, `browser-compatibility-${timestamp}.json`);
  
  await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
  console.log(`Report saved to ${reportFile}`);
}

async function main() {
  try {
    console.log('Running browser compatibility tests...');
    const results = await testVisualRegression('http://localhost:3000');
    
    // Vérifier les résultats
    const failures = results.tests.filter(test => !test.success);
    if (failures.length > 0) {
      console.error('Test failures:');
      failures.forEach(failure => {
        console.error(`${failure.browser} - ${failure.viewport}:`);
        if (failure.error) {
          console.error(`  Error: ${failure.error}`);
        } else {
          failure.testResults.forEach((result, index) => {
            if (!result.passed) {
              console.error(`  Test ${index + 1} failed: ${result.error || 'unknown error'}`);
            }
          });
        }
      });
      throw new Error(`${failures.length} browser tests failed`);
    }
    
    await saveReport(results);
    console.log('All browser compatibility tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
