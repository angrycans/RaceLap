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
  ]
};

export function useTrack(trackSession, map, mapContainer) {
  useEffect(() => {
    const { finishlineJson, sessionJosn, sessionData, trackJosn, LapJson, LapIdx2, routeJson, actPoint, actPointIdx } = trackSession;
    console.log("new map0", map.current, actPoint);
    // initialize map only once
    if (map.current || !actPoint) {
      //console.log("map", map.current.getSource("route"));
      return
    };

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: actPoint,
      zoom: 16
    });

    //console.log("new map1", map.current, actPoint);

    // A single point that animates along the route.
    // Coordinates are initially set to origin.
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
    map.current.on('load', () => {
      // Add a source and layer displaying a point which will be animated in a circle.
      map.current.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'LineString',
                'coordinates': sessionJosn.geometry.coordinates
              }
            }
          ]
        }
      });

      map.current.addSource('point', {
        'type': 'geojson',
        'data': point
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
    });

  }, [trackSession]);
}