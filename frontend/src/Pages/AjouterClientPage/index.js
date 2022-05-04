import './index.scss'

import React, { useRef, useState } from 'react'
import Header from "../../Components/Header"

import AdminPageStructure from '../AdminPageStructure'

import axios from 'axios'

function Index() {
    
    const nomComplet = useRef('')
    const telephone = useRef('')
    const netflixEmail = useRef('')
    const profileCode = useRef('')
    const prix = useRef('')
    const expirationDay = useRef('')
    const expirationMonth = useRef('')
    const expirationYear = useRef('')

    const closeSuccessRef = useRef()

    const ApiUrl = "" // process.env.REACT_APP_SERVER_BASE_URL || ""  // 'http://localhost:5000'


    const [errorMessage, setErrorMessage] = useState('Hello Bug')
    const [errorTitle, setErrorTitle] = useState('Ops!')
    const [successMessage, setSuccessMessage] = useState('Hello Human')
    const [successTitle, setSuccessTitle] = useState('Félicitation')

    
    

    async function handleSubscription(e){
        e.preventDefault()
        // console.log("Nom Complet: ", nomComplet.current)
        // console.log("Téléphone: ", telephone.current)
        // console.log("Neflix: ", netflixEmail.current)
        // console.log("Profile code: ", profileCode.current)
        // document.getElementById('error-button').click()
        console.log(expirationDay.current)
        console.log(expirationMonth.current)
        console.log(expirationYear.current)
        const date = new Date(expirationYear.current, expirationMonth.current-1, expirationDay.current)
        const today = Date.now()
        await axios.post(`${ApiUrl}/subscriptions/add`, {
            customer: {
                fullName: nomComplet.current,
                phoneNumber:  telephone.current
            },
            accountEmail: netflixEmail.current,
            accountProfileCode: profileCode.current,
            price: prix.current,
            duration: 30,
            month: "April",
            startingDate: today,
            endingDate: date
        }).then(result =>{
            console.log('Result ->', result)
            if(result.data.error){
                console.log(result.data.error.message)
                setErrorMessage(result.data.error.message)
                document.getElementById('error-button').click()
            }else{
                console.log(result.data.message)
                setSuccessMessage(result.data.message)
                document.getElementById('success-button').click()
                // window.location.reload()
            }
        }).catch(err => {
            console.log("Error: ", err)
            setErrorMessage(err)
            document.getElementById('error-button').click()
        })
    }
    function oneMonthFromNow(){
        const day = (new Date()).getDate()
        const month = (new Date()).getMonth()
        const year = (new Date()).getUTCFullYear()

        const inOneMonth = new Date(year, month+1, day)

        console.log(day, ' - ', month, ' - ', year)
        console.log(inOneMonth)

        expirationDay.current = day
        expirationMonth.current = month + 2
        expirationYear.current = year
        document.getElementById('expiration-day').value = day
        document.getElementById('expiration-month').value = month + 2
        document.getElementById('expiration-year').value = year
    }

    async function generateAccountEmail(documentId){
        axios.get(`${ApiUrl}/generator/pick-account`)
            .then(result => {
                if(result.data.error){
                    console.log("Error: ", result.data.error)
                    setErrorMessage(result.data.error.message)
                    document.getElementById('error-button').click()
                }
                else {
                    console.log("Results: ", result.data.email)
                    netflixEmail.current = result.data.email
                    document.getElementById(documentId).value = result.data.email
                }
            }).catch(err => {
                console.log("Error: " , err)
                setErrorMessage(err)
                document.getElementById('error-button').click()
            })
    }



    async function generateProfileCode(documentId){
        console.log("Email: ", netflixEmail.current)
        axios.post(`${ApiUrl}/generator/pick-profile`,{
            email: netflixEmail.current
        }).then(result => {
            if(result.data.error){
                // console.log("Error: ", result.data.error.message)
                setErrorMessage(result.data.error.message)
                document.getElementById('error-button').click()
            }
            else {
                console.log("Results: ", result.data.profileCode)
                profileCode.current = result.data.profileCode
                document.getElementById(documentId).value = result.data.profileCode
            }
        }).catch(err => {
            console.log("Error: " , err)
            setErrorMessage(err)
            document.getElementById('error-button').click()
        })
    }
    return (
        <AdminPageStructure
            headerTitle='Un Nouveau Client?'
            headerDescription='Ajouter un nouveau client içi.'
        >
            <div className='body'>
                {/* Button trigger modal */}
                <button id="error-button" type="button" className="d-none btn btn-danger" data-bs-toggle="modal" data-bs-target="#errorModal">
                    Error modal
                </button>
                <button id="success-button" type="button" className="d-none btn btn-success" data-bs-toggle="modal" data-bs-target="#successModal">
                    Success modal
                </button>

                {/* Error Modal */}
                <div className="modal fade" id="errorModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{errorTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {errorMessage}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Success Modal */}
                <div className="modal fade" id="successModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title success" id="exampleModalLabel">{successTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {successMessage}
                            </div>
                            <div className="modal-footer">
                                <button ref={closeSuccessRef} id='close-success' type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='form-container'>
                    <form className="data-container">
                        <h4 className='title'>Ajouter un client</h4>
                        <div className="data-entry">
                            <label htmlFor="username" className="form-label">Nom Complet</label>
                            <input type="text" id="username" onChange={e => {nomComplet.current = e.currentTarget.value}} className="form-control" />
                        </div>
                        <div className="data-entry">
                            <label htmlFor="number" className="form-label">Téléphone</label>
                            <div className='input-group mb-3'>
                                <span class="input-group-text" id="basic-addon1">Tel</span>
                                <input type="number" id="number" onChange={e => {telephone.current = e.currentTarget.value}} className="form-control" />
                                <span class="input-group-text" id="basic-addon2">Prix</span>
                                <input type="number" id="price" onChange={e => {prix.current = e.currentTarget.value}} className="form-control" />
                            </div>
                        </div>
                        <div className="data-entry">
                            <label htmlFor="email" className="form-label">Email du Neflix</label>
                            <div className='input-group mb-3'>
                                <input type="email" id="netflix-email" onChange={e => {netflixEmail.current = e.currentTarget.value}} className="form-control" />
                                <button className="btn btn-outline-success" type="button" id="button-addon1" onClick={() => generateAccountEmail('netflix-email')}>Générer</button>
                            </div>
                        </div>
                        <div className="data-entry">
                            <label htmlFor="email" className="form-label">Profile du Compte</label>
                            <div className='input-group mb-3'>
                                <input type="number" id="profile-code" onChange={e => {profileCode.current = e.currentTarget.value}} className="form-control" />
                                <button className="btn btn-outline-success" type="button" id="button-addon2" onClick={() => generateProfileCode('profile-code')}>Générer</button>
                            </div>
                        </div>
                        <div  className="data-entry">
                            <label htmlFor="email" className="form-label">Date d'expoiration de l'abonnement</label>
                            <div className='input-group mb-3'>
                                <input type="number" id={`expiration-day`} placeholder="JJ" onChange={e => expirationDay.current = e.currentTarget.value} className="form-control" />
                                <input type="number" id={`expiration-month`} placeholder="MM" onChange={e => expirationMonth.current = e.currentTarget.value} className="form-control" />
                                <input type="number" id={`expiration-year`} placeholder="AA" onChange={e => expirationYear.current = e.currentTarget.value} className="form-control" />
                                <button className="btn btn-outline-success" type="button" id={`expiration-date`} onClick={oneMonthFromNow} >1 mois</button>
                            </div>
                        </div>
                        <div className='submit-button'>
                            <button onClick={handleSubscription} className='btn btn-success'>Ajouter Client</button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPageStructure>

    )
}

export default Index