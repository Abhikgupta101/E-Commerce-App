import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import EditIcon from '@mui/icons-material/Edit';
import { db } from '../Firebase';
import SinglePost from '../components/SinglePost';
import { Navigate, useNavigate } from 'react-router-dom';
import SubNavbar from '../components/SubNavbar';
import { Payment } from '@mui/icons-material';

const Profile = () => {
  const userID = localStorage.getItem('userId')

  const [userData, setUserData] = useState([])
  const [post, setPost] = useState([])

  const [payments, setPayments] = useState([])
  const [products, setProducts] = useState(true)
  const [orders, setOrders] = useState(false)

  const [inputState, setInputState] = useState('disabled')

  const userid = useSelector(state => state.user.userUid)


  const navigate = useNavigate()

  const editProfile = (id) => {
    navigate(`/edit/${id}`, { replace: true });
  }

  const profileOrders = () => {
    setProducts(false)
    setOrders(true)
  }

  const profileProducts = () => {
    setOrders(false)
    setProducts(true)

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

  useEffect(() => {
    const colRef = collection(db, 'products')
    const unsub = onSnapshot(query(colRef, where("uid", "==", userid)), (snapshot) => {
      let tempArray = []
      snapshot.docs.forEach((doc) => {
        tempArray.push({ ...doc.data() })
      })

      setPost([...tempArray])
    })
    return () => {
      unsub();
    }

  }, [userid])

  useEffect(() => {
    const colRef = collection(db, 'payments')
    const unsub = onSnapshot(query(colRef, where("userId", "==", userid)), (snapshot) => {
      let tempArray = []
      snapshot.docs.forEach((doc) => {
        tempArray.push({ ...doc.data() })
      })

      setPayments([...tempArray])
    })
    return () => {
      unsub();
    }

  }, [userid])

  return (
    userID ? <div>
      <Navbar userData={userData} />
      {
        userData.length == 1 ?

          <div style={{ display: 'flex', height: '10vh', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '10vh', backgroundColor: 'black', color: 'white' }}>
            <img style={{ width: '50px', height: '50px', borderRadius: '100px', marginLeft: '5%' }} src={userData[0].photoURL} />
            <div>{userData[0].name}</div>
            <div style={{ display: 'flex', cursor: 'pointer' }}>EDIT PROFILE <EditIcon onClick={() => editProfile(userData[0].uid)} /></div>
          </div> : null
      }
      <div className='subnav_container'>
        <div style={products ? { color: 'black' } : { color: 'white' }} onClick={profileProducts}>Products</div>
        <div style={orders ? { color: 'black' } : { color: 'white' }} onClick={profileOrders}>Orders</div>
      </div>
      {products ? <div className='feed_singlepost'>
        {
          post.map((postData) => (
            <SinglePost key={postData.postUid} postData={postData} userData={userData} />
          ))
        }
      </div> : null}
      {orders ? <div style={{ marginTop: '10vh' }}>
        {
          payments.map((payment) => (
            <div className='cart'>
              < div className='cart_cont' >
                <div className='cart_info'>
                  {payment.prodTitle}
                </div>
                <div className='cart_info'>
                  Quantity: {payment.prodQty}
                </div>
                <div className='cart_info'>
                  Price: ${payment.prodPrice}
                </div>
              </div >
              < div style={{ cursor: 'pointer', backgroundColor: 'red', color: 'white', padding: '3px' }}>
                <div>Payment Id: {payment.prodId}</div>
              </div >
            </div>
          ))
        }
      </div> : null}
    </div > : <Navigate to="/login" />

  )
}

export default Profile