import React from 'react'

const Hero = ({title, imageUrl}) => {
  return (
    <div className='hero container'>
        <div className="banner">
            <h1>{title}</h1>
            <p>your trusted partner in health and healing. We are committed to delivering compassionate, patient-centered care backed by modern medical technology and a team of dedicated professionals. Whether it’s routine check-ups, emergency services, or specialized treatments, we ensure every patient receives personalized attention and the highest standard of care. At Anii Care, your well-being is our priority. We believe in healing with empathy, treating with expertise, and caring like family. Step into a space where medical excellence meets heartfelt compassion — because your health deserves nothing less.</p>
            
        </div>
        <div className="banner">
            <img src={imageUrl} alt="hero" className='animated-image' />
            <span>
                <img src="/Vector.png" alt="vector"  />
            </span>
        </div>
      
    </div>
  )
}

export default Hero
