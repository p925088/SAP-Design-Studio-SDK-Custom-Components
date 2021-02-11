/**
 Copyright (c) 2021 Arijit Das

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sub-license, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

/* ---------- Set default properties ---------- */
function hkmDefaultSettings(){
    return {
    	leftMargin: 10, // Left margin for the chart.
        topMargin: 10, // Top margin for the chart.
        rightMargin: 10, // Right margin for the chart.
        bottomMargin: 10, // Bottom margin for the chart.
        textLength: 40 // Max length of label
    };
}

function trimText(text, config){
	var newText = "";
	if(text.length <= config.textLength){
		newText = text;
	} else{
		newText = text.substring(0, config.textLength-3) + "...";
	}
	return newText;
}


/* ---------- Flower Chart Component ---------- */
function hoshinKanri(container, elementId, data, config){
	if(config == null) config = hkmDefaultSettings();
	
	var vis = d3.select("#" + elementId);
	
	var width = vis.style("width").replace("px","");
	var height = vis.style("height").replace("px","");
	
	var componentWidth = width - config.leftMargin - config.rightMargin;
	var componentHeight = height - config.topMargin - config.bottomMargin;
	
	var aList = data.dataset.master_list.aims,
		aCount = aList.length,	
		iList = data.dataset.master_list.initiatives,
		iCount = iList.length,
		dList = data.dataset.master_list.deliverables,
		dCount = dList.length,
		rList = data.dataset.master_list.results,
		rCount = rList.length;
	
	// Draw initial structure
	var rootTable = vis.append("table");
	
	for(var i=0; i<3; i++){
		rootTable.append("tr").attr("id","row"+i);
		for(var j=0; j<3; j++){
			var r = d3.select("#row"+i);
			r.append("td").attr("id","cell_"+i+"_"+j);
		}
	}
	
	// Draw A-I Matrix [cell_0_0]
	var aiMatrix = d3.select("#cell_0_0").append("table");
	aiMatrix.attr("cellspacing","0");
	for(var i=0; i<iCount; i++){
		aiMatrix.append("tr").attr("id","ai"+i);
		for(var j=0; j<aCount; j++){
			var r = d3.select("#ai"+i);
			r.append("td").attr("id","ai_"+i+"_"+j).attr('class','indicator').append("span").text("●");
		}
	}
	
	// Draw I Labels [cell_0_1]
	var iLabel = d3.select("#cell_0_1").append("table");
	iLabel.attr("cellspacing","0");
	for(var i=0; i<iCount; i++){
		var r = iLabel.append("tr");
		r.append("td").append("span").text(iList[i].id);
		r.append("td").append("span").attr("title", iList[i].desc).text(trimText(iList[i].desc, config));
	}
	
	// Draw I-D Matrix [cell_0_2]
	var idMatrix = d3.select("#cell_0_2").append("table");
	idMatrix.attr("cellspacing","0");
	for(var i=0; i<iCount; i++){
		idMatrix.append("tr").attr("id","id"+i);
		for(var j=0; j<dCount; j++){
			var r = d3.select("#id"+i);
			r.append("td").attr("id","id_"+i+"_"+j).attr('class','indicator').append("span").text("●");
		}
	}
	
	// Draw A Labels [cell_1_0]
	var aLabel = d3.select("#cell_1_0").append("table");
	aLabel.attr("cellspacing","0");
	var r1 = aLabel.append("tr");
	var r2 = aLabel.append("tr");
	for(var j=0; j<aCount; j++){			
		r1.append("td").append("div").attr('class','rotateLabel').append("span").attr("title", aList[j].desc).text(trimText(aList[j].desc, config));
		r2.append("td").append("div").attr('class','rotateID').append("span").text(aList[j].id);
	}
	
	// Draw Legend Image [cell_1_1]
	var legend = d3.select("#cell_1_1").append("div").attr('class','legend');
	
	// Draw D Labels [cell_1_2]
	var dLabel = d3.select("#cell_1_2").append("table");
	dLabel.attr("cellspacing","0");
	var r3 = dLabel.append("tr").attr("id","dLabels");
	var r4 = dLabel.append("tr");
	for(var j=0; j<dCount; j++){		
		r3.append("td").append("div").attr('class','rotateLabel')
			.append("span").attr('class','linkLabel')
			.attr('id','dlabel_'+j).append("a").attr("href", dList[j].link).attr("target", '_blank')
			.attr("title", dList[j].desc).text(trimText(dList[j].desc, config));
		r4.append("td").append("div").attr('class','rotateID').append("span").text(dList[j].id);		
	}
	
	
	// Draw R Labels [cell_2_1]
	var rLabel = d3.select("#cell_2_1").append("table");
	rLabel.attr("cellspacing","0");
	for(var i=0; i<rCount; i++){
		var r = rLabel.append("tr");
		r.append("td").append("span").text(rList[i].id);
		r.append("td").append("span").attr("title", rList[i].desc).text(trimText(rList[i].desc, config));
	}
	
	// Draw D-R Matrix [cell_2_2]
	var drMatrix = d3.select("#cell_2_2").append("table");
	drMatrix.attr("cellspacing","0");
	for(var i=0; i<rCount; i++){
		drMatrix.append("tr").attr("id","dr"+i);
		for(var j=0; j<dCount; j++){
			var r = d3.select("#dr"+i);
			r.append("td").attr("id","dr_"+i+"_"+j).attr('class','indicator').append("span").text("●");
		}
	}
	
	//Draw AI Matrix dots
	var aiData = data.dataset.ai_matrix;
	for(var i=0; i<aiData.length; i++){
		var record = aiData[i];
		var cellID = "#ai_"+(record[1]-1)+"_"+(record[0]-1);
		var color="";
		if(record[2] == 0){
			color = "green";
		} else if(record[2] == 1){
			color = "orange";
		} else{
			color = "red";
		}
		
		d3.select(cellID).select("span").style("color", color);
	}
	
	//Draw ID Matrix dots
	var idData = data.dataset.id_matrix;
	for(var i=0; i<idData.length; i++){
		var record = idData[i];
		var cellID = "#id_"+(record[0]-1)+"_"+(record[1]-1);
		var color="";
		if(record[2] == 0){
			color = "green";
		} else if(record[2] == 1){
			color = "orange";
		} else{
			color = "red";
		}
		
		d3.select(cellID).select("span").style("color", color);
	}
	
	//Draw DR Matrix dots
	var drData = data.dataset.dr_matrix;
	for(var i=0; i<drData.length; i++){
		var record = drData[i];
		var cellID = "#dr_"+(record[0]-1)+"_"+(record[1]-1);
		var color="";
		if(record[2] == 0){
			color = "green";
		} else if(record[2] == 1){
			color = "orange";
		} else{
			color = "red";
		}
		
		d3.select(cellID).select("span").style("color", color);
	}
	
	return this;
}

