import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getDoctorImage } from '../assets/assets';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const doctor = doctors.find(doc => doc._id === docId);
    setDocInfo(doctor || null);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;

    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(currentDate.getHours() < 10 ? 10 : currentDate.getHours() + 1);
        currentDate.setMinutes(currentDate.getMinutes() < 30 ? 30 : 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let daySlots = [];

      while (currentDate <= endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;

        const isBooked = docInfo?.slots_booked?.[slotDate]?.includes(slotTime);

        if (!isBooked) {
          daySlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, daySlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      navigate('/login');
      return;
    }

    if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
      toast.error("Select a valid day");
      return;
    }

    if (!slotTime) {
      toast.error("Select a time slot");
      return;
    }

    try {
      const dateObj = docSlots[slotIndex][0].datetime;

      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();

      const slotDate = `${day}_${month}_${year}`;
      const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime, userId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-blue-400 w-full sm:max-w-72 rounded-lg" src={getDoctorImage(docInfo.image)} alt={docInfo.name} />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <div className="flex flex-col gap-10">
              <p className="text-2xl font-semibold flex items-center gap-2">
                {docInfo.name}
                <img className="w-5" src={assets.verified_icon} alt="Verified" />
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <p>{docInfo.degree} - {docInfo.speciality}</p>
                <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
              </div>

              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                  About <img src={assets.info_icon} alt="info" />
                </p>

                <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
              </div>

              <p className="text-gray-500 font-medium">
                Appointment Fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Slot Section */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>

          {/* Day Selector */}
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((daySlots, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? "bg-blue-400 text-white" : "border border-gray-200"
                }`}
              >
                {daySlots.length ? (
                  <>
                    <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                    <p>{daySlots[0].datetime.getDate()}</p>
                  </>
                ) : (
                  <p>No Slots</p>
                )}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots[slotIndex]?.map((slot, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(slot.time)}
                className={`text-sm px-5 py-2 rounded-full cursor-pointer ${
                  slot.time === slotTime
                    ? "bg-blue-400 text-white"
                    : "text-gray-400 border border-gray-300"
                }`}
              >
                {slot.time.toLowerCase()}
              </p>
            ))}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-blue-400 text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;