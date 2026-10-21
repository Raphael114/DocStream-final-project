import dotenv from 'dotenv'
import connectDB from '../config/mongodb.js'
import doctorModel from '../models/doctorModel.js'

dotenv.config()

const seedDoctors = async () => {
  try {
    await connectDB()

    const doctors = [
      {
        name: 'Adebayo Okoye',
        email: 'adebayo.okoye+derm@example.com',
        password: 'password123',
        image: '/doctor-images/doc1.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Dermatologist focused on evidence-based skin care and patient education.',
        fees: 50,
        address: { line1: '12 Allen Avenue', line2: 'Ikeja, Lagos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Folake Adeyemi',
        email: 'kwame.mensah+derm@example.com',
        password: 'password123',
        image: '/doctor-images/doc2.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '7 Years',
        about: 'Experienced in clinical dermatology and compassionate skin care.',
        fees: 60,
        address: { line1: '34 Admiralty Way', line2: 'Lekki, Lagos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Chukwudi Nwankwo',
        email: 'thabo.ndlovu+derm@example.com',
        password: 'password123',
        image: '/doctor-images/doc3.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Provides patient-centered dermatology and preventive skin care.',
        fees: 45,
        address: { line1: '8 New Haven Road', line2: 'Enugu' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Emeka Nwosu',
        email: 'fatoumata.diallo+peds@example.com',
        password: 'password123',
        image: '/doctor-images/doc4.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Pediatrician focused on childhood development and preventive care.',
        fees: 55,
        address: { line1: '9 Ahmadu Bello Way', line2: 'Kaduna' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Ifeoma Eze',
        email: 'amina.abubakar+peds@example.com',
        password: 'password123',
        image: '/doctor-images/doc5.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Provides gentle, family-focused pediatric care and guidance.',
        fees: 40,
        address: { line1: '22 Ogui Road', line2: 'Enugu' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Tunde Akinola',
        email: 'chinedu.nwosu+peds@example.com',
        password: 'password123',
        image: '/doctor-images/doc6.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Experienced in childhood illnesses, immunizations, and wellness.',
        fees: 50,
        address: { line1: '15 Ring Road', line2: 'Ibadan' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Adewale Okafor',
        email: 'zuri.adebisi+neuro@example.com',
        password: 'password123',
        image: '/doctor-images/doc7.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '8 Years',
        about: 'Neurologist with an emphasis on patient education and rehabilitation.',
        fees: 75,
        address: { line1: '3 Independence Avenue', line2: 'Abuja' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Bashir Musa',
        email: 'malik.kone+neuro@example.com',
        password: 'password123',
        image: '/doctor-images/doc8.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Specialist in neurological disorders and chronic pain management.',
        fees: 70,
        address: { line1: '6 Zaria Road', line2: 'Kano' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Adaeze Osagie',
        email: 'nia.okafor+neuro@example.com',
        password: 'password123',
        image: '/doctor-images/doc9.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Focuses on evidence-based neurological care and diagnostics.',
        fees: 65,
        address: { line1: '11 Sapele Road', line2: 'Benin City' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Seyi Oladipo',
        email: 'kofi.boateng+gastro@example.com',
        password: 'password123',
        image: '/doctor-images/doc10.png',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '7 Years',
        about: 'Experienced in gastrointestinal health and endoscopic procedures.',
        fees: 70,
        address: { line1: '19 Awolowo Road', line2: 'Ikoyi, Lagos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Hadiza Ibrahim',
        email: 'sade.adenike+gastro@example.com',
        password: 'password123',
        image: '/doctor-images/doc11.png',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Provides compassionate care for digestive disorders.',
        fees: 55,
        address: { line1: '2 Tafawa Balewa Road', line2: 'Bauchi' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Chinedu Anya',
        email: 'yara.maseko+gastro@example.com',
        password: 'password123',
        image: '/doctor-images/doc12.png',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Committed to high-quality digestive healthcare and prevention.',
        fees: 50,
        address: { line1: '7 Wetheral Road', line2: 'Owerri' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Amaka Udeh',
        email: 'amaka.udeh+general@example.com',
        password: 'password123',
        image: '/doctor-images/doc13.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'General physician providing thorough primary and preventive care.',
        fees: 50,
        address: { line1: '13 Gimbiya Street', line2: 'Garki, Abuja' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Yakubu Danjuma',
        email: 'yakubu.danjuma+gyne@example.com',
        password: 'password123',
        image: '/doctor-images/doc14.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '9 Years',
        about: 'Supports women with respectful, evidence-based reproductive healthcare.',
        fees: 65,
        address: { line1: '14 Lamido Crescent', line2: 'Jos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Nneka Ekwueme',
        email: 'nneka.ekwueme+general@example.com',
        password: 'password123',
        image: '/doctor-images/doc15.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Provides accessible primary care with a focus on long-term wellness.',
        fees: 55,
        address: { line1: '15 Aba Road', line2: 'Port Harcourt' },
        date: Date.now(),
        available: true
      }
    ]

    for (const doc of doctors) {
      await doctorModel.updateOne({ email: doc.email }, { $set: doc }, { upsert: true })
      console.log(`Seeded: ${doc.email}`)
    }

    const seededCount = await doctorModel.countDocuments({
      email: { $in: doctors.map(doc => doc.email) }
    })
    if (seededCount !== doctors.length) {
      throw new Error(`Expected ${doctors.length} seeded doctors, found ${seededCount}`)
    }

    console.log('Seeding complete')
    process.exit(0)
  } catch (err) {
    console.error('Seeding error', err)
    process.exit(1)
  }
}

seedDoctors()
