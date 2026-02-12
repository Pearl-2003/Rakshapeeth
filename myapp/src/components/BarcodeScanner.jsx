import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

export default function BarcodeScanner({ onDetected }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const [scanning, setScanning] = useState(false);

  const handleDetected = (result) => {
    if (!result?.codeResult?.code) return;

    const studentId = result.codeResult.code;
    onDetected(studentId);

    stopScanner();
  };

  const startScanner = () => {
    if (isRunningRef.current) return;

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: { facingMode: "user" },
        },
        decoder: {
          readers: ["code_128_reader"],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }

        Quagga.onDetected(handleDetected);
        Quagga.start();
        isRunningRef.current = true;
        setScanning(true);
      }
    );
  };

  const stopScanner = () => {
    if (!isRunningRef.current) return;

    try {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    } catch (err) {
      console.warn("Quagga stop safely ignored:", err);
    }

    isRunningRef.current = false;
    setScanning(false);
  };

  // 🔥 React 18 StrictMode safe cleanup
  useEffect(() => {
    return () => {
      if (isRunningRef.current) {
        try {
          Quagga.offDetected(handleDetected);
          Quagga.stop();
        } catch (e) {
          // ignore
        }
        isRunningRef.current = false;
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Scan Student ID</h2>

      <div
        ref={scannerRef}
        style={{
          width: "400px",
          height: "300px",
          border: "1px solid black",
          marginBottom: "12px",
        }}
      />

      {!scanning ? (
        <button
          onClick={startScanner}
          className="bg-[#7B4B2A] text-white px-6 py-2 rounded-xl font-semibold"
        >
          Start Scan
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold"
        >
          Stop Scan
        </button>
      )}
    </div>
  );
}
