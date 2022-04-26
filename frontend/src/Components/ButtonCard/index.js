import './index.scss'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faPlus,

} from '@fortawesome/free-solid-svg-icons'

import  { Link } from 'react-router-dom'

function Index({ to='/', icon=faPlus, title='add-text', className=''}) {
  return (
    <div className={`button-card ${className} `}>
        <Link to={to}>
            <div className='card-head'>
                <FontAwesomeIcon className='icon' icon={icon} />
            </div>
            <div className="card-body">
                <p className="card-body-text">{title}</p>
            </div>
        </Link>
    </div>
  )
}

export default Index