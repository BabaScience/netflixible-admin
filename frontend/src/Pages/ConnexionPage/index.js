import './index.scss'


import React, {useRef, useState} from 'react'
import axios from 'axios'
import { useNavigate  } from 'react-router-dom'

function Index() {
    const navigate = useNavigate()
    const username = useRef('')
    const password = useRef('')
    const [errMessageClass, setErrMessageClass] = useState('error-message')
    const [errorMessage, setErrorMessage] = useState('')
    const ApiUrl = ""// process.env.REACT_APP_SERVER_BASE_URL || "" // 'http://localhost:5000'

    async function handleSubmit(e){
        e.preventDefault()
        if(username.current && password.current){
            // console.log('calling axios...')
            setErrMessageClass("error-message")
            await axios.post(`${ApiUrl}/superusers/login`,{
                username: username.current,
                password: password.current
            }).then(data => {
                // console.log(data)
                if(!data.data.error){
                    navigate('dashboard')
                }
                else {
                    // console.log('mot de passe incorrect')
                    setErrorMessage(data.data.error.message)
                    setErrMessageClass("error-message show")
                }
            }).catch(err => {
                console.log(err)
                setErrorMessage(err)
                setErrMessageClass("error-message show")
            })
        }
        else{
            setErrorMessage("Remplissez les champs.")
            setErrMessageClass("error-message show")
        }
    }
    return (
      <div className="view-container">
          <form className="data-container-connexion">
              <div className="data-entry">
                  <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                  <input type="text" id="username" className="form-control" onChange={e => username.current = e.target.value}/>
              </div>
              <div className="data-entry">
                  <label htmlFor="password" className="form-label">Mot de Passe</label>
                  <input type="password" id="password" className="form-control" onChange={e => password.current = e.target.value} />
              </div>
              <div>
                  <p className={errMessageClass}>{errorMessage}</p>
              </div>
              <div className='submit-button'>
                  <button className='btn btn-primary' onClick={handleSubmit}>connexion</button>
              </div>
          </form>
      </div>
    )
}

export default Index