import { arrayUnion, collection, doc, increment, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/Navbar';
import { db } from '../Firebase';

const Product = () => {
    const userID = localStorage.getItem('userId')

    const [userData, setUserData] = useState([])
    const [review, setReview] = useState('')

    const navigate = useNavigate()

    const userid = useSelector(state => state.user.userUid)

    const [productData, setProductData] = useState([])

    let { id } = useParams();

    const buyProd = async () => {
        navigate(`/payment/${id}/1/${productData[0].price}/0/${productData[0].title}`, { replace: true });
    }

    const addReview = async () => {
        await updateDoc(doc(db, "products", id), {
            reviews: arrayUnion(
                {
                    review,
                    from: productData[0].profileName
                }
            )
        })
    }

    useEffect(() => {
        const colRef = collection(db, 'products')
        const unsub = onSnapshot(query(colRef, where("postUid", "==", id)), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setProductData([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [id])

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
        userID ? <div>
            <Navbar userData={userData} />
            {
                productData.length == 1 ?
                    <div className='prod_cont'>
                        <div className='prod_cont_img'>
                            <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={productData[0].postImg} />
                        </div>
                        <div className='prod_info'>
                            <div style={{
                                fontSize: '30px', fontWeight: 'bolder'
                            }} >
                                {productData[0].title}
                            </div>
                            <div>
                                {productData[0].brand}
                            </div>
                            <div>
                                {productData[0].description}
                            </div>
                            <div style={{ fontSize: '30px', fontWeight: 'bolder' }}>
                                Price: ${productData[0].price}
                            </div>
                            <div className='prod_footer'>
                                {
                                    productData[0].quantity == 0 ? <div style={{ backgroundColor: 'red', color: 'white', padding: '3px' }}>OUT OF STOCK</div> :
                                        <div className='prod_footer'>
                                            <div style={{ cursor: 'pointer', backgroundColor: 'red', color: 'white', padding: '3px' }} onClick={buyProd}>BUY NOW</div>
                                            <div>Quantity: {productData[0].quantity}</div>
                                            <div>Warranty: {productData[0].warranty} Year</div>
                                        </div>
                                }
                            </div>
                        </div>
                        <div style={{ width: '20%', height: '5vh', marginTop: '5vh', fontSize: '20px', fontWeight: 'bolder' }}>REVIEWS</div>
                        <div className='prod_reviews'>
                            {
                                productData[0].reviews.map((review) => (
                                    <div key={uuidv4()}>{review.review} - {review.from}</div>
                                ))
                            }
                        </div>
                        <div className='messageform_cont'>
                            <input style={{ height: "2vh", flex: "1", padding: "11px", border: "none", outline: "none" }} type="text" placeholder="Your Message"
                                value={review} onChange={(e) => setReview(e.target.value)}></input>
                            <button style={{ height: "5vh", flex: "0.2" }} onClick={addReview}>Send</button>
                        </div>


                    </div> : null
            }

        </div > : <Navigate to="/login" />
    )
}

export default Product