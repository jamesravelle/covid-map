// import React, { Component } from 'react';
import { Element } from 'react-faux-dom';
import * as d3 from 'd3';
import './Barchart.css'

function Barchart(props){
    
    // format data for bar chart
    let data = [];
    Object.keys(props.data).forEach((el,ind)=>{
        let deaths = parseInt(props.data[el].death);
        if(deaths !== 0) {
            data.push({
                state: el,
                value: deaths
            })
        }
    })
    data.sort((a,b) => (a.value < b.value) ? 1 : ((b.value < a.value) ? -1 : 0));

    const formatDate = (date) => {
        let today = date.split('-');
        return today[1] + '/' + today[2] + '/' +today[0]
    }

    const plot = (chart, width, height) => {

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.state))
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([height, 0]);

        chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .classed('bar', true)
            .attr('x', d => xScale(d.state))
            .attr('y', d => yScale(d.value))
            .attr('height', d => (height - yScale(d.value)))
            .attr('width', d => xScale.bandwidth())
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('fill', (d) => {
                return `rgb(255,${255 - (d.value*2)},0)`
            });

        chart.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', d => xScale(d.state) + xScale.bandwidth()/2)
            .attr('dx', 0)
            .attr('y', d => yScale(d.value))
            .attr('dy', -6)
            .text(d => d.value)
            .style('font-size', ()=>{
                if(data.length > 25){
                    return '14px'
                } else{
                    return (window.innerWidth > 900) ? '18px' : '14px';
                }
            });

        const xAxis = d3.axisBottom()
            .scale(xScale);
            
        chart.append('g')
            .classed('x axis', true)
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        const yAxis = d3.axisLeft()
            .ticks(5)
            .scale(yScale);

        chart.append('g')
            .classed('y axis', true)
            .attr('transform', 'translate(0,0)')
            .call(yAxis);
               
            
        chart.select('.y.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', `translate(-50, ${height/2}) rotate(-90)`)
            .attr('fill', '#000')
            .style('font-size', '20px')
            .style('text-anchor', 'middle')

        chart.append("text")
            .attr("x", (width / 2))             
            .attr("y", -20)
            .attr("text-anchor", "middle")  
            .style('font-size', '14px')
            .style('font-weight','bold')
            .text('Deaths Per State (' + formatDate(props.date) + ')');  
              
            
        const yGridlines = d3.axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickSize(-width,0,0)
            .tickFormat('')

        chart.append('g')
            .call(yGridlines)
            .classed('gridline', true);
    }

    const drawChart = () => {
        const width = window.innerWidth - 60;
        const height = (width > 500) ? width * .4 : 500;

        const el = new Element('div');
        const svg = d3.select(el)
            .append('svg')
            .attr('id', 'chart')
            .attr('width', width)
            .attr('height', height)

        const margin = {
            top: 60,
            bottom: 60,
            left: 40,
            right: 40
        };

        const chart = svg.append('g')
            .classed('display', true)
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom
        plot(chart, chartWidth, chartHeight);

        return el.toReact();
    }
    
    
    return drawChart();

}

export default Barchart;