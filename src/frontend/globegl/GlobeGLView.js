import React, {useState, useEffect, useMemo} from "react";
import Globe from "react-globe.gl";
// import rd3 from 'react-d3-library';
import data from './data.json'

function GlobeGLView() {

    // const [countries, setCountries] = useState({ features: []});
    const [countries, setCountries] = useState(data);
    const [hoverD, setHoverD] = useState();

    useEffect(() => {
        // load data
    }, []);

    // const colorScale = rd3.scaleSequentialSqrt(rd3.interpolateYlOrRd);
    // // GDP per capita (avoiding countries with small pop)
    // const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

    // const maxVal = useMemo(
    //   () => Math.max(...countries.features.map(getVal)),
    //   [countries]
    // );
    // colorScale.domain([0, maxVal]);

    return <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      lineHoverPrecision={0}

      polygonsData={countries.features}
      polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
    //   polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}
      polygonCapColor={d => d === hoverD ? 'steelblue' : 'yellow'}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `
        <b>9999:</b> <br />
        GDP: <i>8888</i> M$<br/>
        Population: <i>0000</i>
      `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    
    />
}

export default GlobeGLView;
