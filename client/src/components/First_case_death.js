import React, { Component } from 'react'
import PageNavbar from "./PageNavbar";
import {Link} from 'react-router-dom'
import background from './pictures/first.jpg'
import "../style/First_case_death.css"

export default class First_case_death extends Component {
    constructor(props) {
        super()
        this.state = {
            country : '',
            countryList : [],
            date_of_first_case : null,
            last_visited_country : null,
            age_of_first_case: null,
            date_of_first_death : null,
            age_of_first_death : null,
            flag : false,
            case_source : '',
            death_source : ''
        }
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    componentDidMount(){
        fetch("http://localhost:8081/explore", {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            var updatedCountryList = []
            for (var i = 0; i < results.length; i++) {
                updatedCountryList.push(results[i].country)
            }
            this.setState({
                countryList : updatedCountryList
            })
        })
    }

    handleCountryChange(event) {
        const {name, value} = event.target
        this.setState({
            [name] : value
        })
        
    }

    handleSearch() {
        fetch("http://localhost:8081/firstcase/" + this.state.country, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            console.log(results)
            if (results[0].length !== 0 && results[1].length !== 0 && results[2].length !== 0) {
                    this.setState({
                    date_of_first_case : results[0][0].date_of_first_case.slice(0, 10),
                    last_visited_country : results[0][0].last_visited_country,
                    age_of_first_case : results[0][0].age_of_first_case,
                    date_of_first_death : results[0][0].date_of_first_death,
                    age_of_first_death : results[0][0].age_of_first_death,
                    flag : true,
                    case_source : results[1][0].source1,
                    death_source : results[2][0].source1
                })
            }
            else {
                this.setState({
                    date_of_first_case : null,
                    last_visited_country : null,
                    age_of_first_case : null,
                    date_of_first_death : null,
                    age_of_first_death : null,
                    flag : false,
                    case_source : null,
                    death_source : null,
                })
            }
        })
    }



    render() {
        return (
            <div>
                <PageNavbar active={"first_case_death"}/>

                <img src={background} alt='background' className="firstBackground"/>

                <select className="positionSelect" name="country" value={this.state.country} onChange={this.handleCountryChange}>
                    <option>
                        {"Please select a country"}
                    </option>
                    {this.state.countryList.map((ele, idx) => 
                        <option value={ele} key={"country" + idx}>
                            {ele}
                        </option>
                    )}
                </select>
                <button className="firstPositionSearch" onClick={this.handleSearch}>Search</button>
               
                        {this.state.flag === false ? null:
                        <div className="result">
                            <span>{'Date of first case : ' + this.state.date_of_first_case}</span>
                            <br/>
                            <span>{'Age of first case : ' + this.state.age_of_first_case}</span>
                            <br/>
                            <span>{'Last visit country : ' + this.state.last_visited_country}</span>
                            <br/>
                            <span>{'Date of first death : ' + this.state.date_of_first_death}</span>
                            <br/>
                            <span>{'Age of first death : ' + this.state.age_of_first_death}</span>
                            <br/>
                            <span>{'Source of first case : '} <Link onClick={()=>window.open(this.state.case_source)}> See detailed infomation about first case </Link> </span>
                            <br/>
                            <span>{'Source of first death : '} <Link onClick={()=>window.open(this.state.death_source)}> See detailed infomation about first death </Link></span>
                        </div>
                        }
        
                    
            </div>
        )
    }
}
