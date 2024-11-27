
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
import { ACTIVE_USERS_TYPES, getActiveUsers } from '@/app/api/clockify/getActiveUsers';


const ClockifyTimeEntry = React.memo(({clockifyTimeEntryProp}) => {
    const [selectedProject, setSelectedProject] = useState("");
    const [description, setDescription] = useState("");
    const [billable, setBillable] = useState(true);
    const [start, setStart] = useState(true);
    const [timer, setTimer] = useState(0);
    const [startTime, setStartTime] = useState(new Date().toISOString());
    const[timeEntryId,setTimeEntryId]=useState()
    const [comboboxProp, setComboboxProp] = useState("");
    const [inputTime, setInputTime] = useState(convertDateToTime(startTime));
    const intervalRef = useRef(null);
    const timerRef = useRef(0);


    const projectNames = useMemo(() => 
        clockifyProjects.map((project) => project.projectName), 
        []
    );

    const matchedProject = useMemo(() => 
        clockifyProjects.find((project) => project.projectName === selectedProject),
        [selectedProject]
    );

    const submitData = useMemo(() => ({
        projectId: matchedProject ? matchedProject.projectId : null,
        description: description,
        billable: billable,
        startTime: new Date().toISOString(),
    }), [matchedProject, description, billable]);

    const startTimer = useCallback(() => {
        const startTimestamp = Date.now() - timerRef.current * 1000;
        const updateTimer = () => {
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
            timerRef.current = elapsedSeconds;
            setTimer(elapsedSeconds);
            intervalRef.current = requestAnimationFrame(updateTimer);
        };
        updateTimer();
    }, []);
    
    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            cancelAnimationFrame(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const handleProjectSelect = useCallback((project) => {
        setSelectedProject(project);
    }, []);


    useEffect(() => {
        const fetchClockifyActiveUsers = async () => {
            try {
                const data = await getActiveUsers(30, ACTIVE_USERS_TYPES.TIMER_ENTRY, {
                    users,
                    clockifyTimeEntryProp,
                    clockifyProjects
                });
                
                if (data) {
                    setTimeEntryId(data.timeEntryId);
                    setDescription(data.description);
                    setSelectedProject(data.projectName);
                    setBillable(data.billable);
                    setStart(false);
                    setStartTime(data.timeInterval.start);
                    setInputTime(convertDateToTime(data.timeInterval.start));
    
                    if (data.elapsedTime !== null) {
                        timerRef.current = data.elapsedTime;
                        setTimer(data.elapsedTime);
                        startTimer();
                    }
                }
            } catch (error) {
                console.error("Error fetching active users:", error);
            }
        };
    
        fetchClockifyActiveUsers();
        
        return () => {
            stopTimer();
        };
    }, [users, clockifyTimeEntryProp, clockifyProjects, startTimer, stopTimer]);


 
    const handleButtonClick = useCallback(async () => {
        try {
            if (start) {
                const response = await createTimeEntry(submitData);
                setStart(false);
                if (response.id) {
                    const timeEntry = await getTimeEntryById(response.id);
                    const matchedProjectWithId = clockifyProjects.find(
                        (project) => project.projectId === timeEntry.projectId
                    );

                    setDescription(timeEntry.description);
                    if (matchedProjectWithId) {
                        setSelectedProject(matchedProjectWithId.projectName);
                    }
                    setBillable(timeEntry.billable);
                    setStartTime(timeEntry.timeInterval.start);
                    setInputTime(convertDateToTime(timeEntry.timeInterval.start));
                    setTimeEntryId(response.id)

                    if (!timeEntry.timeInterval.end) {
                        const elapsedTime = Math.floor(
                            (new Date().getTime() - new Date(timeEntry.timeInterval.start).getTime()) / 1000
                        );
                        timerRef.current = elapsedTime;
                        setTimer(elapsedTime);
                        startTimer();
                    }
                }
            } else {
                    const message = await stopTimeEntry(clockifyTimeEntryProp.clockifyUserId, new Date().toISOString());
                    toast.success(message);
                    
                    // Reset states
                    setStart(true);
                    stopTimer();
                    
                    // Clear form
                    setDescription("");
                    setSelectedProject("");
                    setComboboxProp("");
                    setBillable(true);
                    
                
                    // Reset timer
                    timerRef.current = 0;
                    setTimer(0);
                }
        } catch (error) {
            toast.error(error.message || "Failed to process time entry");
            console.error("Error handling time entry:", error);
        }
    }, [start, submitData, clockifyTimeEntryProp.clockifyUserId, startTimer, stopTimer, clockifyProjects]);
    
    const handleUpdate = useCallback(async () => {
        const updateData = {
            startTime: startTime,
            description: description,
            projectId: matchedProject ? matchedProject.projectId : selectedProject,
            billable: billable
        };
        
        if(timeEntryId)
        try {
            const response = await updateTimeEntry(timeEntryId, updateData);
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
            console.error("Error updating time entry:", error);
            toast.error(error.message || "Failed to update time entry");
        }
    }, [startTime, description, matchedProject, selectedProject, billable, clockifyTimeEntryProp.clockifyUserId, startTimer]);
    
    const handleTimeChange = useCallback((newTime) => {
        const updatedDate = convertTimeToDate(newTime || new Date().toISOString());
        setStartTime(updatedDate);
        setInputTime(newTime);
    }, []);

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
                            className={`${billable ? "text-primary" : "text-muted-foreground"} w-10 cursor-pointer`}
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