var express = require('express'),
    { PythonShell } = require('python-shell');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Starting the connection to the server');
});


rules = {};

app.get('/', (req, res) => {
    var masterItemList = {}
    PythonShell.run('./itemsList.py', { args: [] }, (err, data) => {
        if (err) {
            res.send(err);
        }
        masterItemList = createJSONObject(data.toString())['items'];

        var intializer = {
            'items': masterItemList
        };
        console.log(masterItemList);

        res.render('home', { data: intializer });
    });


    // runPythonScript('/Get_other_frequent_Items.ipynb', []);
    // res.send('Home Page');
    // console.log(result);
});

app.get('/getItem', (req, res) => {
    console.log(req.query.itemName);

    let options = {
        args: [req.query.itemName]
    };

    PythonShell.run('./getRelatedItems.py', options, (err, data) => {
        if (err){
            res.send(err);
        }
        console.log(data.toString());
        var result = createJSONObject(data);
        res.send(result);
    });   
});


// Backup function that to run the python script
function runPythonScript(script) {
    var spawn = require('child_process').spawn;
    var process = spawn('python', [script, true]);
    process.stdout.on('data', function (data) {
        var result = createJSONObject(data);
        return result;
    });
}

function runPythonScript(script, arguments){
    var spawn = require('child_process').spawn;
    var process = spawn('python', [script, arguments]);
    process.stdout.on('data', function (data) {
        var result = createJSONObject(data);
        return result;
    });
}

// Python by default uses single quotes. JS wants double quotes :(
function createJSONObject(data) {
    return JSON.parse(data.toString().replace(/\'/g, '"'));
}