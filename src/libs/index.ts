import { wgstogcj, gcj02towgs84 } from "./wgs84togcj02"
import rnfile from "./rnfile"
import { UTCOFFSET } from './utc'
import { segmentsIntersect, isFinishLinePassed } from './gpsutils'
import mitt from 'mitt'
import RNFS from 'react-native-fs';
import { Platform, PermissionsAndroid } from 'react-native';
import tfetch from './fetchtimeout'

import { ListItem, Avatar, TabView, Tab, Button } from '@rneui/themed'


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


let HttpWebIP;
let ServerIP;
if (__DEV__) {
    HttpWebIP = "http://192.168.3.20:3000/";
    ServerIP = "http://172.19.3.47";
} else {
    HttpWebIP = "./web.bundle/showsession/";
    ServerIP = "http://192.168.4.1"
}

// const HttpWebIP = "http://192.168.3.21:8001";
// const ServerIP = "http://172.19.3.48";
//const ServerIP = "http://192.168.4.1";

//const IP = "http://172.19.3.39";

const MapboxAccessToken = "pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ";
const defaultFSPath = (Platform.OS === 'android' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath);
const defaultRLDATAPath = (Platform.OS === 'android' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) + "/RLDATA/";



function formatMS(msTime: number) {
    let time = msTime / 1000;
    let minute = Math.floor(time / 60) % 60;
    let second = Math.floor(time) % 60;
    let cs = msTime.toString().substring(msTime.toString().length - 3);
    return `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}.${cs.padStart(3, "0")}`;
}



console.log("RaceLap init __DEV__", __DEV__);

export {
    wgstogcj, rnfile, gcj02towgs84, UTCOFFSET, ServerIP, segmentsIntersect, isFinishLinePassed, msg, MapboxAccessToken,
    defaultFSPath,
    defaultRLDATAPath,
    formatMS,
    HttpWebIP,
    tfetch

}