declare module "webpage-capture" {
    class WebCapture {
        public buffer(
            url: string,
            options: {
                type: string, 
                waitFor: number, 
                viewport: string|{width: number,height: number}
            }
        ): Promise<{capture: Buffer}>
    }

    export default WebCapture
}