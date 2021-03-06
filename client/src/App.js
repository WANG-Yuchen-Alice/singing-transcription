//import logo from './logo.svg';
import React from 'react'; 
import FileUpload from './components/FileUpload';
import './App.css';

const App = () => (
  <div className="container mt-4">
    <h4 className="display-4 text-center mb-4">
        <i className="fab fa-react" /> Melody Transcription of Singing Voice

    </h4>
    <div>Please upload a .WAV file.</div>

    <FileUpload />
  </div>
);

export default App;
