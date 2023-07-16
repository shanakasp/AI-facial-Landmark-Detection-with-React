import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFacemesh = async () => {
      await tf.setBackend('webgl');
      await tf.ready();

      const webcam = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const model = await facemesh.load();

      async function detectFaces() {
        const predictions = await model.estimateFaces(webcam);
        // Process the face landmarks predictions here
        // ...

        // Draw face landmarks on the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        predictions.forEach((prediction) => {
          const keypoints = prediction.scaledMesh;
          for (let i = 0; i < keypoints.length; i++) {
            const [x, y, z] = keypoints[i];
            // Draw a circle at each keypoint
            ctx.beginPath();
            ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          }
        });

        requestAnimationFrame(detectFaces);
      }

      detectFaces();
    };

    runFacemesh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
