import { useState, useEffect } from "react"
import moment from "moment";
import RNFS, { downloadFile, readDir } from "react-native-fs"
import { IP, segmentsIntersect, isFinishLinePassed, defaultRLDATAPath, msg, formatMS } from "../libs";
import { useRoute, RouteProp } from '@react-navigation/native';
import { useImmer } from "use-immer";
import { useMount } from "ahooks"
import { loadPartialConfig } from "@babel/core";



let sessionData;
let finishData;

let finishlineJson = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [

    ],
  }
}

let sessionJosn = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [

    ]
  }
}


let trackJosn = {

  lap: [
  ]
}

let LapJson = {
  type: 'FeatureCollection',
  features: [
  ],
};


let LapIdx2 = -1

function useTrackHook() {
  const [trackSession, setTrackSession] = useImmer({ LapIdx2, finishlineJson, sessionJosn, trackJosn, LapJson });
  const route = useRoute<RouteProp<{ params: { name: string } }>>();

  useEffect(() => {
    ; (async () => {

      const txt = await RNFS.readFile(defaultRLDATAPath + route.params.name, 'utf8');
      sessionData = txt.split("\n");
      if (sessionData[sessionData.length - 1] == "") {
        sessionData.pop();
      };
      //console.log("sessionData", sessionData);
      const finishTxt = await RNFS.readFile(defaultRLDATAPath + "track.txt", 'utf8');
      finishData = JSON.parse(finishTxt);
      //console.log("finishData", finishData)
      let lap = getLap();
      // console.log("lap", lap)

      setTrackSession(draft => {
        draft.sessionJosn.geometry.coordinates = [];

        sessionData.forEach(d => {
          let pos = d.split(",")
          draft.sessionJosn.geometry.coordinates.push([parseFloat(pos[2]), parseFloat(pos[1])])
        });

        draft.finishlineJson.geometry.coordinates = [];
        draft.finishlineJson.geometry.coordinates.push([parseFloat(finishData.lng1), parseFloat(finishData.lat1)]);
        draft.finishlineJson.geometry.coordinates.push([parseFloat(finishData.lng2), parseFloat(finishData.lat2)]);

        draft.trackJosn.lap = lap;

      })

    })();


    return () => {

    }
  }, [])

  useEffect(() => {


    console.log("useEffect2 ", trackSession.LapIdx2);
    if (trackSession.LapIdx2 == -1) {
      return;
    }
    let lap = trackSession.trackJosn.lap;

    //console.log("useEffect2 ", lap)

    //console.log("lap[trackSession.LapIdx2].idx, lap[trackSession.LapIdx2].prv", lap[trackSession.LapIdx2].idx, lap[trackSession.LapIdx2].prv)

    let ret = loadLap(sessionData, lap[trackSession.LapIdx2].idx, lap[trackSession.LapIdx2].prv);

    console.log("ret=", ret)

    setTrackSession(draft => {
      draft.LapJson.features = ret;

    })

    // LapJson.features = ret;

  }, [trackSession.LapIdx2])


  return { trackSession, setTrackSession };
}


function getLap() {
  console.log("getlap start...")

  let prev = null;
  let prev_idx = 0;
  let lastdatetime = 0;
  let tmplap = [];
  let maxspeed = 0;

  //finishData = { "lat1": 32.1053905, "lng1": 118.863382, "lat2": 32.105466, "lng2": 118.8633663, "trackname": "" };
  //console.log("finishData", finishData);

  sessionData.forEach((item, idx) => {
    let pos = item.split(",");

    if (prev) {
      let isChecked = segmentsIntersect(parseFloat(pos[1]), parseFloat(pos[2]), parseFloat(prev[1]), parseFloat(prev[2]), finishData.lat1, finishData.lng1, finishData.lat2, finishData.lng2);
      if (isChecked) {
        console.log("isChecked ", pos, prev, idx);

        if (lastdatetime != 0) {
          //console.log("laptimer ", +pos[5] - lastdatetime, formatMS(+pos[5] - lastdatetime));

          tmplap.push({ prv: prev_idx, idx, timer: +pos[5] - lastdatetime, maxspeed });

          maxspeed = 0;
        }
        lastdatetime = +pos[5];
        prev_idx = idx;
      }
    }
    prev = pos;
    if (+pos[4] > maxspeed) {
      maxspeed = +pos[4]
    }

  })

  return tmplap;
}


/*
function getRawCoords(data: []) {

  return data.split("\n").map(rowStr => {
    const col = rowStr.split(",");
    return [+col[col.length - 1], +col[2], +col[1]]
  }).filter(Boolean);


}
*/

function groupData(data: [string], idx: number, prv: number) {
  //const rawCoords = getRawCoords(data);

  //console.log("groupData start", data)
  let rawCoords = [];
  data.forEach((rowStr, index) => {
    const col = rowStr.split(",");

    if (index >= prv && index <= idx) {

      let r = [+col[4], +col[2], +col[1]];
      //console.log("return col", rowStr);
      rawCoords.push(r);
    }

  });

  //console.log("rawcoods", rawCoords)

  let start = 0;
  let currentColor = 'green';
  const result = [{
    color: currentColor,
    data: [rawCoords[0]]
  }];
  const len = rawCoords.length;
  for (let i = 1; i < len; i++) {
    const pivot = rawCoords[start][0];
    const current = rawCoords[i][0];
    const currentResult = result[result.length - 1]
    switch (currentColor) {
      case 'green':
        if (current >= pivot) {
          currentResult.data.push(rawCoords[i]);
        } else {
          currentColor = 'red';
          result.push({
            color: currentColor,
            data: [rawCoords[i - 1], rawCoords[i]]
          })
          // 参照点为最近变更起始点
          // start = i;
        }
        break;
      case 'red':
        if (current <= pivot) {
          currentResult.data.push(rawCoords[i]);
        } else {
          currentColor = 'green';
          result.push({
            color: currentColor,
            data: [rawCoords[i - 1], rawCoords[i]]
          })
          // 参照点为最近变更起始点
          // start = i;
        }
        break;
      default:
        break;
    }

    // 参照点为上次相邻点
    start = i;

  }
  //console.log("groupData end", result)

  return result
}

function loadLap(data: [string], idx: number, prev: number) {

  //console.log("loadLap start", data);

  return groupData(data, idx, prev).map(item => ({
    'type': 'Feature',
    'properties': {
      'color': item.color
    },
    'geometry': {
      'type': 'LineString',
      'coordinates': item.data.map(d => d.slice(1))
    }
  }));
}



export {
  useTrackHook,


}