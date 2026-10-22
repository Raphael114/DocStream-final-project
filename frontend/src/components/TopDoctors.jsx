
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.js'
import DoctorImage from './DoctorImage'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors, backendUrl } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium animate-enter'>
        Top Doctors to Book
      </h1>

      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Grid: 5 doctors per row on large screens */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 px-3 sm:px-0'>
        {doctors.slice(0, 9).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            key={item._id || index}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 animate-fade'
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <DoctorImage
              className='bg-blue-50 w-full h-40 object-cover'
              image={item.image}
              backendUrl={backendUrl}
              index={index}
              name={item.name}
            />

            <div className='p-4'>
              <div
                className={`flex items-center gap-2 text-sm ${
                  item.available ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                <p
                  className={`w-2 h-2 rounded-full ${
                    item.available ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />

                <p>
                  {item.available ? 'Available' : 'Not Available'}
                </p>
              </div>

              <p className='text-gray-900 text-lg font-medium'>
                {item.name}
              </p>

              <p className='text-gray-600 text-sm'>
                {item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate('/doctors')
          scrollTo(0, 0)
        }}
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
      >
        More
      </button>
    </div>
  )
}

export default TopDoctors
