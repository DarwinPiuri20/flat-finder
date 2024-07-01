import React from 'react'
import checkUsserLooged from '../services/action'
import FlatsTable from '../components/FlatsTable'
import Header from '../components/Header'

export default function Home() {
    checkUsserLooged()
  return (
    <div>
      <Header/>
      <FlatsTable/>
      
    </div>
  )
}
