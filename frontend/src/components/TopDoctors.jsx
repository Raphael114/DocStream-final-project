import React, { useContext, useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { doctors as sampleDoctors } from '../assets/assets'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext);

  // image mapping state persisted to localStorage so assignments survive reloads
  const [imageMap, setImageMap] = useState({})

  useEffect(() => {
    const key = 'topDoctorsImageMap_v1'
    const imgs = sampleDoctors.map(d => d.image).filter(Boolean)
    if (!imgs.length || !doctors || !doctors.length) return

    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null')
      // build mapping for all doctors so it can be reused by other pages
      const n = doctors.length

      // check if stored mapping exists and covers the current doctor ids
      if (stored && typeof stored === 'object') {
        const ids = doctors.slice(0, n).map(d => d._id)
        const hasAll = ids.every(id => stored[id])
        if (hasAll) {
          setImageMap(stored)
          return
        }
      }

      // Fisher-Yates shuffle
      const shuffle = (arr) => {
        const a = arr.slice()
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          const tmp = a[i]
          a[i] = a[j]
          a[j] = tmp
        }
        return a
      }

      let pool = shuffle(imgs)
      while (pool.length < n) pool = pool.concat(shuffle(imgs))

      const map = {}
      doctors.forEach((doc, idx) => {
        map[doc._id] = pool[idx]
      })

      setImageMap(map)
      localStorage.setItem(key, JSON.stringify(map))
    } catch (e) {
      // fallback: do nothing (imageMap stays empty)
      // console.warn('Could not initialize image map', e)
    }
  }, [doctors])

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>

      {/* Updated Grid: 5 doctors per row on lg+ screens */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-5 px-3 sm:px-0'>
        {doctors.slice(0, 10).map((item, index) => {
          return (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              key={index}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300'
            >
              <img className='bg-blue-50 w-full h-40 object-cover' src={imageMap[item._id] || item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm ${item.available ? "text-green-500" : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => { navigate("/doctors"); scrollTo(0, 0) }}
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
      >
        More
      </button>
    </div>
  )
}

export default TopDoctors
