import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "secret-key-for-time-left"; // keep this consistent

function CountdownTimer({ initialTime, handleSubmitTest, submitted }) {
  const getInitialSeconds = () => {
    const encrypted = localStorage.getItem("encryptedTimeLeft");
    if (encrypted) {
      try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        return parseInt(decrypted, 10) || 0;
      } catch {
        return 0;
      }
    }
    const [h, m, s] = initialTime.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const [time, setTime] = useState(getInitialSeconds);

  useEffect(() => {

    if(submitted){
      return;
    }

    if (time <= 0) {
      handleSubmitTest();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        const updated = prev - 1;
        const encrypted = CryptoJS.AES.encrypt(updated.toString(), ENCRYPTION_KEY).toString();
        localStorage.setItem("encryptedTimeLeft", encrypted);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, submitted]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return <h1>{formatTime(time)}</h1>;
}

export default CountdownTimer;
