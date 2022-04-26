import "./index.scss"

import React from 'react'
import AdminPageStructure from '../AdminPageStructure'
import StatCard from '../../Components/StatCard'

function Index() {
  return (
    <AdminPageStructure
        headerTitle="Statisques"
        headerDescription="Quelques Statistiques"
        backgroundless={true}
    >
        <StatCard />
    </AdminPageStructure>
  )
}

export default Index