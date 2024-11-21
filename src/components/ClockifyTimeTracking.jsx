
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

// const clockifyProjects = [
//     { projectId: "6436493afa74a43247e70f13", projectName: "Animesh" },
//     { projectId: "670e41120a55801c11fd696c", projectName: "Avinto General" },
//     { projectId: "6717768390254d10caababf8", projectName: "Benediks Transport" },
//     { projectId: "6715b9d0fd2ed55491501ff5", projectName: "Bring API" },
//     { projectId: "6715b9d9fd2ed55491502058", projectName: "Bring SBL" },
//     { projectId: "6703641ed8a5b241d2a462ea", projectName: "Creative Arrangements" },
//     { projectId: "66c5bf1e52d1f70e64e3e444", projectName: "E-bibaaha" },
//     { projectId: "66fe52a4cdc43032a1fe61b5", projectName: "Hugo Assist" },
//     { projectId: "66c6c5b219b51b469d7ccaa3", projectName: "Jambo Booking" },
//     { projectId: "6711ed429f4db553e6edee70", projectName: "Krunch" },
//     { projectId: "6729eb7f0066b72ea6e0c848", projectName: "LogiApp" },
//     { projectId: "6729a11d5d0d3d59b22a4a0e", projectName: "Logistikknyhetene" },
//     { projectId: "670faf3e90b0e73dcc801965", projectName: "Logitrans" },
//     { projectId: "672b3ef3eae6c227b3bbd791", projectName: "Logitrans Design" },
//     { projectId: "6715b9e3fd2ed554915020b8", projectName: "OEG Android" },
//     { projectId: "671220462df45276ae141162", projectName: "OEG Offshore" },
//     { projectId: "66cee83ec8e39b3ef12cd090", projectName: "Safari Planner O&M" },
//     { projectId: "66166796b7d9b2173867225e", projectName: "Sakar hours" },
//     { projectId: "66c5cd72204f1963fca58cc0", projectName: "SyncWave" },
//     { projectId: "66b4e0123e25013d2ff9da6d", projectName: "Viken Fremtind Integration" },
//     { projectId: "65ed5aa033c90b16eac35120", projectName: "Viken Power BI" },
//     { projectId: "668e551351ffa171de759bf3", projectName: "Viken Transportsenter change requests" }
// ];

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

export default ClockifyTimeEntry;