import { formatDuration } from "@/lib/utils";
import { CircleDot } from "lucide-react";
import { useEffect, useState } from "react";

const TimeCell = ({ initialTime, status }) => {
  // Parse the initial time and set the state
  const parseTimeToSeconds = (timeString) => {
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (timeRegex.test(timeString)) {
      // If already in hh:mm:ss format, convert to total seconds
      const [hours, minutes, seconds] = timeString.split(":").map((value) => parseInt(value, 10));
      return hours * 3600 + minutes * 60 + seconds;
    } else {
      // If not in hh:mm:ss format, assume it's a timestamp or ISO string
      const date = new Date(timeString);
      const now = new Date();
      const timeDifferenceInMs = now - date;
      return Math.floor(timeDifferenceInMs / 1000);
    }
  };

  const initialTotalSeconds = parseTimeToSeconds(initialTime);
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);

  useEffect(() => {
    if (status === "Ongoing") {
      const startTimestamp = Date.now();

      const interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
        setTotalSeconds(initialTotalSeconds + elapsedSeconds);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, initialTotalSeconds]);

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm">{formatDuration(totalSeconds)}</p>
      {status === "Ongoing" && <CircleDot className="text-destructive" height={14} width={14} />}
    </div>
  );
};

export default TimeCell;
