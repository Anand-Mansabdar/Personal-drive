import {useState} from 'react'
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {

  const [form, setForm] = useState({username: '', email: '', password:''});
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async(e) =>{
    e.preventDefault();
    setErr('');
    try {
      await api.post('/api/auth/register', form);
      nav('/');
    } catch (error) {
      setErr(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form action="" onSubmit={submit} className='w-full max-w-sm bg-white shadow p-6 rounded-xl space-y-4'>
        <h1 className='text-2xl font-semibold'>Create account</h1>
        {err && <p className='text-red-600 text-sm'>{err}</p>}
        
        <input type="text" className="w-full border rounded p-2" placeholder='Username' value={form.username} onChange={e => setForm({...form, username: e.target.value})}/>

        <input type="text" className="w-full border rounded p-2" placeholder='Email' value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>

        <input type='password' className="w-full border rounded p-2" placeholder='Password' value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>

        <button className='w-full bg-black text-white py-2 rounded'>Sign Up</button>
        <p className="text-sm">Have an account? <Link className='underline' to='/login'>Login </Link></p>
      </form>
    </div>
  )
}

export default Register;