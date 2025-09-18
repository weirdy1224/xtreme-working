import React from 'react';
import { motion } from 'framer-motion';
import UserDetails from '../components/UserDetails';


const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-codeflow-dark via-base-300 to-base-200 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-base-content mb-4">
            My Profile
          </h1>
          <p className="text-lg text-base-content/70">
            Manage your account and track your coding journey
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* User Details - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-1"
          >
            <UserDetails />
          </motion.div>
        </div>

        {/* Future components will be added here */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="card bg-base-100/30 backdrop-blur-sm border border-white/10 p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                More features coming soon...
              </h3>
              <p className="text-base-content/50">
                Additional profile components will be added here in future updates
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
