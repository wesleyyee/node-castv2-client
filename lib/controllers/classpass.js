var util            = require('util');
var debug           = require('debug')('castv2-client');
var JsonController  = require('./json');

function ClassPassController(client, sourceId, destinationId) {
  JsonController.call(this, client, sourceId, destinationId, 'urn:x-cast:classpass.video');

  this.on('message', onmessage);

  var self = this;

  function onmessage(data, broadcast) {
    console.log('data', data);
  }
}

util.inherits(ClassPassController, JsonController);

module.exports = ClassPassController;