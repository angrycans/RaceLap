import React, { useRef, useEffect, useState } from 'react';


import * as turf from "@turf/turf"
// eslint-disable-line
import { SafeArea, Button, Space, Collapse, List, CheckList } from 'antd-mobile'// eslint-disable-line
import { useTrackSession } from "./useTrackSession"

import { RNMsg, formatMS } from "../libs"

import { useTrackMap } from './useTrackMap'
import "./session.css"
import { tick } from './tick';
/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import mapboxgl from '!mapbox-gl';// eslint-disable-line import/no-webpack-loader-syntax

import { sessionTxtFromSa, finishTxtFromSa } from './sa'
import { data_rl } from "./dataRL"
import { data_sa } from "./dataSa"

setTimeout(() => {

  //console.log("datarl", data_rl);
  console.log("datasa", sessionTxtFromSa(data_sa));
  //   1,31.934493,118.986260,31.934659,118.986156
  // 2,31.935279,118.986374,31.935097,118.986298
  // 3,31.934911,118.985879,31.934865,118.986073
  // 4,31.934722,118.985327,31.934918,118.985345
  // 5,31.935798,118.986160,31.935994,118.986176
  // 6,31.935468,118.986605,31.935468,118.986803
  // 7,31.934884,118.987121,31.934764,118.987279
  // 8,31.934679,118.986682,31.934449,118.986870
  RNMsg.emit("trackTxt", {
    //racelap finishLine
    //finishTxt: JSON.stringify({ "lat1": "31.93441833", "lng1": "118.9867468", "lat2": "31.93453583", "lng2": "118.9866317", "trackname": "liwand1mini" }),
    finishTxt: JSON.stringify({ "lat1": "31.934679", "lng1": "118.986682", "lat2": "31.934449", "lng2": "118.986870", "trackname": "liwand1mini" }),
    //sessionTxt: data_rl
    sessionTxt: sessionTxtFromSa(data_sa)
  })


}, 2000);

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ';

var _tick;
var _tick2;

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  const marker2 = useRef(null);
  const popup2 = useRef(null);
  const [expanded, setExpanded] = useState("")
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(17);
  const { trackSession, trackSession2, setTrackSession } = useTrackSession(map, marker, popup, marker2, popup2);
  // const { trackSession2, setTrackSession2 } = useTrackSession(map, marker2, popup2);


  const { finishlineJson, sessionJosn, sessionData, trackJosn, LapJson, LapIdx, routeJson, actPoint, actPointIdx } = trackSession;

  //console.log("render trackSession", trackSession);

  useTrackMap(trackSession, trackSession2, map, mapContainer, marker, popup, marker2, popup2, zoom);

  useEffect(() => {
    console.log("sessionscreen didmount--")
    const handleId = (data) => {
      console.log("RNMsg handleId trackTxt", data);

      //return;
      setTrackSession((draft) => {
        draft.trackSession.trackTxt = data;
      })
    }
    RNMsg.on("trackTxt", handleId);
    return () => {
      console.log("sessionscreen undidmount ---")
      RNMsg.off("trackTxt", handleId);
    }
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });


  if (trackSession && routeJson?.length > 0 && !_tick) {
    console.log("new tick", trackSession)
    _tick = tick(sessionData, LapIdx, trackJosn, routeJson, map.current, marker.current, popup.current);
  }

  if (trackSession2 && trackSession2.routeJson?.length > 0 && marker2.current && !_tick2) {
    console.log("new tick", trackSession)
    _tick2 = tick(sessionData, trackSession2.LapIdx, trackJosn, trackSession2.routeJson, map.current, marker2.current, popup2.current, false);
  }

  return (
    <div className="map-wrapper">
      <div className='info-warp'>
        <Collapse activeKey={expanded} accordion>
          <Collapse.Panel key='1' title='Lap' onClick={async () => {

            console.log("expanded", expanded);
            if (expanded == "1") {
              setExpanded("");
            } else {
              setExpanded("1");
            }

          }}>
            <CheckList multiple
              onChange={async v => {
                console.log("CheckList onChange", v);
                if (v.length > 2) {
                  v.splice(1, 1);
                }

                if (v[0]) {
                  console.log("add track 1", v[0]);
                  await setTrackSession(draft => {
                    draft.trackSession.LapIdx = parseInt(v[0]);
                  })
                } else {
                  console.log("remove track 1", v[0]);
                  await setTrackSession(draft => {
                    draft.trackSession.LapIdx = -1;
                  })
                }

                if (v[1]) {
                  console.log("add track 2", v[1]);
                  await setTrackSession(draft => {
                    draft.trackSession2.LapIdx = parseInt(v[1]);
                  })
                } else {
                  console.log("remove track 2", v[1]);
                  //debugger
                  await setTrackSession(draft => {
                    draft.trackSession2.LapIdx = null;
                  })
                }


                setExpanded("");

              }}

            >
              {trackSession.trackJosn && trackSession.trackJosn.lap.map((l, i) => (
                <CheckList.Item key={i + ""} value={"" + i} onClick={async (value) => {
                  //console.log("CheckList onClick", value);

                  // if (LapIdx > -1) {
                  //   console.log("CheckList aleady check" + LapIdx);
                  // }
                  // await setTrackSession(draft => {
                  //   draft.LapIdx = i;
                  // })
                  // setExpanded("");

                }}

                >
                  {`Lap${i} ${formatMS(l.timer)} max:${l.maxspeed}`}
                </CheckList.Item>
              ))}
            </CheckList>
          </Collapse.Panel>

        </Collapse>
      </div>
      <div className="sidebar">
        Lat: {lat} | Lng: {lng} | Zoom: {zoom}
      </div>

      <div ref={mapContainer} className="map-container" >

      </div>
      <div>
        <Button block color='primary' size='large' onClick={() => {
          console.log("play---");
          console.log("trackSession", trackSession)
          if (trackSession.LapIdx > -1) {
            _tick && _tick.play();

          }
          if (trackSession2.LapIdx != null) {
            _tick2 && _tick2.play();
          }

        }}>
          Play
        </Button>
        <Button block color='primary' size='large' onClick={() => {
          console.log("pause---")
          if (trackSession.LapIdx > -1) {
            _tick && _tick.pause();

          }
          if (_tick2) {
            _tick2.pause();
          }

        }}>
          Pause
        </Button>
      </div>

      <div style={{ background: '#ffffff' }}>
        <SafeArea position='bottom' />
      </div>
    </div >
  );
}
