import "./index.scss"

import React, { useState, useEffect } from 'react'
import Header from "../../Components/Header"

import axios from 'axios'

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faUser, 
    faUsers,
    faFaceAngry,
    faSackDollar
} from '@fortawesome/free-solid-svg-icons'


import  {
    faWhatsapp
} from '@fortawesome/free-brands-svg-icons'

import AdminPageStructure from '../AdminPageStructure'

const exampleClients = [
    {id: 0, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 1, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 2, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 3, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 4, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "wowtvsenegal@gmail.com"},
    {id: 5, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 6, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 7, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "wowtvsenegal@gmail.com"},
    {id: 8, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 9, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 10, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "replaysenegal@gmail.com"},
    {id: 11, nomComplet: "Modou Diop", telephone: 775248574, compteNetflix: "wowtvsenegal@gmail.com"},
]

const filters = [
    {id: 0, by: 'active'},
    {id: 1, by: 'non active'},
]



function Index() {
    const [clients, setClients] = useState(null)
    const [filterByEmail, setFilterByEmail] = useState('tout')
    const [filteredClients, setFilteredClients ] = useState(null)
    const [dispayedClients, setDisplayedClients] = useState(null)
    const [pagination, setPagination] = useState({current: 1, pages: [1]})
    const [comptes, setComptes] = useState(null)

    const ApiUrl = "" // process.env.REACT_APP_SERVER_BASE_URL || "" // 'http://localhost:5000'
    console.log("ApiUrl: ", ApiUrl)

    useEffect(() => {
        console.log("Page Loaded!")
        fetchAccountsFromDB()
        fetchClientsFromDB()

    }, [])

    async function fetchAccountsFromDB(){
        await axios.get(`${ApiUrl}/account`)
                  .then(fetchedAccounts => {
                    setComptes(fetchedAccounts?.data)
                  })
                  .catch(err => console.log(err))
    }
    
    async function fetchClientsFromDB(){
      await axios.get(`${ApiUrl}/customers`)
                .then(fetchedCustomers => {
                    console.log(fetchedCustomers?.data)
                    setClients(fetchedCustomers?.data)
                    setFilteredClients(fetchedCustomers?.data)
                    setDisplayedClients(fetchedCustomers?.data)
                    handlePagination()
                })
                .catch(err => console.log(err))
    }

    async function fetchActiveClientsFromDB(){
        await axios.get(`${ApiUrl}/customers`)
                  .then(fetchedCustomers => {
                      console.log(fetchedCustomers?.data.filter(customer => customer?.active) )
                      setClients(fetchedCustomers?.data.filter(customer => customer?.active) )
                      setFilteredClients(fetchedCustomers?.data.filter(customer => customer?.active) )
                      setDisplayedClients(fetchedCustomers?.data.filter(customer => customer?.active) )
                      handlePagination()
                  })
                  .catch(err => console.log(err))
      }

      async function fetchNonActiveClientsFromDB(){
        await axios.get(`${ApiUrl}/customers`)
                  .then(fetchedCustomers => {
                      console.log(fetchedCustomers?.data.filter(customer => !customer?.active) )
                      setClients(fetchedCustomers?.data.filter(customer => !customer?.active))
                      setFilteredClients(fetchedCustomers?.data.filter(customer => !customer?.active))
                      setDisplayedClients(fetchedCustomers?.data.filter(customer => !customer?.active))
                      handlePagination()
                  })
                  .catch(err => console.log(err))
      }

    function handleFilterby(attr) {
        /*
            This function does
            - filters the list of clients and updates filteredClients object 
            - calls handlePagination
        */
        
        if(attr === 'active'){
            fetchActiveClientsFromDB()
        }
        if(attr === 'non active'){
            fetchNonActiveClientsFromDB()
        }
        else if (attr === "tout"){
            fetchClientsFromDB()
        }
        handlePagination()
        setFilterByEmail(attr)
    }

    function handlePagination(to=1){
        /*
            This function does the following: 
            - calculate the number of pages to display
            - updates the pagination object
        */
        if (filteredClients){
            var number_of_pages = filteredClients.length % 10 == 0  ?  parseInt(filteredClients.length / 10) : parseInt(filteredClients.length / 10) + 1
            console.log("number of pages: ", number_of_pages)
            
            let pages_ = []
            for (let i=1; i<=number_of_pages; i++){
                pages_.push(i)
            }
            setPagination({
                current: to,
                pages: pages_
            })
            console.log(pages_)
            
            let from_client = (to - 1) * 10
            let to_client = to * 10
            setDisplayedClients(filteredClients.slice(from_client, to_client))
            // window.location.reload()
        }

    }

    return (
      <AdminPageStructure
        headerTitle="Liste des Clients"
        headerDescription="Voici la liste des clients du mois."
      >
          <div className="table-container">
                <div className="table-header">
                    <div className="table-header-title">
                        <FontAwesomeIcon className='icon' icon={faUsers} />
                        <span className=''>La Liste des Clients</span>
                    </div>
                    <div className="table-header-options">
                        <div className="filter">
                            <span>Affiché:</span>
                            <div className="dropdown">
                                <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {filterByEmail}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><button  className="dropdown-item" onClick={()=>handleFilterby('tout')} >tout</button></li>
                                    {filters && filters.map(({id, by}) => (
                                        <li key={id}><button  className="dropdown-item" onClick={()=>handleFilterby(by)} >{by}</button></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Link to="/ajouter-client" className="btn btn-sm btn-success ajout-client">
                            <FontAwesomeIcon className="icon" icon={faUser} />
                            Ajouter un Client
                        </Link>
                    </div>
                </div>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">Nom complet</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Prochaine renouvellem.</th>
                            <th scope="col" className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dispayedClients &&  dispayedClients.map(({_id, fullName, phoneNumber, active, lastSubscriptionTermination}) => (
                                <tr key={_id}>
                                    <td>{fullName}</td>
                                    <td>
                                        <FontAwesomeIcon className="icon" icon={faWhatsapp} />
                                        {phoneNumber}
                                    </td>
                                    <td>{new Date(lastSubscriptionTermination).toDateString()}</td>
                                        
                                        <td className="text-center">
                                            <FontAwesomeIcon className={active ? "icon-active" : ''}  icon={faSackDollar} />
                                        </td>
                                        
                                </tr>
                            ))
                        }
                    </tbody>
                    </table>
                    {
                        !dispayedClients  && (
                            <div className="pas-de-client">
                                <FontAwesomeIcon className="icon" icon={faFaceAngry} />
                                <p>Pas de Client.</p>
                            </div>
                        )
                    }
                    <nav aria-label="...">
                        <ul className="pagination pagination-sm">
                            {
                                pagination.pages.map(page_number => {
                                    if (pagination.pages.length > 1){
                                        if(page_number == pagination.current){
                                            return (
                                                <li key={page_number} className="page-item active" aria-current="page">
                                                    <span className="page-link">{page_number}</span>
                                                </li>
                                            )
                                        }
                                        else {
                                            return(    
                                                <li key={page_number} className="page-item"><span className="page-link" onClick={()=>handlePagination(page_number)}>{page_number}</span></li>
                                            )
                                        }
                                    }
                                })
                            }
                        </ul>
                    </nav>
              </div>
      </AdminPageStructure>
    )
}

export default Index