import ViewPort from "./ViewPort";

export default interface Slide {
    url: string
    viewport?: ViewPort
    displayTime?: number
    screenShotDelay?: number
}