import './Map.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Component, useState, useEffect } from 'react';
import { Field, TextArea, Submit } from '../Form.js';

function Places ({id}) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    let places = [];
    
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
                        <a href={item.link} target='_blank'>{item.name}</a><br />{item.description}
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
    <AddPlaceForm />
    </>
}


class AddPlaceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            link: '',
            latitude: '',
            longitude: '',
            showAddPlaceForm: false
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showAddPlace = this.showAddPlace.bind(this);
    }
  
    handleChange(e) {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === 'checkbox' ? e.target.checked : e.target.value;
        this.setState({[name]: value});
    }
  
    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        // send form datas to http://localhost/v1.0/places/1
        fetch('http://localhost/v1.0/places/1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
    }

    showAddPlace(e) {
        this.setState({showAddPlaceForm: true});
        console.log(this.state.showAddPlaceForm);
    }
  
    render() {
        if (this.state.showAddPlaceForm) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <Field name="name" value={this.state.name} onChange={this.handleChange}>Nom</Field>
                    <TextArea name="description" value={this.state.description} onChange={this.handleChange}>Description</TextArea>
                    <Field name="link" type="link" value={this.state.link} onChange={this.handleChange}>Lien</Field>
                    <Field name="latitude" type="number" step="0.0001" value={this.state.latitude} onChange={this.handleChange}>Latitude</Field>
                    <Field name="longitude" type="number" step="0.0001" value={this.state.longitude} onChange={this.handleChange}>Longitude</Field>
                    <Submit>Ajouter</Submit>
                </form>
            );
        }
        else {
            return <button onClick={this.showAddPlace}>Ajouter un nouveau lieu</button>
        }
    }
}

function MapPage() {
    return <>
    <Map />
    </>
}

export default MapPage;
