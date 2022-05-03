import './index.scss'

import React, { useRef, useState } from 'react'
import Header from '../../Components/Header'
import AdminPageStructure from '../AdminPageStructure'
import axios from 'axios'






function Index() {
    const netflixEmail = useRef('')
    const netflixPassword = useRef('')
    const expirationDay = useRef('')
    const expirationMonth = useRef('')
    const expirationYear = useRef('')
    const [accounts, setAccount] = useState({number: 1, profiles: [1], codes:[''], names: ['']})
    const [errorMessage, setErrorMessage] = useState('Hello Bug')
    const [errorTitle, setErrorTitle] = useState('Ops!')
    const [successMessage, setSuccessMessage] = useState('Hello Human')
    const [successTitle, setSuccessTitle] = useState('Félicitation')

    const ApiUrl = "" // 'http://localhost:5000'

    async function handleAddNetflixAccount(e){
        e.preventDefault()
        // console.log("Nom Complet: ", netflixEmail.current)
        // console.log("Téléphone: ", netflixPassword.current)
        // console.log("Neflix: ", accounts)
        const { profiles, codes, names } = accounts
        const creationDate = Date(expirationYear.current, expirationMonth.current - 1, expirationDay.current)
        // save accounts through api
        let profilesList = []
        for(let i=0; i<profiles.length; i++){
            let profileObj = {
                "profileName": names[i],
                "profileCode": codes[i],
                "users": []
            }
            profilesList.push(profileObj)
        }
        await axios.post(`${ApiUrl}/accounts/add`, {
            email: netflixEmail.current,
            password: netflixPassword.current,
            customers: [],
            profiles: profilesList,
            startingDate: creationDate
        }).then(res => {
            if(!res.data.error){
                console.log(res.data)
                toggleSuccessModal('', "Vous Venez d'Ajouter un Nouveau Compte.")
            }
            else{
                // console.log(res.data.error.message)
                toggleErrorModal('', res.data.error.message)

            }
        }).catch(err => {
            // console.log("Error: ", err.message)
            toggleErrorModal('', err.message)
        })
    }

    function toggleErrorModal(title='', message){
        if (title){
            setErrorTitle(title)
        }
        setErrorMessage(message)
        document.getElementById('error-button').click()
    }

    function toggleSuccessModal(title='', message){
        if (title){
            setSuccessTitle(title)
        }
        setSuccessMessage(message)
        document.getElementById('success-button').click()
    }

    function HandleUpdateProfileNameOnChange(e, index){
        let { number, profiles, codes, names } = accounts
        // console.log(e.target.value)
        names[index-1] = e.target.value
        setAccount({number, profiles, codes, names})
        // netflixPassword.current = result.data.code
    }

    function HandleUpdateProfileCodeOnChange(e, index){
        let { number, profiles, codes, names } = accounts
        // console.log(e.target.value)
        codes[index-1] = e.target.value
        setAccount({number, profiles, codes, names})
        // netflixPassword.current = result.data.code
    }

    



    function GeneratePassword(documentId){
        axios.get(`${ApiUrl}/generator/password`)
            .then(result => {
                if(result.data.error){
                    console.log(result.data.error.message)
                }
                else {
                    netflixPassword.current = result.data.password
                    document.getElementById(documentId).value = result.data.password
                }
            })
            .catch(err => console.log(err.message))
    }

    function GenerateCode(documentId, index){
        axios.get(`${ApiUrl}/generator/code`)
            .then(result => {
                if(result.data.error){
                    console.log("Error")
                }
                else {
                    let { number, profiles, codes, names } = accounts
                    codes[index-1] = result.data.code
                    setAccount({number, profiles, codes, names})
                    // netflixPassword.current = result.data.code
                    document.getElementById(documentId).value = result.data.code
                }
                // console.log(accounts)
            })
            .catch(err => console.log("Error: " + err))
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

    function getTodayDate(){
        const day = (new Date()).getDate()
        const month = (new Date()).getMonth()
        const year = (new Date()).getUTCFullYear()

        const inOneMonth = new Date(year, month+1, day)

        console.log(day, ' - ', month, ' - ', year)
        console.log(inOneMonth)

        expirationDay.current = day
        expirationMonth.current = month + 1
        expirationYear.current = year
        document.getElementById('expiration-day').value = day
        document.getElementById('expiration-month').value = month + 1
        document.getElementById('expiration-year').value = year
    }

    function handleAccountNumberChange(n) {
        const number = n
        const profiles = []
        const codes = []
        const names = []
        for(let j=1; j<=accounts.number; j++){
            document.getElementById(`profile-code-${j}`).value = ''
            document.getElementById(`profile-name-${j}`).value = ''
        }
        for (let i=1; i<=n; i++){
            profiles.push(i)
            codes.push('')
            names.push('')
        }
        setAccount({number, profiles, codes, names})
    }


    

  return (
    <AdminPageStructure
        headerTitle='Un Nouveau Compte?'
        headerDescription='Ajouter un nouveau compte netflix'
    >
        <div className="body">
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='form-container'>
                    <form className="data-container">
                        <h4 className='title'>Ajouter un Compte Netflix</h4>
                        <div className="data-entry">
                            <label htmlFor="username" className="form-label">Email du Compte Netflix</label>
                            <input type="text" id="username" onChange={e => {netflixEmail.current = e.currentTarget.value}} className="form-control" />
                        </div>
                        <div className="data-entry">
                            <label htmlFor="email" className="form-label">Mot de Passe</label>
                            <div className='input-group mb-3'>
                                <input type="text" id="password" onChange={e => {netflixPassword.current = e.currentTarget.value}} className="form-control" />
                                <button className="btn btn-outline-success" type="button" id="password-generator" onClick={() => GeneratePassword("password")}>Générer</button>
                            </div>
                        </div>
                        <div className='data-entry-row'>
                            <label htmlFor="email" className="form-label">Nombre de Profiles</label>
                            <div className="dropdown">
                                <button className="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {accounts.number} {accounts.number === 1 ? "Profile" : "Profiles"} 
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><span className="dropdown-item" onClick={()=>handleAccountNumberChange(1)}>1 Profile</span></li>
                                    <li><span className="dropdown-item" onClick={()=>handleAccountNumberChange(2)}>2 Profiles</span></li>
                                    <li><span className="dropdown-item" onClick={()=>handleAccountNumberChange(3)}>3 Profiles</span></li>
                                    <li><span className="dropdown-item" onClick={()=>handleAccountNumberChange(4)}>4 Profiles</span></li>
                                    <li><span className="dropdown-item" onClick={()=>handleAccountNumberChange(5)}>5 Profiles</span></li>
                                </ul>
                            </div>
                        </div>

                        {
                            accounts.profiles.map(profile => (
                                <div key={profile} className="data-entry">
                                    <label htmlFor="email" className="form-label">Nom et Code du Profile {profile}</label>
                                    <div className='input-group mb-3'>
                                        <input type="text" id={`profile-name-${profile}`} onChange={e => HandleUpdateProfileNameOnChange(e, profile)} className="form-control" />
                                        <input type="number" id={`profile-code-${profile}`} onChange={e =>  HandleUpdateProfileCodeOnChange(e, profile)} className="form-control" />
                                        <button className="btn btn-outline-success" type="button" id={`code-generator-${profile}`} onClick={()=>GenerateCode(`profile-code-${profile}`, profile)}>Générer</button>
                                    </div>
                                </div>
                            ))
                        }

                        <div  className="data-entry">
                            <label htmlFor="email" className="form-label">Date de creation</label>
                            <div className='input-group mb-3'>
                                <input type="text" id={`expiration-day`} placeholder="JJ" onChange={e => {expirationDay.current = e.currentTarget.value}} className="form-control" />
                                <input type="number" id={`expiration-month`} placeholder="MM" onChange={e =>  e => {expirationMonth.current = e.currentTarget.value}} className="form-control" />
                                <input type="number" id={`expiration-year`} placeholder="AA" onChange={e =>  e => {expirationYear.current = e.currentTarget.value}} className="form-control" />
                                <button className="btn btn-outline-success" type="button" id={`expiration-date`} onClick={getTodayDate} >aujourd'hui</button>
                            </div>
                        </div>
                        
                        
                        <div className='submit-button'>
                            <button onClick={handleAddNetflixAccount} className='btn btn-success'>Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
    </AdminPageStructure>

  )
}

export default Index