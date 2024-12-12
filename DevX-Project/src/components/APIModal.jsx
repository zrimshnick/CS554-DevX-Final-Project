import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import ReactModal from 'react-modal'
import { use } from 'react'
import.meta.env.VITE_APIKEY
function APIModal(props) {
    //pass the user's address in the props
    const [showModal, setShowModal] = useState(props.isOpen)
    const [loadingState, setLoadingState] = useState(true)
    const [nearbyCafes, setNearbyCafes] = useState([])
    const { location } = props
    const { streetAddress, city, state } = location
    
    useEffect(() => {
        //replace spaces with %20 for the API call
        async function fetchData() {
            streetAddress = streetAddress.replace(' ', '%20')
            city = city.replace(' ', '%20')
            state = state.replace(' ', '%20')
            try{
                let {data, loading, error} = await axios.get(`https://api.geoapify.com/v1/geocode/search?apiKey=${VITE_APIKEY}&text=${streetAddress}%20${city}%20${state}`)
                let {lat, lon} = data.features[0].properties
                let {data: nearbyData, loading: nearbyLoading} = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.cafe&filter=circle:${lon},${lat},5000&apiKey=${VITE_APIKEY}`)
                setLoadingState(false)
                setNearbyCafes(nearbyData.features)
            }catch(err){
                console.log(err)
            }

        }
        fetchData()
    },[showModal])


    if(loadingState){
        return (
            <div>Loading...</div>
        )
    }else{
        return (
            <div>
                <ReactModal
                isOpen={showModal}
                name="Find Nearby Cafes">
                    <h1>Nearby Cafes</h1>
                    <ul>
                        {nearbyCafes.map((cafe, index) => {
                            return (
                                <li key={index}><h4>{cafe.properties.name}</h4></li>

                            )
                        })}
                    </ul>
                    <button onClick={() => setShowModal(false)}>Close</button>
                </ReactModal>
            </div>
        )
    }
}

export default APIModal