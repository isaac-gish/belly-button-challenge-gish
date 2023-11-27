// Set samples from the link in the BCS module
let samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Create dropdown
function dropdown(){
  // Get JSON data
  d3.json(samples).then(function(data) {
    let sampleName = data.names;
    let selector = d3.select("#selDataset");
    sampleName.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);}); 
    //initialze charts with the first samples data
    let firstName = sampleName[0];
    //Bar Chart function
    barChart(firstName);
    //Bubble chart function
    bubbleChart(firstName);
    //Get demographic info
    demographicInfo(firstName);
    //Get guage chart
    gaugeChart(firstName);
  })
}
//call the dropwdown function
dropdown();

function optionChanged(newSample) {
  barChart(newSample);
  bubbleChart(newSample);
  demographicInfo(newSample);
  gaugeChart(newSample);
}

//Create bar chart function
function barChart(sampleId){d3.json(samples).then(function(data) {
    let sampleResults = data.samples;
    let results = [] 
    //Loop through all the results
    for(let i = 0; i < sampleResults.length; i++) {        
      if(sampleResults[i].id === sampleId){results = sampleResults[i]}
    }
    //Use codes found in BCS (sample_values, otu_ids, otu_labels) //Had to ask ChatGPT how to use this
    let sampleValues = results.sample_values.slice(0,10).reverse();
    let sampleIds = results.otu_ids.slice(0,10).reverse();
    let sampleLabels = results.otu_labels.slice(0,10).reverse();
    //change out_ids to match the sampleIDs
    for(let i = 0; i < sampleIds.length; i++) {
      sampleIds[i] = `${sampleIds[i]}`;
    }
    //CHange to string
    sampleLabels = sampleLabels.toString();
    let barChartData = [{
      x: sampleValues,
      y: sampleIds,
      type: "bar",
      orientation: 'h',
      hovertemplate: sampleLabels
    }];
    let layout = {
      width: 1000,
      height: 400
    };
    //Use Plotly
    Plotly.newPlot("bar", barChartData, layout);
  })
}
//Create a bubble chart
function bubbleChart(sampleId){
  d3.json(samples).then(function(data) {
    let sampleResults = data.samples;
    let results = []

    for(let i = 0; i < sampleResults.length; i++) {        
      if(sampleResults[i].id === sampleId){
        results = sampleResults[i];
      }
    }
  //Follow same steps as bar chart
    let sampleIds = results.otu_ids;
    let sampleValues = results.sample_values;
    let sampleLabels = results.otu_labels;
    //set the data values for the bubble chart
    let bubbleData = [{
      x: sampleIds,
      y: sampleValues,
      text: sampleLabels,
      mode: 'markers',
      marker: {
        color: sampleIds,
        size: sampleValues,
      }
    }];
    let layout = {
      showlegend: false
    };
    let responsive = {responsive: true}
    //plot the bubble chart
    Plotly.newPlot("bubble", bubbleData, layout, responsive);
  })
}

//Chat GPT helped me to write this code
function demographicInfo(sampleId){
  d3.json(samples).then(function(data) {
    let sampleDemographicInfo = data.metadata;
    let demoInfoKeys = [];
    let demoInfoValues = [];
    let panelInfo = d3.select("#sample-metadata");
    panelInfo.html("");
    //get the selected sample results
    for(let i = 0; i < sampleDemographicInfo.length; i++) {  
      if(sampleDemographicInfo[i].id == sampleId){
        demoInfoKeys = Object.keys(sampleDemographicInfo[i]);
        demoInfoValues = Object.values(sampleDemographicInfo[i]);
        for(let j = 0; j < demoInfoKeys.length; j++){
          panelInfo
          .append("p")
          .style("font-weight", 600)
          .text(`${demoInfoKeys[j]}:  ${demoInfoValues[j]}`)
          .insert("br");
        }
      }
    }
  })
}
