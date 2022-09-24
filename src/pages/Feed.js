import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import SinglePost from '../components/SinglePost';
import SubNavbar from '../components/SubNavbar';
import { db } from '../Firebase';

const Feed = () => {
    const userID = localStorage.getItem('userId')
    const [post, setPost] = useState([])
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

    useEffect(() => {
        const colRef = collection(db, 'products')
        const unsub = onSnapshot(query(colRef, orderBy("postTime", "desc")), (snapshot) => {
            let tempArray = []
            snapshot.docs.forEach((doc) => {
                tempArray.push({ ...doc.data() })
            })

            setPost([...tempArray])
        })
        return () => {
            unsub();
        }

    }, [])


    return (
        userID ? <div>
            <Navbar userData={userData} />
            <SubNavbar />
            <div className='feed_singlepost'>
                {
                    post.map((postData) => (
                        <SinglePost key={postData.postUid} postData={postData} userData={userData} />
                    ))
                }

            </div>

        </div> : <Navigate to="/login" />
    )
}

export default Feed