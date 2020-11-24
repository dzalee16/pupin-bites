import React, { useEffect, useRef, useState } from 'react'
import { map, uniqBy } from 'lodash'
import Main from '../../components/Main' 
import RestaurantItem from '../../components/RestaurantItem'
//Css
import './PollCreate.css'

// Services
import { getAllRestaurants, createPoll } from '../../services/services.js'

const PollCreate = () => {
    const [change, setChange] = useState('')
    const [filter, setFilter] = useState([])
    const [selected, setSelected] = useState([])
    const [restaurants, setRestaurants] = useState([])
    const [pollName, setPollName] = useState('')

    // States for time calculation
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(15)
    const [duration, setDuration] = useState(15)
    // Token
    const tokenRef = useRef(localStorage.getItem("Token"))
    const token = tokenRef.current

    useEffect(() => {
        getAllRestaurants(token).then(res => {
            let tmp = res.data
            setRestaurants(map(uniqBy(tmp, 'name')))
        })
    }, [token])

    // Handeling hours
    const handleTime = (e) => {
        let name = e.target.name
        let value = e.target.value

        if (name === 'hours') {
            (value > 24) ? setHours(e.target.value) : setHours(value)
        }
        else if (name === 'minutes') {
            value > 59 ? setMinutes(e.target.value) : setMinutes(value)
        }
        setDuration(Number(hours) * 60 + Number(minutes))
    }
    // Handeling input change
    const handleChange = (e) => {
        setChange(e.target.value)
        change <= 0 ? setFilter([]) : setFilter(restaurants.filter(el => el.name.toLowerCase().includes(change)))
    }
    // Add button
    const handleClickAdd = (restaurant, e) => {
        let id = e.target.id
        setSelected(selected.concat(restaurant))
        setRestaurants(restaurants.filter(el => el.id !== id))
        setFilter(filter.filter(el => el.id !== id))
    }
    // Remove button
    const handleClickRemove = (e) => {
        let id = e.target.id
        setSelected(selected.filter(el => el.id !== id))
        setRestaurants(restaurants.concat(selected.filter(el => el.id === id)))
        setFilter(filter.concat(selected.filter(el => el.id === id)))
    }
    // Submit button
    const handleSubmit = () => {
        let data = {
            "label": pollName,
            "restaurants": selected.map(el => el.id)
        }
        createPoll(data).then(res => {
            console.log(res.data)
        })  
    }

    const displayResults = selected.length === 0 ? "none" : "block";

    return (
        <>
        <Main>
            <div> 
           
                <h1>Create Poll</h1>
                <input type="text" placeholder="Poll Name" onChange={(e) => setPollName(e.target.value)} required />
                <div className="pollDuration">
                    <div className="title">Set Duration</div>
                    <div className="hours">                  
                        <input type="number" placeholder="h" name="hours"  min="0" max="24" onChange={(e) => handleTime(e)} required />
                    </div> 
                    <div className="minutes">
                        <input type="number" placeholder="m" name="minutes"   min="10" max="59" size="100" onChange={(e) => handleTime(e)} required /> 
                    </div>
                </div> 
                <input type="text" placeholder="Search Restaurant" onChange={handleChange} />

                <div className="restaurant-list">
                {change.length === 0 ? restaurants.map((restaurant) => (
                    //Complete list
                    <div className="item" key={restaurant.id}>
                        <div><RestaurantItem restaurant={restaurant}/></div>
                        <button onClick={(e) => handleClickAdd(restaurant, e)} id={restaurant.id}>+ </button>
                    </div>))
                    : filter.map((restaurant) => (
                        //Filtered list
                        <div className="item" key={restaurant.id}> 
                            <div><RestaurantItem restaurant={restaurant}/></div>
                            <button onClick={(e) => handleClickAdd(restaurant, e)} id={restaurant.id}>+ </button>
                        </div>))}
                </div>
            </div>

            <div  style={{display:`${displayResults}`}}>
                <div className="selected-list">
                {selected.map((restaurant) => (
                    <div className="selected-item" key={restaurant.id} >
                        <div className="restaurant-name">{restaurant.name}</div>
                        <div className="delete"><button onClick={(e) => handleClickRemove(e)} id={restaurant.id}>X</button></div>
                    </div>))}
                </div> 
                <div >
                    <button className="bigButton" type="submit" onClick={(e) => handleSubmit(e)}>Create Poll</button>
                </div>
            </div>
 

        </Main>
     </>
    )
}
export default PollCreate