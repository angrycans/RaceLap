import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from "@turf/turf"

import { SafeArea, Button, Space, Collapse } from 'antd-mobile'
import { useTrackHook } from "./sessionhook"

import { RNMsg, msg } from "../libs"

import { useTrack } from './usetrack'
import "./session.css"

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ';



export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(16);
  const { trackSession, setTrackSession } = useTrackHook();

  console.log("render trackSession", trackSession);

  useTrack(trackSession, map, mapContainer);

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
      <div>
        <Collapse defaultActiveKey={['1', "2", "3"]}>
          <Collapse.Panel key='1' title='第一项'>
            aaa
          </Collapse.Panel>
          <Collapse.Panel key='2' title='第二项'>
            bbb
          </Collapse.Panel>
          <Collapse.Panel key='3' title='第三项'>
            ccc
          </Collapse.Panel>
        </Collapse>
      </div>
      <div ref={mapContainer} className="map-container" >
        <div className="sidebar">
          Lat: {lat} | Lng: {lng} | Zoom: {zoom}
        </div>
      </div>
      <div>
        <Button block color='primary' size='large'>
          Play
        </Button>
      </div>

      <div style={{ background: '#ffffff' }}>
        <SafeArea position='bottom' />
      </div>
    </div>
  );
}
