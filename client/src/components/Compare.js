import React, { Component } from 'react'
import PageNavbar from "./PageNavbar";
import "../style/Compare.css"
import {Line, Bar, Pie} from 'react-chartjs-2'
import background from './pictures/compare.jpg'
export default class Compare extends Component {
    constructor(props) {
        super()
        this.state = {
            country1 : '',
            country2 : '',
            countryList : [],
            genderInfo1 : [], 
            genderInfo2 : [], // contains country, female_percent, male_percent
            covidDataForCountry1 : [],
            covidDataForCountry2 : [],
            otherDataForCountry1 : {},
            otherDataForCountry2 : {},
            genderDataForCountry1 : [],
            genderDataForCountry2 : [],
            showFlag : false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleCompare = this.handleCompare.bind(this)
    }

    componentDidMount(){
        fetch("http://localhost:8081/compare", {match : "GET"})
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

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
            [name] : value
        })
    }

    handleCompare() {
        fetch("http://localhost:8081/compare/" + this.state.country1 + "/" + this.state.country2, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            console.log(results)
            // For first graph
            var dateForCountry1 = []
            var dateForCountry2 = []
            var covidConfirmedDataCountry1 = []
            var covidConfirmedDataCountry2 = []
            var covidDeathDataCountry1 = []
            var covidDeathDataCountry2 = []
            var covidRecoverDataCountry1 = []
            var covidRecoverDataCountry2 = []

            // For second graph
            var updatedOtherInfo1 = []
            var updatedOtherInfo2 = []
            var updatedGenderInfo1 = []
            var updatedGenderInfo2 = []
            
            for (var i = 0; i < results[0].length; i++) {
                dateForCountry1.push(results[0][i].date.substring(5, 10))
                covidConfirmedDataCountry1.push(results[0][i].confirmed)
                covidDeathDataCountry1.push(results[0][i].death)
                covidRecoverDataCountry1.push(results[0][i].recovered)
            }
            for (i = 0; i < results[1].length; i++) {
                dateForCountry2.push(results[1][i].date.substring(5, 10))
                covidConfirmedDataCountry2.push(results[1][i].confirmed)
                covidDeathDataCountry2.push(results[1][i].death)
                covidRecoverDataCountry2.push(results[1][i].recovered)
            }

            if (results[2].length !== 0) {
                updatedOtherInfo1.push(results[2][0].country)
                updatedOtherInfo1.push(results[2][0].med_age)
                updatedOtherInfo1.push(results[2][0].life_expectancy)
                updatedOtherInfo1.push(results[2][0].gdp / 1000)
            }

            if (results[3].length !== 0) {
                updatedOtherInfo2.push(results[3][0].country)
                updatedOtherInfo2.push(results[3][0].med_age)
                updatedOtherInfo2.push(results[3][0].life_expectancy)
                updatedOtherInfo2.push(results[3][0].gdp / 1000)
            }

            if (results[4].length !== 0) {
                updatedGenderInfo1.push(results[4][0].country)
                updatedGenderInfo1.push(results[4][0].female_percent)
                updatedGenderInfo1.push(results[4][0].male_percent)
            }

            if (results[5].length !== 0) {
                updatedGenderInfo2.push(results[5][0].country)
                updatedGenderInfo2.push(results[5][0].female_percent)
                updatedGenderInfo2.push(results[5][0].male_percent)
            }

            this.setState({
                genderInfo1 : updatedGenderInfo1,
                genderInfo2 : updatedOtherInfo2,
                covidDataForCountry1 : {
                    labels : dateForCountry1,
                    datasets : [
                        {
                            label : 'Confirmed cases',
                            data : covidConfirmedDataCountry1,
                            borderColor : 'orange',
                            fill :false
                    
                        },
                        {
                            label : 'Death',
                            data : covidDeathDataCountry1,
                            borderColor : 'red',
                            fill :false
                        },
                        {
                            label : 'Recovered',
                            data : covidRecoverDataCountry1,
                            borderColor : 'blue',
                            fill :false
                        }
                    ]
                },
                covidDataForCountry2 : {
                    labels : dateForCountry2,
                    datasets : [
                        {
                            label : 'Confirmed cases',
                            data : covidConfirmedDataCountry2,
                            borderColor : 'orange',
                            fill :false
                        },
                        {
                            label : 'Death',
                            data : covidDeathDataCountry2,
                            borderColor : 'red',
                            fill :false
                        },
                        {
                            label : 'Recovered',
                            data : covidRecoverDataCountry2,
                            borderColor : 'blue',
                            fill :false
                        }
                    ]
                },
                otherDataForCountry1: {
                    labels:['median age', 'life expectation', 'GDP'],
                    datasets:[
                        {
                            label: 'Info about ' + updatedOtherInfo1[0],
                            data : updatedOtherInfo1.slice(1, 4),
                            backgroundColor : ['pink', 'orange', 'green']
                        }
                        ]
                    },
                otherDataForCountry2 : {
                    labels:['median age', 'life expectation', 'GDP'],
                    datasets:[
                        {
                            label: 'Info about ' + updatedOtherInfo2[0],// here label should be the name of country2
                            data : updatedOtherInfo2.slice(1, 4),
                            backgroundColor : ['pink', 'orange', 'green']
                        }
                        ]
                    },
                
                genderDataForCountry1 : {
                    labels:['female', 'male'],
                    datasets :[
                        {
                            label : 'percent',
                            data : updatedGenderInfo1.slice(1,3),
                            backgroundColor : ['red', '#00FFFF']
                        }
                    ]
                },

                genderDataForCountry2 : {
                    labels:['female', 'male'],
                    datasets :[
                        {
                            label : 'percent',
                            data : updatedGenderInfo2.slice(1,3),
                            backgroundColor : ['red', '#00FFFF']
                        }
                    ]
                },
                
                showFlag : true
            })
            console.log(results[0])
           
        })
    }

    render() {
        return (
            <div>
                <PageNavbar active="compare"/>
                <img src={background} alt='background' className="compareBackground"/>
                <button className="comparePositionSearch" onClick={this.handleCompare}>Compare</button>
                <select className="comparePositionSelect1" name="country1" value={this.state.country1} onChange={this.handleChange}>
                        <option>
                            {"Please select a country"}
                        </option>
                        {this.state.countryList.map((ele, idx) => 
                            <option value={ele} key={"countryList1" + idx}>
                                {ele}
                            </option>
                        )}
                    </select>


                    <select className="comparePositionSelect2" name="country2" value={this.state.country2} onChange={this.handleChange}>
                        <option>
                            {"Please select a country"}
                        </option>
                        {this.state.countryList.map((ele, idx) => 
                            <option value={ele} key={"countryList2" + idx}>
                                {ele}
                            </option>
                        )}
                    </select>

                <div className="compareRow">
                    
                    
                    <div className="compareColumn">
                    {this.state.showFlag === false ? null : 
                        <div className="graphForOtherData">
                            <Line 
                                data={this.state.covidDataForCountry1}
                                options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "COVID19 Info in " + this.state.country1,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                            />
                        </div>
                    }

                    <br/>
                    <br/>
  
                    {this.state.showFlag === false ? null : 
                        <div className="graphForOtherData">
                            <Bar 
                                data={this.state.otherDataForCountry1}
                                options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "median age, life expectation and GDP in " + this.state.country1,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                            />
                        </div>
                    }

                    <br/>
                    <br/>

                    {this.state.showFlag === false ? null : 
                        <div className="graphForOtherData">
                            <Pie 
                                data = {this.state.genderDataForCountry1}
                                options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "Female and male percentage in " + this.state.country1,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                            />
                        </div>
                    }
                    </div>

                    
                    <div className="compareColumn">
                    {this.state.showFlag === false ? null : 
                    <div className="graphForOtherData">
                        <Line 
                            data={this.state.covidDataForCountry2}
                            options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "COVID19 Info in " + this.state.country2,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                        />
                    </div>
                    }

                    <br/>
                    <br/>

                    {this.state.showFlag === false ? null : 
                        <div className="graphForOtherData">
                            <Bar 
                                data={this.state.otherDataForCountry2}
                                options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "median age, life expectation and GDP in " + this.state.country2,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                            />
                        </div>
                    }

                    <br/>
                    <br/>

                    {this.state.showFlag === false ? null : 
                        <div className="graphForOtherData">
                            <Pie 
                                data = {this.state.genderDataForCountry2}
                                options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "Female and male percentage in " + this.state.country2,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                            />
                        </div>
                    }
                    </div>
                    
                </div>
            </div>
        )
    }
}
