import { useEffect, useState } from 'react';
import noProfile from '../../../../assets/noProfile.jpg'
import toast from 'react-hot-toast'
import api from '../../../../services/api';


function AddEmployee({onClose, employee, fetchEmployees}) {

  const isEditMode = Boolean(employee);
  

  console.log(isEditMode, '----------------------------------')

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', gender: '',
      address: {
        homeNumber: '', street: '', city: '', state: '',
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
    }
  );

  const [errors, setErrors] = useState({});

  // it will work if it is for edit 
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        age: employee.age || '',
        gender: employee.gender || '',
        address: {
          homeNumber: employee.address?.homeNumber || '',
          street: employee.address?.street || '',
          city: employee.address?.city || '',
          state: employee.address?.state || '',
        },
        workExperience: employee.workExperience && employee.workExperience.length > 0
          ? employee.workExperience
          : [{ company: '', startDate: '', endDate: '', address: '' }],
        qualifications: employee.qualifications && employee.qualifications.length > 0
          ? employee.qualifications
          : [{ name: '', startDate: '', endDate: '', percentage: '' }],
        projects: employee.projects && employee.projects.length > 0
          ? employee.projects
          : [{ title: '', description: '' }],
      });
    }
  }, [employee]);


  // handle changes 
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({...formData, address: { ...formData.address, [name]: value },
      });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
  };


  // handle dynamic changes
  const handleDynamicChange = (section, index, e) => {
    const {name, value} = e.target
    const updatedList = formData[section].map((item, i) => 
      i === index ? {...item, [name]: value} : item
    )
    setFormData({...formData, [section]: updatedList})
  }


  // check required field are filled for dynamic entry
  const canAddNewEntry = (section, requiredFields) => {
    const entries = formData[section]
    if (entries.length === 0) return false              // if field is empty, user cannot add new 
    const lastEntry = entries[entries.length - 1]       // if last entries anything is not filled , user cannot add new
    return requiredFields.every((f) => {
      const value = lastEntry[f]
      return value && value.toString().trim() !== ''
    })
  }
  

  // adding new dynamic entry
  const addNewEntry = (section, newEntry, requiredFields) => {
    if(!canAddNewEntry(section, requiredFields)){
      toast.error('Please complete the current entry before adding a new one.')
      return
    }
    setFormData({
      ...formData, [section] : [...formData[section], newEntry ]
    })
  }

  
  // validate form
  const validateForm = () => {
    const newErrors = {}
    const today = new Date()

    // basic things
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.age || Number(formData.age) < 18) newErrors.age = 'Age must be atleast 18'
    if (!formData.phone.trim() || formData.phone.trim().length !== 10) newErrors.phone = 'phone must be 10 digit'
    if (!formData.gender) newErrors.gender = 'Gender is required';

    // address
    ['homeNumber', 'street', 'city', 'state'].forEach((field) => {
      if(!formData.address[field]?.trim()) {
        newErrors[field] = `${field} is required`
      }
    })
    if(formData.address.homeNumber && formData.address.homeNumber.trim() < 3) {
      newErrors.homeNumber = 'home number should have 3 letter'
    }

    // work experience, if any single field is filled all field is needed to fill
    formData.workExperience.forEach((exp, index) => {
      const fields = ['company', 'startDate', 'endDate', 'address'];
      const values = fields.map((f) => exp[f]?.toString().trim())
      const anyFilled = values.some((val) => val !== '')                        // it checks any single field is filled 
      if (anyFilled) {                                                          // if filled it do this
        if(!exp.company.trim()) {
          newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], company: 'company name is required'}
        }
        if(!exp.startDate.trim()) {
          newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], startDate: 'Start date is required'}
        }
        if(!exp.endDate.trim()) {
          newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], endDate: 'end date is required'}
        }
        if(!exp.address.trim()) {
          newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], address: 'address is required'}
        }
        // if date is provide, cheking that is valid dates
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate)
          const end = new Date(exp.endDate)
          if (start > today) {
            newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], startDate:'start date cannot be in future'}
          }
          if (end > today) {
            newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], endDate: 'end date cannot be in future'}
          }
          if (start > end) {
            newErrors[`workExperience_${index}`] = {...newErrors[`workExperience_${index}`], startDate: 'start date cannot be after end date'}
          }
        }
      }
    })

    // qualifications, if any single field is filled all field is needed to fill
    formData.qualifications.forEach((qual, index) => {
      const fields = ['name', 'startDate', 'endDate', 'percentage'];
      const values = fields.map((f) => qual[f]?.toString().trim())
      const anyFilled = values.some((val) => val !== '')
      if (anyFilled) {
        if (!qual.name.trim()) {
          newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], name:'qualification name is required'}
        }
        if(!qual.startDate.trim()) {
          newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], startDate:'start date is required'}
        }
        if(!qual.endDate.trim()) {
          newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], endDate:'end date is required'}
        }
        if(!qual.percentage.toString().trim()) {
          newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], percentage:'percentage is required'}
        }
        else if(Number(qual.percentage) <= 0 ){
          newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], percentage:'percentage must be greater than 0'}
        }
        // check start date and end date is valid if given
        if (qual.startDate && qual.endDate) {
          const start = new Date(qual.startDate)
          const end = new Date(qual.endDate)
          if (start > today) {
            newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], startDate:'start date cannot be in future'}
          }
          if (end > today) {
            newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], endDate:'end date cannot be in future'}
          }
          if (start > end) {
            newErrors[`qualifications_${index}`] = {...newErrors[`qualifications_${index}`], startDate:'start date cannot be after end date'}
          }
        }
      }
    })

    // Projects, if any single field is filled all field is needed to fill
    formData.projects.forEach((proj, index) => {
      const fields = ['title', 'description'];
      const values = fields.map((f) => proj[f]?.toString().trim())
      const anyFilled = values.some((val) => val !== '')

      if(anyFilled) {
        if (!proj.title.trim()) {
          newErrors[`projects_${index}`] = {...newErrors[`projects_${index}`], title:'title is required'}
        }
        if (!proj.description.trim()){
          newErrors[`projects_${index}`] = {...newErrors[`projects_${index}`], description: 'description is required'}
        }
      }
    })

    // check dates are overlaping for Experience
    const validExperiences = formData.workExperience.filter((exp) =>
      exp.startDate && exp.endDate && new Date(exp.startDate) <= new Date(exp.endDate)
    )
    validExperiences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    for (let i = 1; i < validExperiences.length; i++) {
      const prevEnd = new Date(validExperiences[i - 1].endDate);
      const currentStart = new Date(validExperiences[i].startDate);
      if (currentStart < prevEnd) {
        newErrors.overlap = 'Work experience date ranges should not overlap';
        break;
      }
    }

    return newErrors

  }



  const handleSubmit = async (e) => {
    
    e.preventDefault()
    const validationErrors = validateForm()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      console.log('validations errrors', validationErrors)
      return
    }
    console.log(formData)
    try{
      let res; 
      if (isEditMode) {

        console.log(employee.regid, '--------------------------------------------------------------------')
        res = await api.put('update_empl/', {"regid":employee.regid, ...formData})
      }
      else{
        res = await api.post('create_empl/', formData)
      }

      console.log(res)

      if (res.status === 200) {
        toast.success(isEditMode ? 'Employee updated successfully' : 'New employee added')
        onClose()
        {!isEditMode ? fetchEmployees(): fetchEmployees()}
      }
    }
    catch(err) {
      console.log(err)
      if (err.status === 409) {
        toast.error('the email is already exists')
      } 
    }
  }
  

    return(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-10">
        <div className="absolute md:w-[700px] h-[500px] bg-lime-50 border border-slate-600 shadow-md shadow-gray-700 rounded-lg p-6 overflow-hidden">
          <div className="flex justify-center">
            <h1 className="font-semibold text-2xl">Add Employee</h1>
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={() => onClose()} className='bg-lime-300 font-bold px-2 rounded-md cursor-pointer hover:text-red-500'>✕</button>
          </div>
          <hr  className="mt-2"/>
          <div className="overflow-y-auto h-[calc(100%-20px)] custom-scrollbar">
            <div className='mr-2'>
              <form onSubmit={handleSubmit}>
                <div className='flex justify-center mt-4'>
                  <div className='p-2  rounded-3xl'>
                    <img src={noProfile} alt=""  className='w-20 h-20 border rounded-lg' />
                  </div>
                </div>
                        
                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange}  className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-400" />
                      {errors.name && (<p className="text-red-500 text-xs">{errors.name}</p>)}
                  </div>
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600">Email </label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange}  className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-400" />
                    {errors.email && (<p className="text-red-500 text-xs">{errors.email}</p>)}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> Phone </label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-400" />
                    {errors.phone && (<p className="text-red-500 text-xs">{errors.phone}</p>)}
                  </div>
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> age </label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-400" />
                    {errors.age && (<p className="text-red-500 text-xs">{errors.age}</p>)}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> gender </label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="block w-full py-2 border border-lime-200 rounded-md focus:outline-none focus:border-lime-400">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (<p className="text-red-500 text-xs">{errors.gender}</p>)}
                  </div>
                </div>

                <h1 className='mt-6 text-lg font-bold'>Address</h1>

                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> home number </label>
                    <input type="text" name="homeNumber" value={formData.address.homeNumber} onChange={handleChange} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                    {errors.homeNumber && ( <p className="text-red-500 text-xs">{errors.homeNumber}</p>)}
                  </div>
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> street </label>
                    <input type="text" name="street" value={formData.address.street} onChange={handleChange}  className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                    {errors.street && (<p className="text-red-500 text-xs">{errors.street}</p>)}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> city </label>
                    <input type="text" name="city" value={formData.address.city} onChange={handleChange} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                    {errors.city && (<p className="text-red-500 text-xs">{errors.city}</p> )}
                  </div>
                  <div>
                    <label className="block mt-3 text-sm font-medium text-gray-600"> state </label>
                    <input type="text" name="state" value={formData.address.state} onChange={handleChange}  className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                    {errors.state && (<p className="text-red-500 text-xs">{errors.state}</p>)}
                  </div>
                </div>
                
                <div className='flex justify-between'>
                  <h1 className='mt-6 text-lg font-bold'>Work Experience</h1>
                  <button type='button' className='mt-6 text-3xl mr-2'  onClick={() => addNewEntry('workExperience', { company: '', startDate: '', endDate: '', address: '' },['company', 'startDate', 'endDate', 'address'])} disabled={!canAddNewEntry('workExperience', ['company', 'startDate', 'endDate', 'address'])} title="Complete current entry to add a new one">⨮</button>
                </div>

                {formData.workExperience.map((exp, index) => (
                  <div key={index}>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> Company name  </label>
                        <input type="text" name="company" value={exp.company} onChange={(e) => handleDynamicChange('workExperience', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`workExperience_${index}`]?.company && (<p className="text-red-500 text-xs"> {errors[`workExperience_${index}`].company}</p>)}
                      </div>
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> Start date </label>
                        <input type="date" name="startDate" value={exp.startDate} onChange={(e) => handleDynamicChange('workExperience', index, e)}  className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`workExperience_${index}`]?.startDate && (<p className="text-red-500 text-xs"> {errors[`workExperience_${index}`].startDate} </p>)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> End date </label>
                        <input type="date" name="endDate" value={exp.endDate} onChange={(e) => handleDynamicChange('workExperience', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`workExperience_${index}`]?.endDate && (<p className="text-red-500 text-xs"> {errors[`workExperience_${index}`].endDate}</p>)}
                      </div>
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> Address </label>
                        <input type="text" name="address" value={exp.address} onChange={(e) => handleDynamicChange('workExperience', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`workExperience_${index}`]?.address && (<p className="text-red-500 text-xs"> {errors[`workExperience_${index}`].address} </p>)}
                      </div>
                    </div>
                  </div>
                ))}

                <div className='flex justify-between'>
                  <h1 className='mt-6 text-lg font-bold'>Qualifications</h1>
                  <button type='button'  onClick={() => addNewEntry('qualifications', { name: '', startDate: '', endDate: '', percentage: '' }, ['name', 'startDate', 'endDate', 'percentage'])} disabled={!canAddNewEntry('qualifications', ['name', 'startDate', 'endDate', 'percentage'])} title="Complete current entry to add a new one" className='mt-6 text-3xl mr-2'>⨮</button>
                </div>

                {formData.qualifications.map((qual, index) => (
                  <div key={index}>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> Name  </label>
                        <input type="text" name="name" value={qual.name} onChange={(e) => handleDynamicChange('qualifications', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`qualifications_${index}`]?.name && (<p className="text-red-500 text-xs"> {errors[`qualifications_${index}`].name}  </p>)}
                      </div>
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> Start date </label>
                        <input type="date" name="startDate" value={qual.startDate} onChange={(e) => handleDynamicChange('qualifications', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`qualifications_${index}`]?.startDate && (<p className="text-red-500 text-xs"> {errors[`qualifications_${index}`].startDate} </p>)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> End date </label>
                        <input type="date" name="endDate" value={qual.endDate} onChange={(e) => handleDynamicChange('qualifications', index, e) } className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`qualifications_${index}`]?.endDate && (<p className="text-red-500 text-xs"> {errors[`qualifications_${index}`].endDate} </p> )}
                      </div>
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> percentage </label>
                        <input type="number" name="percentage" value={qual.percentage} onChange={(e) => handleDynamicChange('qualifications', index, e)}  className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        {errors[`qualifications_${index}`]?.percentage && (<p className="text-red-500 text-xs"> {errors[`qualifications_${index}`].percentage}</p> )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className='flex justify-between'>
                  <h1 className='mt-6 text-lg font-bold'>Projects</h1>
                  <button type='button' onClick={() => setFormData({...formData, projects: [...formData.projects,{ title: '', description: '' }],})} disabled={!canAddNewEntry('projects', ['title', 'description'])} title="Complete current entry to add a new one" className='mt-6 text-3xl mr-2'>⨮</button>
                </div>

                {formData.projects.map((project, index) => (
                  <div key={index}>
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> title  </label>
                        <input type="text" name="title" value={project.title} onChange={(e) => handleDynamicChange('projects', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        
                      </div>
                      <div>
                        <label className="block mt-3 text-sm font-medium text-gray-600"> description </label>
                        <input type="text" name="description"
                      value={project.description} onChange={(e) => handleDynamicChange('projects', index, e)} className="block w-full px-4 py-2  border border-lime-200 rounded-md focus:outline-none focus:border-lime-300" />
                        
                      </div>
                    </div>
                  </div>
                ))}

                {Object.keys(errors).length > 0 && (
                <div className='flex justify-center text-red-500 text-3xl font-black'>
                  <span title="There are errors in the form">↑</span>
                </div>
               )}
                <div className="border border-lime-400 flex justify-center my-6 rounded-md bg-gradient-to-r from-lime-500 via-lime-200 to-lime-500">
                  <button className="p-2 w-full text-lg font-bold">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default AddEmployee




