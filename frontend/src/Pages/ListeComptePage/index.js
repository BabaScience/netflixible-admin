import './index.scss'


import React, {useState, useEffect} from 'react'
import AdminPageStructure from '../AdminPageStructure'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilm,
  faUsers,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

const exampleAccounts = [
  {id: 0, email: "lebab", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 1, email: "replay", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 2, email: "wow", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 3, email: "lebab", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 4, email: "lebab", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 5, email: "lebab", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 6, email: "lebab", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
  {id: 7, email: "lebab", password: "blabla", profiles : [1, 2], customers:[1, 2, 3, 4]},
]


function Index() {
  const [accounts, setAccounts] = useState(null)

  const ApiUrl = "" // process.env.REACT_APP_SERVER_BASE_URL || ""  // 'http://localhost:5000'

  useEffect(() => {
    console.log('restarted')
    fetchAccountsFromDB()


  }, [])

  async function fetchAccountsFromDB(){
    await axios.get(`${ApiUrl}/accounts`)
              .then(fetchedAccounts => {
                console.log(fetchedAccounts?.data)
                setAccounts(fetchedAccounts?.data)
              })
              .catch(err => console.log(err))
  }

  return (
    <AdminPageStructure
      headerTitle='Liste des Comptes Netflix.'
      headerDescription='Visualisez toutes les informations sur vos comptes netflix.'
    >
      <div className='table-container'>
        <div className='table-header'>
          <div className="table-header-title">
            <FontAwesomeIcon className='icon' icon={faFilm} />
            <span className=''>Les Comptes Netflix</span>
          </div>
        </div>
        <table className="table table-borderless">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Mot de Passe</th>
              <th scope="col" className='text-center'>Utlisateurs</th>
              <th scope="col" className='text-center'>Profiles</th>
              <th scope="col" className='text-center'>Details</th>
            </tr>
          </thead>
          <tbody>
            {
              accounts && accounts.map(account => (
                  <tr key={account?._id}>
                    <td>{account?.email}</td>
                    <td>{account?.password}</td>
                    <td className='text-center'>
                      <FontAwesomeIcon className='icon' icon={faUsers} />
                      {account?.customers ? account?.customers.length : 0}
                    </td>
                    <td className='text-center'>
                      <FontAwesomeIcon className='icon' icon={faFilm} />
                      {account?.profiles.length}
                    </td>
                    <td className='text-center'>
                    <FontAwesomeIcon className='icon icon-info' icon={faInfoCircle} />
                    </td>
                  </tr>
              ))
            }
            
          </tbody>
        </table>
      </div>
    </AdminPageStructure>
  )
}

export default Index