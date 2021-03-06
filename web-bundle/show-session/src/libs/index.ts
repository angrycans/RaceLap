
import mitt from 'mitt'
import { segmentsIntersect, IntersectPoint } from './gpsutils'


const msg = (window as any).RNMsg = mitt()

const RNMsg = (window as any).RNMsg;

const MapboxAccessToken = "pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ";



function formatMS(msTime: number) {
  let time = msTime / 1000;
  let minute = Math.floor(time / 60) % 60;
  let second = Math.floor(time) % 60;
  let cs = msTime.toString().substring(msTime.toString().length - 3);
  return `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}.${cs.padStart(3, "0")}`;
}



console.log("RaceLap webview init __DEV__", (window as any).__DEV__);

export {
  MapboxAccessToken,
  segmentsIntersect,
  IntersectPoint,
  formatMS,
  msg,
  RNMsg


}