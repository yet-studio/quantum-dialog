const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const { default: lighthouse } = require('lighthouse');
const config = require('./lighthouse-config.js');
const fs = require('fs').promises;
const path = require('path');

const THRESHOLD = {
  performance: 90,
  accessibility: 100,
  'best-practices': 95,
  seo: 95,
  pwa: 90
};

async function runLighthouseTest(url) {
  console.log(`Starting Lighthouse test for ${url}...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('Browser launched successfully');
  
  const { lhr } = await lighthouse(url, {
    port: (new URL(browser.wsEndpoint())).port,
    output: 'json',
    logLevel: 'info',
    config
  });

  await browser.close();
  
  return {
    performance: lhr.categories.performance.score * 100,
    accessibility: lhr.categories.accessibility.score * 100,
    bestPractices: lhr.categories['best-practices'].score * 100,
    seo: lhr.categories.seo.score * 100,
    pwa: lhr.categories.pwa.score * 100,
    metrics: {
      FCP: lhr.audits['first-contentful-paint'].numericValue,
      TTI: lhr.audits['interactive'].numericValue,
      SI: lhr.audits['speed-index'].numericValue,
      TBT: lhr.audits['total-blocking-time'].numericValue,
      LCP: lhr.audits['largest-contentful-paint'].numericValue,
      CLS: lhr.audits['cumulative-layout-shift'].numericValue
    }
  };
}

async function saveReport(results) {
  const reportPath = path.join(__dirname, '../reports');
  await fs.mkdir(reportPath, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(reportPath, `performance-${timestamp}.json`);
  
  await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
  console.log(`Report saved to ${reportFile}`);
}

async function main() {
  try {
    console.log('Running performance tests...');
    console.log('Checking server availability...');
    
    // Vérifier que le serveur est accessible
    try {
      const response = await fetch('http://localhost:3000');
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      console.log('Server is accessible');
    } catch (error) {
      console.error('Server check failed:', error.message);
      process.exit(1);
    }
    
    const results = await runLighthouseTest('http://localhost:3000');
    
    // Vérification des seuils
    Object.entries(THRESHOLD).forEach(([metric, threshold]) => {
      const score = results[metric.toLowerCase()] || results[metric];
      console.log(`${metric}: ${score}/${threshold}`);
      if (score < threshold) {
        throw new Error(`${metric} score ${score} is below threshold ${threshold}`);
      }
    });
    
    // Vérification des métriques Web Vitals
    const webVitals = {
      FCP: 2000,  // 2s
      TTI: 3800,  // 3.8s
      SI: 3400,   // 3.4s
      TBT: 300,   // 300ms
      LCP: 2500,  // 2.5s
      CLS: 0.1    // 0.1
    };
    
    Object.entries(webVitals).forEach(([metric, threshold]) => {
      const value = results.metrics[metric];
      console.log(`${metric}: ${value}/${threshold}`);
      if (value > threshold) {
        throw new Error(`${metric} value ${value} is above threshold ${threshold}`);
      }
    });
    
    await saveReport(results);
    console.log('All tests passed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
