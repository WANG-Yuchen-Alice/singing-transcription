import React, { Fragment, useState } from 'react'
import axios from 'axios';
import MidiPlayer from "midi-player-js";

import ReactMidiPlayerDemo from "./ReactMidiPlayerDemo"

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileName, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});

    const Player = new MidiPlayer.Player(function (event) {
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
            // const res = await axios.post('http://localhost:5000/upload', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
            // const { fileName, filePath, dummy } = res.data;
            // console.log(res.data);
            // console.log(fileName);
            // console.log(dummy);

            //,then
            axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                const { fileName, filePath, dummy } = res.data;
                console.log(res.data);
                console.log(fileName);
                console.log(dummy);
                setUploadedFile({ fileName, filePath });
            })
        } catch (err) {
            console.log(err)
            if (err.response.status === 500) {
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
                    <input type='file' className='custom-file-input' id='customFile' accept=".mid,.txt,.mp3,.wav" onChange={onChange} />
                    <label className='custom-file-label' htmlFor='customFile'>
                        {fileName}
                    </label>
                </div>
                <input type='submit' value='Upload' className='btn btn-dark btn-block mt-4' />
            </form>
            {uploadedFile ? (
                <div className='row mt-5'>
                    <div className='col-md-6 m-auto'>
                        <h3 className='text-center'>{uploadedFile.fileName}</h3>
                        <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                        {uploadedFile.fileName !== undefined ? (
                            <div>
                                {uploadedFile.fileName.slice(uploadedFile.fileName.length - 4, uploadedFile.fileName.length) == ".txt" ? (
                                    <div>
                                        <button
                                            type="button" className='btn btn-dark'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.location.href = `http://localhost:3000/uploads/${uploadedFile.fileName}`;
                                            }}> view generated file</button>
                                    </div>
                                ) : (
                                    <div>
                                        {uploadedFile.fileName.slice(uploadedFile.fileName.length - 4, uploadedFile.fileName.length) == ".wav" ? (
                                            <div>
                                                wav player
                                            </div>
                                        ) : (
                                            <div>
                                                <ReactMidiPlayerDemo url={`http://localhost:3000/uploads/${uploadedFile.fileName}`} />
                                                
                                                <div>
                                                    <button
                                                        type="button" className='btn btn-dark'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.location.href = `http://localhost:3000/uploads/${uploadedFile.fileName}`;
                                                        }}> download midi </button>

                                                        <button
                                                        type="button" className='btn btn-dark ml-2'
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.location.href = `http://localhost:3000/uploads/${uploadedFile.fileName.slice(0, uploadedFile.fileName.length - 4)}.json`;
                                                        }}> download json </button>
                                                </div>

                                            </div>

                                        )}
                                    </div>

                                )}
                            </div>
                        ) : (
                            <div> Generated file will appear here :) </div>
                        )}
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};
//<ReactMidiPlayerDemo url={`http://localhost:3000/uploads/happy_birthday.mid`} />
//Mozart_Wolfgang_Amadeus_-_Mozart_Symphony_No._31_KV_297_Paris_D_major.mid
//Beethoven_Ludwig_van_-_Beethoven_Symphony_No._5_4th.mid
//`http://localhost:3000/uploads/happy_birthday.mid`
//<ReactMidiPlayerDemo url={`https://raw.githubusercontent.com/grimmdude/MidiPlayerJS/master/demo/midi/zelda.mid`} />
//http://localhost:3000/uploads/text1.txt
export default FileUpload;