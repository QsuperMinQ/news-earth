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
    const [bool, setBool] = useState(window.location.search.split('?')[1]);
    const [showList, setShowList] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [current, setCurrent] = useState('emotion');

    useEffect(() => {
        timeChange(1)
    },[]);

    const timeChange = (v) => {
        console.log('vvv', v)
        console.log('new Date(dateString)', new Date(`2021-07-${v}`).getTime()/1000)
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
        
    };

    return (
        <div>
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="politic">
                    
                    <Link to="/globegl">Politically Partisan</Link>
                </Menu.Item>
                <Menu.Item key="emotion">
                    
                    <Link to="/globeglEmotion">Emotion</Link>
                </Menu.Item>
                <Menu.Item key="Topic">
                    <Link to="/map">Topic</Link>
                </Menu.Item>
            </Menu>

            <div style = {{position: 'absolute', zIndex: '100', width: '50%',height: '100px',left: '5%'}}>
                <Slider
                    min={1}
                    max={14}
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
                        return <p><a href={item.url}>{item.title}</a></p>
                    })
                }
                
            </Drawer>

            <Globe
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
            

        </div>
    )
}

export default GlobeGLView;
