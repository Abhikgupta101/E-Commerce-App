import { signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from '../Firebase';
import Logo from '../assests/logo.jpg'
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';


const Navbar = ({ userData }) => {
    const [sell, setSell] = useState(false)
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userid = useSelector(state => state.user.userUid)

    const logout = async () => {
        await updateDoc(doc(db, "users", userid), {
            isOnline: false,
        });
        await signOut(auth);
        navigate('/register', { replace: true });
    }

    return (

        <div>
            {
                userData.length == 1 ?
                    <div className='nav_container'>
                        <div className='nav_logo'>
                            <div>E-CART</div>
                        </div>
                        <div className='nav_links'>
                            <Link to='/' style={{ textDecoration: 'none', color: 'white' }}><HomeIcon /></Link>
                            {userData[0].isSeller ?
                                <Link to='/sell' style={{ textDecoration: 'none', color: 'white' }}>Sell</Link> : null
                            }



                            <div style={{ display: 'flex' }}>
                                <Link to='/cart' style={{ textDecoration: 'none', color: 'white' }}><ShoppingCartIcon />
                                </Link>
                                {userData[0].cartProd.length}
                                {/* {userData.length == 1 ?
                        <div>
                            {userData[0].cart.length}
                        </div> : null} */}
                            </div>
                            <Link to='/profile' style={{ textDecoration: 'none', color: 'white' }}><AccountCircleIcon /></Link>
                            <div onClick={logout}>
                                <LogoutIcon />
                            </div>

                        </div>
                    </div> : null
            }
        </div>
    )
}

export default Navbar