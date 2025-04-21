import React, { useEffect, useState } from "react";

function CountdownTimer({ initialTime }) {
  const [time, setTime] = useState(() => {
    const [h, m, s] = initialTime.split(":").map(Number);
    return h * 3600 + m * 60 + s; // total seconds
  });

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [time]);

  // Function to format seconds back to "HH:MM:SS"
  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <h1>{formatTime(time)}</h1>
    </div>
  );
}

export default CountdownTimer;
