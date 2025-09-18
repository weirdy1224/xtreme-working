import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Code, Database, Lock } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-codeflow-dark via-base-300 to-base-200">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 text-codeflow-purple hover:text-codeflow-blue transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-codeflow-purple to-codeflow-blue rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">Privacy Policy</h1>
          </div>
          <p className="text-base-content/70">Demo Project - CodeFlow Platform</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-base-100/50 backdrop-blur-sm shadow-2xl border border-white/10"
        >
          <div className="card-body p-8">
            <div className="prose max-w-none text-base-content">
              
              {/* Demo Notice */}
              <div className="alert alert-info mb-8 bg-blue-500/10 border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="font-semibold text-blue-300">Demo Project Notice</h3>
                    <p className="text-blue-200/80 text-sm">This is a portfolio/demo project. This privacy policy is for demonstration purposes only.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                1. Information We Collect
              </h2>
              <p className="mb-4 text-base-content/80">
                For demo purposes, we collect minimal information:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li><strong>Account Information:</strong> Username, email, and password (hashed)</li>
                <li><strong>Code Submissions:</strong> Your solution code and submission history</li>
                <li><strong>Usage Data:</strong> Problem attempts, completion status, and timestamps</li>
                <li><strong>No Personal Data:</strong> We don't collect sensitive personal information</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                2. How We Use Your Information
              </h2>
              <p className="mb-4 text-base-content/80">
                Your information is used to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>Provide the coding practice platform functionality</li>
                <li>Track your progress and submissions</li>
                <li>Authenticate your account</li>
                <li>Demonstrate platform capabilities to potential employers/clients</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">3. Data Security</h2>
              <p className="mb-6 text-base-content/80">
                We implement standard security measures:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>Passwords are hashed using industry-standard methods</li>
                <li>Data is stored securely in our database</li>
                <li>No sensitive personal information is collected</li>
                <li>HTTPS encryption for all communications</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">4. Data Sharing</h2>
              <p className="mb-6 text-base-content/80">
                As a demo project:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>We do not sell or share your data with third parties</li>
                <li>Your code submissions may be visible in demo presentations</li>
                <li>No personal information is shared publicly</li>
                <li>Data is used solely for platform demonstration</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">5. Data Retention</h2>
              <p className="mb-6 text-base-content/80">
                Since this is a demo project:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>Demo data may be reset periodically</li>
                <li>Account data is retained for platform demonstration</li>
                <li>You can request account deletion by contacting the developer</li>
                <li>No long-term data commitments are made</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">6. Your Rights</h2>
              <p className="mb-6 text-base-content/80">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>Access your account data</li>
                <li>Request deletion of your account</li>
                <li>Understand how your data is used</li>
                <li>Contact us with privacy concerns</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">7. Contact Information</h2>
              <p className="text-base-content/80">
                For privacy questions or concerns about this demo project, please contact 
                the developer through the portfolio website or GitHub repository.
              </p>

              <div className="mt-8 p-4 bg-codeflow-purple/10 rounded-lg border border-codeflow-purple/20">
                <p className="text-sm text-codeflow-purple font-medium">
                  Last updated: August 2025 • Demo Project
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
