import React, { useState, useRef } from 'react';
import { 
  FiArrowRight, FiArrowLeft, FiCheck, FiBriefcase, 
  FiSettings, FiDollarSign, FiUser, FiImage, 
  FiLock, FiFileText, FiUpload, FiGlobe,
  FiMapPin, FiCalendar, FiHash, FiShare2,
  FiMail, FiPhone, FiLink, FiPlus, FiX, FiEdit2
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import mockupimage from "../../../assets/mockupbusiness.webp";

const CreateBusiness = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState(null);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    // Step 1: Business Details
    businessName: 'P Market',
    businessType: 'Retail',
    description: 'Team Lead - Sales at O P Market',
    address: '634, Sandra, Address 117, Rd Number 0, Rajeev Nagar, Patna, Bihar',
    pincode: '800024',
    city: 'Patna',
    state: 'Bihar',
    
    // Step 2: Contact Details
    contacts: [
      {
        name: 'Mr. Chandra Vaibhav',
        mobile: '+917004717328',
        whatsapp: '+918102481915',
        email: 'chandra.vaibhav@byjus.com',
        isPrimary: true,
        designation: 'Owner'
      }
    ],
    
    // Step 3: Business Categories
    categories: [
      {
        name: 'Retail',
        subcategories: ['Electronics', 'Home Appliances']
      }
    ],
    
    // Step 4: Year of Establishment
    establishmentMonth: 'January',
    establishmentYear: '2020',
    
    // Step 5: Social Media Links
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      instagram: '',
    },
    
    // Step 6: Business Address
    businessAddress: {
      fullAddress: '634, Sandra, Address 117, Rd Number 0, Rajeev Nagar, Patna, Bihar',
      landmark: 'Near City Center',
      isSoleOccupant: true,
    },
    
    // Step 7: Photo Gallery
    photos: [],
    
    // Step 8: Business Website
    website: '',
    
    // Step 9: KYC
    kyc: {
      panNumber: '',
      bankDetails: {},
      verificationStatus: 'pending'
    }
  });

  const imageInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle contact person changes
  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, contacts: updatedContacts }));
  };

  // Set primary contact
  const setPrimaryContact = (index) => {
    const updatedContacts = formData.contacts.map((contact, i) => ({
      ...contact,
      isPrimary: i === index
    }));
    setFormData(prev => ({ ...prev, contacts: updatedContacts }));
  };

  // Add new contact person
  const addContactPerson = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          name: '',
          mobile: '',
          whatsapp: '',
          email: '',
          isPrimary: false,
          designation: ''
        }
      ]
    }));
    setCurrentContactIndex(formData.contacts.length);
  };

  // Remove contact person
  const removeContactPerson = (index) => {
    if (formData.contacts.length <= 1) return;
    
    const updatedContacts = formData.contacts.filter((_, i) => i !== index);
    const newPrimaryIndex = formData.contacts.findIndex(c => c.isPrimary) === index ? 0 : null;
    
    if (newPrimaryIndex !== null) {
      updatedContacts[newPrimaryIndex].isPrimary = true;
    }
    
    setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    setCurrentContactIndex(Math.min(index, updatedContacts.length - 1));
  };

  // Add new category
  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name: newCategory.trim(),
          subcategories: []
        }
      ]
    }));
    setNewCategory('');
  };

  // Edit category
  const editCategory = (index) => {
    if (editingCategoryIndex === index) {
      setEditingCategoryIndex(null);
    } else {
      setEditingCategoryIndex(index);
      setNewCategory(formData.categories[index].name);
    }
  };

  // Update category
  const updateCategory = (index) => {
    if (!newCategory.trim()) return;
    
    const updatedCategories = [...formData.categories];
    updatedCategories[index].name = newCategory.trim();
    
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setEditingCategoryIndex(null);
    setNewCategory('');
  };

  // Remove category
  const removeCategory = (index) => {
    const updatedCategories = formData.categories.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  // Add subcategory
  const addSubcategory = (categoryIndex) => {
    if (!newSubcategory.trim()) return;
    
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].subcategories.push(newSubcategory.trim());
    
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setNewSubcategory('');
  };

  // Edit subcategory
  const editSubcategory = (categoryIndex, subcategoryIndex) => {
    if (editingSubcategoryIndex === subcategoryIndex) {
      setEditingSubcategoryIndex(null);
    } else {
      setEditingSubcategoryIndex(subcategoryIndex);
      setNewSubcategory(formData.categories[categoryIndex].subcategories[subcategoryIndex]);
    }
  };

  // Update subcategory
  const updateSubcategory = (categoryIndex, subcategoryIndex) => {
    if (!newSubcategory.trim()) return;
    
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex] = newSubcategory.trim();
    
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setEditingSubcategoryIndex(null);
    setNewSubcategory('');
  };

  // Remove subcategory
  const removeSubcategory = (categoryIndex, subcategoryIndex) => {
    const updatedCategories = [...formData.categories];
    updatedCategories[categoryIndex].subcategories = 
      updatedCategories[categoryIndex].subcategories.filter((_, i) => i !== subcategoryIndex);
    
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  // Handle multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  // Navigation
  const nextStep = () => setStep(prev => Math.min(prev + 1, 9));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const completeProcess = () => {
    setShowSuccess(true);
  };

  const viewBusinessPage = () => {
    navigate('/sawtar/freelancer/business');
  };

  // Step Components
  const steps = [
    // Step 1: Business Details
    {
      title: "Business Details",
      icon: <FiBriefcase className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="grid gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type *</label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
            >
              <option value="Retail">Retail</option>
              <option value="Service">Service</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
        </div>
      )
    },

    // Step 2: Contact Details
    {
      title: "Contact Details",
      icon: <FiUser className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-6">
          {/* Contact Person Tabs */}
          <div className="flex overflow-x-auto pb-2">
            {formData.contacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => setCurrentContactIndex(index)}
                className={`flex-shrink-0 px-4 py-2 mr-2 rounded-t-lg border-b-2 ${currentContactIndex === index ? 'border-[#D26C44] bg-white' : 'border-transparent hover:border-gray-300'}`}
              >
                {contact.name || `Contact ${index + 1}`}
                {contact.isPrimary && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Primary
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={addContactPerson}
              className="flex-shrink-0 px-3 py-2 text-[#D26C44] hover:bg-gray-100 rounded-lg"
            >
              <FiPlus className="inline mr-1" /> Add
            </button>
          </div>

          {/* Current Contact Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">
                {formData.contacts[currentContactIndex].name || `Contact ${currentContactIndex + 1}`}
              </h3>
              {formData.contacts.length > 1 && (
                <button
                  onClick={() => removeContactPerson(currentContactIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              )}
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person Name *</label>
                <input
                  type="text"
                  value={formData.contacts[currentContactIndex].name}
                  onChange={(e) => handleContactChange(currentContactIndex, 'name', e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  value={formData.contacts[currentContactIndex].designation}
                  onChange={(e) => handleContactChange(currentContactIndex, 'designation', e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                <input
                  type="tel"
                  value={formData.contacts[currentContactIndex].mobile}
                  onChange={(e) => handleContactChange(currentContactIndex, 'mobile', e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={formData.contacts[currentContactIndex].isPrimary}
                    onChange={() => setPrimaryContact(currentContactIndex)}
                    className="h-4 w-4 text-[#D26C44] focus:ring-[#D26C44] border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Set as Primary Contact</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.contacts[currentContactIndex].whatsapp}
                  onChange={(e) => handleContactChange(currentContactIndex, 'whatsapp', e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={formData.contacts[currentContactIndex].email}
                  onChange={(e) => handleContactChange(currentContactIndex, 'email', e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
                />
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Step 3: Business Categories
    {
      title: "Business Categories",
      icon: <FiHash className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Add at least one category and optional subcategories to help customers find your business
            </p>

            {/* Categories List */}
            <div className="space-y-4 mb-6">
              {formData.categories.map((category, catIndex) => (
                <div key={catIndex} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center mb-2">
                    {editingCategoryIndex === catIndex ? (
                      <div className="flex items-center w-full">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="flex-1 px-3 py-1 border border-blue-300 rounded-l-md"
                        />
                        <button
                          onClick={() => updateCategory(catIndex)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-r-md"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-blue-800 font-medium">{category.name}</h3>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editCategory(catIndex)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => removeCategory(catIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="ml-4 mt-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {category.subcategories.map((subcat, subIndex) => (
                        <div key={subIndex} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                          {editingSubcategoryIndex === subIndex ? (
                            <>
                              <input
                                type="text"
                                value={newSubcategory}
                                onChange={(e) => setNewSubcategory(e.target.value)}
                                className="bg-transparent border-b border-blue-300 outline-none mr-1 w-24"
                              />
                              <button
                                onClick={() => updateSubcategory(catIndex, subIndex)}
                                className="text-blue-600"
                              >
                                <FiCheck size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              {subcat}
                              <button
                                onClick={() => editSubcategory(catIndex, subIndex)}
                                className="ml-1 text-blue-600"
                              >
                                <FiEdit2 size={12} />
                              </button>
                              <button
                                onClick={() => removeSubcategory(catIndex, subIndex)}
                                className="ml-1 text-red-500"
                              >
                                <FiX size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Subcategory */}
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="Add subcategory"
                        className="flex-1 px-3 py-1 text-sm border border-blue-200 rounded-l-md"
                      />
                      <button
                        onClick={() => addSubcategory(catIndex)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-r-md"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Category */}
            <div className="flex items-center">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#D26C44]"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-[#D26C44] text-white rounded-r-lg"
              >
                Add Category
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: Edits may take 24-48 hours to be published
          </p>
        </div>
      )
    },

    // Step 4: Year of Establishment
    {
      title: "Year of Establishment",
      icon: <FiCalendar className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <select
              name="establishmentMonth"
              value={formData.establishmentMonth}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              name="establishmentYear"
              value={formData.establishmentYear}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
            >
              {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 col-span-2">
            Note: Changes may take 2 working days to go live
          </p>
        </div>
      )
    },

    // Step 5: Social Media Links
    {
      title: "Social Media Links",
      icon: <FiShare2 className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook Business Page</label>
            <div className="flex items-center">
              <FiLink className="text-gray-400 mr-2" />
              <input
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Twitter (X) Business Account</label>
            <div className="flex items-center">
              <FiLink className="text-gray-400 mr-2" />
              <input
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
                placeholder="https://twitter.com/yourprofile"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn Company Page</label>
            <div className="flex items-center">
              <FiLink className="text-gray-400 mr-2" />
              <input
                type="url"
                value={formData.socialMedia.linkedin}
                onChange={(e) => handleNestedChange('socialMedia', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Profile</label>
            <div className="flex items-center">
              <FiLink className="text-gray-400 mr-2" />
              <input
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                placeholder="https://instagram.com/yourprofile"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
        </div>
      )
    },

    // Step 6: Business Address
    {
      title: "Business Address",
      icon: <FiMapPin className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Address *</label>
            <textarea
              value={formData.businessAddress.fullAddress}
              onChange={(e) => handleNestedChange('businessAddress', 'fullAddress', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode *</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Landmark</label>
              <input
                type="text"
                value={formData.businessAddress.landmark}
                onChange={(e) => handleNestedChange('businessAddress', 'landmark', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.businessAddress.isSoleOccupant}
              onChange={(e) => handleNestedChange('businessAddress', 'isSoleOccupant', e.target.checked)}
              className="h-4 w-4 text-[#D26C44] focus:ring-[#D26C44] border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              The entire building/premises is occupied by this business
            </label>
          </div>
        </div>
      )
    },

    // Step 7: Photo Gallery
    {
      title: "Photo Gallery",
      icon: <FiImage className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Upload photos of your business premises (Recommended: 1000px × 1000px)
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    const newPreviews = [...imagePreviews];
                    newPreviews.splice(index, 1);
                    setImagePreviews(newPreviews);
                    setFormData(prev => ({
                      ...prev,
                      photos: prev.photos.filter((_, i) => i !== index)
                    }));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {imagePreviews.length < 10 && (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer h-24"
                onClick={() => imageInputRef.current.click()}
              >
                <span className="text-gray-500">+ Add</span>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Note: Uploaded photos may take 3 working days to be published
          </p>
        </div>
      )
    },

    // Step 8: Business Website
    {
      title: "Business Website",
      icon: <FiGlobe className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Website URL</label>
            <div className="flex items-center">
              <FiLink className="text-gray-400 mr-2" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourbusiness.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D26C44]"
              />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Don't have a website?</h4>
            <p className="text-xs text-blue-700 mb-3">
              Get a professional looking website for your business today
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              GO DIGITAL NOW →
            </button>
          </div>
        </div>
      )
    },

    // Step 9: KYC Verification
    {
      title: "KYC Verification",
      icon: <FiLock className="mr-2" style={{ color: '#D26C44' }} />,
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Complete KYC to get verified</h4>
            <p className="text-xs text-yellow-700">
              Complete the steps below to get your business verified
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600">1</span>
                </div>
                <span className="text-sm font-medium">PAN Verification</span>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600">2</span>
                </div>
                <span className="text-sm font-medium">Bank Account Verification</span>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600">3</span>
                </div>
                <span className="text-sm font-medium">Address Verification</span>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button className="w-full px-4 py-2 bg-[#D26C44] text-white rounded-lg">
              Get Verified
            </button>
          </div>
        </div>
      )
    }
  ];

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Profile Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your business profile is now live. Customers can find and contact you.
          </p>
          <button
            onClick={viewBusinessPage}
            className="w-full px-6 py-3 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition"
          >
            Show Your Business Page
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-3"
          >
            Create Your Business Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Step {step} of 9
          </motion.p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Static Mockup */}
            <div className="md:w-1/3 p-6 text-white">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-[600px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={mockupimage}
                    alt="Static Mockup"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-2/3 p-8">
              <div className="space-y-10">
                {/* Current Step */}
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    {steps[step-1].icon} {steps[step-1].title}
                  </h2>
                  {steps[step-1].content}
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {step > 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={prevStep}
                      className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      <FiArrowLeft className="mr-2" /> Previous
                    </motion.button>
                  )}
                  {step < 9 ? (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={nextStep}
                      className="flex items-center px-6 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition ml-auto"
                    >
                      Next <FiArrowRight className="ml-2" />
                    </motion.button>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      onClick={completeProcess}
                      className="flex items-center px-6 py-2 bg-[#D26C44] text-white rounded-lg hover:bg-[#D26C44]/90 transition ml-auto"
                    >
                      Complete <FiCheck className="ml-2" />
                    </motion.button>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress: {Math.round((step / 9) * 100)}%
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Step {step} of 9
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: `${((step-1)/9)*100}%` }}
                      animate={{ width: `${(step/9)*100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-[#D26C44] h-2.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBusiness;