
import React from "react";

export const InsighorLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      fill="none"
      {...props}
    >
      <path
        d="M34 15C22.402 15 13 24.402 13 36C13 47.598 22.402 57 34 57C45.598 57 55 47.598 55 36C55 24.402 45.598 15 34 15Z"
        stroke="url(#paint0_linear)"
        strokeWidth="2"
      />
      <path
        d="M34 24C27.373 24 22 29.373 22 36C22 42.627 27.373 48 34 48C40.627 48 46 42.627 46 36C46 29.373 40.627 24 34 24Z"
        stroke="url(#paint1_linear)"
        strokeWidth="2"
      />
      <path
        d="M34 34C32.895 34 32 34.895 32 36C32 37.105 32.895 38 34 38C35.105 38 36 37.105 36 36C36 34.895 35.105 34 34 34Z"
        fill="#8B5CF6"
      />
      <path
        d="M34 3L34 15"
        stroke="url(#paint2_linear)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M34 57L34 69"
        stroke="url(#paint3_linear)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M64 36L76 36"
        stroke="url(#paint4_linear)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 36L15 36"
        stroke="url(#paint5_linear)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="13"
          y1="36"
          x2="55"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#1EAEDB" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="22"
          y1="36"
          x2="46"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#1EAEDB" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="34"
          y1="3"
          x2="34"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#1EAEDB" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="34"
          y1="57"
          x2="34"
          y2="69"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#1EAEDB" />
        </linearGradient>
        <linearGradient
          id="paint4_linear"
          x1="64"
          y1="36"
          x2="76"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#1EAEDB" />
        </linearGradient>
        <linearGradient
          id="paint5_linear"
          x1="3"
          y1="36"
          x2="15"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#1EAEDB" />
        </linearGradient>
      </defs>
    </svg>
  );
};
