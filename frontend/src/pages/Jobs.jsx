import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext.js'

const jobCategories = ['Medical & Healthcare', 'Technology', 'General']

const Jobs = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const { backendUrl } = useContext(AppContext)
  const [jobs, setJobs] = useState([])
  const [job, setJob] = useState(null)
  const [jobError, setJobError] = useState('')
  const [appForm, setAppForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [liveLoading, setLiveLoading] = useState(true)
  const [liveError, setLiveError] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')

  const fetchLiveJobs = useCallback(async () => {
    setLiveLoading(true)
    setLiveError('')
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/live`)
      if (!data.success || !Array.isArray(data.jobs)) {
        throw new Error(data.message || 'The live job feed returned an invalid response.')
      }
      setJobs(data.jobs)
      setUpdatedAt(data.updatedAt)
    } catch (error) {
      setLiveError(error.response?.data?.message || error.message || 'Could not load live jobs.')
    } finally {
      setLiveLoading(false)
    }
  }, [backendUrl])

  useEffect(() => {
    fetchLiveJobs()
  }, [fetchLiveJobs])

  useEffect(() => {
    if (!jobId) return

    const fetchJob = async () => {
      setJob(null)
      setJobError('')
      try {
        const { data } = await axios.get(`${backendUrl}/api/jobs/${jobId}`)
        if (data.success) {
          setJob(data.job)
        } else {
          setJobError(data.message || 'Could not load this job.')
        }
      } catch (error) {
        setJobError(error.response?.data?.message || error.message || 'Could not load this job.')
      }
    }

    fetchJob()
  }, [backendUrl, jobId])

  if (jobId) {
    if (jobError) return <div className='my-10 text-red-600'>{jobError}</div>
    if (!job) return <div className='my-10'>Loading...</div>

    const onChange = (event) => setAppForm({ ...appForm, [event.target.name]: event.target.value })
    const submit = async () => {
      setLoading(true)
      try {
        await axios.post(`${backendUrl}/api/jobs/${jobId}/apply`, appForm)
        alert('Application submitted')
        setAppForm({ name: '', email: '', message: '' })
      } catch (error) {
        alert(error.response?.data?.message || 'Could not submit application')
      } finally {
        setLoading(false)
      }
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
          <input name='email' type='email' value={appForm.email} onChange={onChange} placeholder='Email' className='w-full mb-2 p-2 border rounded' />
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
          <h1 className='text-3xl md:text-4xl font-semibold'>Live Job Openings</h1>
          <p className='text-gray-600 mt-2'>Browse current medical, technology, and general opportunities from employers around the world.</p>
          <p className='text-sm text-gray-500 mt-2'>
            Listings provided by <a href='https://jobicy.com' target='_blank' rel='noreferrer' className='text-blue-600 underline'>Jobicy</a>
            {updatedAt && ` · Updated ${new Date(updatedAt).toLocaleString()}`}
          </p>
        </div>
        <div className='hidden md:block md:w-[380px] lg:w-[520px]'>
          <img src={assets.careers_graphic} alt='Careers' className='w-full rounded-lg shadow' />
        </div>
      </div>

      {liveError && (
        <div role='alert' className='mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-700'>
          <p>{liveError}</p>
          <button onClick={fetchLiveJobs} className='mt-2 underline'>Try again</button>
        </div>
      )}

      {liveLoading && <p className='my-8 text-gray-600'>Loading current job openings...</p>}

      {!liveLoading && !liveError && jobs.length === 0 && (
        <p className='my-8 text-gray-600'>No current listings were returned. Please check back soon.</p>
      )}

      {!liveLoading && !liveError && jobCategories.map((category) => {
        const categoryJobs = jobs.filter((item) => item.category === category)
        return (
          <section key={category} className='mb-10'>
            <h2 className='mb-4 text-2xl font-semibold'>{category} Jobs</h2>
            {categoryJobs.length === 0 ? (
              <p className='text-sm text-gray-500'>No current openings in this category.</p>
            ) : (
              <div className='grid gap-6 md:grid-cols-2'>
                {categoryJobs.map((item) => (
                  <article key={item.id} className='flex flex-col border rounded-lg p-4 hover:shadow-md transition'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-medium'>{item.title}</h3>
                      <p className='text-sm text-gray-700'>{item.company}</p>
                      <p className='mt-1 text-sm text-gray-500'>
                        {[item.industries.join(', '), item.location, item.type].filter(Boolean).join(' • ')}
                      </p>
                      {item.publishedAt && (
                        <p className='mt-1 text-xs text-gray-500'>
                          Posted {new Date(item.publishedAt).toLocaleDateString()}
                        </p>
                      )}
                      {item.salary && <p className='mt-2 text-sm text-gray-700'>{item.salary}</p>}
                      {item.description && <p className='mt-3 text-sm text-gray-600'>{item.description}</p>}
                    </div>
                    <a
                      href={item.applicationUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='mt-4 inline-flex w-fit items-center rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700'
                    >
                      View job &amp; apply
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

export default Jobs
