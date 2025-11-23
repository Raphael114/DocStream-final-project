import dotenv from 'dotenv'
import connectDB from '../config/mongodb.js'
import jobModel from '../models/jobModel.js'

dotenv.config()

const seedJobs = async () => {
  try {
    await connectDB()

    const jobs = [
      // Medical
      { title: 'General Physician', team: 'Clinical', location: 'Enugu, Nigeria', type: 'Full-time', description: 'Provide general medical care and consultations.' },
      { title: 'Pediatric Nurse', team: 'Nursing', location: 'Lagos, Nigeria', type: 'Full-time', description: 'Support paediatricians and care for children patients.' },
      { title: 'Dermatologist', team: 'Clinical', location: 'Accra, Ghana', type: 'Part-time', description: 'Skin specialist for clinical and cosmetic cases.' },
      { title: 'Neurologist', team: 'Clinical', location: 'Abuja, Nigeria', type: 'Full-time', description: 'Diagnosis and management of neurological disorders.' },
      { title: 'Gastroenterologist', team: 'Clinical', location: 'Cape Town, South Africa', type: 'Full-time', description: 'Care for patients with digestive system disorders.' },
      { title: 'Radiologist', team: 'Imaging', location: 'Remote', type: 'Contract', description: 'Interpret imaging studies and support diagnostics.' },
      { title: 'Clinical Pharmacist', team: 'Pharmacy', location: 'Kumasi, Ghana', type: 'Full-time', description: 'Medication management and patient counselling.' },
      // Allied & Other medical
      { title: 'Physiotherapist', team: 'Rehab', location: 'Enugu, Nigeria', type: 'Part-time', description: 'Rehabilitation services and physical therapy.' },
      { title: 'Laboratory Scientist', team: 'Laboratory', location: 'Lagos, Nigeria', type: 'Full-time', description: 'Perform and report clinical laboratory tests.' },

      // Non-medical / Tech / Business
      { title: 'Frontend Engineer', team: 'Engineering', location: 'Remote (Africa)', type: 'Full-time', description: 'Build user interfaces using React and modern tooling.' },
      { title: 'Backend Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Build backend APIs and services with Node.js and MongoDB.' },
      { title: 'Data Scientist', team: 'Data', location: 'Accra, Ghana', type: 'Full-time', description: 'Work on analytics, ML models and healthcare insights.' },
      { title: 'Product Manager', team: 'Product', location: 'Enugu, Nigeria', type: 'Full-time', description: 'Drive product roadmap and cross-functional delivery.' },
      { title: 'UI/UX Designer', team: 'Design', location: 'Remote', type: 'Contract', description: 'Design intuitive and accessible user experiences.' },
      { title: 'Marketing Specialist', team: 'Marketing', location: 'Lagos, Nigeria', type: 'Full-time', description: 'Lead growth campaigns and communications.' },
      { title: 'Customer Support Representative', team: 'Support', location: 'Remote', type: 'Full-time', description: 'Provide excellent support for users and patients.' },
      { title: 'HR Generalist', team: 'People', location: 'Enugu, Nigeria', type: 'Full-time', description: 'Support recruitment, onboarding and employee relations.' },
      { title: 'Operations Manager', team: 'Operations', location: 'Accra, Ghana', type: 'Full-time', description: 'Oversee day-to-day operations and logistics.' },

      // Entry level and internships
      { title: 'Software Engineering Intern', team: 'Engineering', location: 'Remote', type: 'Internship', description: 'Hands-on experience building features and learning.' },
      { title: 'Medical Records Clerk', team: 'Records', location: 'Enugu, Nigeria', type: 'Full-time', description: 'Manage patient records and administrative tasks.' }
    ]

    for (const j of jobs) {
      // avoid duplicates by title + location
      const exists = await jobModel.findOne({ title: j.title, location: j.location })
      if (exists) {
        console.log(`Skipping existing job: ${j.title} @ ${j.location}`)
        continue
      }
      await jobModel.create(j)
      console.log(`Inserted job: ${j.title} @ ${j.location}`)
    }

    console.log('Job seeding complete')
    process.exit(0)
  } catch (err) {
    console.error('Seeding jobs error', err)
    process.exit(1)
  }
}

seedJobs()
