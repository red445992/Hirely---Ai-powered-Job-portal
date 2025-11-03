

import Image from "next/image";
import { useState, useEffect } from "react";

import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<Array<{ tech: string; url: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechIcons = async () => {
      try {
        const icons = await getTechLogos(techStack);
        setTechIcons(icons);
      } catch (error) {
        console.error("Error fetching tech icons:", error);
        // Fallback to default icons
        const fallbackIcons = techStack.map(tech => ({
          tech,
          url: "/tech.svg"
        }));
        setTechIcons(fallbackIcons);
      } finally {
        setLoading(false);
      }
    };

    if (techStack.length > 0) {
      fetchTechIcons();
    } else {
      setLoading(false);
    }
  }, [techStack]);

  if (loading) {
    return (
      <div className="flex flex-row items-center gap-1">
        {Array.from({ length: Math.min(3, techStack.length) }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-full p-2 flex items-center justify-center animate-pulse"
          >
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-1">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className="relative group"
        >
          {/* Tooltip */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
            {tech}
          </div>
          
          {/* Icon container */}
          <div className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 flex items-center justify-center transition-colors duration-200">
            <Image
              src={url}
              alt={tech}
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
              onError={(e) => {
                // Fallback to default tech icon if image fails to load
                e.currentTarget.src = "/tech.svg";
              }}
            />
          </div>
        </div>
      ))}
      
      {/* Show remaining count if more than 3 */}
      {techIcons.length > 3 && (
        <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center min-w-9 h-9">
          <span className="text-xs font-medium text-gray-600">
            +{techIcons.length - 3}
          </span>
        </div>
      )}
    </div>
  );
};

export default DisplayTechIcons;