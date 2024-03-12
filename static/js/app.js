const dataSource = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(dataSource).then((dataImport) => {

	console.log(dataImport);

	var dataSet = dataImport;

	//Add IDs to the dropdown menu
	var idsList = dataSet.names;

	idsList.forEach((id) => {
		d3.select("#selDataset").append("option").text(id);
	})

	// Plot default charts for the first item
	function initializeCharts() {

		// Choose data for the first item
		var sampleData = dataSet.samples[0];
		console.log(sampleData);

		// Select all sample values, OTU IDs, and OTU labels of the item
		var sampleValues = sampleData.sample_values;
		var sampleIds = sampleData.otu_ids;
		var sampleLabels = sampleData.otu_labels;

		// Select the top 10 OTUs with their sample values, OTU IDs, and OTU labels
		var top10SampleValues = sampleValues.slice(0, 10).reverse();
		var top10SampleIds = sampleIds.slice(0, 10).reverse();
		var top10SampleLabels = sampleLabels.slice(0, 10).reverse();

		console.log(top10SampleIds);
		console.log(top10SampleIds);
		console.log(top10SampleLabels);

		// Plot Bar Chart
		var barTrace = {
			x: top10SampleValues,
			y: top10SampleIds.map(Id => `OTU ${Id}`),
			text: top10SampleValues,
			type: "bar",
			orientation: "h",
			marker: {
				color: "blue" 
			}
		};

		var barChart = [barTrace];

		var barLayout = {
			title: `Top 10 OTUs`,
			width: 450,
			height: 600
		}

		Plotly.newPlot("bar", barChart, barLayout);

		// Create Bubble Chart
		var colorScale = d3.scaleOrdinal()
			.domain(top10SampleIds)
			.range(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0', '#808080', '#800000', '#808000']);
		var bubbleColors = top10SampleIds.map(id => colorScale(id));
		var bubbleTrace = {
			x: top10SampleIds,
			y: top10SampleValues,
			text: top10SampleLabels,
			mode: 'markers',
			marker: {
				color: bubbleColors,
				size: top10SampleValues
			}
		};
		
		var bubbleChart = [bubbleTrace];
		
		var bubbleLayout = {
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"}, 
		};
		
		Plotly.newPlot('bubble', bubbleChart, bubbleLayout);

		// Get demographic information
		var demographicInfo = dataSet.metadata[0]
		console.log(demographicInfo);

		//Display each key-value pair from the metadata JSON object somewhere on the page.
		Object.entries(demographicInfo).forEach(
			([key, value]) => d3.select("#sample-metadata")
				.append("p").text(`${key.toUpperCase()}: ${value}`));
	
	    
	}
	initializeCharts();

	d3.selectAll("#selDataset").on("change", updatePlots);

	// Function to update all the plots when a new sample is selected.
	function updatePlots() {

		// Use D3 to select the dropdown menu
		var selectElement = d3.select("#selDataset");

		// Assign the value of the dropdown menu option to a variable
		var selectedId = selectElement.property("value");
		console.log(selectedId);

		// Create dataset based on the chosen ID
		var chosenDataset = dataSet.samples.filter(sample => sample.id === selectedId)[0];
		console.log(chosenDataset);

		// Select all sample values, OTU IDs, and OTU labels of the selected test ID
		var selectedSampleValues = chosenDataset.sample_values;
		var selectedSampleIds = chosenDataset.otu_ids;
		var selectedSampleLabels= chosenDataset.otu_labels;

		// Select the top 10 OTUs with their sample values, OTU IDs, and OTU labels
		var top10Values = selectedSampleValues.slice(0, 10).reverse();
		var top10Ids = selectedSampleIds.slice(0, 10).reverse();
		var top10Labels = selectedSampleLabels.slice(0, 10).reverse();

		// Bar Chart Updated
		var barColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0', '#808080', '#800000', '#808000'];

		Plotly.restyle("bar", {
			x: [top10Values],
			y: [top10Ids.map(Id => `OTU ${Id}`)],
			text: [top10Labels],
			"marker.color": [barColors],
		});

		var colorScale = d3.scaleOrdinal()
			.domain(top10SampleIds)
			.range(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0', '#808080', '#800000', '#808000']);

		var bubbleColors = selectedSampleIds.map(id => colorScale(id));

		// Bubble Chart Updated
		
		Plotly.restyle('bubble', {
			x: [selectedSampleIds],
			y: [selectedSampleValues],
			text: [selectedSampleLabels],
			"marker.color": [bubbleColors],
			"marker.size": [selectedSampleValues]
		});
		
		var newDataInfo = dataSet.metadata.filter(sample => sample.id == selectedId)[0];

		// Clear out current contents in the panel
		d3.select("#sample-metadata").html("");

		//Display each key-value pair from the metadata JSON object somewhere on the page.
		Object.entries(newDataInfo).forEach(([key, value]) => d3.select("#sample-metadata")
			.append("p").text(`${key}: ${value}`));
        
	}
});
