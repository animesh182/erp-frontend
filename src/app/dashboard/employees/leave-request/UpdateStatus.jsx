
            "use client"
            import { updateLeaveRequestStatus } from "@/app/api/employees/approveLeaveRequest";
            import { Badge } from "@/components/ui/badge"
            import { Button } from "@/components/ui/button"
            import {
            Dialog,
            DialogContent,
            DialogDescription,
            DialogFooter,
            DialogHeader,
            DialogTitle,
            DialogTrigger,
            } from "@/components/ui/dialog"
            import { useCallback } from "react";
            import { toast } from "sonner";
        
            const STATUS_CONFIG = {
            approved: { 
                color: "bg-green-100 text-green-800", 
                actions: [{ label: "Decline", status: "Declined" }],
                description: "Are you sure you want to Decline the leave request?"
            },
            declined: { 
                color: "bg-red-100 text-red-800", 
                actions: [{ label: "Approve", status: "Approved" }],
                description: "Are you sure you want to Approve the leave request?"
            },
            pending: { 
                color: "bg-orange-300 text-orange-600", 
                actions: [
                { label: "Approve", status: "Approved" },
                { label: "Decline", status: "Declined" }
                ],
                description: "Do you want to Approve or Decline the leave request?"
            }
            };
        
            export function UpdateStatus({ status, onStatusUpdate, id }) {
            const handleStatusUpdate = useCallback(async (newStatus) => {
                try {
                const response = await updateLeaveRequestStatus(newStatus, id);
                if (response?.message) {
                    toast.success(response.message);
                    onStatusUpdate?.(id, newStatus);
                }
                } catch (error) {
                toast.error(`Failed to ${newStatus.toLowerCase()} leave request.`);
                console.error(`Error ${newStatus.toLowerCase()} leave request:`, error);
                }
            }, [id, onStatusUpdate]);
        
            const normalizedStatus = status?.toLowerCase() || "pending";
            const { color, actions, description } = STATUS_CONFIG[normalizedStatus];
        
            return (
                <Dialog>
                <DialogTrigger >
                
                    <Badge className={`${color} cursor-pointer`}>
                    {status || "No Data"}
                    </Badge>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Leave Request</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    {actions.map(({ label, status: newStatus }) => (
                        <Button
                        key={label}
                        variant="outline"
                        className={newStatus === "Declined" ? "text-destructive bg-red-100" : "text-green-800 bg-green-100"}
                        onClick={() => handleStatusUpdate(newStatus)}
                        >
                        {label}
                        </Button>
                    ))}
                    </DialogFooter>
                </DialogContent>
                </Dialog>
            )
            }