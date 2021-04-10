const express = require('express');
//try calling a python script
//const {spawn} = require('child_process');


const fileUpload = require('express-fileupload');

const app = express();
var cors = require('cors')

//Import PythonShell module. 
const { PythonShell } = require('python-shell');

app.use(cors())
app.use(fileUpload());

app.use(express.static('client/public'));

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    //pass the file to the raw folder, to be processed by the server
    raw_address = `${__dirname}/raws/`
    client_address = `${__dirname}/client/public/uploads/`

    var file_name_len = file.name.length;
    if (file.name.slice(file_name_len - 4, file_name_len) == ".mid") {
        console.log("It's a mid file");
        //move the original file to the public folder
        file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

        });
        console.log("mid file moved to public folder");
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, dummy: 'Hey Yo' });
    } else if (file.name.slice(file_name_len - 4, file_name_len) == ".txt"){
        console.log("It is a txt file");
        //move the original file to raw folder
        file.mv(`${__dirname}/raws/${file.name}`, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

        });
        console.log("text file moved to raw folder");
        //check file exists
        const fs = require('fs')
        const path = `${__dirname}/client/public/uploads/${file.name}`

        //run python script
        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time 
            args: [raw_address, client_address, `${file.name}`] //An argument which can be accessed in the script using sys.argv[1] 
        };

        PythonShell.run('python_test.py', options, function (err, result) {
            if (err) throw err;
           
            console.log('result: ', result.toString());
            try {
                if (fs.existsSync(path)) {
                    console.log("right after python: output exists");
                    res.json({ fileName: `${file.name}`, filePath: `/uploads/${file.name}`, dummy: 'Hey Yo' });
                } else {
                    console.log("right after python: file not exists yet");
                }
            } catch (err) {
                console.error("err")
            }
        });

        console.log("about to send to front");
        try {
            if (fs.existsSync(path)) {
                console.log("before sending: output exists");
            } else {
                console.log("before sending: file not exists yet");
            }
        } catch (err) {
            console.error("err")
        }
        //res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, dummy: 'Hey Yo' });

        //res.json({ fileName: "what", filePath: dataToSend, dummy: "hey"});
    } else if (file.name.slice(file_name_len - 4, file_name_len) == ".wav") {
        file_body_name = file.name.slice(0, file_name_len - 4);
        generated_file_name = file_body_name.concat(".mid");
        console.log("It is a wav file");
        console.log(file_body_name);
        console.log(generated_file_name);
        //move the original file to raw folder
        file.mv(`${__dirname}/raws/${file.name}`, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

        });
        console.log("wav file moved to raws folder");
        //check file exists
        const fs = require('fs')
        const path = `${__dirname}/client/public/uploads/${generated_file_name}`

        trans_input = `${raw_address}${file.name}`
        trans_output = `${client_address}${generated_file_name}`

        //run python script
        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time 
            args: [trans_input, trans_output] //An argument which can be accessed in the script using sys.argv[1] 
        };

        PythonShell.run('do_everything.py', options, function (err, result) {
            if (err) throw err;
           
            console.log('result: ', result.toString());
            try {
                if (fs.existsSync(path)) {
                    console.log("right after python: output exists");
                    res.json({ fileName: `${generated_file_name}`, filePath: `/uploads/${generated_file_name}`, dummy: 'Hey Yo' });
                } else {
                    console.log("right after python: file not exists yet");
                }
            } catch (err) {
                console.error("err")
            }
        });

        console.log("about to send to front");
        try {
            if (fs.existsSync(path)) {
                console.log("before sending: output exists");
            } else {
                console.log("before sending: file not exists yet");
            }
        } catch (err) {
            console.error("err")
        }
        //res.json({ fileName: file.name, filePath: `/uploads/${file.name}`, dummy: 'Hey Yo' });

        //res.json({ fileName: "what", filePath: dataToSend, dummy: "hey"});

    }

});

app.listen(5000, () => console.log('Server Started...'));