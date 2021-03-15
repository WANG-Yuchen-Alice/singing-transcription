import React, { Fragment, useState } from 'react'
import axios from 'axios';
import MidiPlayer from "midi-player-js";

import ReactMidiPlayerDemo from "./ReactMidiPlayerDemo"

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileName, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});

    const Player = new MidiPlayer.Player(function(event) {
        console.log(event);
    });

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            });
            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });

            
            
        } catch(err) {
            console.log(err)
            if(err.response.status === 500) {
                console.log('There was a problem with the server');
            } else {
                console.log(err.response.data.msg);
            }

        }
    };

    return (
        <Fragment>
            <form onSubmit={onSubmit}>
                <div className='custom-file mb-4'>
                    <input type='file' className='custom-file-input' id='customFile' accept=".mid,.png,.jpg" onChange={onChange} />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {fileName}
                    </label>
                </div>
                <input type='submit' value='Upload' className='btn btn-primary btn-block mt-4' />
            </form>
            {uploadedFile ? (
              <div className='row mt-5'>
                <div className='col-md-6 m-auto'>
                    <h3 className='text-center'>{uploadedFile.fileName}</h3>
                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                </div>
                <div>
                    generated .MID file
                    <ReactMidiPlayerDemo url={`http://localhost:3000/uploads/happy_birthday.mid`} />
                </div>
              </div>
              
            ) : null}
            
            
        </Fragment>
    );
}; 
//Mozart_Wolfgang_Amadeus_-_Mozart_Symphony_No._31_KV_297_Paris_D_major.mid
//Beethoven_Ludwig_van_-_Beethoven_Symphony_No._5_4th.mid
//`http://localhost:3000/uploads/happy_birthday.mid`
//<ReactMidiPlayerDemo url={`https://raw.githubusercontent.com/grimmdude/MidiPlayerJS/master/demo/midi/zelda.mid`} />

export default FileUpload;