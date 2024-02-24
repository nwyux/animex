import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useCookie from 'react-use-cookie';
import { NavLink } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userToken, setUserToken] = useCookie('token', '0');
    const [logged, setLogged] = useState(false)
    const [userID, setUserID] = useState('');
    const navigate = useNavigate()

    async function login() {
        setLoading(true);
        const response = (await axios.post('http://localhost:3001/api/auth/login', {
            username: username,
            password: password
        })).data;
        if (response.error) {
            setError(response.error);
        } else {
            setUserToken(response['access_token'], {
                days: 365,
                SameSite: 'Strict',
                Secure: true,
            });
            setLogged(true);
            setUserID(response.userID);

            window.localStorage.setItem('userID', response.userID);
            window.localStorage.setItem('admin', response.admin);
        }
        setLoading(false);
    }

    if (logged)
        window.location.href = '/user';
    return (
        <div className="loginBg overflow-hidden flex h-screen relative justify-center items-center">
            <div className='flex absolute top-64 z-20 justify-center bg-vert sm:bg-transparent rounded-full items-center mb-4'>
                <NavLink to='/login' className="text-2xl sm:-mt-14  sm:text-4xl sm:bg-transparent font-semibold bg-vertfonce rounded-full py-4 px-11 text-blanc">Login</NavLink>
                <NavLink to='/register' className="text-2xl sm:hidden font-semibold py-4 px-6 text-vertfonce">Register</NavLink>
              </div>
              <div className="w-full sm:max-w-2xl p-4 bg-blanc sm:backdrop-blur-sm sm:border-2 sm:border-blanc sm:top-48 sm:bg-transparent absolute top-64 h-screen rounded-[45px]">
                <form onSubmit={login} className='mt-24'>
                  <input
                        type="username"
                        placeholder="Username"
                        className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                <button
                    className="w-full p-3 mt-6 bg-vertfonce sm:bg-marron shadow-2xl text-blanc rounded-xl font-bold"
                    onClick={login}
                    disabled={loading}
                >
                    Login
                </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div className="text-vertfonce flex gap-1 font-bold mt-4">
                  <p>You don't have an account?</p>
                  <NavLink to='/register' className="text-vert hover:underline">Register here</NavLink>
                </div>
            </div>
        </div>
    )
}