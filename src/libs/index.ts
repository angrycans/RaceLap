import { wgstogcj, gcj02towgs84 } from "./wgs84togcj02"
import rnfile from "./rnfile"
import { UTCOFFSET } from './utc'


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


const IP = "http://192.168.4.1";

export { wgstogcj, rnfile, gcj02towgs84, UTCOFFSET, IP }