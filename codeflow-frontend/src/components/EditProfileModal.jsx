import React, { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { X, Upload, User, Mail, Camera, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { EditProfileSchema } from '../schemas/profileSchema';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { authUser, updateDetails, updateAvatar } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      fullname: '',
      username: '',
    },
  });

  // Initialize form with current user data when modal opens or authUser updates
  useEffect(() => {
    if (isOpen && authUser) {
      console.log('Initializing form with authUser:', authUser);
      reset({
        fullname: authUser.fullname || '',
        username: authUser.username || '',
      });
      setPreviewImage(authUser.avatarUrl);
      setSelectedFile(null);
    }
  }, [isOpen, authUser?.fullname, authUser?.username, authUser?.avatarUrl, reset]);

  // Separate effect to handle authUser updates when modal is already open
  useEffect(() => {
    if (isOpen && authUser) {
      console.log('AuthUser updated while modal is open:', authUser);
      reset({
        fullname: authUser.fullname || '',
        username: authUser.username || '',
      });
      setPreviewImage(authUser.avatarUrl);
    }
  }, [authUser?.fullname, authUser?.username, authUser?.avatarUrl, isOpen, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    // Check if any profile data has changed
    const profileData = {};

    if (data.fullname && data.fullname.trim() && data.fullname !== authUser?.fullname) {
      profileData.fullname = data.fullname.trim();
    }

    if (data.username && data.username.trim() && data.username !== authUser?.username) {
      profileData.username = data.username.trim();
    }

    let profileUpdateSuccess = true;
    let avatarUpdateSuccess = true;

    // Update profile details if any have changed
    if (Object.keys(profileData).length > 0) {
      setIsUpdatingProfile(true);
      try {
        profileUpdateSuccess = await updateDetails(profileData);
      } catch (error) {
        console.error('Error updating profile:', error);
        profileUpdateSuccess = false;
      } finally {
        setIsUpdatingProfile(false);
      }
    }

    // Update avatar if a new file is selected
    if (selectedFile) {
      setIsUpdatingAvatar(true);
      try {
        avatarUpdateSuccess = await updateAvatar(selectedFile);
      } catch (error) {
        console.error('Error updating avatar:', error);
        avatarUpdateSuccess = false;
      } finally {
        setIsUpdatingAvatar(false);
      }
    }

    // Close modal only if all updates were successful
    if (profileUpdateSuccess && avatarUpdateSuccess) {
      // Reset form state before closing
      setSelectedFile(null);
      onClose();
    }
  };

  const handleReset = () => {
    if (authUser) {
      // Force reset with current authUser data
      reset({
        fullname: authUser.fullname || '',
        username: authUser.username || '',
      });
      setPreviewImage(authUser.avatarUrl || 'https://avatar.iran.liara.run/public/boy');
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const isLoading = isUpdatingProfile || isUpdatingAvatar;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="card bg-base-100/95 backdrop-blur-sm w-full max-w-md shadow-2xl border border-white/10"
      >
        <div className="card-body p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-base-content">Edit Profile</h3>
            <button
              onClick={handleClose}
              className="btn btn-ghost btn-sm btn-circle"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form
            key={authUser?.fullname + authUser?.username}
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-2">
              <div className="relative group cursor-pointer">
                <img
                  src={previewImage || authUser?.avatarUrl || 'https://avatar.iran.liara.run/public/boy'}
                  alt="Profile preview"
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-codeflow-purple/30 group-hover:ring-codeflow-purple/60 transition-all duration-300 shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                  disabled={isLoading}
                >
                  <Camera className="w-6 h-6 text-white drop-shadow-lg" />
                </button>
                {selectedFile && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-ghost btn-sm mt-3 gap-2 hover:bg-codeflow-purple/10 transition-colors duration-200"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
                Change Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  {...register('fullname')}
                  className={`input input-bordered w-full pl-10 ${
                    errors.fullname ? 'input-error' : ''
                  }`}
                  placeholder={authUser?.fullname || "Enter your full name"}
                  disabled={isLoading}
                />
              </div>
              {errors.fullname && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  {...register('username')}
                  className={`input input-bordered w-full pl-10 ${
                    errors.username ? 'input-error' : ''
                  }`}
                  placeholder={authUser?.username || "Enter your username"}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Leave fields empty to keep current values
                </span>
              </label>
            </div>

            {/* Email (Read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  value={authUser?.email || ''}
                  className="input input-bordered w-full pl-10 bg-base-300/50 text-base-content/60"
                  disabled
                  readOnly
                />
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Email cannot be changed
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost flex-1 hover:bg-base-300/30 transition-colors duration-200"
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn bg-base-200/50 border-white/10 hover:bg-base-200/70 flex-1 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn flex-1 gap-2 bg-gradient-to-r from-codeflow-purple to-codeflow-blue hover:from-codeflow-purple/90 hover:to-codeflow-blue/90 text-white border-0 font-medium shadow-lg relative overflow-hidden group transition-all duration-300"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isUpdatingAvatar ? 'Updating Avatar...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
