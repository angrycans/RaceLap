import RNFS from 'react-native-fs';
import moment from 'moment';
import { defaultRLDATAPath } from "./index"
import { Platform, PermissionsAndroid } from 'react-native';
import { safeJSONStringify } from 'lib/tool';

async function is_safile(filePath) {
  // RNFS.readFile(decodeURI(filePath)).then((res) => {
  //   console.log(res)
  // }).catch((e) => {
  //   console.log("is_sa", e)
  // })

  let res = await RNFS.read(decodeURI(filePath), 1024, 0);
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
    console.log({ name, date, filename })

    await RNFS.copyFile(decodeURI(filePath), defaultRLDATAPath + filename);
    return { name, date, filename }
  }

  return null;




}


export {
  is_safile,

}