import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { arrayUnion, deleteDoc, doc, FieldValue, increment, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const SinglePost = ({ postData, userData }) => {
    const userid = useSelector(state => state.user.userUid)

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const productInfo = () => {
        if (userid == postData.uid) {
            return;
        }

        navigate(`/product/${postData.postUid}`, { replace: true });
    }

    const addCart = async () => {
        if (!userData[0].cart.includes(postData.postUid)) {

            await updateDoc(doc(db, "users", userid), {
                cart: arrayUnion(
                    postData.postUid
                )
            })

            await updateDoc(doc(db, "users", userid), {
                cartProd: arrayUnion({
                    id: postData.postUid,
                    qty: 1
                })
            })

            await updateDoc(doc(db, "users", userid), {
                totalCartPrice: increment(postData.price)
            })
        }
    }

    const deletePost = async () => {
        await deleteDoc(doc(db, `products`, postData.postUid))
    }

    return (
        <div className='singlepost_cont'
            style={{ backgroundImage: `url(${postData.postImg})` }}
        >
            <div className='singlepost_img' onClick={productInfo}>
            </div>
            <div className='singlepost_info'>
                <div>
                    {postData.title}
                </div>
                <div>
                    Price: ${postData.price}
                </div>
            </div>
            <div className='singlepost_footer'>
                <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    {
                        userid == postData.uid ? <DeleteIcon fontSize='large' onClick={deletePost} /> :
                            <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center', overflow: 'hidden' }}>
                                {
                                    postData.quantity != 0 ?
                                        <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center', overflow: 'hidden' }}>

                                            {userData.length == 1 && userData[0].cart.includes(postData.postUid) ?
                                                null : <AddShoppingCartIcon fontSize='large' onClick={addCart} />}
                                            <p>Quantity: {postData.quantity}</p>
                                        </div> : <p style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</p>
                                }

                            </div>
                    }

                </div>
            </div>

        </div >
    )
}

export default SinglePost