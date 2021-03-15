const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
var cors = require('cors')

app.use(cors())
app.use(fileUpload());

app.use(express.static('client/public'));

// Upload Endpoint
app.post('/upload', (req, res) => {
    if(req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
        if(err) {
            console.error(err);
            return res.status(500).send(err);
        }

        //const file_url = URL.createObjectURL(file);


        //res.json({ fileName: file.name, filePath: `${__dirname}/client/public/uploads/${file.name}` });
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

    });

});

app.listen(5000, () => console.log('Server Started...'));