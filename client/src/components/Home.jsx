import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="text-center">
              <h1>Query Ticket Management System</h1>

              <Link to="/login"><button className='mr-2'>Login</button></Link>
              <Link to="/register"><button>Register</button></Link>

    </div>
  )
}

export default Home
