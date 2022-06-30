import { useState, useEffect } from "react"
import moment from "moment";
import RNFS, { downloadFile, readDir } from "react-native-fs"
import { ServerIP, segmentsIntersect, isFinishLinePassed, defaultRLDATAPath, msg, formatMS } from "../libs";
import { useRoute, RouteProp } from '@react-navigation/native';
import { useImmer } from "use-immer";

import { useAsyncEffect } from "ahooks"

function useShowTrackTxtHook() {


  const [trackTxt, setTrackTxt] = useImmer({ sessionTxt: "", finishTxt: "", filetype: "" });
  const route = useRoute<RouteProp<{ params: { name: string } }>>();
  useAsyncEffect(async () => {

    console.log("useShowTrackTxtHook", route);

    let file;
    let file_suffix
    if (route.params && route.params.name) {
      file = route.params.name
      file_suffix = file.substring(file.lastIndexOf(".") + 1);
    }


    if (!file) {
      console.error("route params file error")
      return;
    }
    //  route.params.name = 
    const txt = await RNFS.readFile(defaultRLDATAPath + file, 'utf8');

    const finishTxt = await RNFS.readFile(defaultRLDATAPath + "track.txt", 'utf8');
    // let finishData = JSON.parse(finishTxt);

    setTrackTxt(draft => {

      draft.sessionTxt = txt;
      draft.finishTxt = finishTxt;
      draft.filetype = file_suffix;


    })

  }, []);



  return { trackTxt, setTrackTxt };
}

export {
  useShowTrackTxtHook,

}