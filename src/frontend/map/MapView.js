import React, { useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import turf from 'turf';
import './MapStyle.css';
import data from './covid19-who-response.json'

function setupPopup(map, entry) {
  const key = entry[0];
  const value = entry[1];
  var html = `
    <div>
      <span>${key} <span> <br><br>
      <span>${value.content[0]} <span>
    </div>
  `;
  var popUp = new mapboxgl.Popup({ offset: 25 }).setHTML(html);
  var marker = new mapboxgl.Marker()
    .setLngLat([value.lat_lng[1] + Math.random() * 0.03, value.lat_lng[0] + Math.random() * 0.03])
    .setPopup(popUp)
    .addTo(map);
}

function MapView() {
  useEffect(() => {
    // Get valid entities
    var data_entries = []
    Object.entries(data).forEach(entry => {
        const key = entry[0];
        const value = entry[1];
        if (value["lat_lng"]) {
          data_entries.push(entry);
        }
    });

    const lng_lats = data_entries.map(entry => [entry[1].lat_lng[1] , entry[1].lat_lng[0]])
    var origin = [data_entries[0][1].lat_lng[1], data_entries[0][1].lat_lng[0]];
    var destination = [data_entries[data_entries.length - 1][1].lat_lng[1], 
                       data_entries[data_entries.length - 1][1].lat_lng[0]];

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2VpbGl1OTMiLCJhIjoiY2tyMXRyeXRpMjVpdDJvcWh4ZGI0MTJ1NyJ9.US2-VirgCQkgLL3onAfqJw';
    const map = new mapboxgl.Map({
      container: "mapView",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: origin,
      zoom: 2
    });

    // Setup popup and markers
    data_entries.forEach(entry => {
      setupPopup(map, entry)
    });

    // A simple line from origin to destination.
    var route = {
      'type': 'FeatureCollection',
      'features': [
          {
          'type': 'Feature',
          'geometry': {
          'type': 'LineString',
          'coordinates': lng_lats
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
    var lineDistance = 100000000

    var arc = [];
    
    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 10000000;
    
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
          turf.point(end));
        
          // Update the source with this new data
          map.getSource('point').setData(point);
          
          // Request the next frame of animation as long as the end has not been reached
          if (counter < steps) {
              requestAnimationFrame(animate);
          }
        
          counter = counter + 1;

          map.setCenter(end);
      }

      animate(counter);
    });
  }, []);
  return <div id ="mapView" className="mapStyle" ></div>
}

export default MapView;
