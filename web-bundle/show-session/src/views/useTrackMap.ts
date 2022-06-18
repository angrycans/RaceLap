import React, { useRef, useEffect, useState } from 'react';

/* eslint import/no-webpack-loader-syntax: off */
// @ts-ignore
import mapboxgl from '!mapbox-gl';// eslint-disable-line import/no-webpack-loader-syntax


const mapStyle = {
  "version": 8,
  "name": "Dark",
  "sources": {
    "mapbox": {
      "type": "vector",
      "url": "mapbox://mapbox.mapbox-streets-v8"
    },
  },
  "sprite": "mapbox://sprites/mapbox/dark-v10",
  "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  "layers": [
  ],
};

export function useTrackMap(trackSession, trackSession2, map, mapContainer, marker, popup, marker2, popup2, zoom) {
  useEffect(() => {
    const { finishlineJson, sessionJosn, sessionData, trackJosn, LapJson, LapIdx, routeJson, actPoint, actPointIdx } = trackSession;

    console.log("useTrackMap didmount ", trackSession, trackSession2);
    const point = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'Point',
            'coordinates': actPoint
          }
        }
      ]
    };

    if (map.current) {
      changeColorline(trackSession, trackSession2, map, marker, popup, marker2, popup2)

      return
    };

    if (!actPoint) {
      return;
    }
    // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: actPoint,
      zoom: zoom
    });

    map.current.on('load', () => {
      // Add a source and layer displaying a point which will be animated in a circle.
      map.current.addSource('sessionroute', {
        'type': 'geojson',
        'data': sessionJosn

      });

      map.current.addSource('point', {
        'type': 'geojson',
        'data': point
      });


      map.current.addLayer({
        "id": "backgroud",
        "type": "background",
        "paint": {
          "background-color": "#FCF8E8"
        },
        "metadata": {
          "mapbox:group": "92ca48f13df25"
        }
      });
      map.current.addLayer({
        'id': 'sessionroutelayer',
        'source': 'sessionroute',
        'type': 'line',
        'paint': {
          'line-width': 2,
          'line-color': '#15133C'
        }
      });

      if (finishlineJson) {
        map.current.addSource('finishline', {
          'type': 'geojson',
          'data': finishlineJson
        });
        map.current.addLayer({
          'id': 'finishline',
          'source': 'finishline',
          'type': 'line',
          'paint': {
            'line-width': 6,
            'line-color': '#007cbf'
          }
        });
      }

      map.current.addSource('colorline', {
        type: 'geojson',
        lineMetrics: true,
        data: {
          'type': 'FeatureCollection',
          'features': LapJson
        }
      });

      map.current.addLayer({
        'id': 'colorlinelayer',
        'type': 'line',
        'source': 'colorline',
        'paint': {
          'line-width': 2,
          'line-color': ['get', 'color']
        }
      });
      popup.current = new mapboxgl.Popup({ closeButton: false, className: "apple-popup" });
      marker.current = new mapboxgl.Marker({
        color: 'red',
        scale: 0.5,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
      })
        .setLngLat(actPoint)
        .setPopup(popup.current)
        .addTo(map.current)
        .togglePopup();
      popup.current.setHTML(sessionData[actPointIdx][4] + ' ' + sessionData[actPointIdx][7]);
      marker.current.setLngLat(actPoint);

      map.current.addSource('colorline2', {
        type: 'geojson',
        lineMetrics: true,
        data: {
          'type': 'FeatureCollection',
          'features': []
        }
      });

      map.current.addLayer({
        'id': 'colorlinelayer2',
        'type': 'line',
        'source': 'colorline2',
        'paint': {
          'line-width': 2,
          'line-color': ['get', 'color']
        }
      });

      popup2.current = new mapboxgl.Popup({ closeButton: false, className: "apple-popup2" });

    });


  }, [trackSession, trackSession2]);
}


function changeMarker2(_lapidx, _marker, _actPoint = null, _popup = null, _map = null) {
  if (_lapidx == null) {
    if (_marker.current) {
      _marker.current.remove();
      _marker.current = null;
      console.log("_marker removed")
    }
  } else {

    if (!_marker.current) {
      _marker.current = new mapboxgl.Marker({
        id: "marker2",
        color: 'blue',
        scale: 0.5,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto',

      })
        .setLngLat(_actPoint)
        .setPopup(_popup.current)
        .addTo(_map.current)
        .togglePopup();
    }
  }

}


function changeColorline(_trackSession, _trackSession2, _map, _marker, _popup, _marker2, _popup2) {

  if (_trackSession.LapIdx === -1) {
    //map.current.getSource("sessionroute").setData(null);
    _map.current.setLayoutProperty('sessionroutelayer', 'visibility', 'visible');
    _map.current.setLayoutProperty('colorlinelayer', 'visibility', 'none');

  } else {

    _map.current.setLayoutProperty('sessionroutelayer', 'visibility', 'none');
    _map.current.setLayoutProperty('colorlinelayer', 'visibility', 'visible');
    _map.current.getSource("colorline").setData(_trackSession.LapJson);
    _map.current && _map.current.panTo(_trackSession.actPoint);
    _marker.current && _marker.current.setLngLat(_trackSession.actPoint);
    _popup.current && _popup.current.setHTML(_trackSession.sessionData[_trackSession.actPointIdx][4] + ' ' + _trackSession.sessionData[_trackSession.actPointIdx][7]);

    // map.current.getSource("colorline").setData(LapJson);
  }

  if (_trackSession2.LapIdx == null) {
    console.log("remove trackSession2", _trackSession2.LapIdx);
    changeMarker2(_trackSession2.LapIdx, _marker2);
    _map.current.setLayoutProperty('colorlinelayer2', 'visibility', 'none');

  } else {
    console.log("add trackSession2", _trackSession2.LapIdx)
    _trackSession2.actPoint && _trackSession2.actPointIdx && changeMarker2(_trackSession2.LapIdx, _marker2, _trackSession2.actPoint, _popup2, _map)
    _map.current.setLayoutProperty('colorlinelayer2', 'visibility', 'visible');
    _map.current && _map.current.getSource("colorline2").setData(_trackSession2.LapJson);
    _marker2.current && _marker2.current.setLngLat(_trackSession2.actPoint);
    _popup2.current && _popup2.current.setHTML(_trackSession.sessionData[_trackSession2.actPointIdx][4] + ' ' + _trackSession.sessionData[_trackSession2.actPointIdx][7]);


  }

}