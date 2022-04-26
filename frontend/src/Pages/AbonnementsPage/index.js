import React, {useEffect, useState} from 'react'
import AdminPageStructure from '../AdminPageStructure'

import axios from 'axios'

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faUser, 
    faFaceAngry,
    faSackDollar
} from '@fortawesome/free-solid-svg-icons'


import  {
    faWhatsapp
} from '@fortawesome/free-brands-svg-icons'

function Index() {
  const [clients, setClients] = useState(null)
    const [filterByEmail, setFilterByEmail] = useState('tout')
    const [filteredClients, setFilteredClients ] = useState(null)
    const [dispayedClients, setDisplayedClients] = useState(null)
    const [pagination, setPagination] = useState({current: 1, pages: [1]})
    const [comptes, setComptes] = useState(null)

    useEffect(() => {
        console.log("Page Loaded!")
        fetchAccountsFromDB()
        fetchClientsFromDB()
        handlePagination()



    }, [])

    async function fetchAccountsFromDB(){
        await axios.get('/accounts')
                  .then(fetchedAccounts => {
                    setComptes(fetchedAccounts?.data)
                  })
                  .catch(err => console.log(err))
    }
    
    async function fetchClientsFromDB(){
      await axios.get('/subscriptions')
                .then(fetchedCustomers => {
                    console.log(fetchedCustomers?.data.filter(sub => sub.customer.active))
                    setClients(fetchedCustomers?.data.filter(sub => sub.customer.active))
                    setFilteredClients(fetchedCustomers?.data.filter(sub => sub.customer.active))
                    setDisplayedClients(fetchedCustomers?.data.filter(sub => sub.customer.active))
                })
                .catch(err => console.log(err))
    }

    function handleFilterbyEmail(email) {
        /*
            This function does
            - filters the list of clients and updates filteredClients object 
            - calls handlePagination
        */
        
        if(email != 'tout'){
            var filtered_clients = clients.filter(({compteNetflix}) => compteNetflix === email)
            setFilteredClients(filtered_clients)
        }
        else {
            setFilteredClients(clients)
        }
        handlePagination()
        setFilterByEmail(email)
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
        }

    }
  return (
    <AdminPageStructure
        headerTitle='Les Abonnements'
        headerDescription='Vous pouvez voire la liste des abonnements içi!'
    >
        <div className="table-container">
                <h3>List des clients Abonnements Netflix ({clients ? clients.length: 0})</h3>
                <div className="table-header">
                    <div className="filter">
                        <span>Affiché par:</span>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                {filterByEmail}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><button  className="dropdown-item" onClick={()=>handleFilterbyEmail('tout')} >tout</button></li>
                                {comptes && comptes.map(({_id, email}) => (
                                    <li key={_id}><button  className="dropdown-item" onClick={()=>handleFilterbyEmail(email)} >{email}</button></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <Link to="/ajouter-client" className="btn btn-success ajout-client">
                        <FontAwesomeIcon className="icon" icon={faUser} />
                        Ajouter un Abonnement
                    </Link>
                </div>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">Nom complet</th>
                            <th scope="col">Compte</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Depuis</th>
                            <th scope="col">Délai</th>
                            <th scope="col">Prix</th>
                            <th scope="col" className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dispayedClients &&  dispayedClients.map(({_id, customer, account, price, startingDate, endingDate}) => (
                                <tr key={_id}>
                                    <td>{customer?.fullName}</td>
                                    <td>{account?.email}</td>
                                    <td>
                                        <FontAwesomeIcon className="icon" icon={faWhatsapp} />
                                        {customer?.phoneNumber}
                                    </td>
                                    <td>{(new Date(startingDate)).toDateString()}</td>
                                    <td className={ customer.active ? (new Date(endingDate) - Date.now() < (86400000 * 7) ? (new Date(endingDate) - Date.now() < (86400000 * 2) ? "to-red" : "to-orange"): '') : ""}>{(new Date(endingDate)).toDateString()}</td>
                                    <td>{price} f</td>
                                    <td className="text-center">
                                        <FontAwesomeIcon className={ customer.active ? (new Date(endingDate) - Date.now() < (86400000 * 7) ? (new Date(endingDate) - Date.now() < (86400000 * 2) ? "to-red" : "to-orange"): 'icon-active') : ''}  icon={faSackDollar} />
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