import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import DoctorImage from '../components/DoctorImage'

const Doctors = () => {

  const navigate = useNavigate()
  const { speciality } = useParams();
  const { doctors, backendUrl } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    setFilterDoc(speciality ? doctors.filter(doc => doc.speciality === speciality) : doctors)
  }, [speciality, doctors])

  return (
    <div className='animate-enter'>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ""}`} onClick={() => { setShowFilter(!showFilter) }}>Filter</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => { speciality === "" ? navigate("/doctors") : navigate("/doctors/General physician") }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
          <p onClick={() => { speciality === "" ? navigate("/doctors") : navigate("/doctors/Gynecologist") }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
          <p onClick={() => { speciality === "" ? navigate("/doctors") : navigate("/doctors/Dermatologist") }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
          <p onClick={() => { speciality === "" ? navigate("/doctors") : navigate("/doctors/Pediatricians") }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
          <p onClick={() => { speciality === "" ? navigate("/doctors") : navigate("/doctors/Neurologist") }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
          <p onClick={() => { speciality === "" ? navigate("/doctors") : navigate("/doctors/Gastroenterologist") }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastoenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastoenterologist</p>
        </div>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {
            filterDoc.map((item, index) => {
              return (
                <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                  <DoctorImage className='bg-blue-50 w-full h-40 object-cover' image={item.image} backendUrl={backendUrl} index={doctors.indexOf(item)} name={item.name} />
                  <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? " text-green-500" : "text-gray-500"}`}>
                      <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p><p>{item.available ? "Available" : "Not Available"}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
