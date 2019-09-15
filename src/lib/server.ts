import {Server, createServer, IncomingMessage, ServerResponse} from 'http';
// @ts-ignore
import WebCapture from 'webpage-capture';
// @ts-ignore
import Player from 'chromecast-player';
import delay from 'delay';
import Slide from './slide';
import ViewPort from './ViewPort';

const defaultSlide: Slide = {
  url: '',
  displayTime: 60000,
  viewport: { width: 1280, height: 720 },
  screenShotDelay: 0
};

/**
 * Utility to go through a list of web URL and display them on a Chromecast.
 */
class ChromeCastServer {

  private server: Server;
  private image: Buffer|undefined;
  private capture: any = new WebCapture();
  private player: any = new Player();
  private killMedia: () => void = () => {};

  /**
   * @param queue List of slides to go through.
   * @param ip IP address of the current machine and where the chromecast should be pointed.
   * @param port Port to use to host the chromecasted content.
   */
  public constructor(
    private queue: Slide[],
    private ip: string,
    private port: number = 3000
  ) {
    this.server = createServer(this.respond.bind(this)).listen(this.port);
  }

  /**
   * Handle the chromecast request. We always serve the same content.
   * @param _req 
   * @param response 
   */
  private respond(_req: IncomingMessage, response: ServerResponse) {
    response.writeHead(200, {'Content-Type': 'image/png'});
    response.write(this.image);
    response.end();
  }

  /**
   * Start casting the slides.
   */
  public cast(): Promise<any> {
    return this.castOne()
      .finally(() => {
        this.server.close();
        this.killMedia();
        setTimeout(() => process.exit(), 500);
      });
  }

  /**
   * Cast the top slide in the queue.
   */
  private castOne(): Promise<any> {
    const queuedSlide:Slide|undefined = this.queue.shift();
    if (queuedSlide) {
      const slide = Object.assign({}, defaultSlide, queuedSlide);
      const {url, screenShotDelay, viewport, displayTime} = slide;
      return this.generateImage(url, <number>screenShotDelay, <ViewPort>viewport)
        .then(() => {
          const screenShotUrl = `http://${this.ip}:${this.port}/image.png`;
          this.player.launch(screenShotUrl, (_err: Error, p: any) => {
            this.killMedia = p.close.bind(p);
          });
        })
        .then(() => delay(displayTime || 60000))
        .then(this.castOne.bind(this));
    } else {
      return Promise.resolve();
    }
  }


  private generateImage(url: string, delay: number, viewport: ViewPort): Promise<Buffer> {
    return this.capture.buffer(url, {
      type: "png",
      waitFor: delay,
      viewport: viewport
    }).then((capture: any) => {
      this.image = capture.output;
    })
  }

}

export default ChromeCastServer;