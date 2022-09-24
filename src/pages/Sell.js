import { arrayUnion, collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../Firebase';
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';


const Sell = () => {
    const userID = localStorage.getItem('userId')

    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Choose category')
    const [brand, setBrand] = useState('')
    const [quantity, setQuantity] = useState(10)
    const [warranty, setWarranty] = useState('')
    const [description, setDiscription] = useState('')
    const [price, setPrice] = useState(10)
    const [file, setFile] = useState(null)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const [userData, setUserData] = useState([])
    const userid = useSelector(state => state.user.userUid)

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

    // ADDING PRODUCT ON APP
    const upload = () => {
        if (file == null) {
            setError('Upload Product Pic')
            return;
        }
        if (category == "Choose category") {
            setError('Choose A Category')
            return;
        }

        let uid = uuidv4();
        const storageRef = ref(storage, `${userData[0].uid}/post/${uid}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // setFileLoad(progress)
                switch (snapshot.state) {
                    case 'paused':
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
                        profileName: userData[0].name,
                        profileImage: userData[0].photoURL,
                        uid: userData[0].uid,
                        title,
                        category,
                        brand,
                        quantity,
                        warranty,
                        description,
                        price,
                        postImg: downloadURL,
                        postUid: uid,
                        reviews: [],
                        postTime: serverTimestamp()

                    }
                    await setDoc(doc(db, "products", uid), obj)
                    await updateDoc(doc(db, "users", userData[0].uid), {
                        products: arrayUnion(uid)
                    });
                });
                setFile(null)
                navigate('/', { replace: true });
            }
        );
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('')
        }, 2000);
        return () => clearTimeout(timer);
    }, [error]);

    return (
        userID ? <div>
            <Navbar userData={userData} />
            <div className='signup_main'>
                {error ?
                    <div style={{ display: 'flex', alignItems: 'center', width: '28rem', height: '3rem', justifyContent: 'center', backgroundColor: 'red' }}>
                        <div>*{error}</div>
                    </div> : null
                }
                <h1>Product Details</h1>
                <div className='signup_cont'>
                    <input className='signup_input' placeholder='Product Title' value={title} onChange={(e) => setTitle(e.target.value)}></input>
                    <select className='signup_input' onChange={(e) => setCategory(e.target.value)}>
                        <option>Choose category</option>
                        <option value="gadgets">Gadgets</option>
                        <option value="shoes">Shoes</option>
                        <option value="clothes">Clothes</option>
                    </select>
                    <input className='signup_input' placeholder='Brand Name' value={brand} onChange={(e) => setBrand(e.target.value)}></input>
                    <input type="number" className='signup_input' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}></input>
                    <input className='signup_input' placeholder='Warranty' value={warranty} onChange={(e) => setWarranty(e.target.value)}></input>
                    <input className='signup_input' placeholder='Description' value={description} onChange={(e) => setDiscription(e.target.value)}></input>
                    <input type="number" className='signup_input' placeholder='Price' value={price} onChange={(e) => setPrice(parseInt(e.target.value))}></input>
                    <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])}>
                    </input>
                    <label for="file" className='signup_file_lable'>
                        Upload Product Image
                    </label>
                    <div className='btn' onClick={upload}>
                        LIST PRODUCT
                    </div>
                </div >
            </div >
        </div > : <Navigate to="/login" />
    )
}

export default Sell