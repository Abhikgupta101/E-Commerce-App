import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { db } from '../Firebase';


const Edit = () => {
    const userID = localStorage.getItem('userId')

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [contact, setContact] = useState('')
    const [company, setCompany] = useState('')
    const [seller, setSeller] = useState(false)

    const userid = useSelector(state => state.user.userUid)

    const [userData, setUserData] = useState([])

    const navigate = useNavigate()

    const updateInfo = async () => {
        if (!name || !password || !contact || !company) {
            alert('Every Field Should Be Filled')
            return;
        }
        await updateDoc(doc(db, "users", userid), {
            name,
            password,
            contact,
            company,
            isSeller: seller
        })

        navigate(`/`, { replace: true });
    }

    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsub = onSnapshot(query(usersRef, where("uid", "==", userid)), (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push({ ...doc.data() });
            });
            setUserData([...tempArray]);
        });
        return () => unsub();

    }, [userid]);
    return (
        userID ?
            <div>
                <Navbar userData={userData} />
                <div className='signup_main'>

                    <div className='signup_cont'>
                        {
                            userData.length == 1 ?
                                <div>
                                    <h1>Update User Information</h1>
                                    <input className='signup_input' type="text" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></input>
                                    <input className='signup_input' type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                                    {
                                        userData[0].isSeller || seller ?
                                            <div>
                                                <input className='signup_input' placeholder='Contact Number' value={contact} onChange={(e) => setContact(e.target.value)}></input>
                                                <input className='signup_input' placeholder='Company Name' value={company} onChange={(e) => setCompany(e.target.value)}></input>
                                            </div> :
                                            <div style={{ display: 'flex', width: '100%', height: '4vh', justifyContent: 'center', marginBottom: '3vh', marginTop: '3vh' }}>
                                                Do You Want To Become Seller?
                                                <button onClick={() => setSeller(true)}>Yes</button>
                                                <button>No</button>
                                            </div>
                                    }
                                    <div className='btn' onClick={updateInfo}>
                                        Update Info
                                    </div>
                                </div> : null
                        }
                    </div >
                </div>
            </div > : <Navigate to="/login" />
    )
}

export default Edit