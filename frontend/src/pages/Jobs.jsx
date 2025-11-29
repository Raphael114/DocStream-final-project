import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const jobsData = [
  {
    id: 'job1',
    title: 'Frontend Developer',
    team: 'Engineering',
    location: 'Remote (Africa)',
    type: 'Full-time',
    description: 'Build and maintain the DocStream web application using React and modern frontend tooling.'
  },
  {
    id: 'job2',
    title: 'Product Designer',
    team: 'Design',
    location: 'Enugu, Nigeria',
    type: 'Full-time',
    description: 'Design delightful user experiences for our healthcare platform.'
  },
  {
    id: 'job3',
    title: 'Backend Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Contract',
    description: 'Work on backend services, APIs, and integrations (Node.js, MongoDB).' 
  }
]

const Jobs = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const { backendUrl } = useContext(AppContext)
  const [jobs, setJobs] = useState([])
  const [job, setJob] = useState(null)
  const [appForm, setAppForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [openApplyId, setOpenApplyId] = useState(null)
  const [cardForm, setCardForm] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/list`)
        if (data.success) setJobs(data.jobs)
      } catch (e) {}
    }
    fetchJobs()
  }, [backendUrl])

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const { data } = await axios.get(`${backendUrl}/api/jobs/${jobId}`)
          if (data.success) setJob(data.job)
        } catch (e) {}
      }
      fetchJob()
    }
  }, [backendUrl, jobId])

    if (jobId) {
    if (!job) return <div className='my-10'>Loading...</div>
    const onChange = (e) => setAppForm({ ...appForm, [e.target.name]: e.target.value })
    const submit = async () => {
      setLoading(true)
      try {
        await axios.post(`${backendUrl}/api/jobs/${jobId}/apply`, appForm)
        alert('Application submitted')
        setAppForm({ name: '', email: '', message: '' })
      } catch (e) {
        alert('Could not submit application')
      } finally { setLoading(false) }
    }

    return (
      <div className='my-10 animate-enter'>
        <button onClick={() => navigate('/jobs')} className='text-sm text-blue-600 mb-4'>&larr; Back to openings</button>
        <h1 className='text-2xl font-semibold mb-2'>{job.title}</h1>
        <p className='text-sm text-gray-500 mb-4'>{job.team} • {job.location} • {job.type}</p>
        <p className='text-gray-700 mb-6'>{job.description}</p>

        <div className='border p-4 rounded'>
          <h3 className='font-medium mb-2'>Apply for this role</h3>
          <input name='name' value={appForm.name} onChange={onChange} placeholder='Your name' className='w-full mb-2 p-2 border rounded' />
          <input name='email' value={appForm.email} onChange={onChange} placeholder='Email' className='w-full mb-2 p-2 border rounded' />
          <textarea name='message' value={appForm.message} onChange={onChange} placeholder='Message (optional)' className='w-full mb-2 p-2 border rounded' />
          <button onClick={submit} disabled={loading} className='bg-blue-600 text-white px-4 py-2 rounded'>{loading ? 'Sending...' : 'Submit Application'}</button>
        </div>
      </div>
    )
  }

  return (
    <div className='my-10'>
      <div className='flex flex-col md:flex-row items-center gap-6 mb-8'>
        <div className='flex-1 animate-enter'>
          <h1 className='text-3xl md:text-4xl font-semibold'>Open Positions</h1>
          <p className='text-gray-600 mt-2'>Explore current openings at DocStream. Click a role to view details or apply.</p>
        </div>
        <div className='hidden md:block md:w-[380px] lg:w-[520px]'>
          <img src={assets.careers_graphic} alt='careers' className='w-full rounded-lg shadow' />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {jobs.map((job, ndx) => (
          <div key={job._id} className='border rounded-lg p-4 hover:shadow-md transition animate-fade' style={{ animationDelay: `${ndx * 80}ms` }}>
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-lg font-medium'>{job.title}</h2>
                <p className='text-sm text-gray-500'>{job.team} • {job.location} • {job.type}</p>
              </div>
              <div className='flex gap-2'>
                <button onClick={() => navigate(`/jobs/${job._id}`)} className='text-sm bg-blue-50 px-3 py-2 rounded'>View</button>
                <button onClick={() => { setOpenApplyId(openApplyId === job._id ? null : job._id); setCardForm({ name: '', email: '', message: '' }) }} className='text-sm bg-green-50 px-3 py-2 rounded'>Apply</button>
              </div>
            </div>
            <p className='mt-3 text-sm text-gray-600'>{job.description}</p>

            {openApplyId === job._id && (
              <div className='mt-4 border-t pt-4'>
                <h4 className='font-medium mb-2'>Quick Apply</h4>
                <input name='name' value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} placeholder='Your name' className='w-full mb-2 p-2 border rounded' />
                <input name='email' value={cardForm.email} onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })} placeholder='Email' className='w-full mb-2 p-2 border rounded' />
                <textarea name='message' value={cardForm.message} onChange={(e) => setCardForm({ ...cardForm, message: e.target.value })} placeholder='Message (optional)' className='w-full mb-2 p-2 border rounded' />
                <div className='flex gap-2 animate-enter' style={{ animationDelay: '120ms' }}>
                  <button onClick={async () => {
                    try {
                      await axios.post(`${backendUrl}/api/jobs/${job._id}/apply`, cardForm)
                      alert('Application submitted')
                      setOpenApplyId(null)
                    } catch (e) {
                      alert('Could not submit application')
                    }
                  }} className='bg-green-600 text-white px-4 py-2 rounded'>Submit</button>
                  <button onClick={() => setOpenApplyId(null)} className='px-4 py-2 border rounded'>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Jobs
