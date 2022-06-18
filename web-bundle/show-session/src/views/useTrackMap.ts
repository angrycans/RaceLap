import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax



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

    console.log("useTrackMap didmount")
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
    // initialize map only once
    if (map.current) {
      if (LapIdx === -1) {
        //map.current.getSource("sessionroute").setData(null);
        map.current.setLayoutProperty('sessionroutelayer', 'visibility', 'visible');
        map.current.setLayoutProperty('colorlinelayer', 'visibility', 'none');

      } else {
        map.current.setLayoutProperty('sessionroutelayer', 'visibility', 'none');
        map.current.setLayoutProperty('colorlinelayer', 'visibility', 'visible');
        map.current.getSource("colorline").setData(LapJson);
        // map.current.getSource("colorline").setData(LapJson);
      }
      return
    };

    if (!actPoint) {
      return;
    }


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
          "background-color": "rgba(3, 20, 57, 0.4)"
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
          'line-width': 4,
          'line-color': '#007cbf'
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
          'line-width': 3,
          'line-color': ['get', 'color']
        }
      });

      /*
            map.current.addSource('colorline2', {
              type: 'geojson',
              lineMetrics: true,
              data: {
                'type': 'FeatureCollection',
                'features': LapJson
              }
            });
      
            map.current.addLayer({
              'id': 'colorlinelayer2',
              'type': 'line',
              'source': 'colorline2',
              'paint': {
                'line-width': 3,
                'line-color': ['get', 'color']
              }
            });
      */
      popup.current = new mapboxgl.Popup({ closeButton: false });
      marker.current = new mapboxgl.Marker({
        color: 'red',
        scale: 0.8,
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
    });


  }, [trackSession]);
}