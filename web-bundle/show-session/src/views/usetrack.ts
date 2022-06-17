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

export function useTrack(trackSession, map, mapContainer, marker, popup) {
  useEffect(() => {
    const { finishlineJson, sessionJosn, sessionData, trackJosn, LapJson, LapIdx2, routeJson, actPoint, actPointIdx } = trackSession;

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
      if (LapIdx2 > 0) {
        map.current.getSource("route").setData(LapJson);
        map.current.getSource("point").setData(point);
        map.current.getSource("colorline").setData(LapJson);

        //console.log("marker.current-----", marker.current);
        marker.current.setLngLat(actPoint)


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
      zoom: 16
    });


    // A single point that animates along the route.
    // Coordinates are initially set to origin.

    map.current.on('load', () => {
      // Add a source and layer displaying a point which will be animated in a circle.
      map.current.addSource('route', {
        'type': 'geojson',
        'data': sessionJosn

      });

      map.current.addSource('point', {
        'type': 'geojson',
        'data': point
      });


      map.current.addLayer({
        "id": "背景",
        "type": "background",
        "paint": {
          "background-color": "rgba(3, 20, 57, 0.4)"
        },
        "metadata": {
          "mapbox:group": "92ca48f13df25"
        }
      });
      map.current.addLayer({
        'id': 'route',
        'source': 'route',
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


      map.current.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
          'icon-image': 'marker-15',
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });

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
      popup.current.setHTML('Altitude: ' + 1 + 'm<br/>');
      marker.current.setLngLat(actPoint);
    });


  }, [trackSession]);
}