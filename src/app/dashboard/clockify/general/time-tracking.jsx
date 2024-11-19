import React, { useEffect, useState } from "react";
import { CircleDot } from "lucide-react";
import { formatDuration } from "@/lib/utils";

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
      const interval = setInterval(() => {
        setTotalSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm">{formatDuration(totalSeconds)}</p>
      {status === "Ongoing" && <CircleDot color="red" height={14} width={14} />}
    </div>
  );
};

export default TimeCell;
