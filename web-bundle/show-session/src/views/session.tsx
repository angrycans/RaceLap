import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from "@turf/turf"

import { SafeArea, Button, Space, Collapse, List, CheckList } from 'antd-mobile'
import { useTrackSession } from "./useTrackSession"

import { RNMsg, msg, formatMS } from "../libs"

import { useTrackMap } from './useTrackMap'
import "./session.css"
import { tick } from './tick';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ';

var _tick;

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  const marker2 = useRef(null);
  const popup2 = useRef(null);
  const [expanded, setExpanded] = useState("1")
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(17);
  const { trackSession, trackSession2, setTrackSession } = useTrackSession(map, marker, popup, marker2, popup2);
  // const { trackSession2, setTrackSession2 } = useTrackSession(map, marker2, popup2);


  const { finishlineJson, sessionJosn, sessionData, trackJosn, LapJson, LapIdx, routeJson, actPoint, actPointIdx } = trackSession;
  //const { finishlineJson2, sessionJosn2, sessionData2, trackJosn2, LapJson2, LapIdx2, routeJson2, actPoint2, actPointIdx2 } = trackSession2;


  //console.log("render trackSession", trackSession);

  useTrackMap(trackSession, trackSession2, map, mapContainer, marker, popup, marker2, popup2, zoom);

  useEffect(() => {
    console.log("sessionscreen didmount--")
    const handleId = (data) => {
      console.log("RNMsg handleId trackTxt", data);
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
                  await setTrackSession(draft => {
                    draft.trackSession.LapIdx = -1;
                  })
                }

                if (v[1]) {
                  console.log("add track 2", v[1]);
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
            _tick.play();
          }

        }}>
          Play
        </Button>
        <Button block color='primary' size='large' onClick={() => {
          console.log("pause---")
          if (trackSession.LapIdx > -1) {
            _tick.pause();
          }

        }}>
          pause
        </Button>
      </div>

      <div style={{ background: '#ffffff' }}>
        <SafeArea position='bottom' />
      </div>
    </div >
  );
}
