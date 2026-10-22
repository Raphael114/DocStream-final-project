import React from 'react'
import { doctorImages, getDoctorImage, getDoctorImageUrl } from '../assets/assets'

const DoctorImage = ({ image, backendUrl, index = 0, name, className = '' }) => {
  const fallbackImage = getDoctorImage(Object.keys(doctorImages)[index % Object.keys(doctorImages).length])
  const imageUrl = getDoctorImageUrl(image, backendUrl) || fallbackImage

  const showFallbackImage = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return
    event.currentTarget.dataset.fallbackApplied = 'true'
    event.currentTarget.src = fallbackImage
  }

  return (
    <img
      className={className}
      src={imageUrl}
      alt={name ? `Dr. ${name}` : 'Doctor'}
      onError={showFallbackImage}
    />
  )
}

export default DoctorImage
