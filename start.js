const Client                = require('./lib/senders/platform');
const DefaultMediaReceiver  = require('./lib/senders/default-media-receiver');
const mdns                  = require('mdns');
const co                    = require('co');
const dal                   = require('./dal');

let pusher_channel;

// setup
co(function* () {
  try {
    const userId = 1994482;
    const { data: { alias } } = yield dal.createClass('chromecast-only');
    yield dal.registerClass(alias);
    yield dal.startClass(alias);

    const { data: { configuration } } = yield dal.joinClass(alias, userId);
    pusher_channel = configuration.channel_name;
    console.log('==== pusher channel: ', pusher_channel);


    const browser = mdns.createBrowser(mdns.tcp('googlecast'));
    
    browser.on('serviceUp', function(service) {
      console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
      if (service.name === 'Chromecast-f9304c5badfa0dce829292c7d1f5d02d') {
        ondeviceup(service.addresses[0]);
        browser.stop();
      }
    });
    
    browser.start();
    
    function ondeviceup(host) {
    
      const client = new Client();
    
      client.connect(host, function() {
        console.log('connected, launching app ...');
    
        client.launch(DefaultMediaReceiver, function(err, player) {
          const media = {
    
            // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
            contentId: JSON.stringify({hls: 'https://wowzaprod126-i.akamaihd.net/hls/live/531651/930fed58/playlist.m3u8'}),
            contentType: 'video/mp4',
            streamType: 'BUFFERED', // or LIVE
    
            // Title and cover displayed while buffering
            metadata: {
              type: 0,
              metadataType: 0,
              title: "Big Buck Bunny", 
              images: [
                { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
              ]
            }        
          };
    
          player.on('status', function(status) {
            console.log('status broadcast playerState=%s', status.playerState);
          });
    
          console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);
    
          player.load(media, { autoplay: true }, function(err, status) {
            player.play();
            console.log('media loaded playerState=%s', status.playerState);
          });
    
        });
        
      });
    
      client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
      });
    
    }
  } catch (e) {
    console.warn('error', e);
  }
});

