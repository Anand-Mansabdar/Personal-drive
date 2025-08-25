import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/api/auth/me').then(() => {
      if(mounted){
        setOk(true);
        setLoading(false);
      }
    }).catch(() => {
      if(mounted){
        setLoading(false);
        setOk(false);
      }
    });
    return () => {
      mounted = false;
    }
  }, []);

  if(loading){
    return <div className='p-8'>Checking session...</div>
  }

  return ok ? <Outlet /> : <Navigate to='/login' replace />;
}

export default ProtectedRoute