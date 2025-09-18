import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GoLogoSvg from '../assets/Go-Logo.svg';
import RustLogoSvg from '../assets/rust-logo-256x256.svg';
import CppLogoSvg from '../assets/C++_Logo.svg';
import TypeScriptLogoSvg from '../assets/ts-logo-256.svg';

// Programming language logos as SVG components
const PythonLogo = () => (
  <svg viewBox="0 0 256 255" className="w-8 h-8">
    <defs>
      <linearGradient
        x1="12.959%"
        y1="12.039%"
        x2="79.639%"
        y2="78.201%"
        id="pythonOriginal0"
      >
        <stop stopColor="#387EB8" offset="0%"></stop>
        <stop stopColor="#366994" offset="100%"></stop>
      </linearGradient>
      <linearGradient
        x1="19.128%"
        y1="20.579%"
        x2="90.742%"
        y2="88.429%"
        id="pythonOriginal1"
      >
        <stop stopColor="#FFE052" offset="0%"></stop>
        <stop stopColor="#FFC331" offset="100%"></stop>
      </linearGradient>
    </defs>
    <path
      d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"
      fill="url(#pythonOriginal0)"
    ></path>
    <path
      d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"
      fill="url(#pythonOriginal1)"
    ></path>
  </svg>
);

const JavaScriptLogo = () => (
  <svg viewBox="0 0 256 256" className="w-8 h-8">
    <path d="M0 0h256v256H0V0z" fill="#F7DF1E"></path>
    <path d="m67.312 213.932 19.59-11.856c3.78 6.701 7.218 12.371 15.465 12.371 7.905 0 12.89-3.092 12.89-15.12v-81.798h24.057v82.138c0 24.917-14.606 36.259-35.916 36.259-19.245 0-30.416-9.967-36.087-21.996m85.07-2.576 19.588-11.341c5.157 8.421 11.859 14.607 23.715 14.607 9.969 0 16.325-4.984 16.325-11.858 0-8.248-6.53-11.17-17.528-15.98l-6.013-2.58c-17.357-7.387-28.87-16.667-28.87-36.257 0-18.044 13.747-31.792 35.228-31.792 15.294 0 26.292 5.328 34.196 19.247l-18.732 12.03c-4.125-7.389-8.591-10.31-15.465-10.31-7.046 0-11.514 4.468-11.514 10.31 0 7.217 4.468 10.14 14.778 14.608l6.014 2.577c20.45 8.765 31.963 17.7 31.963 37.804 0 21.654-17.012 33.51-39.867 33.51-22.339 0-36.774-10.654-43.819-24.574"></path>
  </svg>
);

const JavaLogo = () => (
  <svg viewBox="0 0 256 346" className="w-8 h-8">
    <path
      d="M82.554 267.473s-13.198 7.675 9.393 10.272c27.369 3.122 41.356 2.675 71.517-3.034 0 0 7.93 4.972 19.003 9.279-67.611 28.977-153.019-1.679-99.913-16.517"
      fill="#5382A1"
    ></path>
    <path
      d="M74.292 230.646s-14.803 10.958 7.805 13.296c29.236 3.016 52.324 3.263 92.276-4.43 0 0 5.526 5.602 14.215 8.666-81.747 23.904-172.798 1.885-114.296-17.532"
      fill="#5382A1"
    ></path>
    <path
      d="M143.942 165.515c16.66 19.18-4.377 36.44-4.377 36.44s42.301-21.837 22.874-49.183c-18.144-25.5-32.059-38.172 43.268-81.858 0 0-118.238 29.53-61.765 94.6"
      fill="#E76F00"
    ></path>
    <path
      d="M233.364 295.442s9.767 8.047-10.757 14.273c-39.026 11.823-162.432 15.393-196.714.471-12.323-5.36 10.787-12.8 18.056-14.362 7.581-1.644 11.914-1.337 11.914-1.337-13.705-9.655-88.583 18.957-38.034 27.15 137.853 22.356 251.292-10.066 215.535-26.195"
      fill="#5382A1"
    ></path>
    <path
      d="M88.9 190.48s-62.771 14.91-22.228 20.323c17.118 2.292 51.243 1.774 83.030-.89 25.978-2.19 52.063-6.85 52.063-6.85s-9.16 3.923-15.787 8.448c-63.744 16.765-186.886 8.966-151.435-8.183 29.981-14.492 54.358-12.848 54.358-12.848"
      fill="#5382A1"
    ></path>
    <path
      d="M201.506 253.422c64.8-33.672 34.839-66.03 13.927-61.67-5.126 1.07-7.411 1.999-7.411 1.999s1.903-2.98 5.537-4.27c41.37-14.545 73.187 42.897-13.355 65.647 0 .001 1.003-.895 1.302-1.706"
      fill="#5382A1"
    ></path>
    <path
      d="M162.439.371s35.887 35.9-34.037 91.101c-56.071 44.282-12.786 69.53-.023 98.377-32.73-29.558-56.75-55.526-40.635-79.72C111.395 74.612 176.918 57.393 162.44.37"
      fill="#E76F00"
    ></path>
  </svg>
);

const GoLogo = () => (
  <img src={GoLogoSvg} alt="Go" className="w-8 h-8" />
);

const TypeScriptLogo = () => (
  <img src={TypeScriptLogoSvg} alt="TypeScript" className="w-8 h-8" />
);

const RustLogo = () => (
  <img src={RustLogoSvg} alt="Rust" className="w-8 h-8" />
);

const CppLogo = () => (
  <img src={CppLogoSvg} alt="C++" className="w-8 h-8" />
);





// Available programming languages with their components
const languages = [
  { name: 'Python', component: PythonLogo, color: 'from-blue-400 to-yellow-400' },
  { name: 'JavaScript', component: JavaScriptLogo, color: 'from-yellow-400 to-yellow-600' },
  { name: 'TypeScript', component: TypeScriptLogo, color: 'from-blue-500 to-blue-600' },
  { name: 'Java', component: JavaLogo, color: 'from-orange-400 to-red-500' },
  { name: 'Go', component: GoLogo, color: 'from-cyan-400 to-blue-500' },
  { name: 'Rust', component: RustLogo, color: 'from-orange-600 to-red-600' },
  { name: 'C++', component: CppLogo, color: 'from-blue-500 to-indigo-600' },
];

// Generate random positions avoiding main UI areas
const generatePosition = (index) => {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '15%', right: '8%' },
    { bottom: '20%', left: '3%' },
    { bottom: '25%', right: '5%' },
    { top: '60%', left: '2%' },
    { top: '70%', right: '3%' },
    { top: '45%', left: '50%', transform: 'translateX(-50%)' }, // Center area
  ];
  return positions[index] || positions[0];
};

export default function FloatingLanguageLogos() {
  const [selectedLogos, setSelectedLogos] = useState([]);

  useEffect(() => {
    // Select 4-5 random languages without duplicates (increased from 3-4)
    const shuffled = [...languages].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 2) + 4; // 4 or 5 logos (instead of 3 or 4)
    setSelectedLogos(shuffled.slice(0, count));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {selectedLogos.map((lang, index) => {
        const LogoComponent = lang.component;
        const position = generatePosition(index);

        return (
          <motion.div
            key={lang.name}
            className="absolute opacity-40"
            style={position}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{
              opacity: 0.4,
              scale: 1,
              y: 0,
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              delay: index * 0.5,
              rotate: {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.8,
              }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${lang.color} blur-xl opacity-30`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.6,
                }}
              />

              {/* Logo */}
              <div className="relative z-10 p-2">
                <LogoComponent />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
