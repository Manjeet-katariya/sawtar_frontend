import React, { useState } from 'react';
import { FiArrowRight, FiArrowLeft, FiCheck, FiLink, FiLinkedin, FiUser, FiMail, FiLock, FiBriefcase, FiAward, FiDollarSign, FiFileText } from 'react-icons/fi';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    skills: '',
    experience: '',
    hourlyRate: '',
    portfolio: '',
    linkedin: '',
    bio: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registration successful!');
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      profession: '',
      skills: '',
      experience: '',
      hourlyRate: '',
      portfolio: '',
      linkedin: '',
      bio: '',
      terms: false,
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Visual */}
        <div 
          className="md:w-2/5 p-8 text-white flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #D26C44 0%, #8B3F2B 100%)' }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-4">Join Our Freelance Network</h1>
            <p className="text-orange-100 mb-8">
              Showcase your skills and connect with clients who need your expertise
            </p>
            
            <div className="space-y-6">
              {[1, 2, 3].map((stepNumber) => (
                <div 
                  key={stepNumber} 
                  className={`flex items-center p-4 rounded-xl transition-all ${step === stepNumber ? 'bg-white/20' : 'opacity-80'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${step >= stepNumber ? 'bg-white text-[#8B3F2B]' : 'bg-white/20'}`}>
                    {stepNumber === 1 && <FiUser className="text-lg" />}
                    {stepNumber === 2 && <FiBriefcase className="text-lg" />}
                    {stepNumber === 3 && <FiFileText className="text-lg" />}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {stepNumber === 1 && 'Account Setup'}
                      {stepNumber === 2 && 'Professional Profile'}
                      {stepNumber === 3 && 'Final Details'}
                    </h3>
                    <p className="text-sm text-orange-100">
                      {stepNumber === 1 && 'Basic information'}
                      {stepNumber === 2 && 'Skills and experience'}
                      {stepNumber === 3 && 'Portfolio and bio'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="text-orange-100 text-sm">
              <p>Already registered? <a href="#" className="text-white font-medium underline">Sign in here</a></p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-3/5 p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Freelancer Registration</h2>
            <span className="text-sm font-medium text-[#D26C44]">Step {step} of 3</span>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    required
                    minLength="8"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-[#D26C44] text-white rounded-lg hover:bg-[#8B3F2B] focus:outline-none focus:ring-2 focus:ring-[#D26C44]/50 focus:ring-offset-2 transition-all"
                  >
                    Next <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Profession</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiBriefcase className="text-gray-400" />
                  </div>
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all appearance-none"
                    required
                  >
                    <option value="">Select your profession</option>
                    <option value="web-developer">Web Developer</option>
                    <option value="graphic-designer">Graphic Designer</option>
                    <option value="content-writer">Content Writer</option>
                    <option value="digital-marketer">Digital Marketer</option>
                    <option value="mobile-developer">Mobile Developer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    placeholder="JavaScript, React, UI/UX"
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Years of Experience</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiAward className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    min="0"
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Hourly Rate ($)</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    min="0"
                    required
                  />
                </div>
                
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                  >
                    <FiArrowLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-[#D26C44] text-white rounded-lg hover:bg-[#8B3F2B] focus:outline-none focus:ring-2 focus:ring-[#D26C44]/50 focus:ring-offset-2 transition-all"
                  >
                    Next <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Portfolio Website</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiLink className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-1">LinkedIn Profile</label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FiLinkedin className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Brief Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D26C44]/50 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="Tell us about yourself and your expertise..."
                    maxLength="500"
                  ></textarea>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {formData.bio.length}/500 characters
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#D26C44] focus:ring-[#D26C44] border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the <a href="#" className="text-[#D26C44] hover:text-[#8B3F2B]">Terms and Conditions</a>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                  >
                    <FiArrowLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-[#D26C44] text-white rounded-lg hover:bg-[#8B3F2B] focus:outline-none focus:ring-2 focus:ring-[#D26C44]/50 focus:ring-offset-2 transition-all"
                  >
                    Complete Registration <FiCheck className="ml-2" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;