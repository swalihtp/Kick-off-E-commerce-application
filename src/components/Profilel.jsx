// import React, {useState,useEffect} from 'react'
// import axios from 'axios'


// function Profilel() {
//     useEffect(()=>{
//         axios.get(``)
//     })
//   return (
//     <div>Profilel</div>
//   )
// }

// export default Profilel


import {useState,useContext} from 'react'
import {AuthContext} from './context/AuthContext'
import {useNavigate} from 'react-router-dom'
function Sample(){
    const navigate=useNavigate()
    const {user}=useContext(AuthContext)
    if(user.role==="user"){
        navigate('/')
    }else if (user.role==="admin"){
        navigate('/admin')
    }
    return(

    );
}