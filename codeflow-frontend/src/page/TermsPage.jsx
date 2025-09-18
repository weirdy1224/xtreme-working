import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Code } from 'lucide-react';

const TermsPage = () => {
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">Terms of Service</h1>
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
                    <p className="text-blue-200/80 text-sm">This is a portfolio/demo project. These terms are for demonstration purposes only.</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">1. Project Overview</h2>
              <p className="mb-6 text-base-content/80">
                CodeFlow is a coding practice platform created as a portfolio project to demonstrate 
                full-stack development skills. This platform includes features like problem solving, 
                code execution, user authentication, and submission tracking.
              </p>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">2. Demo Usage</h2>
              <p className="mb-6 text-base-content/80">
                This platform is intended for demonstration and learning purposes. Users can:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>Create accounts and practice coding problems</li>
                <li>Submit solutions and view results</li>
                <li>Track progress and submissions</li>
                <li>Explore the platform's features</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">3. Data & Privacy</h2>
              <p className="mb-6 text-base-content/80">
                As this is a demo project:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>User data is stored securely but may be reset periodically</li>
                <li>Do not use real sensitive information</li>
                <li>The platform is for educational/demo purposes only</li>
                <li>No commercial use or data selling occurs</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">4. Acceptable Use</h2>
              <p className="mb-6 text-base-content/80">
                Users should:
              </p>
              <ul className="list-disc pl-6 mb-6 text-base-content/80">
                <li>Use the platform respectfully</li>
                <li>Not attempt to break or exploit the system</li>
                <li>Understand this is a learning/demo environment</li>
                <li>Provide feedback if issues are found</li>
              </ul>

              <h2 className="text-xl font-semibold text-codeflow-purple mb-4">5. Contact</h2>
              <p className="text-base-content/80">
                For questions about this demo project, please contact the developer through 
                the portfolio or GitHub repository.
              </p>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
