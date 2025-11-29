import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { doctors as sampleDoctors } from '../assets/assets'

const Doctors = () => {

  const navigate = useNavigate()
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const africanNames = [
    'Adebayo Okoye', 'Kwame Mensah', 'Thabo Ndlovu', 'Fatoumata Diallo', 'Amina Abubakar', 'Chinedu Nwosu', 'Zuri Adebisi', 'Malik Kone', 'Nia Okafor', 'Kofi Boateng', 'Sade Adenike', 'Yara Maseko'
  ]

  const applyFilter = ()=> {
    if (speciality){
      let arr = doctors.filter(doc => doc.speciality === speciality)

      // Reduce gynecologists by 3 when viewing Gynecologist
      if (speciality === 'Gynecologist') {
        if (arr.length > 3) arr = arr.slice(0, Math.max(0, arr.length - 3))
        else arr = []
      }

      // Ensure these sections have at least 3 doctors by adding mock entries if needed
      const ensureList = ['Pediatricians', 'Neurologist', 'Gastroenterologist']
      if (ensureList.includes(speciality)) {
        const minCount = 3
        const imgs = sampleDoctors ? sampleDoctors.map(d => d.image).filter(Boolean) : []
        let need = Math.max(0, minCount - arr.length)
        for (let i = 0; i < need; i++) {
          // pick a template doc to copy from (prefer same speciality if available, else any)
          const template = arr[i % (arr.length || 1)] || doctors.find(d => d.speciality === speciality) || doctors[0] || {}
          const storedMap = JSON.parse(localStorage.getItem('topDoctorsImageMap_v1') || '{}')
          const image = (template && template._id && storedMap && storedMap[template._id])
            ? storedMap[template._id]
            : (imgs[i % imgs.length] || template.image)

          const mock = {
            _id: `mock_${speciality}_${i}`,
            name: africanNames[i % africanNames.length],
            image: image || '',
            speciality: speciality,
            degree: template.degree || 'MBBS',
            experience: template.experience || '1 Year',
            about: template.about || '',
            fees: template.fees || 40,
            address: template.address || { line1: '', line2: '' },
            available: true
          }
          arr.push(mock)
        }
      }

      // For target specialities, replace displayed names with human African names (stable ordering)
      const targetSpecialities = ['Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']
      if (targetSpecialities.includes(speciality)) {
        arr = arr.map((doc, idx) => ({ ...doc, name: africanNames[idx % africanNames.length] }))
      }

      setFilterDoc(arr)

    }else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [speciality, doctors])

  // ensure we have a persistent shuffled image mapping (shared key with TopDoctors)
  const [imageMap, setImageMap] = useState({})

  useEffect(() => {
    const key = 'topDoctorsImageMap_v1'
    const imgs = sampleDoctors.map(d => d.image).filter(Boolean)
    if (!imgs.length || !doctors || !doctors.length) return

    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null')

      const ids = doctors.map(d => d._id)
      const hasAll = stored && typeof stored === 'object' && ids.every(id => stored[id])
      if (hasAll) {
        setImageMap(stored)
        return
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
      while (pool.length < doctors.length) pool = pool.concat(shuffle(imgs))

      const map = {}
      doctors.forEach((doc, idx) => {
        map[doc._id] = pool[idx]
      })

      setImageMap(map)
      localStorage.setItem(key, JSON.stringify(map))
    } catch (e) {
      // ignore
    }
  }, [doctors])

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
                  <img className='bg-blue-50' src={imageMap[item._id] || item.image} alt="" />
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
