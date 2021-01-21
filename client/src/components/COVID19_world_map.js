import React, { Component } from 'react'
import PageNavbar from "./PageNavbar";
import {MapContainer, GeoJSON, Popup, Marker} from 'react-leaflet'
import GeojsonData from './../countries.json'
import 'leaflet/dist/leaflet.css'
import '../style/COVID19_world_map.css'
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
export default class COVID19_world_map extends Component {
    constructor(props){
        super()
        this.state = {
            toggleCountryFlag : false,
            center : [50, -42], // center of the map, we should set it as a country's location
            countryName: '',
            date: '',
            color: ['#F7C7C7', '#FFBFBF', '#FF8080', '#E75858','#FF4040', '#FF0000', '#BF0000', '#701010'],
            hashMap: new Map(), // key is each country's name, value is a list[confirmed, death, recovered]
            colorPeriod:[],
            hashMapCountryColor: new Map(),
            markers: new Map(),
            countries: [],
            displayCountryName: '',
            displayDate : ''
        }
        this.onEachCountry = this.onEachCountry.bind(this)
        // this.onCountryMouseover = this.onCountryMouseover.bind(this)
        this.handleCountryNameChange = this.handleCountryNameChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        // this.helpUpdatePage = this.helpUpdatePage.bind(this)
    }

    componentDidMount() {
        fetch("http://localhost:8081/covid19_world_map", {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            var map = results[0]
            var locations = results[1]
            var updatedHashMap = new Map()
            for (var i = 0; i < map.length; i++) {
                var tmpList = []
                tmpList.push(map[i].confirmed)
                tmpList.push(map[i].death)
                tmpList.push(map[i].recovered)
                tmpList.push(6)
                updatedHashMap.set(map[i].country, tmpList)
            }
            var updatedColorPeriod = []
            var min = 0;
            var max = 0;
            for (var i = 0; i < map.length; i++) {
                min = Math.min(min, map[i].confirmed)
                max = Math.max(max, map[i].confirmed)
            }
            for (var i = 0; i < 10; i++) {
                updatedColorPeriod.push(min + i / 9 * (max - min))
            }
            
           
            var updatedLocations = new Map()
            var updatedCountries = []
            for (i = 0; i < locations.length; i++) {
                var tmp = []
                tmp.push(locations[i].latitude)
                tmp.push(locations[i].longitude)
                updatedLocations.set(locations[i].country, tmp)
                updatedCountries.push(locations[i].country)
            }
            this.setState({
                hashMap : updatedHashMap,
                colorPeriod : updatedColorPeriod,
                markers : updatedLocations,
                countries : updatedCountries
            })
        })
        
    }

    onEachCountry(country, layer){
        const countryName = country.properties.ADMIN
       
        const colorIndex = Math.floor(Math.random() * this.state.color.length)
        layer.options.fillColor = this.state.color[colorIndex]
        if (countryName === 'United States') {
            layer.options.fillColor = this.state.color[7]
        }
        layer.on({
            click: (event)=>{
                event.target.setStyle({
                    fillColor : 'yellow',
                    Popup : '123'
                })
            }
        })
    }

    handleCountryNameChange(event){
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSearch(){
        if (this.state.markers.has(this.state.countryName)) {
            
            this.setState({
                center : this.state.markers.get(this.state.countryName)
            })
        }

        if (this.state.countries.includes(this.state.countryName)) {
            this.setState({
                displayCountryName : this.state.countryName
            })
        }

        else {
            this.setState({
                displayCountryName : "This country doesn't exist!"
            })
        }
        

        if (this.state.date !== '' && this.state.date[4] === '-' && this.state.date.slice(5, 7) <= "10" && this.state.date.slice(8, 10) <= "30" && this.state.date.length === 10) {
            fetch("http://localhost:8081/covid19_world_map/" + this.state.date, {match : "GET"})
        .then((res)=>res.json())
        .then((map)=>{            
            var updatedHashMap = new Map()
            for (var i = 0; i < map.length; i++) {
                var tmpList = []
                tmpList.push(map[i].confirmed)
                tmpList.push(map[i].death)
                tmpList.push(map[i].recovered)
                tmpList.push(6)
                updatedHashMap.set(map[i].country, tmpList)
            }
            var updatedColorPeriod = []
            var min = 0;
            var max = 0;
            for (i = 0; i < map.length; i++) {
                min = Math.min(min, map[i].confirmed)
                max = Math.max(max, map[i].confirmed)
            }
            for (i = 0; i < 10; i++) {
                updatedColorPeriod.push(min + i / 9 * (max - min))
            }

            this.setState({
                hashMap : updatedHashMap,
                colorPeriod : updatedColorPeriod,
                displayDate : this.state.date
            })
        })
        }
        else {
            this.setState({
                displayDate : "This date doesn't exist!"
            })
        }
    }
    
    render() {
        return ( 
            <div > 
                <PageNavbar active='covid19_world_map'/>
                <MapContainer style={{height:"100vh"}} zoom={3} center={this.state.center} scrollWheelZoom={false}>
                <div className='searchBar'>
                    <input type='text' name="countryName" placeholder="Country name" onChange={this.handleCountryNameChange}></input>
                    <input type='text' name="date" placeholder="Date, e.g. 2020-9-20" onChange={this.handleCountryNameChange}></input>
                    <button onClick={this.handleSearch}>Search</button>
                </div>  

                <div className='displayCountry'>
                    <h4>{this.state.displayCountryName}</h4>
                    <h4>{this.state.displayDate}</h4>
                    <h4>{this.state.hashMap.has(this.state.displayCountryName) ? 'confirmed : ' + this.state.hashMap.get(this.state.displayCountryName)[0] : ''}</h4>
                    <h4>{this.state.hashMap.has(this.state.displayCountryName) ? 'Death : ' + this.state.hashMap.get(this.state.displayCountryName)[1] : ''}</h4>
                    
                </div>

                <GeoJSON 
                    data={GeojsonData}
                    onEachFeature = {this.onEachCountry}
                    style = {{
                        fillColor: 'white',
                        weight:1,
                        color: 'black',
                        fillOpacity:1
                    }}
                />
                 {/* <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
                 url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 /> */}
                    {this.state.countries.map((ele, idx)=>
                    <Marker key = {idx} position = {this.state.markers.get(ele)}>
                        <Popup>
                    <span>{ele}</span>
                    <br/>
                    <span>{this.state.hashMap.has(ele) ? 'Confirmed : ' + this.state.hashMap.get(ele)[0] : 'Confirmed : Unknown'}</span>
                    <br/>
                    <span>{this.state.hashMap.has(ele) ? 'Deaths : ' + this.state.hashMap.get(ele)[1] : 'Deaths : Unknown'}</span>
                        </Popup>
                    </Marker>
                )}
                </MapContainer>
            </div>
        )
    }
}
