



import React, { useState } from 'react';
import noProfile from '../../../../assets/noProfile.jpg';

function AddEmployee({ onClose }) {
  // Main form state including dynamic sections:
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: {
      homeNumber: '',
      street: '',
      city: '',
      state: '',
    },
    workExperience: [
      { company: '', startDate: '', endDate: '', address: '' }
    ],
    qualifications: [
      { name: '', startDate: '', endDate: '', percentage: '' }
    ],
    projects: [
      { title: '', description: '' }
    ],
  });

  // Store errors for each field (including dynamic sections)
  const [errors, setErrors] = useState({});

  // Basic change handler for top-level and nested address fields:
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value }});
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Change handler for dynamic array fields:
  const handleDynamicChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedList = formData[section].map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setFormData({ ...formData, [section]: updatedList });
  };

  // Helper: Check if the last dynamic entry has all its required fields filled.
  const canAddNewEntry = (section, requiredFields) => {
    const entries = formData[section];
    if (entries.length === 0) return false;
    const lastEntry = entries[entries.length - 1];
    // Returns true only if every required field has a nonempty value.
    return requiredFields.every((f) => {
      const value = lastEntry[f];
      return value && value.toString().trim() !== '';
    });
  };

  // Handler for adding a new dynamic entry (only if the current last entry is complete)
  const addNewEntry = (section, newEntry, requiredFields) => {
    if (!canAddNewEntry(section, requiredFields)) {
      alert('Please complete the current entry before adding a new one.');
      return;
    }
    setFormData({
      ...formData,
      [section]: [...formData[section], newEntry],
    });
  };

  // Extended validation function
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();

    // Validate basic fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.age || Number(formData.age) < 18)
      newErrors.age = 'Age must be at least 18';
    if (!formData.phone.trim() || formData.phone.trim().length !== 10)
      newErrors.phone = 'Phone must be 10 digits';
    if (!formData.gender) formData.gender = 'Gender is required';

    // Validate address fields
    ['homeNumber', 'street', 'city', 'state'].forEach((field) => {
      if (!formData.address[field]?.trim()) {
        newErrors[field] = `${field} is required`;
      }
    });
    if (
      formData.address.homeNumber &&
      formData.address.homeNumber.trim().length < 3
    ) {
      newErrors.homeNumber =
        'Home number must be at least 3 characters/digits';
    }

    // Validate each work experience entry
    formData.workExperience.forEach((exp, index) => {
      const fields = ['company', 'startDate', 'endDate', 'address'];
      const values = fields.map((f) => exp[f]?.toString().trim());
      const anyFilled = values.some((val) => val !== '');
      if (anyFilled) {
        if (!exp.company.trim()) {
          newErrors[`workExperience_${index}`] = {
            ...newErrors[`workExperience_${index}`],
            company: 'Company name is required',
          };
        }
        if (!exp.startDate.trim()) {
          newErrors[`workExperience_${index}`] = {
            ...newErrors[`workExperience_${index}`],
            startDate: 'Start date is required',
          };
        }
        if (!exp.endDate.trim()) {
          newErrors[`workExperience_${index}`] = {
            ...newErrors[`workExperience_${index}`],
            endDate: 'End date is required',
          };
        }
        if (!exp.address.trim()) {
          newErrors[`workExperience_${index}`] = {
            ...newErrors[`workExperience_${index}`],
            address: 'Address is required',
          };
        }
        // Validate dates if provided:
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          if (start > today) {
            newErrors[`workExperience_${index}`] = {
              ...newErrors[`workExperience_${index}`],
              startDate: 'Start date cannot be in the future',
            };
          }
          if (end > today) {
            newErrors[`workExperience_${index}`] = {
              ...newErrors[`workExperience_${index}`],
              endDate: 'End date cannot be in the future',
            };
          }
          if (start > end) {
            newErrors[`workExperience_${index}`] = {
              ...newErrors[`workExperience_${index}`],
              startDate: 'Start date cannot be after end date',
            };
          }
        }
      }
    });

    // Validate qualifications entries
    formData.qualifications.forEach((qual, index) => {
      const fields = ['name', 'startDate', 'endDate', 'percentage'];
      const values = fields.map((f) => qual[f]?.toString().trim());
      const anyFilled = values.some((val) => val !== '');
      if (anyFilled) {
        if (!qual.name.trim()) {
          newErrors[`qualifications_${index}`] = {
            ...newErrors[`qualifications_${index}`],
            name: 'Qualification name is required',
          };
        }
        if (!qual.startDate.trim()) {
          newErrors[`qualifications_${index}`] = {
            ...newErrors[`qualifications_${index}`],
            startDate: 'Start date is required',
          };
        }
        if (!qual.endDate.trim()) {
          newErrors[`qualifications_${index}`] = {
            ...newErrors[`qualifications_${index}`],
            endDate: 'End date is required',
          };
        }
        if (!qual.percentage.toString().trim()) {
          newErrors[`qualifications_${index}`] = {
            ...newErrors[`qualifications_${index}`],
            percentage: 'Percentage is required',
          };
        } else if (Number(qual.percentage) <= 0) {
          newErrors[`qualifications_${index}`] = {
            ...newErrors[`qualifications_${index}`],
            percentage: 'Percentage must be greater than 0',
          };
        }
        if (qual.startDate && qual.endDate) {
          const start = new Date(qual.startDate);
          const end = new Date(qual.endDate);
          if (start > today) {
            newErrors[`qualifications_${index}`] = {
              ...newErrors[`qualifications_${index}`],
              startDate: 'Start date cannot be in the future',
            };
          }
          if (end > today) {
            newErrors[`qualifications_${index}`] = {
              ...newErrors[`qualifications_${index}`],
              endDate: 'End date cannot be in the future',
            };
          }
          if (start > end) {
            newErrors[`qualifications_${index}`] = {
              ...newErrors[`qualifications_${index}`],
              startDate: 'Start date cannot be after end date',
            };
          }
        }
      }
    });

    // Validate projects entries (if any field is filled, both title and description are required)
    formData.projects.forEach((proj, index) => {
      const fields = ['title', 'description'];
      const values = fields.map((f) => proj[f]?.toString().trim());
      const anyFilled = values.some((val) => val !== '');
      if (anyFilled) {
        if (!proj.title.trim()) {
          newErrors[`projects_${index}`] = {
            ...newErrors[`projects_${index}`],
            title: 'Project title is required',
          };
        }
        if (!proj.description.trim()) {
          newErrors[`projects_${index}`] = {
            ...newErrors[`projects_${index}`],
            description: 'Project description is required',
          };
        }
      }
    });

    // Example: Check for overlapping work experience dates.
    const validExperiences = formData.workExperience.filter((exp) =>
      exp.startDate && exp.endDate && new Date(exp.startDate) <= new Date(exp.endDate)
    );
    validExperiences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    for (let i = 1; i < validExperiences.length; i++) {
      const prevEnd = new Date(validExperiences[i - 1].endDate);
      const currentStart = new Date(validExperiences[i].startDate);
      if (currentStart < prevEnd) {
        newErrors.overlap = 'Work experience date ranges should not overlap';
        break;
      }
    }

    return newErrors;
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Stop submission if errors exist.
      console.log('Validation Errors:', validationErrors);
      return;
    }
    // If valid, proceed with submission (e.g., API call)
    console.log('Form submitted successfully!', formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10">
      <div className="absolute md:w-[700px] h-[500px] bg-lime-50 border border-slate-600 shadow-md shadow-gray-700 rounded-lg p-6 overflow-hidden">
        <div className="flex justify-center">
          <h1 className="font-semibold text-2xl">Add Employee</h1>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="bg-lime-300 font-bold px-2 rounded-md cursor-pointer hover:text-red-500"
          >
            ✕
          </button>
        </div>
        <hr className="mt-2" />
        <div className="overflow-y-auto h-[calc(100%-20px)] custom-scrollbar">
          <div className="mr-2">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.age && <p className="text-red-500 text-xs">{errors.age}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                </div>
              </div>

              {/* Address */}
              <h1 className="mt-6 text-lg font-bold">Address</h1>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Home Number
                  </label>
                  <input
                    type="text"
                    name="homeNumber"
                    value={formData.address.homeNumber}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.homeNumber && (
                    <p className="text-red-500 text-xs">{errors.homeNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    Street
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-xs">{errors.street}</p>
                  )}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block mt-3 text-sm font-medium text-gray-600">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* Work Experience */}
              <div className="flex items-center mt-6">
                <h1 className="text-lg font-bold">Work Experience</h1>
                <button
                  type="button"
                  className="ml-4 bg-green-200 px-2 rounded-full text-xl"
                  onClick={() =>
                    addNewEntry(
                      'workExperience',
                      { company: '', startDate: '', endDate: '', address: '' },
                      ['company', 'startDate', 'endDate', 'address']
                    )
                  }
                  disabled={!canAddNewEntry('workExperience', ['company', 'startDate', 'endDate', 'address'])}
                  title="Complete current entry to add a new one"
                >
                  +
                </button>
              </div>
              {formData.workExperience.map((exp, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) =>
                        handleDynamicChange('workExperience', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`workExperience_${index}`]?.company && (
                      <p className="text-red-500 text-xs">
                        {errors[`workExperience_${index}`].company}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleDynamicChange('workExperience', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`workExperience_${index}`]?.startDate && (
                      <p className="text-red-500 text-xs">
                        {errors[`workExperience_${index}`].startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleDynamicChange('workExperience', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`workExperience_${index}`]?.endDate && (
                      <p className="text-red-500 text-xs">
                        {errors[`workExperience_${index}`].endDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={exp.address}
                      onChange={(e) =>
                        handleDynamicChange('workExperience', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`workExperience_${index}`]?.address && (
                      <p className="text-red-500 text-xs">
                        {errors[`workExperience_${index}`].address}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Qualifications */}
              <div className="flex items-center mt-6">
                <h1 className="text-lg font-bold">Qualifications</h1>
                <button
                  type="button"
                  className="ml-4 bg-green-200 px-2 rounded-full text-xl"
                  onClick={() =>
                    addNewEntry(
                      'qualifications',
                      { name: '', startDate: '', endDate: '', percentage: '' },
                      ['name', 'startDate', 'endDate', 'percentage']
                    )
                  }
                  disabled={!canAddNewEntry('qualifications', ['name', 'startDate', 'endDate', 'percentage'])}
                  title="Complete current entry to add a new one"
                >
                  +
                </button>
              </div>
              {formData.qualifications.map((qual, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Qualification Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={qual.name}
                      onChange={(e) =>
                        handleDynamicChange('qualifications', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`qualifications_${index}`]?.name && (
                      <p className="text-red-500 text-xs">
                        {errors[`qualifications_${index}`].name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={qual.startDate}
                      onChange={(e) =>
                        handleDynamicChange('qualifications', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`qualifications_${index}`]?.startDate && (
                      <p className="text-red-500 text-xs">
                        {errors[`qualifications_${index}`].startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={qual.endDate}
                      onChange={(e) =>
                        handleDynamicChange('qualifications', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`qualifications_${index}`]?.endDate && (
                      <p className="text-red-500 text-xs">
                        {errors[`qualifications_${index}`].endDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Percentage
                    </label>
                    <input
                      type="number"
                      name="percentage"
                      value={qual.percentage}
                      onChange={(e) =>
                        handleDynamicChange('qualifications', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                    {errors[`qualifications_${index}`]?.percentage && (
                      <p className="text-red-500 text-xs">
                        {errors[`qualifications_${index}`].percentage}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Projects */}
              <div className="flex items-center mt-6">
                <h1 className="text-lg font-bold">Projects</h1>
                <button
                  type="button"
                  className="ml-4 bg-green-200 px-2 rounded-full text-xl"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      projects: [
                        ...formData.projects,
                        { title: '', description: '' }
                      ],
                    })
                  }
                  disabled={!canAddNewEntry('projects', ['title', 'description'])}
                  title="Complete current entry to add a new one"
                >
                  +
                </button>
              </div>
              {formData.projects.map((project, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={project.title}
                      onChange={(e) =>
                        handleDynamicChange('projects', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={project.description}
                      onChange={(e) =>
                        handleDynamicChange('projects', index, e)
                      }
                      className="block w-full px-4 py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-300"
                    />
                  </div>
                </div>
              ))}

              {/* Submit Button with Arrow Indicator if Errors Exist */}
              <div className="flex items-center justify-center my-6">
                <button type="submit" className="p-2 text-lg font-bold border border-lime-400 rounded-md bg-gradient-to-r from-lime-500 via-lime-200 to-lime-500">
                  Submit
                </button>
                {Object.keys(errors).length > 0 && (
                  <span className="ml-2 text-red-500 text-2xl" title="There are errors in the form">
                    ↑
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
