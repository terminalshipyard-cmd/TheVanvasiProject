import React from "react";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark" | "stamp";
  theme?: "dark" | "light";
}

export function Logo({
  className = "h-8",
  variant = "full",
  theme = "dark",
}: LogoProps) {
  const isLight = theme === "light";
  const strokeColor = isLight ? "#FBF9F5" : "#1F3A2B";
  const textColor = isLight ? "#FBF9F5" : "#1F3A2B";

  // Mark only (The "V" with contour lines)
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M15 15 L50 85 L85 15"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Wood-grain contour lines inside the V */}
        <path
          d="M26 24 C 38 42, 42 62, 50 72 C 58 62, 62 42, 74 24"
          stroke={strokeColor}
          strokeWidth="2.5"
          opacity="0.8"
        />
        <path
          d="M33 32 C 42 48, 45 58, 50 64 C 55 58, 58 48, 67 32"
          stroke={strokeColor}
          strokeWidth="2"
          opacity="0.65"
        />
        <path
          d="M40 40 C 46 50, 48 54, 50 56 C 52 54, 54 50, 60 40"
          stroke={strokeColor}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    );
  }

  // Circular Stamp version
  if (variant === "stamp") {
    return (
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeDasharray="4 2"
        />
        <circle cx="100" cy="100" r="82" stroke={strokeColor} strokeWidth="1.5" />
        
        {/* Center V Mark */}
        <g transform="translate(60, 60) scale(0.8)">
          <path
            d="M15 15 L50 85 L85 15"
            stroke={strokeColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 26 C 38 42, 42 60, 50 68 C 58 60, 62 42, 72 26"
            stroke={strokeColor}
            strokeWidth="2.5"
            opacity="0.75"
          />
        </g>

        {/* Circular text path */}
        <path
          id="stampTextPath"
          d="M 100, 100 m -68, 0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0"
          fill="none"
        />
        <text
          fill={textColor}
          fontSize="11"
          fontFamily="serif"
          letterSpacing="0.25em"
          textAnchor="middle"
        >
          <textPath href="#stampTextPath" startOffset="50%">
            THE VANVASI PROJECT • LAZIMPAT •
          </textPath>
        </text>
      </svg>
    );
  }

  // Full lockup: Contour V mark + classical serif capitals
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square flex-shrink-0"
      >
        <path
          d="M18 18 L50 82 L82 18"
          stroke={strokeColor}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 26 C 38 44, 42 60, 50 68 C 58 60, 62 44, 72 26"
          stroke={strokeColor}
          strokeWidth="2.5"
          opacity="0.85"
        />
        <path
          d="M36 34 C 43 48, 46 56, 50 60 C 54 56, 57 48, 64 34"
          stroke={strokeColor}
          strokeWidth="2"
          opacity="0.65"
        />
      </svg>
      <div className="flex flex-col">
        <span
          className="font-serif tracking-[0.25em] text-xs md:text-sm font-semibold uppercase leading-tight"
          style={{ color: textColor }}
        >
          The Vanvasi Project
        </span>
        <span
          className="tracking-[0.2em] text-[9px] uppercase font-sans font-medium opacity-70"
          style={{ color: textColor }}
        >
          Lazimpat • Kathmandu
        </span>
      </div>
    </div>
  );
}
