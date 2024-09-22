import React from "react";

const HealthIcon = ({ width, height, fill }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M47.9766 22.4315C47.5857 16.2084 44.7765 10.3849 40.1492 6.20534C35.5111 2.01731 29.4261 -0.20276 23.1808 0.0145763C16.9349 0.226575 11.017 2.86182 6.68064 7.36201C2.35671 11.8516 -0.0406348 17.8538 0.00052127 24.0869V24.6254C0.0270576 25.7602 0.136325 26.8873 0.328323 28.0065C1.30332 33.8382 4.4069 39.1009 9.03847 42.7763C13.6774 46.4615 19.5121 48.3069 25.4265 47.9596C31.3408 47.6123 36.9194 45.0966 41.0951 40.8937C45.2585 36.699 47.7187 31.1095 48 25.2061V24.1103C48 23.7357 48 22.9677 47.9766 22.4315ZM44.3942 26.1638H37.0374L30.7108 36.7096C30.5001 37.0539 30.204 37.3379 29.8512 37.534C29.4984 37.7301 29.1008 37.8316 28.6972 37.8288H28.5567C28.127 37.8065 27.7117 37.6662 27.3564 37.4233C27.0012 37.1805 26.7198 36.8444 26.5431 36.452L19.0224 19.5609L14.3395 27.3766C14.1289 27.7217 13.8325 28.0064 13.4792 28.2029C13.1259 28.3994 12.7278 28.5012 12.3235 28.4982H4.02779C3.69797 27.051 3.53302 25.5712 3.53609 24.0869V23.8293H10.9865L17.3318 13.3093C17.5545 12.9433 17.8733 12.6454 18.2536 12.4481C18.6338 12.2507 19.0609 12.1615 19.4883 12.1901C19.914 12.2165 20.3243 12.3587 20.6751 12.6014C21.0258 12.844 21.3036 13.1778 21.4785 13.5668L29.0226 30.458L33.7079 22.6422C33.9154 22.2931 34.2101 22.004 34.5632 21.8033C34.9162 21.6026 35.3154 21.4971 35.7215 21.4973H44.3427C44.4597 22.3589 44.5144 23.2221 44.5066 24.0869C44.5116 24.781 44.4725 25.4746 44.3895 26.1638"
      fill={fill}
    />
  </svg>
);

const ProjectHealth = ({ health }) => {
  const getHealthInfo = () => {
    switch (health) {
      case "on-track":
        return {
          fillColor: "#22C55E",
          text: "On Track",
          color: "text-green-500",
        };
      case "at-risk":
        return {
          fillColor: "#EAB308",
          text: "At Risk",
          color: "text-yellow-500",
        };
      case "critical":
        return {
          fillColor: "#EF4444",
          text: "Critical",
          color: "text-red-500",
        };
      default:
        return {
          fillColor: "#9CA3AF",
          text: "N/A",
          color: "text-gray-400",
        };
    }
  };

  const { fillColor, text } = getHealthInfo();

  return (
    <div className="flex items-center gap-1">
      <HealthIcon width="14" height="14" fill={fillColor} />
      <span className="text-xs font-normal text-muted-foreground">{text}</span>
    </div>
  );
};

export default ProjectHealth;
