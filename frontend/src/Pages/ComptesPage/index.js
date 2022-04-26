import './index.scss'

import React from 'react'
import Header from '../../Components/Header'
import ButtonCard from '../../Components/ButtonCard'

import AdminPageStructure from '../AdminPageStructure'

import  {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {
  faPlusSquare,
  faListCheck
} from '@fortawesome/free-solid-svg-icons'

function Index() {
  return (
    <AdminPageStructure 
      headerTitle='Que voulez-vous faire?' 
      headerDescription='Vous pouver voir la liste de tous les comptes enrigitrés et vous pouvez ajouter aussi un nouveau compte à la base de donnée.'
      backgroundless={true}
    >
      <div className='row gx-4'>
        <div className='col'>
          <ButtonCard title='ajouter-un-compte' to='/ajouter-compte-netflix' icon={faPlusSquare}/>
        </div>
        <div className='col'>
          <ButtonCard title='liste-des-comptes' to='/liste-des-comptes-netflix' icon={faListCheck}/>
        </div>
      </div>
    </AdminPageStructure>
  )
}

export default Index
