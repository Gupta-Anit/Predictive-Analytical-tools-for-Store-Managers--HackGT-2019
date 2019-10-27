document.getElementById('fetchBtn').addEventListener('click', function () {
    var dropDown = document.getElementById("itemList");
    var element = dropDown.options[dropDown.selectedIndex].value;
    var query = buildQuery({ itemName: element });

    generateRelatedItemData(query);
});

function generateRelatedItemData(query) {
    var requestURL = '/getItem?' + query;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", requestURL);

    xhr.onload = function () {
        var relatedItems = JSON.parse(this.responseText);
        document.getElementById("my_dataviz").innerHTML = "";
        generateGraph(getInputData(relatedItems));
    }

    xhr.send()
}

var buildQuery = function (data) {
    if (typeof (data) === 'string') return data;
    var query = [];

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
    }
    return query.join('&');
};


function getInputData(relatedItems) {

    var children = [];
    for (var key in relatedItems) {
        children.push({
            'name': key,
            'value': relatedItems[key],
            'size': relatedItems[key] * 100000
        });
    };

    return [{
        'name': "Tree Map of Related Items",
        'children': children
    }];
}

function generateGraph(data) {
    // create a chart and set the data
    chart = anychart.treeMap(data, "as-tree");

    // set the container id
    chart.container("my_dataviz");
    chart.sort("desc");

    //Color
    var customColorScale = anychart.scales.linearColor();
    customColorScale.colors(["#b4f0ad", "#54B948"]);

    // set the color scale as the color scale of the chart
    chart.colorScale(customColorScale);


    chart.tooltip().format(
        "Frequently bought item: {%value}%"
    );

    // initiate drawing the chart
    chart.draw();
}