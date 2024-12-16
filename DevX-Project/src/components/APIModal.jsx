import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'


function APIModal(props) {
    //pass the user's address in the props
    //const [showModal, setShowModal] = useState(props.isOpen)
    const [address, setAddress] = useState(props.address)
    const [loadingState, setLoadingState] = useState(true)
    const [nearbyCafes, setNearbyCafes] = useState([])

    useEffect(() => {
        console.log("props", props)
        const userEmail = props.email
        // console.log("id", userId)
        // async function getUserLocation(id) {
        //     try{
               
        //         setAddress(data)
        //     }catch(err){
        //         console.log("Location:", err)
        //     }
        // }

        // getUserLocation(userId)
        async function fetchData() 
        {
            const VITE_APIKEY = import.meta.env.VITE_APIKEY;

            let {data, loading, error} = await axios.get(`http://localhost:3000/user/${userEmail}`)
            let {streetAddress, city, state} = data
            streetAddress = streetAddress.replace(' ', '%20')
            city = city.replace(' ', '%20')
            state = state.replace(' ', '%20')

            try{
                let {data, loading, error} = await axios.get(`https://api.geoapify.com/v1/geocode/search?apiKey=${VITE_APIKEY}&text=${streetAddress}%20${city}%20${state}`)
                let {lat, lon} = data.features[0].properties
                let {data: nearbyData, loading: nearbyLoading} = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.cafe&filter=circle:${lon},${lat},5000&apiKey=${VITE_APIKEY}`)
                console.log(nearbyData)
                console.log(VITE_APIKEY)
                setLoadingState(false)
                setNearbyCafes(nearbyData.features)
            }catch(err){
                console.log("d",err)
            }

        }
        fetchData()
    },[])


    if(loadingState){
        return (
            <div>Loading...</div>
        )
    }else{
        return (
            <div>
            <h1>Nearby Cafes</h1>
            <ul>
                {nearbyCafes.map((cafe, index) => (
                    <li key={index}>
                        <h4><a href={cafe.properties.website}>{cafe.properties?.name || 'Unnamed Cafe'}</a></h4>
                        <h5> {cafe.properties.opening_hours}</h5>
                        <h5> {cafe.properties.address_line2}</h5>
                    </li>
                ))}
            </ul>
        </div>
        )
    }
}

export default APIModal