import React , { useState, useEffect } from 'react'
import styles from './style'

import {Dashboard, Module, StudyCalendar, Support, LogIn, Register, SemesterUploader, AddTask, AddActivity} from './components'
import {
  Route,
  Navigate,
  Routes,
} from 'react-router-dom';

//import { toast } from "react-toastify";

const App = () => {

  const checkAuthenticated = async () => {
    const token = localStorage.token;
    if(!token){
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/authentication/verify", {
        method: "POST",
        headers: { token: localStorage.token }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };



  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return (
     <div className="bg-black w-full h-screen overflow-auto">
      <div className='relative z-[5] w-full h-screen'>
          <Routes>
            <Route 
              path="/" 
              element ={
                !isAuthenticated ? (
                  <LogIn setAuth={setAuth}/>
                ) : (
                  <Navigate to="../dashboard" />
                )
              } 
            />
            <Route 
              path="/login" 
              element ={
                !isAuthenticated ? (
                  <LogIn setAuth={setAuth}/>
                ) : (
                  <Navigate to="../dashboard" />
                )
              } 
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate to="../dashboard"/>
                )
              }
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
            <Route
              path="/module"
              element={
                isAuthenticated ? (
                  <Module setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
            <Route
              path="/studycalendar"
              element={
                isAuthenticated ? (
                  <StudyCalendar setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
            <Route
              path="/support"
              element={
                isAuthenticated ? (
                  <Support setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
            <Route
              path="/semesteruploader"
              element={
                isAuthenticated ? (
                  <SemesterUploader setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
            <Route
              path="/addtask"
              element={
                isAuthenticated ? (
                  <AddTask setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
            <Route
              path="/addactivity"
              element={
                isAuthenticated ? (
                  <AddActivity setAuth={setAuth} />
                ) : (
                  <Navigate to="../login" />
                )
              }
            />
          </Routes>
        </div>
        <div>
          <div className='absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient'/>
          <div className='absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient'/>
          <div className='absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient'/>
      </div>
     </div>
  )
}

export default App