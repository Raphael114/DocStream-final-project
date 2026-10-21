import doctorModel from "../models/doctorModel.js";

const doctorsByImage = [
    { email: 'adebayo.okoye+derm@example.com', name: 'Adebayo Okoye' },
    { email: 'kwame.mensah+derm@example.com', name: 'Folake Adeyemi' },
    { email: 'thabo.ndlovu+derm@example.com', name: 'Chukwudi Nwankwo' },
    { email: 'fatoumata.diallo+peds@example.com', name: 'Emeka Nwosu' },
    { email: 'amina.abubakar+peds@example.com', name: 'Ifeoma Eze' },
    { email: 'chinedu.nwosu+peds@example.com', name: 'Tunde Akinola' },
    { email: 'zuri.adebisi+neuro@example.com', name: 'Adewale Okafor' },
    { email: 'malik.kone+neuro@example.com', name: 'Bashir Musa' },
    { email: 'nia.okafor+neuro@example.com', name: 'Adaeze Osagie' },
    { email: 'kofi.boateng+gastro@example.com', name: 'Seyi Oladipo' },
    { email: 'sade.adenike+gastro@example.com', name: 'Hadiza Ibrahim' },
    { email: 'yara.maseko+gastro@example.com', name: 'Chinedu Anya' },
    { email: 'amaka.udeh+general@example.com', name: 'Amaka Udeh' },
    { email: 'yakubu.danjuma+gyne@example.com', name: 'Yakubu Danjuma' },
    { email: 'nneka.ekwueme+general@example.com', name: 'Nneka Ekwueme' }
]

 const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: "Availability change" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req,res)=> {
    try {
<<<<<<< HEAD
        const records = await doctorModel.find({
            email: { $in: doctorsByImage.map(doctor => doctor.email) }
        }).select('-password')
        const recordsByEmail = new Map(records.map(doctor => [doctor.email, doctor]))
        const doctors = doctorsByImage.flatMap((doctor, index) => {
            const record = recordsByEmail.get(doctor.email)
            if (!record) return []

            const doctorData = record.toObject()
            delete doctorData.email
            return [{
                ...doctorData,
                name: doctor.name,
                image: `/doctor-images/doc${index + 1}.png`
            }]
        })

        if (doctors.length !== doctorsByImage.length) {
            return res.status(503).json({
                success: false,
                message: 'The doctor catalog is incomplete. Run npm run seed in the backend directory.'
            })
        }
=======
        const doctors = await doctorModel.find({}).sort({ date: -1 }).select(['-password','-email'])
>>>>>>> 381365d4409df923f3aa6668d430cc3babea059f

        res.json({success:true,doctors})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export {changeAvailability,doctorList}