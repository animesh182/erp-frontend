"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SimpleDataTable from "@/components/ui/simple-data-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import AsyncSelect from "react-select/async";

export function InviteMember() {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  setSelectedUsers(
                    selectedUsers.filter((u) => u.id !== user.id)
                  )
                }
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Mock search function
  const loadOptions = async (inputValue) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUsers = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "Developer",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Designer",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "Manager",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: "Product Owner",
        },
        {
          id: "5",
          name: "Mike Brown",
          email: "mike@example.com",
          role: "Developer",
        },
        {
          id: "6",
          name: "Emily Davis",
          email: "emily@example.com",
          role: "Designer",
        },
        {
          id: "7",
          name: "Alex Turner",
          email: "alex@example.com",
          role: "QA Engineer",
        },
        {
          id: "8",
          name: "Lisa Anderson",
          email: "lisa@example.com",
          role: "Scrum Master",
        },
        {
          id: "9",
          name: "Chris Martin",
          email: "chris@example.com",
          role: "Developer",
        },
        {
          id: "10",
          name: "Rachel Green",
          email: "rachel@example.com",
          role: "UI/UX Designer",
        },
      ];

      return mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          user.email.toLowerCase().includes(inputValue.toLowerCase())
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (selectedOption) => {
    if (
      selectedOption &&
      !selectedUsers.some((user) => user.id === selectedOption.id)
    ) {
      setSelectedUsers([...selectedUsers, selectedOption]);
    }
  };

  const handleInvite = () => {
    console.log("Inviting users:", selectedUsers);
    setOpen(false);
    setSelectedUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Invite Members</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] ">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Search Members
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              onChange={handleSelect}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              getOptionValue={(option) => option.id}
              placeholder="Search by name or email..."
              isLoading={isLoading}
              noOptionsMessage={() => "No members found"}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "40px",
                }),
              }}
            />
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            <label className="text-sm font-medium leading-none">
              Selected Members
            </label>
            <SimpleDataTable columns={columns} data={selectedUsers} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={selectedUsers.length === 0}
            >
              Invite ({selectedUsers.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
