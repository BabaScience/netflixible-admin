import React from 'react'
import "./index.scss"

import AdminPageStructure from '../AdminPageStructure'

function Index() {
  return (
    <AdminPageStructure
      headerTitle="Salut Gaby Lame!"
      headerDescription='Comment-allez vous?'
    >
      Dashboard
    </AdminPageStructure>
  )
}

export default Index