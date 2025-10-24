import React, { useState } from 'react';

const QuotationHome = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    roomType: '',
    measurements: '',
    designStyle: '',
    name: '',
    email: '',
    phone: '',
    budgetRange: ''
  });

  const projectTypes = [
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
    { id: 'living-room', name: 'Living Room', icon: '🛋️' },
    { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
    { id: 'whole-home', name: 'Whole Home', icon: '🏠' }
  ];

  const roomSizes = [
    { value: 'small', label: 'Small (<100 sq ft)', multiplier: 1 },
    { value: 'medium', label: 'Medium (100-200 sq ft)', multiplier: 1.5 },
    { value: 'large', label: 'Large (200-400 sq ft)', multiplier: 2 },
    { value: 'extra-large', label: 'Extra Large (>400 sq ft)', multiplier: 3 }
  ];

  const designStyles = [
    { id: 'modern', name: 'Modern', description: 'Clean lines, minimalism' },
    { id: 'classic', name: 'Classic', description: 'Timeless elegance' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple and functional' },
    { id: 'industrial', name: 'Industrial', description: 'Raw and edgy' },
    { id: 'scandinavian', name: 'Scandinavian', description: 'Light and airy' },
    { id: 'rustic', name: 'Rustic', description: 'Natural and cozy' }
  ];

  const budgetRanges = [
    { label: 'Economy ($1k - $5k)', value: 'economy' },
    { label: 'Standard ($5k - $15k)', value: 'standard' },
    { label: 'Premium ($15k - $30k)', value: 'premium' },
    { label: 'Luxury ($30k+)', value: 'luxury' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const calculateEstimate = () => {
    const basePrices = {
      'Kitchen': 8000,
      'Bathroom': 5000,
      'Living Room': 6000,
      'Bedroom': 4500,
      'Whole Home': 20000
    };

    const selectedRoomSize = roomSizes.find(size => size.label === formData.roomType);
    const sizeMultiplier = selectedRoomSize ? selectedRoomSize.multiplier : 1;

    let basePrice = basePrices[formData.projectType] || 10000;
    basePrice *= sizeMultiplier;

    if (formData.designStyle === 'Luxury') basePrice *= 1.5;
    if (formData.designStyle === 'Premium') basePrice *= 1.3;
    if (formData.designStyle === 'Minimalist') basePrice *= 0.9;

    if (formData.budgetRange === 'economy') basePrice *= 0.7;
    if (formData.budgetRange === 'luxury') basePrice *= 1.8;

    const variation = 1 + (Math.random() * 0.2 - 0.1);
    basePrice *= variation;

    return Math.round(basePrice / 500) * 500;
  };

  const getEstimateRange = () => {
    const estimate = calculateEstimate();
    const lower = Math.round(estimate * 0.85);
    const upper = Math.round(estimate * 1.15);
    return { lower, upper };
  };

  const resetForm = () => {
    setFormData({
      projectType: '',
      roomType: '',
      measurements: '',
      designStyle: '',
      name: '',
      email: '',
      phone: '',
      budgetRange: ''
    });
    setStep(1);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const estimate = getEstimateRange();
    alert(`Thank you, ${formData.name}! Your estimated cost range is $${estimate.lower.toLocaleString()} - $${estimate.upper.toLocaleString()}. We'll contact you shortly at ${formData.email} or ${formData.phone}.`);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Fixed Steps Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center relative">
            {/* Horizontal Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(step - 1) * 33.33}%` }}
              ></div>
            </div>
            {/* Step Indicators */}
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    step >= stepNumber
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-400'
                  } font-semibold`}
                  aria-label={`Step ${stepNumber}: ${['Project', 'Details', 'Preferences', 'Contact'][stepNumber - 1]}`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    step >= stepNumber ? 'text-amber-600 font-bold' : 'text-gray-500'
                  }`}
                >
                  {['Project', 'Details', 'Preferences', 'Contact'][stepNumber - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto" style={{marginTop:"30px"}}>
          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8 md:p-10">
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of project are you planning?</h2>
                    <p className="text-gray-600 text-sm">Select the type of space you want to renovate or design</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, projectType: type.name }));
                          nextStep();
                        }}
                        className={`p-6 rounded-xl border-2 text-left transition-all flex items-start ${
                          formData.projectType === type.name
                            ? 'border-amber-500 bg-amber-50 shadow-inner'
                            : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
                        } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      >
                        <span className="text-2xl mr-3">{type.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">{type.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">Renovation & Design</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your space</h2>
                    <p className="text-gray-600 text-sm">Help us understand the scope of your project</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Room Size</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roomSizes.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setFormData(prev => ({ ...prev, roomType: size.label }))}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              formData.roomType === size.label
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          >
                            <h3 className="font-medium text-gray-900 text-sm">{size.label}</h3>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Approximate Measurements (optional)</label>
                      <input
                        type="text"
                        name="measurements"
                        value={formData.measurements}
                        onChange={handleChange}
                        placeholder="e.g. 12ft x 15ft"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">This helps us provide a more accurate estimate</p>
                    </div>
                  </div>
                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!formData.roomType}
                      className={`px-6 py-2 rounded-lg text-white font-medium flex items-center transition-colors ${
                        formData.roomType
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    >
                      Continue
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your design preferences</h2>
                    <p className="text-gray-600 text-sm">Tell us about your style and budget</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Preferred Design Style</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {designStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setFormData(prev => ({ ...prev, designStyle: style.name }))}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              formData.designStyle === style.name
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          >
                            <h3 className="font-medium text-gray-900 text-sm">{style.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{style.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Budget Range</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {budgetRanges.map((range) => (
                          <button
                            key={range.value}
                            onClick={() => setFormData(prev => ({ ...prev, budgetRange: range.value }))}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              formData.budgetRange === range.value
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-gray-200 hover:border-amber-300'
                            } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          >
                            <h3 className="font-medium text-gray-900 text-sm">{range.label}</h3>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-6">
                    <button
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!formData.designStyle || !formData.budgetRange}
                      className={`px-6 py-2 rounded-lg text-white font-medium flex items-center transition-colors ${
                        formData.designStyle && formData.budgetRange
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    >
                      Continue
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <form onSubmit={submitForm} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost done!</h2>
                    <p className="text-gray-600 text-sm">Share your contact details to receive your estimate</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  {/* Estimate Preview */}
                  {formData.projectType && formData.roomType && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mt-6">
                      <h3 className="text-base font-semibold text-amber-800 mb-2">Your Project Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Project Type:</p>
                          <p className="font-medium text-sm">{formData.projectType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Room Size:</p>
                          <p className="font-medium text-sm">{formData.roomType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Design Style:</p>
                          <p className="font-medium text-sm">{formData.designStyle || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Budget Range:</p>
                          <p className="font-medium text-sm">
                            {budgetRanges.find(r => r.value === formData.budgetRange)?.label || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-amber-200">
                        <p className="text-gray-600 text-sm mb-1">Estimated Cost Range:</p>
                        {formData.designStyle && formData.budgetRange ? (
                          <p className="text-xl font-bold text-amber-600">
                            ${getEstimateRange().lower.toLocaleString()} - ${getEstimateRange().upper.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">Complete your preferences for an accurate estimate</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.name || !formData.email || !formData.phone}
                      className={`px-6 py-2 rounded-lg text-white font-medium flex items-center transition-colors ${
                        formData.name && formData.email && formData.phone
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    >
                      Get My Estimate
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="mt-10 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">How our estimator works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-lg mr-4">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Answer questions</h4>
                    <p className="text-gray-600 text-xs">Tell us about your project in just a few steps</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-lg mr-4">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Get instant estimate</h4>
                    <p className="text-gray-600 text-xs">Receive a personalized cost range based on your inputs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-100 p-2 rounded-lg mr-4">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Connect with pros</h4>
                    <p className="text-gray-600 text-xs">We'll match you with qualified professionals in your area</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Note:</span> This is an estimate only. Final costs may vary based on materials, labor, and other factors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuotationHome;