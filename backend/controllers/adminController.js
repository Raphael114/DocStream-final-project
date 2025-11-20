import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Checking for all data to add for doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        // Validating email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        // Validating password
        if (password.length < 8) {
            return res.status(400).json({ message: "Please enter a strong password" });
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Uploading image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

   
        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//api for admin login

const loginAdmin = async (req, res) => {
    try{
        const { email, password } = req.body

       if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.status(200).json({ success: true,message: "Login successful", token });
        } else {
            return res.status(400).json({success:false, message: "Invalid email or password" });
        }

       

    }catch(error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }
}

// api to get all doctors list for admin panel

const allDoctors = async (req, res) =>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
        
    } catch (error) {
         console.log(error);
        res.json({ success: false, message: error.message });
        
    }
}

export { addDoctor, loginAdmin,allDoctors };
