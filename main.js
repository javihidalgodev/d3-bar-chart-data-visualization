import './style.css'
import * as d3 from 'd3'

const getData = async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

const initializeChart = async () => {
  const dataPoint = await getData();

  if (dataPoint) {


    const width = 1000
    const height = 500

    let minDate = new Date(d3.min(dataPoint, d => d[0]))
    let maxDate = new Date(d3.max(dataPoint, d => d[0]))
    let minAmount = d3.min(dataPoint, d => d[1])
    let maxAmount = d3.max(dataPoint, d => d[1])

    let medianDate = (minDate.getTime() + maxDate.getTime()) / 2
    
    const xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width - 80])
    
    console.log(xScale(medianDate) / 2)

    const yScale = d3.scaleLinear()
    .domain([0, maxAmount])
    .range([height - 60, 10])
    
    const svg = d3.select(".container")
    .append("svg")
      .attr("width", width)
      .attr("height", height)

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(60, ${height - 60})`)
        .call(xAxis)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(60, 0)`)
        .call(yAxis)

        svg.selectAll("rect")
        .data(dataPoint)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("width", width / dataPoint.length)
        .attr("height", (d, i) => height - 60 - yScale(d[1]))
        .attr("fill", "red")
        .attr("y", d => yScale(d[1]))
        .attr("x", (d, i) => xScale(new Date(d[0])) + 60)
        .on("mouseover", function (e) {
          const dataDate = e.target.getAttribute("data-date")
          const dataGDP = e.target.getAttribute("data-gdp")
          d3.select('#tooltip')
          .html(dataDate + '<br>' + dataGDP)
          .style("visibility", "visible")
          .attr('data-date', dataDate)
          .attr('data-gdp', dataGDP)
        })
        .on("mouseout", () => {
          d3.select("#tooltip")
          .style("visibility", "hidden")
        })

        d3.select(".container")
          .append("div")
          .attr("id", "tooltip")
  }
}

const handleMouseOver = (e) => {
  const date = e.target.__data__[0]

  document.querySelector('#tooltip').textContent = date
}

initializeChart();