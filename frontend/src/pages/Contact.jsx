import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm relative'>
        {/* decorative graphic */}
        <img src={assets.hero_medical} alt='decor' className='hidden lg:block absolute -right-8 -top-16 w-[420px] opacity-70 pointer-events-none select-none' />
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6 animate-enter'>
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>19 Sunafric Satellite Avenue <br /> Trans Ekulu, Enugu State, Nigeria.</p>
          <p className='text-gray-500'>Tel: +2347037571701 <br /> Email: raphaelodinaka13@gmail.com</p>
          <p className='text-gray-600 font-semibold text-lg'>Careers at DOCSTREAM</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button onClick={() => navigate('/jobs')} className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 animate-fade' style={{animationDelay:'80ms'}}>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
