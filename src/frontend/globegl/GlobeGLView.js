import React, {useState, useEffect, useMemo} from "react";
import Globe from "react-globe.gl";
import * as d3 from 'd3';
// import data from './data.json'
import globeData from './globeData.json'

globeData.features.forEach(item => {
    item.properties.politic_polar = Math.random();
})

function GlobeGLView() {

    // const [countries, setCountries] = useState({ features: []});
    const [countries, setCountries] = useState(globeData);
    const [hoverD, setHoverD] = useState();

    useEffect(() => {

    });

    const colorScale = d3.scaleSequentialSqrt(d3.interpolateRdBu);
    // GDP per capita (avoiding countries with small pop)
    // const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
    const getVal = feat => feat.properties.politic_polar;

    const maxVal = useMemo(
      () => Math.max(...countries.features.map(getVal)),
      [countries]
    );
    colorScale.domain([0, maxVal]);

    return <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      lineHoverPrecision={0}

      polygonsData={countries.features}
      polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
      polygonCapColor={d => d === hoverD ? 'green' : colorScale(getVal(d))}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `
        <b>politic:${d.politic_polar}</b> <br />
      `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}

    //   labelsData={countries.features}
    //   labelLat={d => d.geometry.coordinates[0][0][1]}
    //   labelLng={d => d.geometry.coordinates[0][0][0]}
    //   labelText={d => d.properties.name}
    //   labelSize={5}
    //   labelDotRadius={1}
    //   labelColor={() => 'rgba(255, 165, 0, 0.75)'}
    //   labelResolution={2}
    />
}

export default GlobeGLView;
