import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Adjust import path as necessary

const TeamAvatars = ({
  teamMembersImage,
  teamMembersCount,
  size = "default",
}) => {
  const maxVisible = 5;
  const visibleImages = teamMembersImage.slice(0, maxVisible);
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

  return (
    <div className={`flex ${containerSpacingClass}`}>
      {visibleImages.map((image, index) => (
        <Avatar
          key={index}
          className={`border-2 border-white ${avatarSizeClass}`}
        >
          <AvatarImage src={image} className="object-cover" />
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
              J
            </span>
          </AvatarFallback>
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
