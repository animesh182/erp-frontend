import { createTimeEntry, stopTimeEntry } from '@/app/api/clockify/createTimeEntry';
import { ACTIVE_USERS_TYPES, getActiveUsers } from '@/app/api/clockify/getActiveUsers';
import { getTimeEntryById } from '@/app/api/clockify/getTimeEntryById';
import { updateTimeEntry } from '@/app/api/clockify/updateTimeEntry';
import { useActiveUsers } from '@/app/hooks/clockify/useActiveUsers';
import { useClockifyProjects } from '@/app/hooks/projects/useClockifyProjects';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useClockify } from '@/context/clockifyContext/ClockifyContext';
import { convertDateToTime, convertTimeToDate, formatDuration } from '@/lib/utils';
import { DollarSign } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import ComboboxProjectsWrapper from './ProjectComboBoxWrapper';
import { useTimeEntryById } from '@/app/hooks/clockify/useTimeEntryById';
import { SimpleSkeleton } from './Skeletons';


const ClockifyTimeEntry = React.memo(() => {
    const [selectedProject, setSelectedProject] = useState("");
    const [description, setDescription] = useState("");
    const [billable, setBillable] = useState(true);
    const [start, setStart] = useState(true);
    const [timer, setTimer] = useState(0);
    const [startTime, setStartTime] = useState(new Date().toISOString());
    const[timeEntryId,setTimeEntryId]=useState()
    const [inputTime, setInputTime] = useState(convertDateToTime(startTime));
    const intervalRef = useRef(null);
    const timerRef = useRef(0);
    const{clockifyUserData}=useClockify()


    const{data:clockifyProjects}=useClockifyProjects(false)
    const { data: activeUsers ,isLoading} = useActiveUsers({
        items: 30,
        type: ACTIVE_USERS_TYPES.TIMER_ENTRY,
        additionalData: { clockifyUserData, clockifyProjects },
    });
    const matchedProject = useMemo(() => {
        if (clockifyProjects && selectedProject) {
            const selectedFirstWord = selectedProject.split(' ')[0]?.toLowerCase();
    
            return clockifyProjects.find((project) => {
                const projectFirstWord = project.projectName?.split(' ')[0]?.toLowerCase();
                return projectFirstWord === selectedFirstWord;
            });
        }
        return null;
    }, [selectedProject, clockifyProjects]);
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

    // const handleProjectSelect = useCallback((project) => {
    //     setSelectedProject(project);
    // }, []);


    useEffect(() => {
        const fetchClockifyActiveUsers = async () => {
            if(clockifyUserData && clockifyProjects)
            try {
                if (activeUsers) {
                    setTimeEntryId(activeUsers.timeEntryId);
                    setDescription(activeUsers.description);
                    setSelectedProject(activeUsers.projectName);
                    setBillable(activeUsers.billable);
                    setStart(false);
                    setStartTime(activeUsers.timeInterval.start);
                    setInputTime(convertDateToTime(activeUsers.timeInterval.start));
    
                    if (activeUsers.elapsedTime !== null) {
                        timerRef.current = activeUsers.elapsedTime;
                        setTimer(activeUsers.elapsedTime);
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
    }, [ clockifyUserData, clockifyProjects, startTimer, stopTimer,activeUsers]);
    

    const handleButtonClick = useCallback(async () => {
        if(clockifyUserData.clockify_api_key)
        try {
            if (start) {
                const response = await createTimeEntry(clockifyUserData.clockify_api_key,submitData);
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
                const message = await stopTimeEntry(clockifyUserData.clockify_user_id,clockifyUserData.clockify_api_key, new Date().toISOString());
                toast.success(message);
                
                // Reset states
                setStart(true);
                stopTimer();
                
                // Clear form
                setDescription("");
                setSelectedProject("");
                setBillable(true);
                
                
                // Reset timer
                timerRef.current = 0;
                setTimer(0);
            }
        } catch (error) {
            toast.error(error.message || "Failed to process time entry");
            console.error("Error handling time entry:", error);
        }
    }, [start, submitData,  startTimer, stopTimer, clockifyProjects]);
    
    const handleUpdate = useCallback(async () => {
        const updateData = {
            startTime: startTime,
            description: description,
            projectId: matchedProject ? matchedProject.projectId : selectedProject,
            billable: billable
        };
        
        if(timeEntryId && clockifyUserData)
        try {
    const response = await updateTimeEntry(timeEntryId,clockifyUserData.clockify_api_key, updateData);
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
}, [startTime, description, matchedProject, selectedProject, billable,  startTimer]);

const handleTimeChange = useCallback((newTime) => {
    const updatedDate = convertTimeToDate(newTime || new Date().toISOString());
    setStartTime(updatedDate);
    setInputTime(newTime);
}, []);

return (
    <>
        {clockifyUserData ? (
        <Card className="p-2 md:flex lg:flex  items-center justify-between">
            <Input
                className="md:w-7/12 lg:w-7/12 w-full"
                placeholder="What are you working on..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                />
                <div className='p-2 flex items-center justify-between md:w-5/12 lg:w-5/12 w-full'> 
                <ComboboxProjectsWrapper
            clockifyProjects={clockifyProjects}
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
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
            </div>
        </Card>
        ):
        <SimpleSkeleton/>
        }
        </>
    );
});

ClockifyTimeEntry.displayName = "ClockifyTimeEntry";

export default ClockifyTimeEntry;





// useEffect(() => {
//     const fetchClockifyActiveUsers = async () => {
//         if(clockifyUserData && clockifyProjects)
//         try {
//             const data = await getActiveUsers(30, ACTIVE_USERS_TYPES.TIMER_ENTRY, {

//                 clockifyUserData,
//                 clockifyProjects
//             });
        
//             if (data) {
//                 console.log(data,"realdata")
//                 setTimeEntryId(data.timeEntryId);
//                 setDescription(data.description);
//                 setSelectedProject(data.projectName);//matching logic to match the project with CLockifyProjects to get id
//                 setBillable(data.billable);
//                 setStart(false);
//                 setStartTime(data.timeInterval.start);
//                 setInputTime(convertDateToTime(data.timeInterval.start));

//                 if (data.elapsedTime !== null) {
//                     timerRef.current = data.elapsedTime;
//                     setTimer(data.elapsedTime);
//                     startTimer();
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching active users:", error);
//         }
//     };

//     fetchClockifyActiveUsers();
    
//     return () => {
//         stopTimer();
//     };
// }, [ clockifyUserData, clockifyProjects, startTimer, stopTimer]);