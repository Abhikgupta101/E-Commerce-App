import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SubNavbar = () => {

    const navigate = useNavigate()

    const categories = [
        {
            id: '0',
            category: 'gadgets'
        },
        {
            id: '1',
            category: 'shoes'
        },
        {
            id: '2',
            category: 'clothes'
        }
    ]

    const updateCategory = (id) => {
        navigate(`/category/${id}`, { replace: true });
    }

    return (
        <div className='subnav_container'>
            {
                categories.map((category) => (
                    <div key={category.id} onClick={() => updateCategory(category.category)}>{category.category}</div>
                ))
            }
        </div >
    )
}

export default SubNavbar