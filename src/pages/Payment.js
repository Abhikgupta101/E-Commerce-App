import { arrayRemove, arrayUnion, collection, doc, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../Firebase';
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';

const Payment = () => {
    const userID = localStorage.getItem('userId')
    const userid = useSelector(state => state.user.userUid)
    var { prodId, prodQty, prodPrice, cartPrice, prodTitle } = useParams();
    const [order, setOrder] = useState()
    const [error, setError] = useState('')
    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [creditNum, setCreditNum] = useState()
    const [cvv, setCvv] = useState()
    const [expiryDate, setExpiryDate] = useState()

    // ADDING PRODUCT ON APP
    const submitOrder = async () => {
        if (!first || !last || !creditNum || !cvv || !expiryDate) {
            setError('All Fields Are Mandatory')
            return;
        }
        let uid = uuidv4();
        await setDoc(doc(db, "payments", uid), {
            userId: userid,
            paymentId: uid,
            prodId,
            prodQty,
            prodPrice,
            prodTitle,
            first,
            last,
            cvv,
            creditNum,
            expiryDate
        })

        if (cartPrice != 0) {


            await updateDoc(doc(db, "users", userid), {
                cartProd: arrayRemove({
                    id: prodId,
                    qty: parseInt(prodQty)
                })
            })

            await updateDoc(doc(db, "users", userid), {
                cart: arrayRemove(
                    prodId,
                )
            })

            await updateDoc(doc(db, "users", userid), {
                totalCartPrice: parseInt(cartPrice) - (parseInt(prodPrice) * parseInt(prodQty))
            })
        }

        await updateDoc(doc(db, "products", prodId), {
            quantity: increment(- parseInt(prodQty))
        })
        setOrder(prodPrice * prodQty)

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setOrder('')
            setError('')
        }, 3000);

        return () => clearTimeout(timer);
    }, [error ? error : order]);

    return (
        userID ? <div>
            <div className='signup_main'>
                {order ?
                    <div style={{ display: 'flex', alignItems: 'center', width: '28rem', height: '3rem', color: 'white', justifyContent: 'center', backgroundColor: 'green' }}>
                        <div>You Have SuccessFully Placed An Order of ${order}</div>
                    </div> : null
                }

                {error ?
                    <div style={{ display: 'flex', alignItems: 'center', width: '28rem', height: '3rem', color: 'white', justifyContent: 'center', backgroundColor: 'red' }}>
                        <div>{error}</div>
                    </div> : null
                }

                <h1>Payment Details</h1>
                <div className='signup_cont'>
                    <input className='signup_input' placeholder='First Name' value={first} onChange={(e) => setFirst(e.target.value)}></input>
                    <input className='signup_input' placeholder='Last Name' value={last} onChange={(e) => setLast(e.target.value)}></input>
                    <input className='signup_input' placeholder='Credit Card Number' type="number" value={creditNum} onChange={(e) => setCreditNum(e.target.value)}></input>
                    <input className='signup_input' type="number" placeholder='CVV' value={cvv} onChange={(e) => setCvv(e.target.value)}></input>
                    <input className='signup_input' type="tel" maxlength="4" placeholder='Expiry Date' value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}></input>
                    <div className='btn' style={{ backgroundColor: 'green' }} onClick={submitOrder}>
                        Submit Order
                    </div>
                    <div className='btn'>
                        <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>Cancel Payment</Link>
                    </div>
                </div >
            </div >
        </div > : <Navigate to="/login" />
    )
}

export default Payment