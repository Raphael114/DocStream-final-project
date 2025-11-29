import React from 'react'
import './Loader.css'
import { assets } from '../assets/assets'

const Loader = ({ size = 160 }) => {
  return (
    <div className="ds-loader">
      <div className="ds-loader__rings" style={{ width: size, height: size }}>
        <div className="ds-loader__ring ds-loader__ring--outer" />
        <div className="ds-loader__ring ds-loader__ring--mid" />
        <div className="ds-loader__ring ds-loader__ring--inner" />
        <div className="ds-loader__center">
          <img src={assets.logo} alt="DocStream" />
        </div>
      </div>
    </div>
  )
}

export default Loader
