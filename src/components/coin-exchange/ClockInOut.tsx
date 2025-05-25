import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, PauseCircle, LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClockInOutProps {
  isActive?: boolean;
  initialTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  onClockIn?: () => void;
  onClockOut?: () => void;
  onBreak?: () => void;
}

const ClockInOut: React.FC<ClockInOutProps> = ({
  isActive = true,
  initialTime = { hours: 93, minutes: 56, seconds: 3 },
  onClockIn,
  onClockOut,
  onBreak,
}) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(isActive);
  const [isBreak, setIsBreak] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);

  // Format time with leading zeros
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // Update timer every second when active and not on break
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isBreak) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          let newSeconds = prevTime.seconds + 1;
          let newMinutes = prevTime.minutes;
          let newHours = prevTime.hours;

          if (newSeconds >= 60) {
            newSeconds = 0;
            newMinutes += 1;
          }

          if (newMinutes >= 60) {
            newMinutes = 0;
            newHours += 1;
          }

          return {
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isBreak]);

  // Calculate break duration
  const calculateBreakDuration = useCallback(() => {
    if (!breakStartTime) return "00:00";

    const now = new Date();
    const diffMs = now.getTime() - breakStartTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    return `${formatTime(diffMins)}:${formatTime(diffSecs)}`;
  }, [breakStartTime]);

  // Handle break state
  const handleBreak = () => {
    if (isBreak) {
      // Ending break
      setIsBreak(false);
      setBreakStartTime(null);
    } else {
      // Starting break
      setIsBreak(true);
      setBreakStartTime(new Date());
    }

    if (onBreak) onBreak();
  };

  // Handle clock out
  const handleClockOut = () => {
    setShowConfirmation(true);
  };

  // Confirm clock out
  const confirmClockOut = () => {
    setIsRunning(false);
    setShowConfirmation(false);
    setIsClockedOut(true);

    // In a real app, this would make an API call to log out and update work time
    if (onClockOut) onClockOut();

    // This could also redirect the user to a login page or dashboard
    console.log("Clocking out...", {
      totalHours: time.hours,
      totalMinutes: time.minutes,
      totalSeconds: time.seconds,
    });
  };

  // Handle clock in
  const handleClockIn = () => {
    setIsRunning(true);
    setIsClockedOut(false);

    // In a real app, this would make an API call to log the start time
    if (onClockIn) onClockIn();

    console.log("Clocking in...");
  };

  const formattedTime = `${formatTime(time.hours)}:${formatTime(time.minutes)}:${formatTime(time.seconds)}`;

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-gray-50">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-base font-light">{formattedTime}</span>
        </div>

        {isClockedOut ? (
          <Button
            variant="outline"
            className="border px-5 py-2 text-green-600 border-green-400 bg-green-50 hover:bg-green-100 hover:text-green-700 transition-all duration-200"
            onClick={handleClockIn}
          >
            <LogIn className="h-4 w-4 mr-1" />
            Clock In
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className={`border px-5 py-2 transition-all duration-200 ${
                isBreak ? "bg-amber-100 text-amber-700 border-amber-300" : ""
              }`}
              onClick={handleBreak}
              disabled={isClockedOut}
            >
              {isBreak ? (
                <span className="flex items-center gap-1">
                  <PauseCircle className="h-4 w-4" />
                  Resume ({calculateBreakDuration()})
                </span>
              ) : (
                "Break"
              )}
            </Button>

            <Button
              variant="outline"
              className="border px-5 py-2 text-red-600 border-red-400 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
              onClick={handleClockOut}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Clock Out
            </Button>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Clock Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to clock out? Your current shift time is{" "}
              {formattedTime}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmClockOut}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Clock Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClockInOut;
