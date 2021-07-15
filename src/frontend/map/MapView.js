import React, { useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import './MapStyle.css';


function MapView() {
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2VpbGl1OTMiLCJhIjoiY2tyMXRyeXRpMjVpdDJvcWh4ZGI0MTJ1NyJ9.US2-VirgCQkgLL3onAfqJw';
    const map = new mapboxgl.Map({
      container: "mapView",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.9, 42.35],
      zoom: 9
    });
  }, []);
  return <div id ="mapView" className="mapStyle" ></div>
}

export default MapView;
