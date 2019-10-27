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
};

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
};

function getPredictedQuantity(itemName) {
    var testData = {
        '': 0,
        '60 TEATIME FAIRY CAKE CASES': 0,
        'ALARM CLOCK BAKELIKE GREEN': 0,
        'ALARM CLOCK BAKELIKE IVORY': 0,
        'ALARM CLOCK BAKELIKE PINK': 0,
        'ALARM CLOCK BAKELIKE RED': 0,
        'ASSORTED COLOUR BIRD ORNAMENT': 3,
        'BAKING SET 9 PIECE RETROSPOT': 6,
        'BAKING SET SPACEBOY DESIGN': 3,
        'BATHROOM METAL SIGN': 5,
        'CHARLOTTE BAG APPLES DESIGN': 13,
        'CHARLOTTE BAG PINK POLKADOT': 9,
        'CHARLOTTE BAG SUKI DESIGN': 10,
        'CHOCOLATE HOT WATER BOTTLE': 23,
        'COOK WITH WINE METAL SIGN': 3,
        'DOLLY GIRL LUNCH BOX': 6,
        'GARDENERS KNEELING PAD CUP OF TEA': 12,
        'GARDENERS KNEELING PAD KEEP CALM': 0,
        'GIN + TONIC DIET METAL SIGN': 3,
        'GREEN REGENCY TEACUP AND SAUCER': 7,
        'HAND OVER THE CHOCOLATE   SIGN': 3,
        'HAND WARMER BIRD DESIGN': 0,
        'HAND WARMER OWL DESIGN': 0,
        'HAND WARMER SCOTTY DOG DESIGN': 9,
        'HEART OF WICKER LARGE': 7,
        'HEART OF WICKER SMALL': 13,
        'HOME BUILDING BLOCK WORD': 10,
        'HOT WATER BOTTLE I AM SO POORLY': 13,
        'HOT WATER BOTTLE TEA AND SYMPATHY': 7,
        'JAM MAKING SET PRINTED': 0,
        'JAM MAKING SET WITH JARS': 0
    };

    return testData[itemName];        
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