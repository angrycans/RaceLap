import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from "@turf/turf"

import { SafeArea, Button, Space, Collapse, List, CheckList } from 'antd-mobile'
import { useTrackHook } from "./sessionhook"

import { RNMsg, msg, formatMS } from "../libs"

import { useTrack } from './usetrack'
import "./session.css"

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ';



export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const popup = useRef(null);
  const [expanded, setExpanded] = useState("1")
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(17);
  const { trackSession, setTrackSession } = useTrackHook();
  const timerId = useRef(0);

  console.log("render trackSession", trackSession);

  useTrack(trackSession, map, mapContainer, marker, popup);

  useEffect(() => {
    console.log("sessionscreen didmount--0000")
    const handleId = (data) => {
      console.log("RNMsg trackTxt", data);
      setTrackSession((draft) => {
        draft.trackTxt = data;
      })
    }
    RNMsg.on("trackTxt", handleId);
    return () => {
      console.log("sessionscreen undidmount 0000")
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

  return (
    <div className="map-wrapper">
      <div className='info-warp'>
        <Collapse activeKey={expanded} accordion>
          <Collapse.Panel key='1' title='Lap' onClick={async () => {
            setExpanded("1");
          }}>
            <CheckList >
              {trackSession.trackJosn && trackSession.trackJosn.lap.map((l, i) => (
                <CheckList.Item key={i + ""} value={"" + i} onClick={async () => {
                  console.log("Lap onpress");
                  await setTrackSession(draft => {
                    draft.LapIdx2 = i;
                  })
                  setExpanded("");

                }}>
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
          console.log("play---")
          if (trackSession.LapIdx2 > 0) {
            console.log(" trackSession.trackJosn.lap.prv", trackSession.trackJosn.lap)
            let i = trackSession.trackJosn.lap[trackSession.LapIdx2].prv;
            const geojson = {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                  }
                }
              ]
            };
            const timer = setInterval(() => {
              if (i < trackSession.trackJosn.lap[trackSession.LapIdx2].idx) {
                geojson.features[0].geometry.coordinates.push(trackSession.sessionJosn.geometry.coordinates[i]);
                map.current.getSource('route').setData(geojson);
                //map.current.panTo(trackSession.sessionJosn.geometry.coordinates[i]);
                marker.current.setLngLat(trackSession.sessionJosn.geometry.coordinates[i]);
                i++;
              } else {
                window.clearInterval(timer);
              }
            }, 100);
          }

        }}>
          Play
        </Button>
        <Button block color='primary' size='large' onClick={() => {
          console.log("play2---")
          if (trackSession.LapIdx2 > 0) {
            console.log(" trackSession.trackJosn.lap.prv", trackSession.trackJosn.lap)
            let i = trackSession.trackJosn.lap[trackSession.LapIdx2].prv;
            const geojson = {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': []
                  }
                }
              ]
            };

          }

        }}>
          Play2
        </Button>
      </div>

      <div style={{ background: '#ffffff' }}>
        <SafeArea position='bottom' />
      </div>
    </div>
  );
}
