// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  //console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            //console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        //console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        //buildBubbleChart(sample_one);
        //buildGaugeChart(sample_one);

    });
};

// Function that populates metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        //console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            //console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function that populates bar chart info
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all samples data
        let samples = data.samples;

        // Filter based on the value of the sample
        let value = samples.filter(result => result.id == sample);
        
        // Filter based on the value of the sample
        let otu_ids = value[0].otu_ids;
        let sample_values = value[0].sample_values;
        let otu_labels = value[0].otu_labels;
            // Slice the first 10 objects for plotting
        var sliced_otu_ids = otu_ids.slice(0, 10);
        let sliced_sample_values = sample_values.slice(0, 10);
        let sliced_otu_labels = otu_labels.slice(0, 10);
        
        // rewrite sliced_otu_ids
        var sliced_otu_ids_final = []
        
        for (let i = 0; i < sliced_otu_ids.length; i++) {
          sliced_otu_ids_final.push("OTU " + sliced_otu_ids[i]);
        }
        
        // Log the array of metadata objects after the have been filtered
        //console.log(sliced_otu_ids_final);
        //console.log(sliced_sample_values);
        //console.log(sliced_otu_labels);
        
        // Trace1
        let traceBar = {
          x: sliced_sample_values,
          y: sliced_otu_ids_final,
          text: sliced_otu_labels,
          type: "bar",
          orientation: "h"
         };

    // Data array
    // `data` has already been defined, so we must choose a new name here:
    let traceData = [traceBar];

    // Apply a title to the layout
    let layout = {
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
        
// build bubble chart
        var tracebubble = {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: 'markers',
              marker: {
                color: otu_ids,
                opacity: [1, 0.8, 0.6, 0.4],
                size: sample_values
              }
            };

var data = [tracebubble];

var layoutBubble = {
      showlegend: false,
      height: 600,
      width: 1000
    }
    ;



// Render the plot to the div tag with id "bar"
Plotly.newPlot("bar", traceData, layout);
Plotly.newPlot("bubble", data, layoutBubble);

    })
};


// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let dataset = dropdownMenu.property("value");

  // build tables based on dropdown value
        buildMetadata(dataset);
        buildBarChart(dataset);
        //buildBubbleChart(dataset);
        //buildGaugeChart(dataset);
}

init();
