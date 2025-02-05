module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    skipAudits: [
      'uses-http2',
      'offline-start-url',
      'service-worker',
      'works-offline'
    ],
    emulatedFormFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    },
    maxWaitForLoad: 45 * 1000
  },
  audits: [
    {
      path: 'metrics/first-contentful-paint',
      options: { scorePODR: 800, scoreMedian: 1600 }
    },
    {
      path: 'metrics/largest-contentful-paint',
      options: { scorePODR: 1000, scoreMedian: 2000 }
    }
  ]
};
