// "use client"
// import { getClockifyProjects } from '@/app/api/clockify/getClockifyProjects';
// import DoughnutChart from '@/components/charts/PieChart';
// import React, { useEffect, useState } from 'react'






// const formatDurationToHours = (duration) => {
//     // Handle duration format from Clockify (e.g., PT3H14M51S)
//     const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
//     const matches = regex.exec(duration);
//     if (!matches) return 0;
//     let hours = 0;
//     let minutes = 0;
  
//     if (matches[1]) hours = parseInt(matches[1].replace('H', ''));
//     if (matches[2]) minutes = parseInt(matches[2].replace('M', ''));
 
//     const totalHours = hours + minutes / 60;
    
//     // Return 0 for durations less than an hour to filter them out later
//     return totalHours >= 1 ? totalHours : 0;
//   };
  
//   function ClockifyStats() {
//     const [projects, setProjects] = useState([]);
  
//     useEffect(() => {
//         const fetchClockifyProjects = async () => {
//             try {
//                 const data = await getClockifyProjects();
               
//                 if (data) {
//                     const processedProjects = data.map(project => ({
//                         ...project,
//                         durationHours: formatDurationToHours(project.duration)
//                     }));

//                     // Sort projects by duration in descending order and take the top 10
//                     const topProjects = processedProjects
//                         .sort((a, b) => b.durationHours - a.durationHours)
//                         .slice(0, 7);

//                     setProjects(topProjects);
//                 } else {
//                     console.log("No projects found");
//                 }
//             } catch (error) {
//                 console.error("Error fetching projects:", error);
//             }
//         };
      
//         fetchClockifyProjects();
        
//     }, []);

//     console.log(projects)


//     return (
//         <div className="w-full grid  lg:grid-cols-6 gap-8 py-4 px-0 max-h-[320px]">
//         <div className="col-span-3 justify-center w-full">
//           <DoughnutChart chartData={projects.map((project, index) => ({
//             name: project.name,
//             value: formatDurationToHours(project.duration),
//             color: project.color // Example colors
    
//           }))} />
//         </div>
//         </div>
//     );
// }


// export default ClockifyStats





"use client";
import { getClockifyProjects } from '@/app/api/clockify/getClockifyProjects';
import { fetchTimeEntries } from '@/app/api/clockify/getUserTimeEntries';
import { getEmployees } from '@/app/api/employees/getEmployees';
import ComboboxEmployees from '@/app/users/leave-request/combobox';
import DoughnutChart from '@/components/charts/PieChart';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const formatDurationToHours = (duration) => {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matches = regex.exec(duration);
    if (!matches) return 0;
    let hours = 0;
    let minutes = 0;
  
    if (matches[1]) hours = parseInt(matches[1].replace('H', ''));
    if (matches[2]) minutes = parseInt(matches[2].replace('M', ''));
 
    const totalHours = hours + minutes / 60;
    
    return totalHours >= 1 ? totalHours : 0;
};


  const formatClockifyDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const time = "T00:00:00Z";
    // return `${year}-${month}-${day}${time}`;
    return `2024-11-06T00:00:00Z`;
  };



  const processTimeEntries = (timeEntries) => {


    if (!timeEntries || timeEntries.length === 0) {
      return []; 
    }
  return timeEntries.map((entry) => {
      const { description, timeInterval } = entry;
  
      let durationInHours = 0;
      if (timeInterval && timeInterval.duration) {
        durationInHours = formatDurationToHours(timeInterval.duration);
      }
  
      return {
        description,
        duration: durationInHours,
      };
    });
  };


  const DoughnutChartData = (timeEntries) => {
    if (!timeEntries || timeEntries.length === 0) {
      return [
        { name: 'Project A', value: 30, color: '#6875F5' },
        { name: 'Project B', value: 50, color: '#34D399' },
        { name: 'Project C', value: 20, color: '#FBBF24' },
      ];
    }
    const totalWorkedHours = timeEntries.reduce((acc, entry) => acc + entry.duration, 0);
    
    return timeEntries.map((entry, index) => {
      const percentage = (entry.duration / totalWorkedHours) * 100;
      return {
        name: entry.description, // or use project name
        value: percentage,
        color: ["#6875F5", "#34D399", "#FBBF24", "#EF4444"][index % 4], // Example color cycling
      };
    });
  };
  
function ClockifyStats() {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const[employees,setEmployees]=useState(null)
    const[employeeNames,setEmployeeNames]=useState(null)
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [timeEntries, setTimeEntries] = useState(null);
  const [userData, setUserData] = useState({ email: '', name: '' });

  const date=new Date()
  const clockifyDate = formatClockifyDate(date);



    const handleEmployeeSelect = (employee) => {
      setSelectedEmployee(employee);
      console.log("Selected Employee:", employee); // Retrieve the selected employee here
    };
  
    useEffect(() => {
        const fetchClockifyProjects = async () => {
            try {
                const data = await getClockifyProjects();
                if (data) {
                    // Process and filter projects with non-zero durations
                    const processedProjects = data
                        .map(project => ({
                            ...project,
                            durationHours: formatDurationToHours(project.duration)
                        }))
                        .filter(project => project.durationHours > 0); // Filter out projects with 0 hours

                    // Sort projects by duration in descending order
                    const sortedProjects = processedProjects.sort((a, b) => b.durationHours - a.durationHours);

                    setProjects(sortedProjects);
                } else {
                    console.log("No projects found");
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        const getEmployeeDetails = async () => {
            try {
              const { status, data } = await getEmployees();
              if (status === 200) {
                setEmployees(data);
               
                setEmployeeNames(data.map((emp)=>{
                    return emp.full_name
                  }))
                
                  setUserData({
                    email: "",
                    name: selectedEmployee,
                  });
              
              } else {
                console.error("Failed to fetch employee data");
              }
            } catch (error) {
              console.error("Error fetching employee details:", error);
            } 
          };
          getEmployeeDetails()
        fetchClockifyProjects();
    }, [selectedEmployee]);



    useEffect(() => {
        const fetchUserTimeEntries = async () => {
            if(selectedEmployee)
          try {
            const data = await fetchTimeEntries(userData, clockifyDate);
            if (data) {
              setTimeEntries(data);
            } else {
              console.log("No time entries found");
            }
          } catch (error) {
            console.error("Error fetching time entries:", error);
          }
        };
      
        if ( userData.name) {
          fetchUserTimeEntries();
        }
      }, [userData, clockifyDate,selectedEmployee]);
 
    console.log(userData,"asdasd")

    // Calculate paginated projects based on the current page
    const paginatedProjects = projects.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const nextPage = () => {
        if ((currentPage + 1) * itemsPerPage < projects.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const clockifyData = processTimeEntries(timeEntries);

   
    return (
        <div className="w-full grid lg:grid-cols-6 gap-8 py-4 px-0 ">
            <div className="col-span-3 justify-center w-full">
                <DoughnutChart chartData={paginatedProjects.map((project, index) => ({
                    name: project.name,
                    value: project.durationHours,
                    color: project.color // Example colors
                }))} />
            <div className="col-span-3 flex justify-center items-center gap-4">
                <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    <ArrowLeft/>
                </button>
                <button
                    onClick={nextPage}
                    disabled={(currentPage + 1) * itemsPerPage >= projects.length}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    <ArrowRight/>
                </button>
            </div>
            </div>
            <div className="col-span-3 justify-center w-full">
            <div className=" gap-2">
        <ComboboxEmployees employeeNames={employeeNames}
        onSelectEmployee={handleEmployeeSelect} 
        />
            
          { selectedEmployee && (clockifyData && clockifyData.length > 0 ?( <DoughnutChart chartData={DoughnutChartData(clockifyData)} />):( 
            (<div>Count not find your data</div>)
))}

      </div>
                </div>
        </div>
    );
}

export default ClockifyStats;
