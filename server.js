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
    } else {
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
        const path = `${__dirname}/client/public/uploads/output.txt`

        //run python script
        let options = {
            mode: 'text',
            pythonOptions: ['-u'], // get print results in real-time 
            args: [raw_address, client_address, `${file.name}`] //An argument which can be accessed in the script using sys.argv[1] 
        };

        PythonShell.run('python_test.py', options, function (err, result) {
            if (err) throw err;
            // result is an array consisting of messages collected  
            //during execution of script. 
            console.log('result: ', result.toString());
            try {
                if (fs.existsSync(path)) {
                    console.log("right after python: output exists");
                    res.json({ fileName: "output.txt", filePath: `/uploads/output.txt`, dummy: 'Hey Yo' });
                } else {
                    console.log("right after python: file not exists yet");
                }
            } catch (err) {
                console.error("err")
            }
        });

        //move the file to the public folder, to be rendered by the front end
        // console.log("about to move");
        // file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        //     if (err) {
        //         console.error(err);
        //         return res.status(500).send(err);
        //     }

        // });

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