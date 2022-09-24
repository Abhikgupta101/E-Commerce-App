import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import { useSelector, useDispatch } from "react-redux";
import { setUser } from './store/userSlice';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import Feed from './pages/Feed';
import Sell from './pages/Sell';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Edit from './pages/Edit';
import Category from './pages/Category';
import Payment from './pages/Payment';

export default function App() {
  const userID = localStorage.getItem('userId')
  const dispatch = useDispatch();
  const userid = useSelector(state => state.user.userUid)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid))
        localStorage.setItem('userId', user.uid)
      }
      else {
        dispatch(setUser(null))
        localStorage.setItem('userId', '')
      }
    });
  }, []);


  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<Feed />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/edit/:id' element={<Edit />} />
        <Route path='/category/:id' element={<Category />} />
        <Route path='/payment/:prodId/:prodQty/:prodPrice/:cartPrice/:prodTitle' element={<Payment />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        < Route path='/*' element={<Navigate to="/login" />} />
      </Routes >
    </BrowserRouter >
  );
}
