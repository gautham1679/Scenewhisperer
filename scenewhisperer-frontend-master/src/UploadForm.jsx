import React, { useState } from 'react';

function UploadForm() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [report, setReport] = useState('');
  const [audioPath, setAudioPath] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return;

    setText('');
    setReport('');
    setAudioPath('');
    setUploadProgress(0);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', image);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8000/upload/');

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setText(data.extracted_text);
        setReport(data.report);
        setAudioPath(data.audio_path);
      } else {
        console.error('Upload failed:', xhr.statusText);
      }
      setUploadProgress(0);
      setIsProcessing(false);
    };

    xhr.onerror = () => {
      console.error('Upload error');
      setIsProcessing(false);
    };

    xhr.send(formData);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🧠 SceneWhisperer AI</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="file-upload" style={styles.customFileLabel}>
            📁 Choose Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.hiddenFileInput}
          />
          <button type="submit" style={styles.button}>Upload</button>
        </form>

        {uploadProgress > 0 && (
          <div style={styles.progressWrapper}>
            <progress value={uploadProgress} max="100" style={styles.progressBar} />
            <p style={styles.progressText}>{uploadProgress}% uploaded</p>
          </div>
        )}

        {isProcessing && (
          <div style={styles.processingBox}>
            <strong>Processing... please wait</strong>
          </div>
        )}

        {text && (
          <div style={styles.card}>
            <h3>🧾 Extracted Text:</h3>
            <p>{text}</p>
          </div>
        )}

        {report && (
          <div style={styles.card}>
            <h3>📝 Incident Report:</h3>
            <p>{report}</p>
          </div>
        )}

        {audioPath && (
          <div style={styles.card}>
            <h3>🔊 Audio Summary:</h3>
            <audio controls src={`http://127.0.0.1:8000/audio`} style={styles.audio} />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundImage: 'url("/worldmap.jpg")', // Ensure this file is in your public/ folder
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: 'white',
  },
  container: {
    marginTop: '40px',
    width: '100%',
    maxWidth: '700px',
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#ffffff',
    textShadow: '0 0 10px rgba(0,0,0,0.7)',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  customFileLabel: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  hiddenFileInput: {
    display: 'none',
  },
  button: {
    backgroundColor: '#7c3aed',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  progressWrapper: {
    textAlign: 'center',
    marginTop: '10px',
  },
  progressBar: {
    width: '100%',
    height: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#7c3aed',
  },
  progressText: {
    marginTop: '5px',
    color: '#38bdf8',
    textShadow: '0 0 5px rgba(0,0,0,0.5)',
  },
  processingBox: {
    textAlign: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    padding: '15px',
    borderRadius: '10px',
    marginTop: '20px',
    color: '#facc15',
    textShadow: '0 0 5px rgba(0,0,0,0.6)',
  },
  card: {
    backgroundColor: 'transparent',
    padding: '20px',
    borderRadius: '12px',
    marginTop: '20px',
    color: 'white',
    textShadow: '0 0 6px rgba(0,0,0,0.6)',
  },
  audio: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    marginTop: '10px',
  },
};

export default UploadForm;
