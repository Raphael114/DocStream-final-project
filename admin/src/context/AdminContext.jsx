/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useEffect } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken , setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors] = useState([])


    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/all-doctors", {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [])

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                getAllDoctors();
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value ={
        aToken,
        setAToken,backendUrl,
        doctors, changeAvailability

    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
}

export default AdminContextProvider;
