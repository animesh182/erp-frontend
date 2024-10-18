import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Adjust import path as necessary

const TeamAvatars = ({
  teamMembers, // Array of objects containing name and image
  teamMembersCount,
  size = "default",
}) => {
  console.log(teamMembers);
  const maxVisible = 5;
  const visibleMembers = teamMembers?.slice(0, maxVisible);
  const remainingCount =
    teamMembersCount > maxVisible ? teamMembersCount - maxVisible : 0;

  const avatarSizeClass =
    size === "small" ? "h-6 w-6" : size === "medium" ? "h-9 w-9" : "h-12 w-12";
  const containerSpacingClass =
    size === "small"
      ? "-space-x-2"
      : size === "medium"
      ? "-space-x-3"
      : "-space-x-4";

  // Helper function to get the initials from the name
  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials;
  };

  return (
    <div className={`flex ${containerSpacingClass}`}>
      {visibleMembers?.map((member, index) => (
        <Avatar
          key={index}
          className={`border-2 border-white ${avatarSizeClass}`}
        >
          {member.image ? (
            <AvatarImage src={member.image} className="object-cover" />
          ) : (
            <AvatarFallback>
              <span
                className={
                  size === "small"
                    ? "text-xs"
                    : size === "medium"
                    ? "text-sm"
                    : "text-base"
                }
              >
                {getInitials(member.name)} {/* Fallback to initials */}
              </span>
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className={`border-2 border-white ${avatarSizeClass}`}>
          <AvatarFallback>
            <span
              className={
                size === "small"
                  ? "text-xs"
                  : size === "medium"
                  ? "text-sm"
                  : "text-base"
              }
            >
              +{remainingCount}
            </span>
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default TeamAvatars;
