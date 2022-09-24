import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../Firebase'

// import Profile from '../assests/Profile.jpg'

const Form = ({ register }) => {

    const userID = localStorage.getItem('userId')

    const [seller, setSeller] = useState(false)
    const [user, setUser] = useState(false)
    const [file, setFile] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [contact, setContact] = useState('')
    const [company, setCompany] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const createAccount = async () => {
        if (!name || !email || !password) {
            setError('All Fields Are Mandatory')
            return;
        }
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            const storageRef = ref(storage, `${user.user.uid}/profile`);

            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    switch (snapshot.state) {
                        case 'paused':
                            break;
                        case 'running':
                            break;
                    }
                },
                (error) => {
                    setError(error.message)
                    return;
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        let obj = {
                            uid: user.user.uid,
                            name: name,
                            email: email,
                            password,
                            contact,
                            company,
                            photoURL: downloadURL,
                            isSeller: seller,
                            totalCartPrice: 0,
                            cart: [],
                            cartProd: []

                        }
                        await setDoc(doc(db, "users", user.user.uid), obj)
                    });
                }

            );
        } catch (error) {
            setError(error.message.split(":")[1])
            return;
        }
        if (!error) {
            navigate('/', { replace: true });
        }


    }


    const login = async () => {

        try {
            await signInWithEmailAndPassword(auth, email, password);

        } catch (error) {
            setError(error.message.split(":")[1])
            return;
        }
        if (!error) {
            navigate('/', { replace: true });
        }
    }

    const randomUser = async () => {

        await signInWithEmailAndPassword(auth, 's@s.com', '123456');
        navigate('/', { replace: true });
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setError('')
        }, 2000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        !userID ?
            <div className='signup_main'>
                {
                    seller == user && register ?
                        <div style={{ display: 'flex', width: '100%', height: '4vh', justifyContent: 'center' }}>
                            Are You A Seller?
                            <button onClick={() => setSeller(true)}>Yes</button>
                            <button onClick={() => setUser(true)}>No</button>
                        </div> : null
                }
                {error ?
                    <div style={{ display: 'flex', alignItems: 'center', width: '28rem', height: '3rem', color: 'red', justifyContent: 'center' }}>
                        <div>*{error}</div>
                    </div> : null
                }

                {
                    register ? <h1>Sign Up</h1> : <h1>Log In</h1>
                }

                <div className='signup_cont'>
                    {
                        register ?

                            <input className='signup_input' type="text" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></input> : null
                    }
                    <input className='signup_input' type="text" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input className='signup_input' type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                    {
                        seller ?
                            <input className='signup_input' placeholder='Contact Number' value={contact} onChange={(e) => setContact(e.target.value)}></input> : null
                    }
                    {
                        seller ?
                            <input className='signup_input' placeholder='Company Name' value={company} onChange={(e) => setCompany(e.target.value)}></input> : null
                    }



                    {
                        register ?
                            <div style={{ width: '100%', height: '100%' }}>
                                <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}>
                                </input>
                                <label htmlFor="file" className='signup_file_lable'>
                                    Upload Profile Pic
                                </label>


                                <div className='btn' onClick={createAccount}>
                                    Sign Up
                                </div>
                                <div style={{ marginTop: '2%' }}>
                                    Already Have An Account?
                                    <Link to='/login' style={{ color: 'yellow' }}>
                                        Login
                                    </Link>
                                </div>
                            </div> :
                            <div>
                                <div className='btn' onClick={login}>
                                    Log In
                                </div>
                                <div style={{ marginTop: '2%' }}>
                                    Don't Have An Account?
                                    <Link to='/register' style={{ color: 'yellow' }}>
                                        Create Account
                                    </Link>
                                </div>
                            </div>
                    }
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '50%', justifyContent: 'space-evenly' }}>
                        <div>
                            OR
                        </div>
                        <div className='btn' style={{ backgroundColor: 'red' }} onClick={randomUser}>
                            Log In As Random User
                        </div>
                    </div>
                </div >
            </div > : <Navigate to="/" />

    )
}

export default Form
