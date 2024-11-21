
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createTimeEntry, stopTimeEntry } from '@/app/api/clockify/createTimeEntry';
import { toast } from 'sonner';
import { convertDateToTime, convertTimeToDate, formatDuration } from '@/lib/utils';
import { getTimeEntryById } from '@/app/api/clockify/getTimeEntryById';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { updateTimeEntry } from '@/app/api/clockify/updateTimeEntry';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ComboboxProjects from './ProjectComboBox';
import { clockifyProjects, users } from '@/app/dashboard/clockify/general/page';

const ClockifyTimeEntry = React.memo(({userId}) => {
    const [selectedProject, setSelectedProject] = useState("");
    const [description, setDescription] = useState("");
    const [billable, setBillable] = useState(true);
    const [start, setStart] = useState(true);
    const [timer, setTimer] = useState(0);
    const [startTime, setStartTime] = useState(new Date().toISOString());
    const [comboboxProp, setComboboxProp] = useState("");
    const [inputTime, setInputTime] = useState(convertDateToTime(startTime))

    // Use refs for more efficient interval management
    const intervalRef = useRef(null);
    const timerRef = useRef(0);

    // Memoize project-related calculations
    const projectNames = useMemo(() => 
        clockifyProjects.map((project) => project.projectName), 
        []
    );

    const matchedProject = useMemo(() => 
        clockifyProjects.find((project) => project.projectName === selectedProject),
        [selectedProject]
    );

    // Memoize submit data
    const submitData = useMemo(() => ({
        projectId: matchedProject ? matchedProject.projectId : null,
        description: description,
        billable: billable,
        startTime: new Date().toISOString(),
    }), [matchedProject, description, billable]);

    const startTimer = useCallback(() => {
        const startTimestamp = Date.now() - timerRef.current * 1000; // Adjust for current timer value
    
        // Save start time in local storage
        if (typeof window !== "undefined") {
            localStorage.setItem("timerStartTimestamp", startTimestamp);
        }
    
        const updateTimer = () => {
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
            timerRef.current = elapsedSeconds;
            setTimer(elapsedSeconds);
    
            // Use requestAnimationFrame for smooth updates
            intervalRef.current = requestAnimationFrame(updateTimer);
        };
    
        updateTimer();
    }, []);
    
    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            cancelAnimationFrame(intervalRef.current);
            intervalRef.current = null;
        }
    
        // Clear timer start from local storage
        if (typeof window !== "undefined") {
            localStorage.removeItem("timerStartTimestamp");
        }
    }, []);

    const handleProjectSelect = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    // Fetch time entry details with improved efficiency
    const fetchTimeEntryDetails = useCallback(async (id) => {
        try {
            const timeEntry = await getTimeEntryById(id);
            const matchedProjectWithId = clockifyProjects.find(
                (project) => project.projectId === timeEntry.projectId
            );

            // Minimize state updates
            setDescription(timeEntry.description);
            
            if (matchedProjectWithId) {
                setSelectedProject(matchedProjectWithId.projectName);
            }

            setBillable(timeEntry.billable);
            setStart(false);
            setStartTime(timeEntry.timeInterval.start);
            setInputTime(convertDateToTime(timeEntry.timeInterval.start))
            // Handle timer more efficiently
            if (!timeEntry.timeInterval.end) {
                const elapsedTime = Math.floor(
                    (new Date().getTime() - new Date(timeEntry.timeInterval.start).getTime()) / 1000
                );
                timerRef.current = elapsedTime;
                setTimer(elapsedTime);
                startTimer();
            }
        } catch (error) {
            console.error("Error fetching time entry:", error);
            toast.error("Failed to fetch time entry details");
        }
    }, [startTimer]);
    
    // Optimize button click handler
    const handleButtonClick = useCallback(async () => {
        try {
            if (start) {
                const response = await createTimeEntry(submitData);
                setStart(false);
                

                // Persist time entry ID
                if (typeof window !== "undefined") {
                    localStorage.setItem("timeEntryId", response.id);
                }
                
                if (response.id) {
                    await fetchTimeEntryDetails(response.id);
                }
            } else {
                const message = await stopTimeEntry(userId, new Date().toISOString());
                toast.success(message);
                
                // Reset states
                setStart(true);
                stopTimer();
                
                // Clear form
                setDescription("");
                setSelectedProject("");
                setComboboxProp("");
                setBillable(true);
                
                // Clear localStorage
                if (typeof window !== "undefined") {
                    localStorage.removeItem("timeEntryId");
                }
                
                // Reset timer
                timerRef.current = 0;
                setTimer(0);
            }
        } catch (error) {
            toast.error(error.message || "Failed to process time entry");
            console.error("Error handling time entry:", error);
        }
    }, [start, submitData, userId, fetchTimeEntryDetails, stopTimer]);
    
    // Handle time entry update
    const handleUpdate = useCallback(async () => {
        const updateData = {
            startTime: startTime,
            description: description,
            projectId: matchedProject ? matchedProject.projectId : selectedProject,
            billable: billable
        };
        
        const savedTimeEntryId = localStorage.getItem("timeEntryId");
        try {
            const response = await updateTimeEntry(savedTimeEntryId, updateData);
            
            
            
            if (!response.timeInterval.end) {
                const elapsedTime = Math.floor(
                    (new Date().getTime() - new Date(response.timeInterval.start).getTime()) / 1000
                );
                timerRef.current = elapsedTime;
                setTimer(elapsedTime);
                startTimer();
            }
            
            toast.success(response.message || "Time entry has been updated!");

        } catch (error) {
            toast.error(error.message || "Failed to update time entry");
            console.error("Error updating time entry:", error);
        }
    }, [startTime, description, matchedProject, selectedProject, billable]);
    
    // Handle time change
    const handleTimeChange = useCallback((newTime) => {
        const updatedDate = convertTimeToDate(newTime || new Date().toISOString());
        setStartTime(updatedDate);
        setInputTime(newTime);
    }, []);


    useEffect(() => {
        const savedTimeEntryId = localStorage.getItem("timeEntryId");
        const savedStartTimestamp = localStorage.getItem("timerStartTimestamp");
    
        if (savedTimeEntryId) {
            fetchTimeEntryDetails(savedTimeEntryId);
        }
    
        if (savedStartTimestamp) {
            const elapsedSeconds = Math.floor((Date.now() - Number(savedStartTimestamp)) / 1000);
            timerRef.current = elapsedSeconds;
            setTimer(elapsedSeconds);
            startTimer();
        }
    
        return () => {
            stopTimer();
        };
    }, [fetchTimeEntryDetails, startTimer, stopTimer]);
    
    // Sync combobox prop with selected project
    useEffect(() => {
        setComboboxProp(selectedProject);
    }, [selectedProject]);

    
    return (
        <Card className="p-2 flex items-center justify-between">
            <Input
                className="w-7/12"
                placeholder="What are you working on..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />
            <ComboboxProjects
                projectNames={projectNames}
                onSelectProject={handleProjectSelect}
                className="w-2/12"
                prop={comboboxProp}
            />

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <DollarSign
                            className={`${billable ? "text-blue-500" : "text-gray-400"} w-10 cursor-pointer`}
                            onClick={() => setBillable((prev) => !prev)}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Billable</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {!start ? (
                <Popover className="">
                    <PopoverTrigger>
                        <div className="w-1/12">{formatDuration(timer)}</div>
                    </PopoverTrigger>
                    <PopoverContent className="flex items-center">
                        <p className='text-sm w-1/2'>Start Time:</p>
                        <Input
                            // value={convertDateToTime(startTime)}
                            value={inputTime}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="w-1/2 text-center"
                        />
                    </PopoverContent>
                </Popover>
            ) : (
                <div className="w-1/12">00:00:00</div>
            )}
            
            {!start && (
                <Button variant="outline" onClick={handleUpdate}>
                    Update
                </Button>
            )}
            <Button
                className="w-1/12"
                variant={start ? "default" : "destructive"}
                onClick={handleButtonClick}
            >
                {start ? "Start" : "Stop"}
            </Button>
        </Card>
    );
});
ClockifyTimeEntry.displayName = "ClockifyTimeEntry";

export default ClockifyTimeEntry;