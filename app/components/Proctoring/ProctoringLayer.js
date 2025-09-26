// app/components/Proctoring/ProctoringLayer.js
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as blazeface from '@tensorflow-models/blazeface';

const NO_FACE_THRESHOLD = 10; 
const LOOKING_AWAY_THRESHOLD = 5; 
const INTERVAL_MS = 800; 

export default function ProctoringLayer({ roomId = 'unknown', candidateName }) {
  const videoRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const modelsRef = useRef({});
  const timersRef = useRef({});
  const lastSentRef = useRef({});

  const addLog = (type, message) => {
    const entry = { type, message, time: new Date().toISOString() };
    setLogs(l => [entry, ...l].slice(0, 200));
    postLog(entry);
  };

  console.log("candidateName:", candidateName);

  const postLog = async (entry) => {
    const key = `${entry.type}:${entry.message}`;
    const now = Date.now();
    if (lastSentRef.current[key] && now - lastSentRef.current[key] < 5000) return;
    lastSentRef.current[key] = now;

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, roomId, candidateName }),
      });
    } catch (err) {
      console.warn('Failed to post log', err);
    }
  };

  useEffect(() => {
    let intervalId;
    let running = true;

    const setup = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();

        const faceModel = await blazeface.load();
        const objModel = await cocoSsd.load();
        modelsRef.current = { faceModel, objModel };
        addLog('system', 'Models loaded.');

        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        intervalId = setInterval(async () => {
          if (!running || !videoRef.current || videoRef.current.readyState < 2) return;
          const { faceModel, objModel } = modelsRef.current;

          // --- Face detection ---
          const faces = await faceModel.estimateFaces(videoRef.current, false);

          if (!faces || faces.length === 0) {
            if (!timersRef.current.noFaceTimer) {
              timersRef.current.noFaceTimer = setTimeout(() => {
                addLog('critical', `No face detected for ${NO_FACE_THRESHOLD}s`);
              }, NO_FACE_THRESHOLD * 1000);
            }
          } else {
            clearTimeout(timersRef.current.noFaceTimer);
            timersRef.current.noFaceTimer = null;
          }

          if (faces.length > 1) {
            addLog('critical', `Multiple faces detected (${faces.length})`);
          }

          // --- Looking away (approximation) ---
          if (faces.length === 1) {
            const face = faces[0];
            const { topLeft, bottomRight } = face;
            const faceCenterX = (topLeft[0] + bottomRight[0]) / 2;
            const frameCenterX = videoRef.current.videoWidth / 2;

            const offset = Math.abs(faceCenterX - frameCenterX) / (videoRef.current.videoWidth / 2);

            if (offset > 0.35) {
              if (!timersRef.current.awayTimer) {
                timersRef.current.awayTimer = setTimeout(() => {
                  addLog('warning', `Looking away for ${LOOKING_AWAY_THRESHOLD}s`);
                }, LOOKING_AWAY_THRESHOLD * 1000);
              }
            } else {
              clearTimeout(timersRef.current.awayTimer);
              timersRef.current.awayTimer = null;
            }
          }

          // --- Object detection ---
          const predictions = await objModel.detect(videoRef.current);
          const suspicious = ['cell phone', 'book', 'laptop', 'tv', 'remote'];
          predictions.forEach(p => {
            if (suspicious.includes(p.class) && p.score > 0.6) {
              addLog('suspicious_item', `${p.class} detected (${Math.round(p.score * 100)}%)`);
            }
          });
        }, INTERVAL_MS);
      } catch (err) {
        console.error('Proctoring init failed', err);
        addLog('error', 'Proctoring setup failed.');
      }
    };

    setup();

    return () => {
      running = false;
      if (intervalId) clearInterval(intervalId);
      Object.values(timersRef.current).forEach(t => t && clearTimeout(t));
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 z-50 max-w-sm">
      <div className="bg-black/70 text-white p-3 rounded shadow-lg max-h-80 overflow-y-auto">
        <h4 className="font-semibold mb-2">Proctoring Logs</h4>
        <video ref={videoRef} autoPlay muted playsInline style={{ display: 'none' }} />
        {logs.map((l, i) => (
          <div key={i} className="text-xs py-1 border-b border-gray-600 last:border-b-0">
            <div className="font-medium">{l.type}</div>
            <div>{l.message}</div>
            <div className="text-gray-300 text-[10px]">{new Date(l.time).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
