var max
d3.csv("police.csv", function(row){
  //console.log(row);
return row;
}).then(function(data){
  //console.log(data2.length);
  //for(var i =0; i <data2.length; i++){

//return data2;
//SET MAX

//console.log(row);



  // get the data to visualize
//  let count = updateData()
//console.log(count);
  // get the svg to draw on
  let svg = d3.select("body").select("svg");

  let count = d3.map();

  /*
   * you can loop through strings as if they are arrays
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
   */
   var category
  for (let i = 0; i < data.length; i++) {
  category = data[i]["Incident Day of Week"];
    //console.log(category);
    if (count.has(category)) {
      count.set(category, count.get(category) + 1);
    }
    else {
      count.set(category, 1);
    }
//    // check if we have seen this letter before

  }


  /*
   * we will need to map our data domain to our svg range, which
   * means we need to calculate the min and max of our data
   */

  let countMin = 0; // always include 0 in a bar chart!
  let countMax = d3.max(count.values());

  // this catches the case where all the bars are removed, so there
  // is no maximum value to compute
  //if (isNaN(countMax)) {
    //countMax = 0;
  //}

  // console.log("count bounds:", [countMin, countMax]);

  /*
   * before we draw, we should decide what kind of margins we
   * want. this will be the space around the core plot area,
   * where the tick marks and axis labels will be placed
   * http://bl.ocks.org/mbostock/3019563
   */
  let margin = {
    top:    30,
    right:  50, // leave space for y-axis
    bottom: 110, // leave space for x-axis
    left:   70
  };

  // now we can calculate how much space we have to plot
  let bounds = svg.node().getBoundingClientRect();
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;

  /*
   * okay now somehow we have to figure out how to map a count value
   * to a bar height, decide bar widths, and figure out how to space
   * bars for each letter along the x-axis
   *
   * this is where the scales in d3 come in very handy
   * https://github.com/d3/d3-scale#api-reference
   */

  /*
   * the counts are easiest because they are numbers and we can use
   * a simple linear scale, but the complicating matter is the
   * coordinate system in svgs:
   * https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions
   *
   * so we want to map our min count (0) to the max height of the plot area
   */
  let yScale = d3.scaleLinear()
    .domain([countMin, countMax])
    .range([plotHeight, 0])
    .nice(); // rounds the domain a bit for nicer output

  /*
   * the letters need an ordinal scale instead, which is used for
   * categorical data. we want a bar space for all letters, not just
   * the ones we found, and spaces between bars.
   * https://github.com/d3/d3-scale#band-scales
   */
   //var cat= "category" + "gory"
   var cat = data[8]["Incident Category"]
let xScale = d3.scaleBand()
     .domain(["Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"])
    .rangeRound([0, plotWidth])
    .paddingInner(0.1); // space between bars
//console.log(data2[l]["Incident Category"])
//}
  // try using these scales in the console
  // console.log("count scale [0, 36]:", [yScale(0), yScale(36)]);


  // console.log("letter scale [a, z]:", [xScale('a'), xScale('z')]);

  // we are actually going to draw on the "plot area"
  let plot = svg.select("g#plot");

  if (plot.size() < 1) {
    // this is the first time we called this function
    // we need to steup the plot area
    plot = svg.append("g").attr("id", "plot");

    // notice in the "elements" view we now have a g element!

    // shift the plot area over by our margins to leave room
    // for the x- and y-axis
    plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  // now lets draw our x- and y-axis
  // these require our x (letter) and y (count) scales
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisRight(yScale);

  // check if we have already drawn our axes
  if (plot.select("g#y-axis").size() < 1) {
    let xGroup = plot.append("g").attr("id", "x-axis");

    // the drawing is triggered by call()
    xGroup.call(xAxis);

    // notice it is at the top of our svg
    // we need to translate/shift it down to the bottom
    xGroup.attr("transform",  "translate(0," + plotHeight + ")");


    // do the same for our y axix
    let yGroup = plot.append("g").attr("id", "y-axis");
    yGroup.call(yAxis);
    yGroup.attr("transform", "translate(" + plotWidth + ",0)");
  }
  else {
    // we need to do this so our chart updates
    // as we type new letters in our box
    plot.select("g#y-axis").call(yAxis);
  }

  // now how about some bars!
  /*
   * time to bind each data element to a rectangle in our visualization
   * hence the name data-driven documents (d3)
   */
  let bars = plot.selectAll("rect")
    .data(count.entries(), function(d) { return d.key; });

  // setting the "key" is important... this is how d3 will tell
  // what is existing data, new data, or old data

  /*
   * okay, this is where things get weird. d3 uses an enter, update,
   * exit pattern for dealing with data. think of it as new data,
   * existing data, and old data. for the first time, everything is new!
   * http://bost.ocks.org/mike/join/
   */
   console.log(category);
  // we use the enter() selection to add new bars for new data
  bars.enter().append("rect")
    // we will style using css
    .attr("class", "bar")
    // the width of our bar is determined by our band scale
    .attr("width", xScale.bandwidth())
    // we must now map our letter to an x pixel position
//////////////////////////////////////


    .attr("fill", function(d) {

    if (d.key==="Tuesday" ) { //Red
      return "red";
    } else if(d.key==="Sunday"){
      return "blue"
    }else if(d.key==="Thursday") {  //green
      return "green";
    } else if (d.key === "Monday") { //Orange
      return "orange";

    }else if(d.key==="Saturday"){
    return "pink";
  }else if(d.key==="Friday"){
    return "Yellow";
  }else{
    return "BurlyWood";
  }
  })

  //////////////////////////////////////
    .attr("x", function(d) {
      return xScale(d.key);
    })
    // and do something similar for our y pixel position
    .attr("y", function(d) {
      return yScale(d.value);
    })
    // here it gets weird again, how do we set the bar height?
    .attr("height", function(d) {
      return plotHeight - yScale(d.value);
    })
    .each(function(d, i, nodes) {
      console.log("Added bar for:", d.key);
    });

  // notice there will not be bars created for missing letters!

  // so what happens when we change the text?
  // well our data changed, and there will be a new enter selection!
  // only new letters will get new bars

  // but we have to bind this draw function to textarea events
  // (see index.html)

  // for bars that already existed, we must use the update selection
  // and then update their height accordingly
  // we use transitions for this to avoid change blindness

  //////////////////////////////////////
  svg.append("text")
         .attr("x", (plotWidth/ 2))
         .attr("y", 20 - (1 / 2))
         .attr("text-anchor", "middle")
         .style("font-size", "20px")
         .text("Number of records per day of week");

         svg.append("text")
                .attr("x", (plotWidth/ 2))
                .attr("y", 50 - (1 / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Incident day of Week");


                svg.append("text")
                       .attr("x", (1/ 10))
                       .attr("y", 10 - (1 / 2))
                       .attr("dy", ".35em")
                       .attr("transform", "rotate(-90)")

                       .attr("text-anchor", "end")
                       //.attr("transform", "rotate(-90)")
                       .style("font-size", "16px")
                       .text("Number of Records");

                                        svg.append("text")
                                               .attr("x", (1/ 10))
                                               .attr("y", 450 - (1 / 2))
                                               .attr("text-anchor", "start")
                                               .style("font-size", "12px")
                                               .text("David Mendez: Sum of Number of Records for each Incident Day of Week.  Color shows details about the week day in no specific fashion, just for clarity");



  bars.transition()
    .attr("y", function(d) { return yScale(d.value); })
    .attr("height", function(d) { return plotHeight - yScale(d.value); });

  // what about letters that disappeared?
  // we use the exit selection for those to remove the bars

  bars.exit()
    .each(function(d, i, nodes) {
      console.log("Removing bar for:", d.key);
    })

    .attr("y", function(d) { return yScale(countMin); })
    .attr("height", function(d) { return plotHeight - yScale(countMin); })
    .remove();

})
