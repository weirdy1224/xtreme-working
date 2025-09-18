import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Shield,
  Crown,
  Check,
  X,
  Camera,
  Loader2,
  Save
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const UserDetails = () => {
  const { authUser, updateDetails, updateAvatar } = useAuthStore();
  const fileInputRef = useRef(null);

  
  // Editing states
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    fullname: '',
    username: ''
  });
  const [isUpdating, setIsUpdating] = useState({
    fullname: false,
    username: false,
    avatar: false
  });

  // Mock data for demonstration
  const userStats = {
    problemsSolved: 127,
    successRate: 89,
    totalSubmissions: 243,
    streak: 15,
    rank: 'Expert',
    points: 1247,
  };

  const startEditing = (field) => {
    setEditingField(field);
    setEditValues({
      ...editValues,
      [field]: authUser?.[field] || ''
    });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValues({
      fullname: '',
      username: ''
    });
  };

  const saveField = async (field) => {
    const value = editValues[field]?.trim();

    if (!value || value === authUser?.[field]) {
      cancelEditing();
      return;
    }

    setIsUpdating(prev => ({ ...prev, [field]: true }));

    try {
      const success = await updateDetails({ [field]: value });

      if (success) {
        setEditingField(null);
        setEditValues(prev => ({ ...prev, [field]: '' }));
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setIsUpdating(prev => ({ ...prev, avatar: true }));
    
    try {
      await updateAvatar(file);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, avatar: false }));
    }
  };

  const renderEditableField = (field, label, icon, value) => {
    const isEditing = editingField === field;
    const isLoading = isUpdating[field];

    const IconComponent = icon;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-base-content/70">
            {label}
          </label>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startEditing(field)}
              className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 transition-colors"
              disabled={editingField !== null}
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </motion.button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconComponent className="h-4 w-4 text-base-content/40" />
              </div>
              <input
                type="text"
                value={editValues[field]}
                onChange={(e) => setEditValues(prev => ({ ...prev, [field]: e.target.value }))}
                className="input input-bordered w-full pl-10 text-sm h-10"
                placeholder={`Enter your ${label.toLowerCase()}`}
                autoFocus
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveField(field);
                  if (e.key === 'Escape') cancelEditing();
                }}
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => saveField(field)}
                className="btn btn-primary btn-sm gap-1"
                disabled={isLoading || !editValues[field]?.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelEditing}
                className="btn btn-ghost btn-sm gap-1"
                disabled={isLoading}
              >
                <X className="w-3 h-3" />
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-base-200/30 rounded-lg border border-base-300/50">
            <div className="flex items-center gap-3">
              <IconComponent className="w-4 h-4 text-base-content/60" />
              <span className="text-base-content font-medium">
                {value || `No ${label.toLowerCase()} set`}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card bg-base-100/50 backdrop-blur-sm shadow-xl border border-white/10">
      <div className="card-body p-0">
        {/* Header with Avatar */}
        <div className="relative p-6 bg-gradient-to-r from-codeflow-purple/20 to-codeflow-blue/20 rounded-t-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <img
                src={authUser?.avatarUrl || 'https://avatar.iran.liara.run/public/boy'}
                alt="Profile"
                className="w-24 h-24 rounded-full ring-4 ring-codeflow-purple/50 object-cover transition-all duration-300"
              />
              {authUser?.role === 'ADMIN' && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-base-100"></div>
              
              {/* Avatar upload overlay */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                disabled={isUpdating.avatar}
              >
                {isUpdating.avatar ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </motion.button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              {authUser?.role === 'ADMIN' && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-base-content mb-4">Basic Info</h3>
          </div>

          {/* Full Name */}
          {renderEditableField('fullname', 'Name', User, authUser?.fullname)}

          {/* Username */}
          {renderEditableField('username', 'Username', User, authUser?.username)}

          {/* Email (Read-only) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-base-content/70">
                Email
              </label>
            </div>
            <div className="p-3 bg-base-200/30 rounded-lg border border-base-300/50">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-base-content/60" />
                <span className="text-base-content font-medium">
                  {authUser?.email || 'No email set'}
                </span>
              </div>
            </div>
          </div>

          {/* Join Date (Read-only) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-base-content/70">
                Member Since
              </label>
            </div>
            <div className="p-3 bg-base-200/30 rounded-lg border border-base-300/50">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-base-content/60" />
                <span className="text-base-content font-medium">
                  {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="p-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-base-content mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-base-200/30 rounded-xl">
              <div className="text-xl font-bold text-codeflow-purple">{userStats.problemsSolved}</div>
              <div className="text-xs text-base-content/60">Problems Solved</div>
            </div>
            <div className="text-center p-3 bg-base-200/30 rounded-xl">
              <div className="text-xl font-bold text-codeflow-blue">{userStats.successRate}%</div>
              <div className="text-xs text-base-content/60">Success Rate</div>
            </div>
            <div className="text-center p-3 bg-base-200/30 rounded-xl">
              <div className="text-xl font-bold text-green-400">{userStats.points}</div>
              <div className="text-xs text-base-content/60">Points</div>
            </div>
            <div className="text-center p-3 bg-base-200/30 rounded-xl">
              <div className="text-xl font-bold text-yellow-400">{userStats.totalSubmissions}</div>
              <div className="text-xs text-base-content/60">Submissions</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UserDetails;
