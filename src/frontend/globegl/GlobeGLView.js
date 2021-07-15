import React, {useState, useEffect, useMemo} from "react";
import Globe from "react-globe.gl";
import * as d3 from 'd3';
import { Slider, Drawer, Menu } from 'antd';
import 'antd/dist/antd.css';
import {
    Link
  } from "react-router-dom";
import globeData from './globeData.json'

globeData.features.forEach(item => {
    item.properties.politic_polar = 0.5;
})

function GlobeGLView(props) {

    // const [countries, setCountries] = useState({ features: []});
    const [countries, setCountries] = useState(globeData);
    const [hoverD, setHoverD] = useState();
    const [bool, setBool] = useState(true);
    const [showList, setShowList] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [current, setCurrent] = useState('politic');
    const [time, setTime] = useState(2);

    useEffect(() => {
        timeChange(time)
    },[]);

    const timeChange = (v) => {
        setTime(v)
        let time = (new Date(`2021-07-${v}`).getTime())/1000;
        // console.log('time', time)
        fetch(`http://35.72.9.13/api/state/politic_polar?ts=${time}`).then(res => res.json()).then(res => {
            let data = {type: countries.type, features: [...countries.features], bbox: countries.bbox}
            res.forEach(item => {
                data.features.forEach(i => {
                    if (i.properties.name === item.state) {
                        i.properties.politic_polar = item.politic_polar;
                        i.properties.items = item.items;
                    }
                })
            })

            setCountries(data)
        }); 
    }

    const tipFormatter = v => {
        return <div>{`7-${v}`}</div>
    }

    const onClose = () => {
    setShowList(false);
    };

    const handleClick = e => {
        console.log('click ', e);
        setCurrent(e.key)
        setBool(e.key === 'politic')
        
    };

    return (
        <div>
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="politic">
                    
                    <Link to="/globegl">Political polar</Link>
                </Menu.Item>
                <Menu.Item key="emotion">
                    
                    <Link to="/globeglEmotion">Sentiment</Link>
                </Menu.Item>
                <Menu.Item key="Topic">
                    <Link to="/map">Event timeline</Link>
                </Menu.Item>
            </Menu>

            <div style = {Styles.time}>{`7-${time}`}</div>

            <div style = {{position: 'absolute', zIndex: '100', width: '50%',height: '100px',left: '5%',top:'60px',}}>
                <Slider
                    min={1}
                    max={14}
                    defaultValue={time}
                    onChange={timeChange}
                    tipFormatter ={tipFormatter}/>
            </div>

            <Drawer
                title="news"
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showList}
            >
                {
                    newsList.map(item => {
                        return <p><img style={Styles.icon} src={item.thumbnail_url[0]}/><span>[{item.politic_polar}]&nbsp;</span><a href={item.url}>{item.title}</a></p>
                    })
                }
                
            </Drawer>

            {
                bool
                ? <Globe
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    lineHoverPrecision={0}
        
                    polygonsData={countries.features}
                    polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
                    // polygonCapColor={d => d === hoverD ? 'green' : colorScale(getVal(d))}
                    polygonCapColor={d => d === hoverD ? 'green' : d3.interpolateRdBu(1-((d.properties.politic_polar + 1)/2))}
                    polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
                    polygonStrokeColor={() => '#111'}
                    polygonLabel={({ properties: d }) => `
                        <b style="color:red">politic:${d.politic_polar.toFixed(3)}</b> <br />
                        <b style="color:red">state:${d.name}</b> <br />
                    `}
                    onPolygonHover={setHoverD}
                    polygonsTransitionDuration={300}
                    onPolygonClick = {({ properties: d } )=> {
                        setShowList(true)
                        setNewsList(d.items)
                    }}
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
                    labelText={d => d.properties.name}
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

var Styles = {
    time: {
        position: 'absolute',
        zIndex: '100',
        width: '100px',
        height: '100px',
        left: '10px',
        top:'150px',
        backgroundColor:'#fff',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    icon: {
        width: '30px',
        height: '30px'
    }
}

export default GlobeGLView;
