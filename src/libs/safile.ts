import RNFS from 'react-native-fs';
import moment from 'moment';
import { defaultRLDATAPath } from "./index"
import { Platform, PermissionsAndroid } from 'react-native';
import { safeJSONStringify } from 'lib/tool';
import { parse } from '@babel/core';

async function is_safile(filePath) {
  // RNFS.readFile(decodeURI(filePath)).then((res) => {
  //   console.log(res)
  // }).catch((e) => {
  //   console.log("is_sa", e)
  // })

  let res = await RNFS.read(decodeURI(filePath), 1024, 0);

  //let res = await RNFS.readFile(decodeURI(filePath));
  if (res.indexOf("#SW=SpeedAngle R4Apex") > 0) {
    //return {name:res.}
    let pos = res.indexOf("#S=");
    let name = res.substring(pos + 3, res.indexOf("=", pos + 3)).trim();

    pos = res.indexOf("#D=");
    let date = res.substring(pos + 3, res.indexOf("=", pos + 3)).trim();

    // console.log({ name, date })

    date = moment(date, "MM-DD-YYYY HH:mm:ss").format("YYYY/MM/DD HH:mm");

    pos = decodeURI(filePath).lastIndexOf("/");
    console.log("file pos", pos, decodeURI(filePath).length - pos - 1)
    let filename = decodeURI(filePath).substring(pos + 1, pos + 1 + 100).trim();
    // console.log({ name, date, filename })
    //console.log(ParseSa(res));

    await RNFS.copyFile(decodeURI(filePath), defaultRLDATAPath + filename);
    return { name, date, filename }
  }

  return null;

}

function ParseSa(txt) {
  console.log("parsesa 0 ", txt);
  //console.log("parsesa 4 ", ("#D=SW9\r\n90PS===123").match(/#D=([\s\S]*)=/)[1]);
  //console.log("parsesa 5", getStr(res, "#D=", "="));
  const trackInfo = Array.from(txt.matchAll(/#(\w*)=([^=<>]*)/igm)).reduce((acc, [, key, val]) => (acc[key] = val.trim(), acc), {})

  const trackPlan = txt.match(/<trackplan[^>]*>([^<]*)<\/trackplan[^>]*>/m)[1].trim().split("\r\n").map((item) => {
    const d = item.split(",");

    return [+d[0], +d[1], +d[2], +d[3], +d[4]]
  })

  const sectorInfo = Array.from(txt.replace(/<timer[^>]*>([^<]*)<\/timer[^>]*>/m, '$1').matchAll(/#(\d+),([^\n]*)\n([^#\n]*)/g)).reduce((acc, item, idx, arr) => {
    const isNewRow = !idx || (item[1] < arr[idx - 1][1]);
    const row = isNewRow ? {} : acc[acc.length - 1];
    const [m, s] = item[2].split(':').map(Number);
    const [pm, ps] = idx ? arr[idx - 1][2].split(':').map(Number) : [0, 0];
    const [avgSpeed, maxSpeed, , , maxPlusG, maxMinusG] = item[3].split(',');

    const time = +(m * 60 + s).toFixed(3);

    const time_s = +(time - (pm * 60 + ps)).toFixed(3);

    const time_t = +(((row[`S${item[1] - 1}`]?.time_t) || 0) + time_s).toFixed(3);

    row[`S${item[1]}`] = {
      time,
      time_s,
      time_t,
      avgSpeed, maxSpeed, maxPlusG, maxMinusG
    };
    isNewRow && acc.push(row);
    return acc;
  }, [])


  const sessionTxt = txt.match(/<trace[^>]*>([^<]*)<\/trace[^>]*>/m)[1].trim().split("\r\n");

  return { trackInfo, sectorInfo, trackPlan, sessionTxt }
}




export {
  is_safile,
  ParseSa

}