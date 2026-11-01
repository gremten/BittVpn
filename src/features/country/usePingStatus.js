import { useEffect, useState } from 'react';

const PING_UPDATE_MS = 20000;
const PING_VARIANCE_MS = 5;

function getNextPing(basePing, currentPing) {
  const minPing = Math.max(1, basePing - PING_VARIANCE_MS);
  const maxPing = basePing + PING_VARIANCE_MS;
  let nextPing = currentPing;

  while (nextPing === currentPing && maxPing > minPing) {
    nextPing = Math.floor(Math.random() * (maxPing - minPing + 1)) + minPing;
  }

  return nextPing;
}

export default function usePingStatus(initialPing = 73) {
  const [pingMs, setPingMs] = useState(initialPing);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setPingMs(initialPing);
    setAnimationKey((key) => key + 1);
  }, [initialPing]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPingMs((currentPing) => getNextPing(initialPing, currentPing));
      setAnimationKey((key) => key + 1);
    }, PING_UPDATE_MS);
    return () => window.clearInterval(timer);
  }, [initialPing]);

  return { pingMs, animationKey };
}
