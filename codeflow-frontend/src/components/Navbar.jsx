import React, { useState, useEffect } from 'react';
import {
  User,
  Code,
  LogOut,
  Settings,
  Trophy,
  BookOpen,
  Star,
  Shield,
  Crown,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/Button';

const Navbar = ({ variant = 'top' }) => {
  const { authUser } = useAuthStore();

  // Sidebar variants
  if (variant === 'sidebar-problem') {
    return (
      <motion.aside
        className="fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-40 flex-col hidden md:flex w-16"
        animate={{}}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo Section */}
        <div className="p-2 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <Link to="/" className="flex flex-col items-center gap-1">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-codeflow-purple to-codeflow-blue shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                }}
                whileHover={{
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Zap className="h-4 w-4 text-white" />
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* User Avatar Section */}
        <div className="p-2 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <Link to="/profile" className="flex flex-col items-center gap-1">
              <img
                src={
                  authUser?.avatarUrl ||
                  'https://avatar.iran.liara.run/public/boy'
                }
                alt="Profile"
                className="w-8 h-8 rounded-full ring-2 ring-codeflow-purple/50"
              />
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-1 py-2">
          <nav className="space-y-1">
            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
            >
              <div className="flex flex-col items-center gap-1 px-2 py-2 w-full">
                <User className="w-4 h-4" />
                <span className="text-xs">Profile</span>
              </div>
            </Link>

            {authUser?.role === 'ADMIN' && (
              <Link
                to="/add-problem"
                className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <div className="flex flex-col items-center gap-1 px-2 py-2 w-full">
                  <Code className="w-4 h-4" />
                  <span className="text-xs">Add</span>
                </div>
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        {authUser && (
          <div className="p-2 border-t border-gray-800">
            <LogoutButton className="flex items-center text-gray-300 hover:text-red-400 hover:bg-red-500/10 hover:cursor-pointer rounded-lg transition-all duration-200 w-full">
              <div className="flex flex-col items-center gap-1 px-2 py-2 w-full">
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Logout</span>
              </div>
            </LogoutButton>
          </div>
        )}
      </motion.aside>
    );
  }

  // Default top navbar variant
  return (
    <nav className="sticky top-0 z-50 w-full py-0">
      <motion.header
        className={`border-b transition-all duration-300 border-gray-700/20 bg-background/80 backdrop-blur-sm`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="relative flex h-16 w-full items-center px-6">
          {/* Left: Logo */}
          <div className="flex items-center h-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/" className="flex items-center space-x-2 group">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-codeflow-purple to-codeflow-blue shadow-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  }}
                  whileHover={{
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Zap className="h-5 w-5 text-white" />
                  </motion.div>
                </motion.div>
                <motion.span
                  className="text-xl font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-codeflow-purple group-hover:to-codeflow-blue group-hover:bg-clip-text group-hover:text-transparent"
                  style={{
                    color: '#ffffff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  CodeFlow
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Center: Badge (absolutely centered, does not affect spacing) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="flex items-center gap-2 rounded-full border border-gray-600/20 bg-gradient-to-r from-white/5 to-white/10 px-4 py-2 backdrop-blur-sm hover:border-codeflow-purple/40 hover:bg-gradient-to-r hover:from-codeflow-purple/10 hover:to-codeflow-blue/10 transition-all duration-300">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-4 w-4" style={{ color: '#8b5cf6' }} />
                </motion.div>
                <span className="text-sm font-medium text-white/90">
                  Made for Developers
                </span>
              </div>
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-codeflow-purple/30 to-codeflow-blue/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
                }}
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          </div>

          {/* Right: Auth Buttons/Profile */}
          <div className="flex items-center space-x-3 ml-auto h-full">
            {authUser ? (
              <>
                <LogoutButton>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </LogoutButton>
                <div className="dropdown dropdown-end">
                  <motion.label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar relative group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-background ring-transparent group-hover:ring-codeflow-purple/50 transition-all duration-300">
                      <img
                        src={authUser?.avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background"></div>
                  </motion.label>

                  <motion.ul
                    tabIndex={0}
                    className="menu dropdown-content mt-3 z-[1] p-0 shadow-2xl bg-base-100/95 backdrop-blur-sm rounded-2xl w-72 border border-white/10"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-to-r from-codeflow-purple/20 to-codeflow-blue/20 rounded-t-2xl border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              authUser?.avatarUrl ||
                              'https://avatar.iran.liara.run/public/boy'
                            }
                            alt="User Avatar"
                            className="w-12 h-12 object-cover rounded-full ring-2 ring-codeflow-purple/50"
                          />
                          {authUser?.role === 'ADMIN' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-base-content truncate">
                            {authUser?.fullname || 'User'}
                          </p>
                          <p className="text-sm text-base-content/60 truncate">
                            {authUser?.email || 'user@example.com'}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {authUser?.role === 'ADMIN' && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Admin
                              </span>
                            )}
                            {/* <span className="px-2 py-0.5 bg-green-400/20 text-green-400 text-xs rounded-full">
                              Online
                            </span> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Section */}
                    {/* <div className="p-4 border-b border-white/10">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-bold text-codeflow-purple">127</div>
                          <div className="text-xs text-base-content/60">Problems</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-bold text-codeflow-blue">89%</div>
                          <div className="text-xs text-base-content/60">Success</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-bold text-green-400">1,247</div>
                          <div className="text-xs text-base-content/60">Points</div>
                        </div>
                      </div>
                    </div> */}

                    {/* Menu Items */}
                    <div className="p-2">
                      <motion.li
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-codeflow-purple/10 hover:to-codeflow-blue/10 hover:text-codeflow-purple transition-all duration-200 group"
                        >
                          <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <User className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">My Profile</div>
                            <div className="text-xs text-base-content/60">
                              View and edit profile
                            </div>
                          </div>
                        </Link>
                      </motion.li>

                      {/* <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <Link
                          to="/achievements"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-codeflow-purple/10 hover:to-codeflow-blue/10 hover:text-codeflow-purple transition-all duration-200 group"
                        >
                          <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Achievements</div>
                            <div className="text-xs text-base-content/60">View your progress</div>
                          </div>
                        </Link>
                      </motion.li> */}

                      {/* <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <Link
                          to="/bookmarks"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-codeflow-purple/10 hover:to-codeflow-blue/10 hover:text-codeflow-purple transition-all duration-200 group"
                        >
                          <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                            <BookOpen className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Bookmarks</div>
                            <div className="text-xs text-base-content/60">Saved problems</div>
                          </div>
                        </Link>
                      </motion.li> */}

                      {authUser?.role === 'ADMIN' && (
                        <>
                          <div className="divider my-2 text-xs text-base-content/40">
                            Admin Tools
                          </div>
                          <motion.li
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Link
                              to="/add-problem"
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 hover:text-orange-400 transition-all duration-200 group"
                            >
                              <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                                <Code className="w-4 h-4 text-orange-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">Add Problem</div>
                                <div className="text-xs text-base-content/60">
                                  Create new challenges
                                </div>
                              </div>
                            </Link>
                          </motion.li>
                        </>
                      )}

                      {/* <motion.li whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-codeflow-purple/10 hover:to-codeflow-blue/10 hover:text-codeflow-purple transition-all duration-200 group"
                        >
                          <div className="p-2 bg-gray-500/10 rounded-lg group-hover:bg-gray-500/20 transition-colors">
                            <Settings className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Settings</div>
                            <div className="text-xs text-base-content/60">Preferences & privacy</div>
                          </div>
                        </Link>
                      </motion.li> */}

                      {/* <div className="divider my-2"></div> */}
                    </div>
                  </motion.ul>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="relative text-white/70 hover:text-white hover:bg-sky-400 transition-all duration-300 group"
                  >
                    <Link to="/login">
                      Login
                      <motion.div
                        className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-codeflow-purple to-codeflow-blue"
                        style={{
                          background:
                            'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
                        }}
                        whileHover={{ width: '100%', x: '-50%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 0 rgba(108, 92, 231, 0)',
                      '0 0 20px rgba(108, 92, 231, 0.3)',
                      '0 0 0 rgba(108, 92, 231, 0)',
                    ],
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    scale: { duration: 0.2 },
                    y: { duration: 0.2 },
                  }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="relative overflow-hidden bg-gradient-to-r from-codeflow-purple to-codeflow-blue hover:from-codeflow-purple/90 hover:to-codeflow-blue/90 text-white font-medium shadow-lg border-0"
                    style={{
                      background:
                        'linear-gradient(90deg, #a78bfa 0%, #60a5fa 100%)',
                    }}
                  >
                    <Link to="/signup">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        Sign Up
                      </motion.span>
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                          repeatDelay: 3,
                        }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.header>
    </nav>
  );
};

export default Navbar;
