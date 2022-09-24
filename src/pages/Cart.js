import { arrayRemove, collection, deleteDoc, doc, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import { db } from '../Firebase'
import { Navigate, useNavigate } from 'react-router-dom';
import SingleCartProduct from '../components/SingleCartProduct';

const Cart = () => {
  const userid = localStorage.getItem('userId')
  const [userData, setUserData] = useState([])
  const [post, setPost] = useState([])

  const navigate = useNavigate()

  const productInfo = (id) => {
    navigate(`/product/${id}`, { replace: true });
  }

  useEffect(() => {

    const userRef = collection(db, 'users');
    const q = query(userRef, where("uid", "==", userid))
    const unsub = onSnapshot(q, (querySnapshot) => {
      let tempArray = [];
      querySnapshot.forEach((doc) => {
        tempArray.push({ ...doc.data() });
      });
      setUserData([...tempArray]);
    });
    return () => unsub();
  }, [userid]);

  return (
    userid ?
      <div>
        <Navbar userData={userData} />
        {


          userData.length == 1 ?
            <div style={{ display: 'flex', width: '80vw', height: '10vh', alignItems: 'center', justifyContent: 'center', margin: 'auto', marginTop: '15vh', fontSize: '30px' }}>CART PRICE: ${userData[0].totalCartPrice}</div> : null
        }
        {

          userData.length == 1 ?
            < div style={{ display: 'flex', flexDirection: 'column', marginTop: '5vh', marginBottom: '5vh', alignItems: 'center' }}>
              {
                userData[0].cartProd.map((cart) => (
                  <SingleCartProduct key={cart.id} cart={cart} userData={userData} />
                ))
              }
            </div> : null
        }

      </div > : <Navigate to="/login" />
  )
}

export default Cart