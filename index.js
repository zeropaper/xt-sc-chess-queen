var resemble = require('node-resemble-v2');

function checkStyles(browser, key, shotsPath, tolerance = 15) {
  browser.windowHandleSize({
    width: resolutions[key][0],
    height: resolutions[key][1]
  });

  if (shotsPath) {
    shotsPath = shotsPath + '/' + key + '.png';
  }
  var screenshot = browser.saveScreenshot(shotsPath);

  ressemble(screenshot).compareTo(fs.readFileSync('./verifShots/' + key + '.png')).onComplete(function(data) {
    // console.info(data.rawMisMatchPercentage);
    assert(data.rawMisMatchPercentage <= tolerance);
  });
}

checkStyles.resolutions = {
  'ipad-portrait': [768, 1024],
  'ipad-landscape': [1024, 768],
  'galaxy-s5-portrait': [360, 640],
  'galaxy-s5-landscape': [640, 360],
  'iphone-6-portrait': [375, 667],
  'iphone-6-landscape': [667, 375]
};

module.export = checkStyles;
