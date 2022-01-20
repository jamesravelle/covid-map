
import React, { useState, useEffect } from "react"
import { geoAlbersUsa, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import './Map.css'

const mapWidth = (window.innerWidth > 1000) ? window.innerWidth * .65 : window.innerWidth;
const mapHeight = mapWidth * .5625;
const projection = geoAlbersUsa().scale(mapWidth * 1.2).translate([mapWidth / 2, mapHeight / 2])

const Map = (props) => {
  // Build map
  const [geographies, setGeographies] = useState([])
  // Handle tooltip
  const [tooltip, setToolTip] = useState({})

  useEffect(() => {
    fetch("/states-10m.json")
      .then(response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(worlddata => {
            setGeographies(feature(worlddata, worlddata.objects.states).features)
        })
      })

  }, [])

  

  const showTooltip = (e) => {
    // const topPos = e.target.getBoundingClientRect().top + 50
    // const leftPos = e.target.getBoundingClientRect().left *.75
    const topPos = e.clientY *.75
    const leftPos = e.clientX
    let today = props.totals.date.split('-')
    setToolTip({
      deaths: Math.floor(props.data[props.convertStateName(e.target.id)].death),
      cases: Math.floor(props.data[props.convertStateName(e.target.id)].new),
      totalDeaths: Math.floor(props.data[props.convertStateName(e.target.id)].totalDeath),
      totalCases: Math.floor(props.data[props.convertStateName(e.target.id)].totalCases),
      top: topPos,
      left: leftPos,
      state: e.target.id,
      date: today[1] + '/' + today[2] + '/' +today[0]
    })
  }

  const gradientColor = (num) => {
    if(num === 0) return `rgb(255,255,170)`
    num--; // working with 0-99 will be easier
    // yellow to red
    let r = 255;
    // let g =  Math.floor(255 * ((50-num % 50) / 50));
    let g =  255 - (num * 3);
    let b = 0;
    return `rgb(${r},${g},${b})`;
  }
  //todo calculate color based on distance from average
  const calcFill = (d) => {
    if(props.data[props.convertStateName(d.properties.name)] && props.totals){
      let input =  Math.floor(parseInt(props.data[props.convertStateName(d.properties.name)].death));
      let high = props.totals.highDeaths;
      let scale = input / high;
      return gradientColor(scale*100)
      // return `rgba(255, 0, 0, ${scale}`
    }
  }

  const viewBox =  `0 0 ${mapWidth} ${mapHeight}`
  return (
    <div className="map" >
      <svg width={ mapWidth } height={ mapHeight } viewBox={viewBox}>
        <g className="usa">
          {
            geographies.map((d,i) => (
              <path
                key={ `path-${ i }` }
                d={ geoPath().projection(projection)(d) }
                className={"state"}
                fill={ calcFill(d) } //`rgba(38,50,56,${ 1 / geographies.length * i})` 
                stroke="#000000"
                strokeWidth={ 1 }
                id={d.properties.name}
                onClick={props.mapClick}
                onMouseEnter={showTooltip}
                onMouseLeave = {() => setToolTip({})}
              />
            ))
          }
        </g>
      </svg>
      <div className={`tooltip ${tooltip.state ? "active" : ""}`} style={{top:`${tooltip.top}px`,left:`${tooltip.left}px`}}>
              <div className="header" style={{backgroundColor:`${gradientColor(tooltip.deaths)}`}}>
                <div><strong>{tooltip.state}</strong></div>
                <div>{tooltip.date}</div>
              </div>
              <div className="tooltip-data">Deaths: {props.formatNum(tooltip.deaths)}</div>
              <div className="tooltip-data">New Cases: {props.formatNum(tooltip.cases)}</div>
              <div className="tooltip-data">Total Deaths: {props.formatNum(tooltip.totalDeaths)}</div>
              <div className="tooltip-data">Total Cases: {props.formatNum(tooltip.totalCases)}</div>
      </div>

    </div>
  )
}

export default Map
