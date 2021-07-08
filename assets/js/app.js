// Create parameters

var svgWidth = 900;
var svgHeight = 500;

var margin = {
    top: 50,
    bottom: 60,
    right: 50,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold the chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare= +data.healthcare;
    });
    console.log(healthData)

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.append("g")
    .attr("class", "stateCircle")
    .selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", ".2");

    // Add text on top of circles to show state 
    // ===============================
    var textGroup = chartGroup.append("g")
    .attr("class", "stateText")
    .selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty) - 0) //a nudge 
    .attr("y", d => yLinearScale(d.healthcare) + 5) // a nudge
    .html(function ( d ) {
        return (`${d.abbr}`);
    });


    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}% <br>Lacks healthcare: ${d.healthcare}%`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("g")
      .attr("class", "leftaxis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 25)
      .attr("x", 0 - (height / 2 ))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)")
      .attr("class", "active");

    // Bottom Axis labels
    chartGroup.append("g")
      .attr("class", "bottomAxis")
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 0})`)
      .attr("class", ".aText")
      .text("In Poverty (%)")
      .attr("class", "active");

  }).catch(function(error) {
    console.log(error);
  });
