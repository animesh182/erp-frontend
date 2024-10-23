"use client";

import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'

import React, { useState } from 'react'

import EmployeeLoginFooter from '@/components/EmployeeLoginFooter';

import BasicDetails from '@/components/EmployeeDetails/BasicDetails';
import PersonalDetails from '@/components/EmployeeDetails/PersonalDetails';
import ProfessionalDetails from '@/components/EmployeeDetails/ProfessionalDetails';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
// const Onboarding = () => {

//   return (
//     <div className="h-screen w-full flex flex-col justify-center items-center ">   
//        <Card className="w-7/12  pt-5 pb-10">
//         <CardContent  className="grid grid-cols-2 p-0">
 
      
//       <div className="flex flex-col justify-center space-y-2 px-20  py-14">
//       {/* <BasicDetails/> */}
//       {/* <PersonalDetails/> */}
//       <ProfessionalDetails/>
   
//       </div>
//       <div className="flex flex-col items-end space-y-2 pb-6 pt-20 pl-10  ">
        
//     <img  src="/employeeInformationPreview.png" alt="information preview" className="shadow-lg rounded-2xl"/>
//       </div>
   
//     </CardContent>

//     </Card>
// <EmployeeLoginFooter/>
//     </div>

//   )
// }

// export default Onboarding


const Onboarding = () => {

  const [step, setStep] = useState(1);

  
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

  const handleSubmitProfessionalDetails = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      professionalDetails: data,
    }));
  
  };

  const handlePrevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); 
  };
console.log(formData,"the forma data")
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
            defaultValues={formData.professionalDetails}/>}
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
