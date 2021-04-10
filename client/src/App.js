//import logo from './logo.svg';
import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css';
import ReactAudioPlayer from 'react-audio-player';

// const App = () => (
//     <div className="container mt-4">
//         <h4 className="display-4 text-center mb-4">
//             <i className="fab fa-react" /> Melody Transcription of Singing Voice

//     </h4>
//         <div>Please upload a .WAV file.</div>

//         <FileUpload />
//     </div>
// );

const App = () => {
    const [page, setPage] = React.useState(0);

    const getUploadPage = () => (
        <div className="container mt-4">
            <h4 className="display-4 text-center mb-4">
                <i className="fas fa-headphones-alt" /> Singing Transcription
            </h4>
            <div>
                <i class="fas fa-file-audio" />  Please upload a .WAV file.
            </div>

            <FileUpload />
        </div>);

    const getDemoPage = () => (
        <div className="container mt-4">
            <h4 className="display-4 text-center mb-4">
                <i className="fas fa-headphones-alt" /> Singing Transcription Demo
            </h4>
            <div>
                <h2 className="display-6 mb-4">
                    <i className="fas fa-headphones-alt" /> Pop Song
                </h2>   
            </div>
            <div>
                <h4 className="display-8">
                    Vocal
                </h4>   
            </div>
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/zsa_vocal.mp3`}
                    controls
                />
            </div>
            <div>
                <h4 className="display-8">
                    Transcribed
                </h4>   
            </div>
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/zsa_trans.mp3`}
                    controls
                />
            </div>
            <div>
                <h4 className="display-8">
                    Combined
                </h4>   
            </div>
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/zsa_combined.mp3`}
                    controls
                />
            </div>


            <div>
                <h2 className="display-6 mb-4">
                    <i className="fas fa-compact-disc" /> Jazz
                </h2>   
            </div>
            
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/jazz_vocal.mp3`}
                    controls
                />
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/jazz_trans.mp3`}
                    controls
                />
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/jazz_combined.mp3`}
                    controls
                />
            </div>

            <div>
                <h2 className="display-6 mb-4">
                    <i className="fas fa-guitar" /> Rock
                </h2>   
            </div>
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/rock_vocal.mp3`}
                    controls
                />
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/rock_trans.mp3`}
                    controls
                />
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/rock_combined.mp3`}
                    controls
                />
            </div>
            
            <div>
                <h2 className="display-6 mb-4">
                    <i className="fab fa-napster" /> Rap
                </h2>   
            </div>
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/rap_vocal.mp3`}
                    controls
                />
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/rap_trans.mp3`}
                    controls
                />
                <ReactAudioPlayer
                    src={`http://localhost:3000/uploads/demo_pieces/rap_combined.mp3`}
                    controls
                />
            </div>

        </div>);

    const getHomePage = () => (
        <div className="container mt-4">
            <h4 className="display-4 text-center mb-4">
                Welcome to Singing Transcription
            </h4>
            <div>
                CS4347 Project
            </div>
            <div>
                Jin Minjia
            </div>
            <div>
                Liu Hongfu
            </div>
            <div>
                Wang Yuchen
            </div>

        </div>);

    return (
        <>
            <button className='btn btn-dark' onClick={() => setPage(0)}>Home</button>
            <button className='btn btn-dark ml-2' onClick={() => setPage(1)}>Upload</button>
            <button className='btn btn-dark ml-2' onClick={() => setPage(2)}>Demo</button>
            {page === 0 ? getHomePage() : null}
            {page === 1 ? getUploadPage() : null}
            {page === 2 ? getDemoPage() : null}

        </>

    )
}

export default App;
