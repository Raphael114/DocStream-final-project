import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext.js";

const AppContextProvider = (props) => {
    const currencySymbol = "$";
    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(
        localStorage.getItem("token")
            ? localStorage.getItem("token")
            : false
    );
    const [userData, setUserData] = useState(false);

    // Fetch all doctors
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/doctor/list"
            );

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Fetch user profile
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/user/get-profile",
                { headers: { token } }
            );

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        setUserData,
        userData,
        loadUserProfileData,
    };

    // Fetch doctors two seconds after the app mounts
    useEffect(() => {
        const timeoutId = setTimeout(getDoctorsData, 2000);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Run when token changes
    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;