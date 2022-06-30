import { useState, useEffect } from "react"
import moment from "moment";
import { segmentsIntersect, IntersectPoint, msg, formatMS } from "../libs";
import { useImmer } from "use-immer";
import { InteractionManager } from "react-native";

import * as turf from "@turf/turf"
import { getStringBytes } from "lib/tool";



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



function useTrackSession(_map, _marker, _popup, _marker2, _popup2) {


  const [MtrackSession, setTrackSession] = useImmer({ trackSession: { trackTxt: null, LapIdx: -1, sessionData: null, finishlineJson, sessionJosn, trackJosn, LapJson, routeJson: null, actPoint: null, actPointIdx: 0 }, trackSession2: { trackTxt: null, LapIdx: null, sessionData: null, finishlineJson, sessionJosn, trackJosn, LapJson, routeJson: null, actPoint: null, actPointIdx: 0 }, error: null });
  //const route = useRoute<RouteProp<{ params: { name: string } }>>();
  const { trackSession, trackSession2, error } = MtrackSession;
  useEffect(() => {
    ; (async () => {
      console.log("useTrackSession init----")
      console.log("useTrackSession listen tracktxt", trackSession.trackTxt)

      if (!trackSession.trackTxt) {
        console.log("useTrackSession listen tracktxt is null return")
        return;
      }



      let ret = getSessionFromTxt(trackSession.trackTxt);
      let { lap, sessionData, finishData, err } = ret;
      console.log("getSessionFromTxt ret", ret);

      if (err) {

        setTrackSession(draft => {
          draft.error = err;
        });
        return;
      }

      setTrackSession(draft => {

        draft.trackSession.sessionJosn.geometry.coordinates = [];
        draft.trackSession.sessionData = sessionData;

        sessionData.forEach(pos => {
          // let pos = d.split(",")
          draft.trackSession.sessionJosn.geometry.coordinates.push([parseFloat(pos[2]), parseFloat(pos[1])])
        });

        draft.trackSession.finishlineJson.geometry.coordinates = [];
        draft.trackSession.finishlineJson.geometry.coordinates.push([parseFloat(finishData.lng1), parseFloat(finishData.lat1)]);
        draft.trackSession.finishlineJson.geometry.coordinates.push([parseFloat(finishData.lng2), parseFloat(finishData.lat2)]);

        draft.trackSession.trackJosn.lap = lap;

        //设置 线路点和actpoint
        //draft.routeJson = new Animated.RouteCoordinatesArray(draft.sessionJosn.geometry.coordinates.reverse());
        draft.trackSession.actPoint = draft.trackSession.sessionJosn.geometry.coordinates[0];
        draft.trackSession.actPointIdx = 0;


        _map.current && _map.current.panTo(draft.trackSession.actPoint);
        _marker.current && _marker.current.setLngLat(draft.trackSession.actPoint);
        _popup.current && _popup.current.setHTML(sessionData[draft.trackSession.actPointIdx][4] + ' ' + sessionData[draft.trackSession.actPointIdx][7]);

      })

    })();


    return () => {

    }
  }, [trackSession.trackTxt])



  useEffect(() => {

    console.log("useEffect  listen trackSession.LapIdx ", trackSession.LapIdx);
    if (trackSession.LapIdx === -1) {

      console.log("trackSession", trackSession)

      if (!trackSession.trackTxt) {
        console.log("trackTxt is null ignore")
        return;
      }
      setTrackSession(draft => {
        draft.trackSession.actPoint = draft.trackSession.sessionJosn.geometry.coordinates[0];
        draft.trackSession.actPointIdx = 0;

        draft.trackSession.routeJson = [];
        //  draft.LapJson.features = null;
        _map.current && _map.current.panTo(draft.trackSession.actPoint);
        _marker.current && _marker.current.setLngLat(draft.trackSession.actPoint);
        _popup.current && _popup.current.setHTML(draft.trackSession.sessionData[draft.trackSession.actPointIdx][4] + ' ' + draft.trackSession.sessionData[draft.trackSession.actPointIdx][7]);

        //_map.current.reload
      })
    } else {

      //return;
      let lap = trackSession.trackJosn.lap;

      //console.log("useEffect2 ", lap)

      //console.log("lap[trackSession.LapIdx].idx, lap[trackSession.LapIdx].prv", lap[trackSession.LapIdx].idx, lap[trackSession.LapIdx].prv)

      let ret = loadLap(trackSession.sessionData, lap[trackSession.LapIdx].idx, lap[trackSession.LapIdx].prv);

      let route = [];
      trackSession.sessionData.forEach((item, i) => {
        if ((i >= lap[trackSession.LapIdx].prv) && (i <= lap[trackSession.LapIdx].idx)) {
          route.push([+item[2], +item[1]])
        }
      })


      setTrackSession(draft => {
        draft.trackSession.LapJson.features = ret;
        draft.trackSession.actPoint = ret[0].geometry.coordinates[0];
        draft.trackSession.actPointIdx = lap[trackSession.LapIdx].prv;
        draft.trackSession.routeJson = route;


      })

      console.log("useEffect  listen trackSession.LapIdx end ", trackSession.LapIdx);

    }
  }, [trackSession.LapIdx])


  useEffect(() => {

    console.log("useEffect  listen trackSession(2).LapIdx ", trackSession2.LapIdx);
    console.log("MtrackSession", MtrackSession)
    if (trackSession2.LapIdx !== null) {
      let lap = trackSession.trackJosn.lap;

      let ret = loadLap(trackSession.sessionData, lap[trackSession2.LapIdx].idx, lap[trackSession2.LapIdx].prv, 2);

      let route = [];
      trackSession.sessionData.forEach((item, i) => {
        if ((i >= lap[trackSession2.LapIdx].prv) && (i <= lap[trackSession2.LapIdx].idx)) {
          route.push([+item[2], +item[1]])
        }
      })


      setTrackSession(draft => {
        draft.trackSession2.LapJson.features = ret;
        draft.trackSession2.routeJson = route;
        draft.trackSession2.actPoint = ret[0].geometry.coordinates[0];
        draft.trackSession2.actPointIdx = lap[trackSession2.LapIdx].prv;


      })

    }
  }, [trackSession2.LapIdx])



  return { trackSession, trackSession2, error, setTrackSession };
}


function getLap(_sessionData) {
  console.log("getlap start...")

  let prevPoint = null; //prev point
  let prev_idx = 0;     //prev segmentsIntersect point idx in _sessionData
  let lastdatetime = 0; //prev  segmentsIntersect time mills()
  let tmplap = [];      //lap info
  let maxspeed = 0;
  let prevItem;         //prev segmentsIntersect item  endpoint
  let prevprevItem;     //prev segmentsIntersect item  startpoint
  let prev_intersectpoint;          //prev segmentsIntersect point startpoint-->endpoint intersect finishling


  _sessionData.forEach((pos, idx) => {

    if (prevPoint) {
      let isChecked = segmentsIntersect(parseFloat(pos[1]), parseFloat(pos[2]), parseFloat(prevPoint[1]), parseFloat(prevPoint[2]), finishData.lat1, finishData.lng1, finishData.lat2, finishData.lng2);
      if (isChecked) {
        // console.log("isChecked ", pos, prev, idx);
        let intersectP = IntersectPoint({ lat: +prevPoint[1], lng: +prevPoint[2] }, { lat: +pos[1], lng: +pos[2] }, { lat: +finishData.lat1, lng: +finishData.lng1 }, { lat: +finishData.lat2, lng: +finishData.lng2 })

        if (lastdatetime != 0) {
          //console.log("laptimer ", +pos[5] - lastdatetime, formatMS(+pos[5] - lastdatetime));

          //tmplap.push({ prv: prev_idx, idx, timer: +pos[6] - lastdatetime, maxspeed });



          var pt = turf.point([pos[1], pos[2]]);
          var pt_prev = turf.point([prevPoint[1], prevPoint[2]]);
          var line = turf.lineString([[finishData.lat1, finishData.lng1], [finishData.lat2, finishData.lng2]]);

          // var distance_point = turf.distance([pos[1], pos[2]], [prev[1], prev[2]], { units: 'miles' });

          console.log("prev_cp", prev_intersectpoint, intersectP)
          // var distance_point = turf.distance([prevprevItem[1], prevprevItem[2]], [prevPoint[1], prevPoint[2]], { units: 'kilometers' });
          var distance_point0 = turf.distance([prevprevItem[1], prevprevItem[2]], [prev_intersectpoint[1], prev_intersectpoint[0]], { units: 'kilometers' });
          var distance_point1 = turf.distance([prevPoint[1], prevPoint[2]], [intersectP[1], intersectP[0]], { units: 'kilometers' });
          let off0 = (distance_point0 / +prevprevItem[4]) * 60 * 60 * 1000;
          let off1 = (distance_point1 / +prevPoint[4]) * 60 * 60 * 1000;

          console.log("distance", distance_point0, (+prevPoint[6] - lastdatetime), Math.round(off0), Math.round(off1), (+prevPoint[6] - lastdatetime) + Math.round(off1) - Math.round(off0));
          tmplap.push({ prv: prev_idx - 1, idx: idx - 1, timer: (+prevPoint[6] - lastdatetime) - Math.round(off0) + Math.round(off1), maxspeed, intersectP });


          maxspeed = 0;

        }
        lastdatetime = +prevPoint[6];
        prev_idx = idx;
        prevItem = pos;
        prevprevItem = prevPoint;
        prev_intersectpoint = intersectP;
      }
    }
    prevPoint = pos;
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

function groupData(data: [string], idx: number, prv: number, _color: number) {
  //const rawCoords = getRawCoords(data);
  //console.log("groupData start", data)

  const style = [
    ["green", "red"],
    ["#A0D995", "#73777B"],
    ["#6CC4A1", "#DD4A48"],
  ]
  let rawCoords = [];
  data.forEach((col, index) => {
    //const col = rowStr.split(",");

    if (index >= prv && index <= idx) {

      let r = [+col[4], +col[2], +col[1]];
      //console.log("return col", rowStr);
      rawCoords.push(r);
    }

  });

  //console.log("rawcoods", rawCoords)

  let start = 0;
  let currentColor = style[_color][0];
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
      case style[_color][0]:
        if (current >= pivot) {
          currentResult.data.push(rawCoords[i]);
        } else {
          currentColor = style[_color][1];
          result.push({
            color: currentColor,
            data: [rawCoords[i - 1], rawCoords[i]]
          })
          // 参照点为最近变更起始点
          // start = i;
        }
        break;
      case style[_color][1]:
        if (current <= pivot) {
          currentResult.data.push(rawCoords[i]);
        } else {
          currentColor = style[_color][0];
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

function loadLap(data: [string], idx: number, prev: number, color = 0) {

  //console.log("loadLap start", data);

  return groupData(data, idx, prev, color).map(item => ({
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



function getSessionFromTxt(_trackTxt) {


  try {
    if (!((_trackTxt.filetype == "sa") || (_trackTxt.filetype == "rl") || (_trackTxt.filetype == "txt"))) {

      return { err: "file unkown " }
    }

    if (_trackTxt.file_suffix === "sa") {

    }


    let sessionTxt;

    if (_trackTxt.sessionTxt.indexOf("\r\n") > 0) {
      sessionTxt = _trackTxt.sessionTxt.split("\r\n");
    } else {
      sessionTxt = _trackTxt.sessionTxt.split("\n");
    }

    if (sessionTxt[sessionTxt.length - 1] === "") {
      sessionTxt.pop();
    };

    let lastItem;

    // sessionData = sessionTxt.map((_item, idx) => {
    let sessionData = [];
    for (let idx = 0; idx < sessionTxt.length; idx++) {
      let item = sessionTxt[idx].split(",");

      let GForc;
      let tmpvel;
      let tmpMillis;
      let vel = +item[4];

      let ms = 0

      if (idx == 0) {
        tmpvel = item[4];
        tmpMillis = 10
      } else {
        tmpvel = lastItem[4];
        tmpMillis = +item[6] - lastItem[6];

      }

      //tmpMillis = 10;

      if (idx - 9 >= 0) {
        tmpvel = sessionTxt[idx - 9].split(",")[4];
        //[]
      } else {
        tmpvel = vel;
      }
      if (idx === sessionTxt.length - 1) {
        ms = 0;
      } else {
        let nexitem = sessionTxt[idx + 1].split(",");
        ms = nexitem[6] - item[6]

      }

      //https://create.arduino.cc/projecthub/guitar/gps-tacho-g-force-meter-accelerometer-1ea839
      //GForc = (((vel - tmpvel) / 3.6) / (9.81 * tmpMillis / 1000)).toFixed(3);
      GForc = (((vel - tmpvel) / 3.6) / (9.8)).toFixed(3);
      //GForc = Math.sqrt(1 + Math.pow(((vel - tmpvel) / 3.6) / (9.8 * tmpMillis / 1000), 2)).toFixed(2);

      lastItem = item;
      item.push(GForc);
      item.push(ms);
      //return item;
      sessionData.push(item);
    }
    // console.log("sessionData==", sessionData[0], sessionData[1], sessionData[sessionData.length - 1]);
    // const finishTxt = await RNFS.readFile(defaultRLDATAPath + "track.txt", 'utf8');
    let finishTxt = _trackTxt.finishTxt;
    finishData = JSON.parse(finishTxt);
    //console.log("finishData", finishData)
    let lap = getLap(sessionData);


    return { sessionData, finishData, lap, err: 0 }
  } catch {
    return { sessionData: null, finishData: null, lap: null, err: "file unkown" }
  }

}



function ParseSa(txt) {


}


export {
  useTrackSession,


}