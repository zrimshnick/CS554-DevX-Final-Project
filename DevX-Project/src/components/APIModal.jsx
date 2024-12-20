import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Grid, Typography, Paper, Box } from '@mui/material';
import './APIModal.css'
// import { Link } from 'react-router-dom';
const API_LOCAL = "http://localhost:3000"



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

            let {data, loading, error} = await axios.get(`${import.meta.env.VITE_HEROKU_SERVER || API_LOCAL}/user/${userEmail}`)
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
            <div className='nearby-cafes-container'>
            <Paper className='nearby-cafes-paper' sx={{ padding: 2, borderRadius: 2, width: '95%', display:"flex", flexDirection:"column", justifyContent:"center", alignItems: "center" }}>
                <Typography variant="h6" gutterBottom className="nearby-cafes-title">
                Nearby Cafes
                </Typography>
                <Grid container spacing={2} justifyContent="center" className="nearby-cafes-grid">
                {nearbyCafes.map((cafe, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3} className="cafe-item">
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography className="cafe-name" variant="body2" align="center" sx={{ marginTop: 1 }}>
                        {cafe.properties.website && (
                        cafe.properties.website.slice(0,5) === "https" ? (
                        <a
                            href={cafe.properties.website}
                            className="cafe-link"
                        >
                            {cafe.properties.name}
                        </a>
                        ) : cafe.properties.website.slice(0,7) === "http://" ? (
                        <a
                            href={`https://${cafe.properties.website.slice(7)}`}
                            className="cafe-link"
                        >
                            {cafe.properties.name}
                        </a>
                        ) : (
                        <a
                            href={`https://${cafe.properties.website}`}
                            className="cafe-link"
                        >
                            {cafe.properties.name}
                        </a>
                        )
                        )}
                        </Typography>
                        <Typography className="cafe-address" variant="body2" align="center" sx={{ marginTop: 1 }}>
                        {cafe.properties.address_line2}
                        </Typography>
                        <Typography className="cafe-hours" variant="body2" align="center" sx={{ marginTop: 1 }}>
                        {cafe.properties.opening_hours}
                        </Typography>
                    </Box>
                    </Grid>
                ))}
                </Grid>
            </Paper>
        </div>
        )
    }
}

export default APIModal