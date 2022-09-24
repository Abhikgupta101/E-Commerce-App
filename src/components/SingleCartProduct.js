import { arrayRemove, arrayUnion, collection, doc, increment, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { db } from '../Firebase';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from 'react-router-dom';

const SingleCartProduct = ({ cart, userData }) => {
    const navigate = useNavigate()
    const userid = useSelector(state => state.user.userUid)
    const [product, setProduct] = useState([])

    const buyProd = () => {
        navigate(`/payment/${cart.id}/${cart.qty}/${product[0].price}/${userData[0].totalCartPrice}/${product[0].title}`, { replace: true });
    }

    const removeCart = async () => {
        if (cart.qty == 1) {
            await updateDoc(doc(db, "users", userid), {
                cartProd: arrayRemove({
                    id: cart.id,
                    qty: cart.qty
                })
            })

            await updateDoc(doc(db, "users", userid), {
                cart: arrayRemove(
                    cart.id,
                )
            })
        }
        else {
            await updateDoc(doc(db, "users", userid), {
                cartProd: arrayRemove({
                    id: cart.id,
                    qty: cart.qty
                })
            })

            await updateDoc(doc(db, "users", userid), {
                cartProd: arrayUnion({
                    id: cart.id,
                    qty: cart.qty - 1

                })
            })
        }

        await updateDoc(doc(db, "users", userid), {
            totalCartPrice: increment(-parseInt(product[0].price))
        })
    }

    const addCart = async () => {

        if (product[0].quantity == cart.qty) {
            alert('No more items available')
            return;
        }

        await updateDoc(doc(db, "users", userid), {
            cartProd: arrayRemove({
                id: cart.id,
                qty: cart.qty
            })
        })

        await updateDoc(doc(db, "users", userid), {
            cartProd: arrayUnion({
                id: cart.id,
                qty: cart.qty + 1

            })
        })

        // let val1 = parseInt(userData[0].totalCartPrice)
        // let val2 = parseInt(product[0].price)
        // let val3 = val1 + val2

        await updateDoc(doc(db, "users", userid), {
            totalCartPrice: increment(parseInt(product[0].price))
        })
    }

    const deleteCart = async () => {
        await updateDoc(doc(db, "users", userid), {
            cartProd: arrayRemove({
                id: cart.id,
                qty: cart.qty
            })
        })

        await updateDoc(doc(db, "users", userid), {
            cart: arrayRemove(
                cart.id,
            )
        })
        
        await updateDoc(doc(db, "users", userid), {
            totalCartPrice: increment(-parseInt(product[0].price * cart.qty))
        })
    }

    useEffect(() => {

        const prodRef = collection(db, 'products');
        const q = query(prodRef, where("postUid", "==", cart.id))
        const unsub = onSnapshot(q, (querySnapshot) => {
            let tempArray = [];
            querySnapshot.forEach((doc) => {
                tempArray.push({ ...doc.data() });
            });
            setProduct([...tempArray]);
        });
        return () => unsub();
    }, [cart.id]);

    return (

        <div className='cart'>
            {

                product.length == 1 ?
                    <div className='cart_cont'>
                        <div className='cart_info'>
                            <img style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                src={product[0].postImg} />
                        </div>
                        <div className='cart_info'>
                            {product[0].title}
                        </div>
                        <div className='cart_info'>
                            Price: ${(product[0].price * cart.qty)}
                        </div>
                        <div className='cart_counters'>
                            <AddCircleIcon onClick={addCart} />
                            <div>{cart.qty}</div>
                            <RemoveCircleIcon onClick={removeCart} />
                        </div>
                        <div className='cart_delete'>
                            <RemoveShoppingCartIcon onClick={deleteCart} />
                        </div>
                    </div > : null
            }
            < div style={{ cursor: 'pointer', backgroundColor: 'red', color: 'white', padding: '3px' }}>
                <div onClick={buyProd}>BUY PRODUCT</div>
            </div >
        </div>
    )
}

export default SingleCartProduct