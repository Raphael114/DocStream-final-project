import React from 'react'
import { doctorImages, getDoctorImageUrl } from '../assets/assets'

const DoctorImage = ({ image, backendUrl, index = 0, name, className = '' }) => {
  const fallbackImage = doctorImages[index % doctorImages.length]
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
