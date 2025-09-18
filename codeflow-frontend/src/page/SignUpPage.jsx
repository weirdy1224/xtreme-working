import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Code, Eye, EyeOff, Loader2, Lock, Mail, User, Zap } from 'lucide-react';
import { SignUpSchema } from '../schemas/signupSchema';
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';
import AuthBackground from '@/components/AuthBackground';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { motion } from 'framer-motion';


const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data) => {
    const success = await signup(data);
    if (success) {
      navigate('/verify-email');
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <AuthBackground />
      {/* Right Side - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full flex flex-col justify-center items-center p-4 sm:p-8"
      >
        {/* Glassmorphism Container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl w-full max-w-md">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
          <div className="relative z-10 w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-6"
            >
              <div className="flex justify-center mb-3">
                <Link to="/">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#0984e3] shadow-lg"
                  >
                    <Zap className="h-5 w-5 text-white" />
                  </motion.div>
                </Link>
              </div>
              <h1 className="text-xl font-bold text-white mb-1 lg:hidden">Join CodeFlow</h1>
              <h1 className="text-xl font-bold text-white mb-1 hidden lg:block">Create Account</h1>
              <p className="text-white/70 text-xs lg:hidden">Create your account to start coding</p>
              <p className="text-white/70 text-xs hidden lg:block">Fill in your details to get started</p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 w-full"
            >
              {/* Full Name Field */}
              <div className="space-y-1">
                <Label htmlFor="fullName" className="text-white/90 text-xs font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="fullName"
                    type="text"
                    {...register('fullname')}
                    placeholder="Enter your full name"
                    className={`pl-10 py-2.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-[#6c5ce7]/50 focus:ring-[#6c5ce7]/25 transition-all duration-300 rounded-lg ${
                      errors.fullname ? 'input-error' : ''
                    }`}
                    required
                  />
                </div>
                {errors.fullname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-1">
                <Label htmlFor="username" className="text-white/90 text-xs font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="username"
                    type="text"
                    {...register('username')}
                    placeholder="Choose a username"
                    className={`pl-10 pr-10 py-2.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-[#6c5ce7]/50 focus:ring-[#6c5ce7]/25 transition-all duration-300 rounded-lg ${
                      errors.username ? 'input-error' : ''
                    }`}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-white/90 text-xs font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    className={`pl-10 py-2.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-[#6c5ce7]/50 focus:ring-[#6c5ce7]/25 transition-all duration-300 rounded-lg ${
                      errors.email ? 'input-error' : ''
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-white/90 text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    placeholder="Create a password"
                    className={`pl-10 pr-10 py-2.5 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-[#6c5ce7]/50 focus:ring-[#6c5ce7]/25 transition-all duration-300 rounded-lg ${
                      errors.password ? 'input-error' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="text-xs text-white/60 leading-relaxed pt-2">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-[#6c5ce7] hover:text-[#0984e3] transition-colors font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#6c5ce7] hover:text-[#0984e3] transition-colors font-semibold">
                  Privacy Policy
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
                  disabled={isSigningUp}
                  className="w-full bg-gradient-to-r from-[#6c5ce7] to-[#0984e3] hover:from-[#6c5ce7]/90 hover:to-[#0984e3]/90 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 rounded-lg"
                >
                  {isSigningUp ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </motion.form>

            {/* Alpha Notice (conditionally rendered) */}
            {import.meta.env.VITE_SHOW_ALPHA_NOTICE === 'true' && (
              <div className="mt-4 mb-4 p-3 rounded-lg bg-yellow-100/10 border border-yellow-300/20 text-yellow-300 text-sm text-center">
                <strong>Alpha Notice:</strong> CodeFlow is currently in alpha. User
                verification is manual and may take some time. You will be contacted
                once your account is approved.
              </div>
            )}

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-white/70 text-sm">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#6c5ce7] hover:text-[#0984e3] transition-colors font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={'Welcome to CodeFlow!'}
        subtitle={
          'Sign up to access our platform and start using our services.'
        }
      />
    </div>
  );
};

export default SignUpPage;
