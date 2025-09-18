import { motion } from "framer-motion";

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-codeflow-purple/30 to-codeflow-blue/30 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)'
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-codeflow-blue/25 to-codeflow-purple/25 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-codeflow-purple to-codeflow-blue rounded-full opacity-60"
          style={{
            left: `${20 + (i * 15)}%`,
            top: `${30 + (i * 10)}%`,
            background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)'
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167, 139, 250, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167, 139, 250, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
