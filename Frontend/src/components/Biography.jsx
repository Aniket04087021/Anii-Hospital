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
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, aut pariatur totam incidunt atque, eligendi quod cumque quo ipsa deserunt laudantium illum id provident repellat necessitatibus voluptates enim libero temporibus.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <p>Lorem ipsum dolor sit amet.</p>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora eius explicabo similique voluptates enim veniam repellat reprehenderit quia quod voluptatum temporibus placeat, optio beatae incidunt quis aperiam itaque quas labore, necessitatibus deleniti consequuntur corporis ipsam?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias harum officiis autem.</p>
            <p>Lorem, ipsum dolor.</p>
        </div>
      
    </div>
  )
}

export default Biography
