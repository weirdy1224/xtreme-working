import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { ArrowRight, Code, PlayCircle, Target, TrendingUp } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import CodeSnippet from '@/components/CodeSnippet';
import FeatureCard from '@/components/FeatureCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartPracticing = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 min-h-[90vh] flex items-center">
        <AnimatedBackground />

        <div className="relative z-10 w-full max-w-screen-xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center justify-center">
            {/* Left Side Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 px-4 lg:pl-8 xl:pl-4 2xl:pl-0"
            >
              <div>
                <motion.h1
                  variants={itemVariants}
                  className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl"
                >
                  Welcome to{' '}
                  <span
                    className="bg-gradient-to-r from-codeflow-purple to-codeflow-blue bg-clip-text text-transparent mr-0.5 pl-3"
                    style={{
                      background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    CodeFlow
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-white/70 mb-8 leading-relaxed"
                >
                  A platform to master coding interviews through real-world
                  challenges. Practice, learn, and grow.
                </motion.p>
              </div>

              {/* Feature List */}
              <motion.ul
                variants={containerVariants}
                className="space-y-4 text-lg"
              >
                {[
                  'Solve coding problems',
                  'Track your progress',
                  'Join weekly contests',
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    variants={itemVariants}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="h-2 w-2 rounded-full bg-gradient-to-r from-codeflow-purple to-codeflow-blue"
                      style={{
                        background: 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)'
                      }}
                    />
                    <span className="text-white/90">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    onClick={handleStartPracticing}
                    className="bg-gradient-to-r from-codeflow-purple to-codeflow-blue hover:from-codeflow-purple/90 hover:to-codeflow-blue/90 text-white font-medium px-8 py-6 text-lg group shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                    style={{
                      background: 'linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)'
                    }}
                  >
                    Start Practicing
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center lg:justify-end px-4 lg:pr-8 xl:pr-4 2xl:pr-0"
            >
              <CodeSnippet />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative px-6 py-24 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Master coding interviews with our structured approach to learning
              and practice
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Code}
              title="Choose Problems"
              description="Select from hundreds of coding challenges across different difficulty levels and topics."
              delay={0}
            />

            <FeatureCard
              icon={Target}
              title="Solve"
              description="Code your solution with real-time feedback and comprehensive test cases."
              delay={0.1}
            />

            <FeatureCard
              icon={TrendingUp}
              title="Track Progress"
              description="Monitor your improvement with detailed analytics and personalized learning paths."
              delay={0.2}
            />

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
