import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import connectDB from '../config/mongodb.js'
import doctorModel from '../models/doctorModel.js'

const doctors = [
  {
    name: 'Yusuf Danjuma',
    email: 'yusuf.danjuma@docstream.example',
    image: 'doc1.png',
    speciality: 'General physician',
    degree: 'MBBS',
    experience: '8 Years',
    about: 'Provides comprehensive primary care with a focus on preventive health and long-term wellbeing.',
    fees: 45,
    address: { line1: '14 Ahmadu Bello Way', line2: 'Lagos, Nigeria' }
  },
  {
    name: 'Ngozi Eze',
    email: 'ngozi.eze@docstream.example',
    image: 'doc2.png',
    speciality: 'Gynecologist',
    degree: 'MBBS, FWACS',
    experience: '10 Years',
    about: 'Offers compassionate women’s health services, routine screenings, and reproductive care.',
    fees: 65,
    address: { line1: '8 Independence Layout', line2: 'Enugu, Nigeria' }
  },
  {
    name: 'Tunde Balogun',
    email: 'tunde.balogun@docstream.example',
    image: 'doc3.png',
    speciality: 'Dermatologist',
    degree: 'MBBS, FMCP',
    experience: '7 Years',
    about: 'Treats common skin conditions and helps patients build practical, evidence-based skincare plans.',
    fees: 55,
    address: { line1: '21 Allen Avenue', line2: 'Ikeja, Lagos, Nigeria' }
  },
  {
    name: 'Aisha Bello',
    email: 'aisha.bello@docstream.example',
    image: 'doc4.png',
    speciality: 'Pediatricians',
    degree: 'MBBS, FWACP',
    experience: '6 Years',
    about: 'Provides child-focused care, growth monitoring, and guidance for families.',
    fees: 50,
    address: { line1: '5 Ibrahim Taiwo Road', line2: 'Kano, Nigeria' }
  },
  {
    name: 'Ifeoma Ude',
    email: 'ifeoma.ude@docstream.example',
    image: 'doc5.png',
    speciality: 'Neurologist',
    degree: 'MBBS, FMCP',
    experience: '9 Years',
    about: 'Supports patients with neurological conditions through careful assessment and ongoing care.',
    fees: 75,
    address: { line1: '3 Nnamdi Azikiwe Street', line2: 'Abuja, Nigeria' }
  },
  {
    name: 'Olumide Akinola',
    email: 'olumide.akinola@docstream.example',
    image: 'doc6.png',
    speciality: 'Gastroenterologist',
    degree: 'MBBS, FWACP',
    experience: '11 Years',
    about: 'Provides diagnostic and ongoing care for digestive and gastrointestinal conditions.',
    fees: 70,
    address: { line1: '17 Ring Road', line2: 'Ibadan, Nigeria' }
  },
  {
    name: 'Chiamaka Okeke',
    email: 'chiamaka.okeke@docstream.example',
    image: 'doc7.png',
    speciality: 'Gynecologist',
    degree: 'MBBS, FWACS',
    experience: '5 Years',
    about: 'Focuses on respectful, patient-centered gynecological and preventive care.',
    fees: 60,
    address: { line1: '9 Aba Road', line2: 'Port Harcourt, Nigeria' }
  },
  {
    name: 'Babatunde Adeyemi',
    email: 'babatunde.adeyemi@docstream.example',
    image: 'doc8.png',
    speciality: 'Pediatricians',
    degree: 'MBBS, FWACP',
    experience: '4 Years',
    about: 'Helps children and families with routine care, preventive visits, and common illnesses.',
    fees: 48,
    address: { line1: '6 Obafemi Awolowo Way', line2: 'Ikeja, Lagos, Nigeria' }
  }
]

async function seedNigerianDoctors() {
  try {
    await connectDB()
    const existingDoctors = await doctorModel.find({}).select('name email').lean()
    const existingByEmail = new Map(existingDoctors.map(doctor => [doctor.email.toLowerCase(), doctor]))
    const existingNames = new Set(existingDoctors.map(doctor => doctor.name.trim().toLowerCase()))
    let inserted = 0

    for (const doctor of doctors) {
      const existingDoctor = existingByEmail.get(doctor.email.toLowerCase())
      if (existingDoctor) {
        if (existingDoctor.image !== doctor.image) {
          await doctorModel.updateOne({ _id: existingDoctor._id }, { $set: { image: doctor.image } })
          console.log(`Updated portrait: ${doctor.name}`)
        } else {
          console.log(`Skipping existing doctor: ${doctor.name}`)
        }
        continue
      }
      if (existingNames.has(doctor.name.toLowerCase())) {
        console.log(`Skipping existing doctor: ${doctor.name}`)
        continue
      }

      const password = await bcrypt.hash(randomBytes(32).toString('hex'), 10)
      await doctorModel.create({ ...doctor, password, date: Date.now(), available: true })
      existingByEmail.set(doctor.email.toLowerCase(), doctor)
      existingNames.add(doctor.name.toLowerCase())
      inserted += 1
      console.log(`Inserted: ${doctor.name}`)
    }

    console.log(`Seeding complete. Added ${inserted} Nigerian doctors.`)
  } catch (error) {
    console.error('Nigerian doctor seeding failed:', error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedNigerianDoctors()
