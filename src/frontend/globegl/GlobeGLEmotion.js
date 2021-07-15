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
    item.properties.sentiment = 0.5;
})

function GlobeGLView(props) {

    // const [countries, setCountries] = useState({ features: []});
    const [countries, setCountries] = useState(globeData);
    const [current, setCurrent] = useState('emotion');
    const [time, setTime] = useState(1);

    useEffect(() => {
        timeChange(1)
    },[]);

    const timeChange = (v) => {
        setTime(v)
        let time = (new Date(`2021-07-${v}`).getTime())/1000;
        // console.log('time', time)
        fetch(`http://35.72.9.13/api/state/sentiment?ts=${time}`).then(res => res.json()).then(res => {
            let data = {type: countries.type, features: [...countries.features], bbox: countries.bbox}
            res.forEach(item => {
                data.features.forEach(i => {
                    if (i.properties.name === item.state) {
                        i.properties.sentiment = item.sentiment;
                    }
                })
            })

            setCountries(data)
        }); 
    }

    const tipFormatter = v => {
        return <div>{`7-${v}`}</div>
    }

    const handleClick = e => {
        console.log('click ', e);
        setCurrent(e.key)
        
    };

    const getGrade = (v) => {
      console.log('Sentiment==>', v)
     if (0 < v && v <= 1/6) {
        return 'blue'
      } else if (1/6 < v && v <= 2/6) {
        return 'red'
      } else if (2/6 < v && v <= 3/6) {
        return 'yellow'
      } else if (3/6 < v && v <= 4/6) {
        return 'pink'
      } else if (4/6 < v && v <= 5/6) {
        return '#F9AA0C'
      } else if (5/6 < v && v <= 1) {
        return 'green'
      }
    }

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

            <div style = {{position: 'absolute', zIndex: '100', width: '50%',height: '100px',left: '5%'}}>
                <Slider
                    min={1}
                    max={14}
                    onChange={timeChange}
                    tipFormatter ={tipFormatter}/>
            </div>

            <div style = {Styles.legend}>
              <p style ={Styles.blue}>Sad</p>
              <p style ={Styles.red}>Angry</p>
              <p style ={Styles.yellow}>Scared</p>
              <p style ={Styles.pink}>Tender</p>
              <p style ={Styles.orange}>Excited</p>
              <p style ={Styles.green}>Happy</p>
            </div>

            <Globe
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    lineHoverPrecision={0}

                    polygonsData={countries.features}
                    polygonStrokeColor={() => '#111'}
                    polygonSideColor={() => 'aacbff'}
                    polygonCapColor={({ properties: d }) => {
                      return getGrade(d.sentiment)
                    }}

                    labelsData={countries.features}
                    labelLat={d => d.properties.lat}
                    labelLng={d => d.properties.lng}
                    // labelText={d => d.properties.name}
                    // labelSize={0.5}
                    // labelDotRadius={0.5}
                    labelAltitude = {0.03}
                    // labelLabel = {({ properties: d }) => `
                    //     <b style='color: red'>Sentiment:${getSentiment((d.politic_polar+1)/2)}</b> <br />
                    // `}
                    onLabelClick = {() => {
                        console.log('9999999')
                    }}
                    labelColor={() => 'rgba(255, 165, 0, 0.75)'}
                    labelResolution={2}
                 />
            

        </div>
    )
}

const Styles = {

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

  legend: {
    position: 'absolute',
    zIndex: '100',
    width: '100px',
    right: '10px',
    top:'50px',
    backgroundColor:'#fff',
    fontSize: '16px',
    color: '#ECEBE8'
  },

  blue: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    margin: 0
  },

  red: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'red'
  },

  yellow: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'yellow'
  },

  pink: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'pink'
  },

  orange: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    backgroundColor: '#F9AA0C'
  },

  green: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'green'
  },

}

export default GlobeGLView;
