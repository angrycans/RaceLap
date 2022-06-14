import { useState, useEffect } from "react"
import moment from "moment";
import RNFS, { downloadFile, readDir } from "react-native-fs"
import { ServerIP, segmentsIntersect, isFinishLinePassed, defaultRLDATAPath, msg, formatMS } from "../libs";
import { useRoute, RouteProp } from '@react-navigation/native';
import { useImmer } from "use-immer";

import { useAsyncEffect } from "ahooks"

function useShowTrackTxtHook() {


  const [trackTxt, setTrackTxt] = useImmer({ sessionTxt: "", finishTxt: "" });
  const route = useRoute<RouteProp<{ params: { name: string } }>>();
  useAsyncEffect(async () => {

    console.log("useShowTrackTxtHook", route);

    let file;
    if (route.params && route.params.name) {
      file = route.params.name
    } else {
      file = "RL20220612091229.txt";
    }
    //  route.params.name = 
    const txt = await RNFS.readFile(defaultRLDATAPath + file, 'utf8');
    // let _sessionTxt = txt.split("\n");
    // if (_sessionTxt[_sessionTxt.length - 1] == "") {
    //   _sessionTxt.pop();
    // };


    const finishTxt = await RNFS.readFile(defaultRLDATAPath + "track.txt", 'utf8');
    // let finishData = JSON.parse(finishTxt);

    setTrackTxt(draft => {

      draft.sessionTxt = txt;
      draft.finishTxt = finishTxt;

      console.log("txt", txt);
      console.log("finishTxt", finishTxt);

    })

  }, []);



  return { trackTxt, setTrackTxt };
}

export {
  useShowTrackTxtHook,

}