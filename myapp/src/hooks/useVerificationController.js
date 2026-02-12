import { useEffect, useRef, useState } from "react";

const VERIFY_DURATION_MS = 15000;     // 15 sec
const CHECK_INTERVAL_MS = 600;

const MIN_GREEN_MATCHES = 10;
const MAX_MISMATCH_STREAK = 3;

export function useVerificationController() {
  const [state, setState] = useState("IDLE");

  const [timeLeft, setTimeLeft] = useState(15);
  const [totalChecks, setTotalChecks] = useState(0);
  const [greenMatches, setGreenMatches] = useState(0);
  const [redMismatches, setRedMismatches] = useState(0);
  const [mismatchStreak, setMismatchStreak] = useState(0);

  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  // 🔹 START VERIFICATION
  const startVerification = () => {
    reset();
    setState("VERIFYING");

    // countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopVerification();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // frame check loop
    intervalRef.current = setInterval(() => {
      runVerificationCheck();
    }, CHECK_INTERVAL_MS);
  };

  // 🔹 STOP VERIFICATION
  const stopVerification = () => {
    clearInterval(timerRef.current);
    clearInterval(intervalRef.current);

    if (greenMatches >= MIN_GREEN_MATCHES && mismatchStreak <= MAX_MISMATCH_STREAK) {
      setState("SUCCESS");
    } else {
      setState("FAILURE");
    }
  };

  // 🔹 RESET EVERYTHING
  const reset = () => {
    clearInterval(timerRef.current);
    clearInterval(intervalRef.current);

    setTimeLeft(15);
    setTotalChecks(0);
    setGreenMatches(0);
    setRedMismatches(0);
    setMismatchStreak(0);
  };

  // 🔹 THIS WILL LATER RECEIVE ML RESULT
  const registerFrameResult = (isMatch) => {
    setTotalChecks((v) => v + 1);

    if (isMatch) {
      setGreenMatches((v) => v + 1);
      setMismatchStreak(0);
    } else {
      setRedMismatches((v) => v + 1);
      setMismatchStreak((v) => v + 1);
    }
  };

  // 🔹 Placeholder (STEP-2 will replace this)
  const runVerificationCheck = () => {
    // 🔥 TEMPORARY SIMULATION
    // In STEP-2, this will come from backend (LBPH result)
    const simulatedMatch = Math.random() > 0.3; // 70% chance green
    registerFrameResult(simulatedMatch);
  };

  return {
    state,
    timeLeft,
    totalChecks,
    greenMatches,
    redMismatches,
    mismatchStreak,
    startVerification,
    stopVerification,
    registerFrameResult, // will be used later
  };
}