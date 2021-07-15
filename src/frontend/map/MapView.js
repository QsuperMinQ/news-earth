import React, { useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import turf from 'turf';
import './MapStyle.css';


function MapView() {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2VpbGl1OTMiLCJhIjoiY2tyMXRyeXRpMjVpdDJvcWh4ZGI0MTJ1NyJ9.US2-VirgCQkgLL3onAfqJw';
    const map = new mapboxgl.Map({
      container: "mapView",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-96, 37.8],
      zoom: 3
    });

    // source marker
    var sourceHtml = `
      <div>
        <ol>
          <li> News one </li>
          <li> News two </li>
          <li> News three </li>
          <li> News four </li>
        </ol>
      </div>
    `;
    var sourcePopup = new mapboxgl.Popup({ offset: 25 }).setHTML(sourceHtml);
    var sourceMarker = new mapboxgl.Marker()
      .setLngLat([-122.414, 37.776])
      .setPopup(sourcePopup)
      .addTo(map);

    // target marker
    var middleHtml = `
      <div>
        <ol>
          <li> News one </li>
          <li> News two </li>
          <li> News three </li>
          <li> News four </li>
        </ol>
      </div>
    `;
    var middlePopup = new mapboxgl.Popup({ offset: 25 }).setHTML(middleHtml);
    var middleMarker = new mapboxgl.Marker()
      .setLngLat([-100.34, 35.78])
      .setPopup(middlePopup)
      .addTo(map);

    // target marker
    var targetHtml = `
      <div>
        <ol>
          <li> News one </li>
          <li> News two </li>
          <li> News three </li>
          <li> News four </li>
        </ol>
      </div>
    `;
    var targetPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(targetHtml);
    var targetMarker = new mapboxgl.Marker()
      .setLngLat([-77.032, 38.913])
      .setPopup(targetPopup)
      .addTo(map);

    // San Francisco
    var origin = [-122.414, 37.776];

    var middle = [-100.34, 35.78]
    
    // Washington DC
    var destination = [-77.032, 38.913];
    
    // A simple line from origin to destination.
    var route = {
      'type': 'FeatureCollection',
      'features': [
          {
          'type': 'Feature',
          'geometry': {
          'type': 'LineString',
          'coordinates': [origin, middle, destination]
          }
        }
      ]
    };
    
    // A single point that animates along the route.
    // Coordinates are initially set to origin.
    var point = {
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
    // var lineDistance = turf.length(route.features[0]);
    var lineDistance = 23251

    var arc = [];
    
    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 500;
    
    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
        var segment = turf.along(route.features[0], i);
        arc.push(segment.geometry.coordinates);
    }
    
    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;
    
    // Used to increment the value of the point measurement against the route.
    var counter = 0;
    
    map.on('load', function () {
      // Add a source and layer displaying a point which will be animated in a circle.
      map.addSource('route', {
        'type': 'geojson',
        'data': route
      });
      
      map.addSource('point', {
        'type': 'geojson',
        'data': point
      });

      map.addLayer({
        'id': 'route',
        'source': 'route',
        'type': 'line',
        'paint': {
        'line-width': 2,
        'line-color': '#007cbf'
        }
      });
      
      map.addLayer({
        'id': 'point',
        'source': 'point',
        'type': 'symbol',
        'layout': {
          'icon-image': 'airport-15',
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true
        }
      });
      
      function animate() {
          var start = route.features[0].geometry.coordinates[counter >= steps ? counter - 1 : counter];
          var end = route.features[0].geometry.coordinates[counter >= steps ? counter : counter + 1];
          if (!start || !end) return;
        
          // Update point geometry to a new position based on counter denoting
          // the index to access the arc
          point.features[0].geometry.coordinates =
          route.features[0].geometry.coordinates[counter];
        
          // Calculate the bearing to ensure the icon is rotated to match the route arc
          // The bearing is calculated between the current point and the next point, except
          // at the end of the arc, which uses the previous point and the current point
          point.features[0].properties.bearing = turf.bearing(
          turf.point(start),
          turf.point(end))
          ;
        
          // Update the source with this new data
          map.getSource('point').setData(point);
          
          // Request the next frame of animation as long as the end has not been reached
          if (counter < steps) {
              requestAnimationFrame(animate);
          }
        
          counter = counter + 1;
      }
      // Start the animation
      animate(counter);
    });
  }, []);
  return <div id ="mapView" className="mapStyle" ></div>
}

export default MapView;
