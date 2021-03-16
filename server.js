const express = require('express');
//try calling a python script
//const {spawn} = require('child_process');


const fileUpload = require('express-fileupload');

const app = express();
var cors = require('cors')

//Import PythonShell module. 
const {PythonShell} =require('python-shell'); 

app.use(cors())
app.use(fileUpload());

app.use(express.static('client/public'));

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        //try listen to python
        let options = { 
            mode: 'text', 
            pythonOptions: ['-u'], // get print results in real-time 
            args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1] 
        }; 
          
        PythonShell.run('python_test.py', options, function (err, result){ 
              if (err) throw err; 
              // result is an array consisting of messages collected  
              //during execution of script. 
              console.log('result: ', result.toString()); 
              //res.send(result.toString()) 
        });
        // //const file_url = URL.createObjectURL(file);
        // //try modify the data from the script
        // var dataToSend;
        // // spawn new child process to call the python script
        // const python = spawn('python', ['script2.py', 'str1', 'str2']);
        // // collect data from script
        // python.stdout.on('data', function (data) {
        //     console.log('Pipe data from python script ...');
        //     dataToSend = data.toString();
        // });
        // // in close event we are sure that stream from child process is closed
        // python.on('close', (code) => {
        //     console.log(`child process close all stdio with code ${code}`);
        //     // send data to browser
        //     //res.send(dataToSend)
        //     console.log(dataToSend);
        // });



    });

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, dummy: 'Hey Yo' });
    //res.json({ fileName: "what", filePath: dataToSend, dummy: "hey"});

});

app.listen(5000, () => console.log('Server Started...'));