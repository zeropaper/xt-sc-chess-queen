const assert = require('assert');
const fs = require('fs');
const resemble = require('node-resemble-v2');
const saveBaseline = !!process.env.TEST_SAVE_BASELINE;

const readFile = fs.readFileSync;
function writeFile(destination, data) {
  try {
    fs.unlinkSync(destination);
  } catch(_) {}

  fs.writeFileSync(destination, data);
}


function checkStyles(browser, key, testName, shotsPath, tolerance = 5, timeout = 0) {
  browser.windowHandleSize({
    width: resolutions[key][0],
    height: resolutions[key][1]
  });

  var baseFilename = [testName, key].filter(v => !!v).join('--');
  var baselineFilename = __dirname + '/sc/' + baseFilename + '.png';
  if (saveBaseline) {
    if(timeout) browser.pause(timeout);
    browser.saveScreenshot(baselineFilename);
  }
  else {
    var baseline = readFile(baselineFilename);

    if (shotsPath) {
      var images = Object.keys(resolutions)
                    .map(r => (testName ? testName + '--' : '') + r);
      htmlFile = readFile(__dirname + '/index.html').toString()
        .split('var images = [];')
        .join('var images = ' + JSON.stringify(images) + ';');
      writeFile(shotsPath + '/' + (testName || 'index') + '.html', htmlFile);
      writeFile(shotsPath + '/bl-' + baseFilename + '.png', baseline);
      shotsPath = shotsPath + '/' + baseFilename + '.png';
    }

    if(timeout) browser.pause(timeout);
    var screenshot = browser.saveScreenshot(shotsPath);

    resemble(screenshot).compareTo(baseline).onComplete(function(data) {
      if (data.rawMisMatchPercentage > tolerance) {
        throw new Error('The ' + data.misMatchPercentage + '% mismatching exceeds the ' + tolerance + '% tolerance');
      }
    });
  }
}

var resolutions = checkStyles.resolutions = {
  'ipad-p': [768, 1024],
  'ipad-l': [1024, 768],
  'galaxy-s5-p': [360, 640],
  'galaxy-s5-l': [640, 360],
  'iphone-6-p': [375, 667],
  'iphone-6-l': [667, 375]
};

module.exports = checkStyles;
