//import logo from './logo.svg';
import React from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

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
                <i className="fab fa-react" /> Melody Transcription of Singing Voice
            </h4>
            <div>Please upload a .WAV file.</div>

        <FileUpload />
        </div>);

    const getHomePage = () => (
        <div className="container mt-4">
            <h4 className="display-4 text-center mb-4">
                Melody Transcription of Singing Voice
            </h4>
            <div>
                CS4347 Project
            </div>
            <div>
                Wang Yuchen
            </div>

        </div>);

    return (
        <>
        <button onClick = {() => setPage(0)}>Upload</button>
        <button onClick = {() => setPage(1)}>Home</button>
        {page === 0 ? getUploadPage() : getHomePage()}
        </>
    
    )
}

export default App;
