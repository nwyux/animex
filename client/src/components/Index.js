import axios from 'axios'
import { useEffect, useState } from 'react'
import PageTemplate from './PageTemplate'
import WaitingPage from './WaitingPage'

export default function Index() {
    
  return (
    <div className="bg-noir min-h-screen mt-28 flex flex-col justify-center items-center">
      <h1 className="text-5xl text-center text-blanc mb-4">AnimeX</h1>
        <div className="flex flex-col justify-center items-center py-4">
            {/* <WaitingPage /> */}
        </div>
    </div>
  )
}
