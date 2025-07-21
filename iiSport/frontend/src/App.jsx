import { useState } from 'react'

import {Routes , Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import LogReg from './views/LogReg';
import Dashboard from './views/Dashboard';
import New from './views/New';
import OneEvent from './views/OneEvent';
import Search from './views/Search';
import OneUser from './views/OneUser';
import EditUser from './views/EditUser';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LogReg />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new" element={<New />} />
        <Route path="/event/:id" element={<OneEvent />} />
        <Route path="/search" element={<Search />} />
        <Route path="/user/:id" element={<OneUser />} />
        <Route path="/user/edit/:id" element={<EditUser />} />

      </Routes>
    </>
  )
}

export default App
