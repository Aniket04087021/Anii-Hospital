import React from 'react'

const Biography = ({imageUrl}) => {
  return (
    <div className='container biography'>
        <div className="banner">
            <img src={imageUrl} alt="aboutImg" />
        </div>
        <div className="banner">
            <p>Biography</p>
            <h3>Who Are We </h3>
            <p>A Care Hospital is a modern healthcare platform designed to make medical services more accessible and convenient for patients. The system allows users to easily book doctor appointments, explore hospital services, and manage their healthcare needs online.

Our goal is to simplify the healthcare experience by connecting patients with doctors through a user-friendly digital platform. The website provides features such as online appointment booking, doctor information, service details, and patient support to ensure a smooth and efficient healthcare process.

A Care Hospital focuses on delivering reliable healthcare solutions using modern web technologies while ensuring a simple and responsive user experience. The platform is built to improve accessibility, reduce waiting time, and help patients receive the care they need quickly and efficiently.
</p>
            
        </div>
      
    </div>
  )
}

export default Biography
