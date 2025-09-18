import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Code, Eye, EyeOff, Loader2, Lock, Mail, User, Zap } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import { LogInSchema } from '../schemas/loginSchema';
import { useAuthStore } from '../store/useAuthStore';
import AuthBackground from '@/components/AuthBackground';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { motion } from 'framer-motion';


const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LogInSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error('SignIn failed', error);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <AuthBackground />
      {/* Right Side - Signin Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col justify-center items-center p-8 sm:p-12"
      >
        {/* Glassmorphism Container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12 backdrop-blur-xl shadow-2xl w-full max-w-lg">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
          <div className="relative z-10 w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <Link to="/">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#0984e3] shadow-lg"
                  >
                    <Zap className="h-6 w-6 text-white" />
                  </motion.div>
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 lg:hidden">
                Welcome Back
              </h1>
              <h1 className="text-2xl font-bold text-white mb-2 hidden lg:block">
                Sign In
              </h1>
              <p className="text-white/70 text-sm lg:hidden">
                Sign in to continue your coding journey
              </p>
              <p className="text-white/70 text-sm hidden lg:block">
                Enter your credentials to continue
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white/90 text-sm font-medium block"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    className={`w-full pl-10 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-[#6c5ce7]/50 focus:ring-[#6c5ce7]/25 transition-all duration-300 rounded-lg ${
                      errors.email ? 'input-error' : ''
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-white/90 text-sm font-medium block"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-[#6c5ce7]/50 focus:ring-[#6c5ce7]/25 transition-all duration-300 rounded-lg ${
                      errors.password ? 'input-error' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#6c5ce7] hover:text-[#0984e3] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-[#6c5ce7] to-[#0984e3] hover:from-[#6c5ce7]/90 hover:to-[#0984e3]/90 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 rounded-lg"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-white/70 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#6c5ce7] hover:text-[#0984e3] transition-colors font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={'Welcome to Back!'}
        subtitle={
          "Sign in to continue your journey with us. Don't have an account? Create one now."
        }
      />
    </div>
  );
};

export default LogInPage;
