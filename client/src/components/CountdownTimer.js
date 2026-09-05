import React, { useState, useEffect } from 'react';

function getTimeLeft(deadline) {
  const total = new Date(deadline) - new Date();
  if (total <= 0) return null;

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!timeLeft) {
    return <span className="countdown countdown-expired">Deadline passed</span>;
  }

  return (
    <span className="countdown">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
    </span>
  );
}

export default CountdownTimer;