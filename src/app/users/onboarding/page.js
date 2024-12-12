"use client";

import { Card, CardContent } from '@/components/ui/card';

import { useEffect, useState } from 'react';

import EmployeeLoginFooter from '@/components/EmployeeLoginFooter';

import { createEmployee } from '@/app/api/employees/createEmployee';
import { getRoles } from '@/app/api/role/getRoles';
import BasicDetails from '@/components/EmployeeDetails/BasicDetails';
import PersonalDetails from '@/components/EmployeeDetails/PersonalDetails';
import ProfessionalDetails from '@/components/EmployeeDetails/ProfessionalDetails';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';




const Onboarding = () => {

  const [step, setStep] = useState(1);
  const [role,setRole]=useState([])
  const [level,setLevel]=useState([])
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(null);
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };


  const [formData, setFormData] = useState({
    basicDetails: {},
    personalDetails: {},
    professionalDetails: {},
  });


  const handleSubmitBasicDetails = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      basicDetails: data,
    }));
    handleNextStep(); 
  };

  const handleSubmitPersonalDetails = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      personalDetails: data,
    }));
    handleNextStep(); 
  };

 


  const currentDate = new Date().toISOString().split('T')[0]; 




  useEffect(() => {
    const tempPassword = sessionStorage.getItem("password");
    if (tempPassword) {
      setPassword(tempPassword);
      sessionStorage.removeItem("password"); // Remove after storing in state
    }
  }, []);
  const handleSubmitProfessionalDetails = async (data) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        professionalDetails: data,
      };

  
      const transformedData = {
        dateOfBirth: updatedData.personalDetails.dateOfBirth, 
        gender: updatedData.personalDetails.gender,
        maritalStatus: updatedData.personalDetails.maritalStatus,
        password: password,
        country: updatedData.personalDetails.country,
        startDate: currentDate,
        phone: updatedData.personalDetails.phoneNumber,
        email: updatedData.basicDetails.email,
        fullName: `${updatedData.basicDetails.firstName} ${updatedData.basicDetails.lastName}`,
        linkedInUrl: "N/A",
        jobTitle: updatedData.professionalDetails.jobTitle,
        level: updatedData.professionalDetails.level,
        department: updatedData.professionalDetails.department,
        supervisor: "N/A",
        salary: "1231",
        panNumber: updatedData.professionalDetails.panNumber,
        employeeType: updatedData.professionalDetails.empType,
      };
  
      
      const createEmployeeRecord = async () => {
        try {
          await createEmployee(transformedData);
          toast.success("Registered successfully!");
          console.log("Employee registered:", transformedData);
          window.location.href="/users"
        } catch (error) {
          toast.error(error.message || "Failed to register");
          console.error("Error registering employee:", error);
        } finally{
          sessionStorage.removeItem("password");
        }
      };
  
      createEmployeeRecord();
      return updatedData;
    });
  };

  const handlePrevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); 
  };




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const rolesData = await getRoles();
  //       const levelsData = await getLevels();
        
  //       if (rolesData && levelsData) {
  //         setRole(rolesData);
  //         setLevel(levelsData);
  //       } else {
  //         console.error("Failed to fetch data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchData();
  // }, []);




    useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await getRoles();
        // const levelsData = await getLevels();
        
        if (rolesData) {
          setRole(rolesData);
          // setLevel(levelsData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  



  





  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <Card className="lg:w-7/12 w-10/12 pt-5 lg:pb-10 pb-5 ">
        <CardContent className="lg:grid grid-cols-2 p-0">
          <div className="flex flex-col justify-center space-y-1 lg:px-20 px-5 py-14">
            <div className=' '>
              {step > 1 && (
                <div onClick={handlePrevStep} className=''>
                <ChevronLeft className='text-[#020617] size-5 cursor-pointer'/>
                </div>
              )}
          <div className="text-xs font-medium text-[#64748B]">
                {step}/3
              </div>
              </div>
            {step === 1 && <BasicDetails onSubmission={handleSubmitBasicDetails}
            defaultValues={formData.basicDetails} />}
            {step === 2 && <PersonalDetails onSubmission={handleSubmitPersonalDetails}
            defaultValues={formData.personalDetails} />}
            {step === 3 && <ProfessionalDetails onSubmission={handleSubmitProfessionalDetails} 
            defaultValues={formData.professionalDetails}
            role={role}
            level={level}
            isLoading={loading}
            />}
          </div>
          <div className="lg:flex flex-col items-end space-y-2 pb-6 pt-20 pl-10 hidden md:hidden">
          <img src="/employeeInformationPreview.png" alt="information preview" className="shadow-lg rounded-2xl" />
          </div>
        </CardContent>
      </Card>
      <EmployeeLoginFooter />
    </div>
  );
};

export default Onboarding;
