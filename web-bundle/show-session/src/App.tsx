import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import * as turf from "@turf/turf"
import "./App.css"

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ncnljYW5zIiwiYSI6ImNsMm8ycXdwdzAxeTczY204cXJ5ajBzeXEifQ.6Ln8QhR1LGdJC7YLjdZXsQ';

// San Francisco
const origin = [-122.414, 37.776];

// Washington DC
const destination = [-77.032, 38.913];

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const counter = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(4);



  useEffect(() => {

    if (map.current) return; // initialize map only once
    let trackTxt = (window as any).trackTxt;
    if (trackTxt) {
      console.log("tracktxt=", trackTxt);
    }
    // map.current = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: origin,
    //   zoom: zoom
    // });


    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: origin,
      zoom: zoom
    });

    const route = {
      'type': 'FeatureCollection',
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [origin, destination]
          }
        }
      ]
    };

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
            'coordinates': origin
          }
        }
      ]
    };

    // Calculate the distance in kilometers between route start/end point.
    const lineDistance = turf.length((route.features[0] as any));

    const arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    const steps = 500;

    // Draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
      const segment = turf.along((route.features[0] as any), i);
      arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    counter.current = 0

    console.log("route", route);
    console.log("point", point);
    map.current.on('load', () => {
      // Add a source and layer displaying a point which will be animated in a circle.
      map.current.addSource('route', {
        'type': 'geojson',
        'data': route
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
          'line-width': 2,
          'line-color': '#007cbf'
        }
      });

      map.current.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          'icon-image': 'airport-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });

      function animate() {
        const start =
          route.features[0].geometry.coordinates[
          counter.current >= steps ? counter.current - 1 : counter.current
          ];
        const end =
          route.features[0].geometry.coordinates[
          counter.current >= steps ? counter.current : counter.current + 1
          ];
        if (!start || !end) return;

        // Update point geometry to a new position based on counter denoting
        // the index to access the arc
        point.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter.current];

        // Calculate the bearing to ensure the icon is rotated to match the route arc
        // The bearing is calculated between the current point and the next point, except
        // at the end of the arc, which uses the previous point and the current point
        (point.features[0].properties as any).bearing = turf.bearing(
          turf.point(start),
          turf.point(end)
        );

        // Update the source with this new data
        map.current.getSource('point').setData(point);

        // Request the next frame of animation as long as the end has not been reached
        if (counter.current < steps) {
          requestAnimationFrame(animate);
        }

        counter.current = counter.current + 1;
      }
      animate();

    });

  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div className="map-container">
      <div className="sidebar">
        Lat: {lat} | Lng: {lng} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
