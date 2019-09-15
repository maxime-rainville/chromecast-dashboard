// @ts-ignore
import {DefaultMediaReceiver, Client} from 'castv2-client';
import mdns from 'mdns';


const browser = mdns.createBrowser(mdns.tcp('googlecast'));

browser.on('serviceUp', (service) => {
    console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
    ondeviceup(service.addresses[0]);
    browser.stop();
  });
  
  browser.start();
  
  function ondeviceup(host: any) {
  
    const client = new Client();
  
    client.connect(host, function() {
      console.log('connected, launching app ...');
  
      client.launch(DefaultMediaReceiver, function(_err: Error, player: any) {
        var media = {
  
            // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
          contentId: 'http://192.168.16.127/comic-papyrus-silverstripe.png',
          contentType: 'image/png',
        //   streamType: 'BUFFERED', // or LIVE
  
          // Title and cover displayed while buffering
        //   metadata: {
        //     type: 0,
        //     metadataType: 0,
        //     title: "Big Buck Bunny", 
        //     images: [
        //       { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
        //     ]
        //   }        
        };
  
        player.on('status', function(status: any) {
          console.log('status broadcast playerState=%s', status.playerState);
        });
  
        console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);
  
        player.load(media, { autoplay: true }, function(_err: any, status: any) {
          console.log('media loaded playerState=%s', status.playerState);
  
          // Seek to 2 minutes after 15 seconds playing.
          setTimeout(function() {
            player.seek(2*60, function(_err: Error, _status:any) {
              //
            });
          }, 15000);
  
        });
  
      });
      
    });
  
    client.on('error', function(err: Error) {
      console.error(err.message);
      client.close();
    });
  
  }

  export default browser;