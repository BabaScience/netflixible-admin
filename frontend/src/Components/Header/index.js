import "./index.scss"

import React from 'react'
import { Link } from 'react-router-dom'
import { 
  faUser,
  faUsers,
  faChartLine,
  faArrowRightFromBracket,
  faTv,
  faMoneyBill1Wave
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function Index() {
  return (
    <div className="header-container">
      <div className="logo">
        Netflixible Admin
      </div>
      <div className="navbar">
        <ul className="sections">
          <li >
            <Link className="section" to="/profile">
              <FontAwesomeIcon className="icon" icon={faUser} />
              Profile
            </Link>
          </li>
          <li >
            <Link className="section" to="/clients">
              <FontAwesomeIcon className="icon" icon={faUsers} />
              Clients
            </Link>
          </li>
          <li >
            <Link className="section" to="/abonnements">
              <FontAwesomeIcon className="icon" icon={faMoneyBill1Wave} />
              Abonnem.
            </Link>
          </li>
          <li >
            <Link className="section" to="/comptes-netflix">
              <FontAwesomeIcon className="icon" icon={faTv} />
              Comptes
            </Link>
          </li>
          <li >
            <Link className="section" to="/statistiques">
              <FontAwesomeIcon className="icon" icon={faChartLine} />
              Statistiques
            </Link>
          </li>
        </ul>
      </div>
      <div className="footer">
        <ul className="sections">
          <li >
            <Link className="section" to="/">
              <FontAwesomeIcon className="icon" icon={faArrowRightFromBracket} />
              Déconn. 
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Index