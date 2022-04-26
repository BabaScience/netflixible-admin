import './index.scss'

import React from 'react'
import Header from '../../Components/Header'

function Index({
    children, 
    headerTitle = "Un Nouveau Compte?", 
    headerDescription = "Ajouter un nouveau compte netflix",
    backgroundless = false
}) {
  return (
    <div className="admin-background">
        <Header /> 
        <div className="right-side">
            <div className="header">
                <h3>{headerTitle}</h3>
                <p>{headerDescription}</p>
            </div>
            <div className={backgroundless ? 'body background-less' : 'body'}>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Index