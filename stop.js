const co                    = require('co');
const mdns                  = require('mdns');
const dal                   = require('./dal');

// setup
co(function* () {
  try {
    const browser = mdns.createBrowser(mdns.tcp('googlecast'));
    browser.stop();

    const alias = 'chromecast-only'
    yield dal.endClass(alias);
    yield dal.deleteClass(alias);
    console.log('ended and deleted class');
  } catch (e) {
    console.warn('error', e);
  }
});
 