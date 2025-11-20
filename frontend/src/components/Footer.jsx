import React from 'react'
import { assets } from '../assets/assets'
import { FaLinkedin } from "react-icons/fa"
import { FaGithub } from "react-icons/fa"


const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/*left section*/}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>DocStream connects you with trusted healthcare professionals anytime, anywhere. Book appointments, access medical expertise, and manage your health—all in one seamless, secure platform. Your well-being is our priority, and we’re committed to making quality care accessible and convenient for everyone.</p>
                </div>
                {/*center section*/}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                {/*right section*/}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+2347037571701</li>
                        <li>raphaelodinaka13@gmail.com</li>
                        <li><a href="https://www.linkedin.com/in/nwamuta-raphael-a40242182/"><FaLinkedin /> LinkedIn</a></li>
                        <li><a href=""><FaGithub /> Github</a></li>
                    </ul>
                </div>
            </div>

            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2025@ DocStream -All Right Reserved</p>
            </div>
        </div>
    )
}

export default Footer
