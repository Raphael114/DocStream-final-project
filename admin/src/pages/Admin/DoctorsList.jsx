import React, { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, changeAvailability } = useContext(AdminContext)
  console.log(doctors);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>ALL DOCTORS</h1>

      {/* Grid layout for equal alignment */}
      <div className='grid grid-cols-5 gap-6 pt-5'>
        {doctors.map((item, index) => {
          return (
            <div
              className='border border-indigo-200 rounded-xl w-56 overflow-hidden cursor-pointer'
              key={index}
            >
              {/* Image zoom on hover */}
              <img
                className='w-full h-60 object-cover transition-transform duration-500 hover:scale-105'
                src={item.image}
                alt={item.name}
              />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                  />
                  <p>Available</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DoctorsList
