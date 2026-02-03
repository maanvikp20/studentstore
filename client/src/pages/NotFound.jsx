import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="card">
        <h2>404 -- Page Not Found</h2>
        <p className="small">That Route does not exist in this Page</p>
        <Link className="link" to={'/'}>Go Home</Link>
    </div>
  )
}

export default NotFound