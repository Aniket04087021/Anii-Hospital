import React from 'react'

const Hero = ({title, imageUrl}) => {
  return (
    <div className='hero container'>
        <div className="banner">
            <h1>{title}</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, aut pariatur totam incidunt atque, eligendi quod cumque quo ipsa deserunt laudantium illum id provident repellat necessitatibus voluptates enim libero temporibus.</p>
            
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
