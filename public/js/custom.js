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
        generateGraph(relatedItems);
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


function generateGraph(relatedItems){
    for(var key in relatedItems){
        console.log(key);
    }
}