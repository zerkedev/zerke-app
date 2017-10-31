// import InitialMap from './InitialMap';
// import React, { Component } from 'react';
// import _ from 'lodash';
// import axios from 'axios';

// import {
// 	withGoogleMap,
// 	GoogleMap,
// 	InfoWindow,
// 	Marker,
// } from "react-google-maps";


// export default class MainMap extends Component {
	
// 	constructor(props){
// 		super(props);

// 		this.state={
// 			markers: [],
// 			formValue:""	
// 		}
		
// 		this.handleMapClick = this.handleMapClick.bind(this);
// 		this.handleMarkerClick = this.handleMarkerClick.bind(this);
// 		this.handleMarkerClose = this.handleMarkerClose.bind(this);
// 		this.handleChange = this.handleChange.bind(this);
// 		this.UpdatingContent = this.UpdatingContent.bind(this);
// 	}
// 	componentDidMount(){
// 		axios.get('/api')
// 			.then(response => {
// 				const markerData = response.data;
// 				console.log(response.data)
// 				const nextMarkers = markerData.map(markerObject => {
// 					const latLng = {lat: Number(markerObject.latitude), lng: Number(markerObject.longitude)}
// 					const content = markerObject.content ? markerObject.content : null 
// 					return {
// 						id: markerObject.id,
// 						position: latLng,
// 						content: content
// 					}
// 				})
// 				this.setState({
// 					markers: nextMarkers
// 				})
// 			})
// 	}
// 	handleMapClick(event){
// 		const lat = event.latLng.lat();
// 		const lng = event.latLng.lng();

// 		axios.post('/api', {'latitude': lat, 'longitude': lng})
// 			.then(response => {
// 				const markerData = response.data; 
// 				console.log(response.data)
// 				const nextMarkers = markerData.map(markerObject => {
// 					const latLng = {lat: Number(markerObject.latitude), lng: Number(markerObject.longitude)}
// 					const content = markerObject.content ? markerObject.content : null 
// 					return {
// 						id: markerObject.id,
// 						position: latLng,
// 						content: content
// 					} 
// 				})
// 				this.setState({
// 					markers:nextMarkers
// 				})
// 			})
// 	}
// 	handleChange(event){
// 		this.setState({formValue: event.target.value})
// 	}

// 	handleMarkerClick(targetMarker) {
// 		this.setState({
// 			markers:this.state.markers.map(marker => { 
// 				if (marker === targetMarker) marker.showInfo = true 
// 				if (!marker.content){
// 					marker.content = ( 
// 						<form onSubmit={(event) => {
// 							console.log(event, marker.id)
// 							this.UpdatingContent(this.state.formValue, marker.id)
// 						}}>
// 							<label>Description:</label>
// 							<input type="text" onChange={this.handleChange}/>
// 						</form>
// 						)} else {
// 							marker.imageUrl = imageArray[Math.floor(Math.random() * 10)]
// 							console.log(imageArray[Math.floor(Math.random()*10)])
// 						}
// 						console.log(marker)
// 						return marker;
// 				})
// 		})
// 	}
// 	updatingContent( content, markerId) {
// 		axios.put('/api', {conent: content, id: markerId})
// 		.then(response => {
// 			const markerData = response.data;
// 			const nextMarkers = markerData.map(markerObject => {
// 				const latLng = {lat: Number(markerObject.latitude), lng: Number(markerObject.longitude)}
// 				const content = markerObject.content ? markerObject.content : null 
// 				return {
// 					id: markerObject.id,
// 					position: latLng,
// 					content: content
// 				} 
// 			})
// 		})
// 	}
// 	handleMarkerClose(targetMarker) {
// 		this.setState({
// 			markers: this.state.markers.map(marker => {
// 				if (markers === targetMarker) marker.showInfo = false
// 				return marker;
// 			}),
// 		})
// 	}



// 	render() {
// 		return (
// 		<div style={{height:"100%"}}>
// 			<InitialMap
// 				containerElement={
// 					<div style={{height:"100%"}} />
// 				}
// 				mapElement={
// 					<div style={{height:"100%"}} />
// 				}
// 				markers={this.state.markers}
// 				onMapLoad={this.handleMapLoad}
// 				onMapClick={this.handleMapClick}
// 				OnMarkerClick={this.handleMarkerClick}
// 				OnMarkerClose={this.handleMarkerClose}

// 			  />
// 		</div>
// 	  );
//  	}
// }