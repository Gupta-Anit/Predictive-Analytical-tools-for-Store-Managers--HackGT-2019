var express = require('express'),
    { PythonShell } = require('python-shell');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Starting the connection to the server');
});

app.get('/', (req, res) => {
    PythonShell.run('./test.py', { args: [] }, (err, data) => {
        if (err) {
            res.send(err);
        }
        // res.send(createJSONObject(data)['Output']);
        res.render('home');
    });
});




// Backup function that to run the python script
function runPythonScript(script, input) {
    var spawn = require('child_process').spawn;
    var process = spawn('python', ['./test.py', true]);
    process.stdout.on('data', function (data) {
        var result = createJSONObject(data);

        return result;
    });
}

// Python by default uses single quotes. JS wants double quotes :(
function createJSONObject(data) {
    return JSON.parse(data.toString().replace(/\'/g, '"'));
}