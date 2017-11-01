const co = require('co');
const dal = require('./dal');

// setup
co(function* () {
  try {
    const alias = 'chromecast-only'
    yield dal.endClass(alias);
    yield dal.deleteClass(alias);
    console.log('ended and deleted class');
  } catch (e) {
    console.warn('error', e);
  }
});
 