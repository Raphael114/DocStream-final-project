import dotenv from 'dotenv'
import connectDB from '../config/mongodb.js'
import doctorModel from '../models/doctorModel.js'

dotenv.config()

const seedDoctors = async () => {
  try {
    await connectDB()

    const doctors = [
      // Dermatologists
      {
        name: 'Adebayo Okoye',
        email: 'adebayo.okoye+derm@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Adebayo+Okoye',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Skilled dermatologist with a focus on practical treatments and patient education.',
        fees: 50,
        address: { line1: '12 Elm St', line2: 'Lagos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Kwame Mensah',
        email: 'kwame.mensah+derm@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Kwame+Mensah',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '7 Years',
        about: 'Experienced in clinical dermatology and cosmetic procedures.',
        fees: 60,
        address: { line1: '34 Oak Ave', line2: 'Accra' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Thabo Ndlovu',
        email: 'thabo.ndlovu+derm@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Thabo+Ndlovu',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Provides patient-centered dermatology care with evidence-based treatments.',
        fees: 45,
        address: { line1: '8 River Rd', line2: 'Johannesburg' },
        date: Date.now(),
        available: true
      },

      // Pediatricians
      {
        name: 'Fatoumata Diallo',
        email: 'fatoumata.diallo+peds@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Fatoumata+Diallo',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Caring pediatrician focused on childhood development and preventive care.',
        fees: 55,
        address: { line1: '9 Market St', line2: 'Bamako' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Amina Abubakar',
        email: 'amina.abubakar+peds@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Amina+Abubakar',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Provides gentle, family-focused pediatric care.',
        fees: 40,
        address: { line1: '22 Child Ln', line2: 'Kumasi' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Chinedu Nwosu',
        email: 'chinedu.nwosu+peds@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Chinedu+Nwosu',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Experienced in treating common childhood illnesses and immunizations.',
        fees: 50,
        address: { line1: '15 Clinic Way', line2: 'Enugu' },
        date: Date.now(),
        available: true
      },

      // Neurologists
      {
        name: 'Zuri Adebisi',
        email: 'zuri.adebisi+neuro@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Zuri+Adebisi',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '8 Years',
        about: 'Neurologist with emphasis on patient education and rehabilitation.',
        fees: 75,
        address: { line1: '3 Brain St', line2: 'Lagos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Malik Kone',
        email: 'malik.kone+neuro@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Malik+Kone',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '5 Years',
        about: 'Specialist in neurological disorders and chronic pain management.',
        fees: 70,
        address: { line1: '6 Neuro Blvd', line2: 'Bamako' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Nia Okafor',
        email: 'nia.okafor+neuro@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Nia+Okafor',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '6 Years',
        about: 'Focuses on evidence-based neurological care and diagnostics.',
        fees: 65,
        address: { line1: '11 Neuropark', line2: 'Abuja' },
        date: Date.now(),
        available: true
      },

      // Gastroenterologists
      {
        name: 'Kofi Boateng',
        email: 'kofi.boateng+gastro@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Kofi+Boateng',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '7 Years',
        about: 'Experienced in gastrointestinal health and endoscopic procedures.',
        fees: 70,
        address: { line1: '19 Digest Ave', line2: 'Accra' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Sade Adenike',
        email: 'sade.adenike+gastro@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Sade+Adenike',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Provides compassionate care for digestive disorders.',
        fees: 55,
        address: { line1: '2 Health St', line2: 'Lagos' },
        date: Date.now(),
        available: true
      },
      {
        name: 'Yara Maseko',
        email: 'yara.maseko+gastro@example.com',
        password: 'password123',
        image: 'https://via.placeholder.com/600x400.png?text=Yara+Maseko',
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Committed to high-quality digestive healthcare and prevention.',
        fees: 50,
        address: { line1: '7 Clinic Rd', line2: 'Cape Town' },
        date: Date.now(),
        available: true
      }
    ]

    for (const doc of doctors) {
      const exists = await doctorModel.findOne({ email: doc.email })
      if (exists) {
        console.log(`Skipping existing: ${doc.email}`)
        continue
      }
      await doctorModel.create(doc)
      console.log(`Inserted: ${doc.email}`)
    }

    console.log('Seeding complete')
    process.exit(0)
  } catch (err) {
    console.error('Seeding error', err)
    process.exit(1)
  }
}

seedDoctors()
