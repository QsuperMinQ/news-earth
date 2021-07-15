import React, {useState, useEffect, useMemo} from "react";
import Globe from "react-globe.gl";
import * as d3 from 'd3';
import { Slider } from 'antd';
import 'antd/dist/antd.css';
// import data from './data.json'
import globeData from './globeData.json'

globeData.features.forEach(item => {
    item.properties.politic_polar = 0;
})

function GlobeGLView() {

    // const [countries, setCountries] = useState({ features: []});
    const [countries, setCountries] = useState(globeData);
    const [hoverD, setHoverD] = useState();
    const [bool, setBool] = useState(true);
    const [time, setTime] = useState();

    useEffect(() => {
        timeChange(1)
    },[]);

    const colorScale = d3.scaleSequentialSqrt(d3.interpolateRdBu);
    // GDP per capita (avoiding countries with small pop)
    // const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);
    const getVal = feat => feat.properties.politic_polar;

    const maxVal = useMemo(
      () => Math.max(...countries.features.map(getVal)),
      [countries]
    );
    colorScale.domain([0, maxVal]);

    const timeChange = (v) => {
        console.log('vvv', v)
        console.log('new Date(dateString)', new Date(`2021-07-${v}`).getTime()/1000)
        let time = (new Date(`2021-07-${v}`).getTime())/1000;
        console.log('time', time)
        fetch(`http://35.72.9.13/api/state/politic_polar?ts=${time}`).then(res => res.json()).then(res => {
            let data = {type: countries.type, features: [...countries.features], bbox: countries.bbox}
            res.forEach(item => {
                data.features.forEach(i => {
                    if (i.properties.name === item.state) {
                        i.properties.politic_polar = item.politic_polar
                    }
                })
            })

            setCountries(data)
        }); 
    }

    const tipFormatter = v => {
        return <div>{`7-${v}`}</div>
    }

    return (
        <div>
            <div style = {{position: 'absolute', zIndex: '100', width: '50%',height: '100px',left: '5%'}}>
                <Slider
                    min={1}
                    max={14}
                    onChange={timeChange}
                    tipFormatter ={tipFormatter}/>
            </div>
            {
                bool
                ? <Globe
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
                        <b>state:${d.name}</b> <br />
                    `}
                    onPolygonHover={setHoverD}
                    polygonsTransitionDuration={300}
                    />
                :<Globe
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    lineHoverPrecision={0}

                    polygonsData={countries.features}
                    polygonStrokeColor={() => '#111'}
                    polygonSideColor={() => 'aacbff'}
                    polygonCapColor={() => 'aacbff'}

                    labelsData={countries.features}
                    labelLat={d => d.properties.lat}
                    labelLng={d => d.properties.lng}
                    labelText={d => '😀'}
                    pathLabel = {d => '😀'}
                    labelSize={0.5}
                    labelDotRadius={0.5}
                    labelAltitude = {0.03}
                    labelLabel = {({ properties: d }) => `
                        <b>detail:${d.name}</b> <br />
                    `}
                    onLabelClick = {() => {
                        console.log('9999999')
                    }}
                    labelColor={() => 'rgba(255, 165, 0, 0.75)'}
                    labelResolution={2}
                 />
            }

        </div>
    )
}

export default GlobeGLView;
