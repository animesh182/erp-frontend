import { deleteEmployee, updateEmployee } from "@/app/api/employee/getEmployees";
import { useEmployees } from "@/hooks/useEmployees";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    const { refetch } = useEmployees();

    return useMutation({
        mutationFn: updateEmployee,
        onSuccess: (updatedEmployee) => {
         
          
            queryClient.setQueryData(["employees"], (oldQueryData) => {
             
                const newData = oldQueryData.map((emp) =>
                    emp.employee_id === updatedEmployee.employee_id ? updatedEmployee : emp
                );
              
                return newData;
                
            });
            refetch();
        },
    });
};


export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteEmployee,
      onSuccess: (deletedEmployeeId) => {
        queryClient.setQueryData(["employees"], (oldEmployeesData) => {
          return oldEmployeesData.filter((employee) => employee.id !== deletedEmployeeId);
        });
      },
    });
  }
