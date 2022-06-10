import './Map.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Component, useState, useEffect } from 'react';

function Places ({id}) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    let places = [];
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch('http://localhost/v1.0/places/' + id)
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setItems(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [])
    
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        const placesList = items['places']
        placesList.forEach(item => {
            places.push(
                <Marker position={item.coordinates} key={item.id}>
                    <Popup>
                        <a href={item.link}>{item.name}</a><br />{item.description}
                    </Popup>
                </Marker>
            )
        })
        return places;
    }
}

function Map () {
    return <>
    <MapContainer center={[46.590795,1.9753367]} zoom={5} scrollWheelZoom={true} id="map">
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Places id="1"/>
    </MapContainer>
    </>
}



function MapPage() {
    return <>
    <Map />
    </>
}

export default MapPage;
