import { wgstogcj, gcj02towgs84 } from "./wgs84togcj02"
import rnfile from "./rnfile"
import { UTCOFFSET } from './utc'
import { segmentsIntersect, isFinishLinePassed } from './gpsutils'
import mitt from 'mitt'

const msg = mitt()

export type GPSPOSTION = {
    coords: {
        accuracy: number
        altitude: number
        altitudeAccuracy: number
        heading: number
        latitude: number
        longitude: number
        speed: number
    },
    timestamp: number
}


//const IP = "http://192.168.4.1";
const IP = "http://172.19.3.48";

export { wgstogcj, rnfile, gcj02towgs84, UTCOFFSET, IP, segmentsIntersect, isFinishLinePassed, msg }