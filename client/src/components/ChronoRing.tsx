import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Pause } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChronoRing() {
  const [minutes, setMinutes] = useState(45);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = minutes * 60 + seconds;
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 140; // radius = 140
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            triggerConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleStart = () => {
    if (isConfiguring) {
      const newTotalTime = minutes * 60 + seconds;
      if (newTotalTime > 0) {
        setTimeLeft(newTotalTime);
        setIsConfiguring(false);
        setIsRunning(true);
      }
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsConfiguring(true);
    setTimeLeft(minutes * 60 + seconds);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Configuration Inputs */}
      {isConfiguring && (
        <div className="flex gap-3 mb-8">
          <Input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 text-center text-xl font-bold bg-[#1a1a1a] border-gray-700 text-white"
            min="0"
          />
          <span className="text-2xl font-bold text-gray-500">:</span>
          <Input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            className="w-20 text-center text-xl font-bold bg-[#1a1a1a] border-gray-700 text-white"
            min="0"
            max="59"
          />
        </div>
      )}

      {/* Chrono Ring */}
      <div className="relative w-[300px] h-[300px]">
        <svg className="w-full h-full -rotate-90">
          {/* Background Circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="#222"
            strokeWidth="15"
          />
          {/* Progress Circle */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="#FFD60A"
            strokeWidth="15"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 linear"
          />
        </svg>
        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-black">{formatTime(timeLeft)}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-5 mt-10">
        <Button
          onClick={handleReset}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleStart}
          size="lg"
          className="w-16 h-16 rounded-full bg-[#32D74B] hover:bg-[#32D74B]/90 text-black"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </Button>
      </div>
    </div>
  );
}
