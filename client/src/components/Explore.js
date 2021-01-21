import React, { Component } from 'react'
import PageNavbar from "./PageNavbar";
import {Line} from 'react-chartjs-2'
import "../style/Explore.css"
import background from './pictures/explore.jpg'
export default class Explore extends Component {
    constructor(props) {
        super()
        this.state = {
            country : '',
            state : '',
            countryList : [],
            stateList : [],
            showFlag : false,
            covidInfo : [],
            trafficInfo : [],
            happinessInfo:[], 
            covidStartDate: '',
            covidStartDateList : [],
            covidEndDate : [],
            covidEndDateList : [],
            covidType : '',
            covidTypeList : ['confirmed', 'death', 'recovered'],
            growthRate : null,
            trafficStartDate : '',
            trafficEndDate : '',
            correlationLagList : [1,2,3,4,5,6,7,8],
            correlationLag : 0,
            correlationOutput: null,
            dropCalculatorScore : null,
            dropCalculatorList : ['score', 'percentage'],
            dropCalculatorType : '',
            correlationType : '',
            correlationTypeList : ['correlation_coefficient_population', 'correlation_coefficient_sample']
        }
        this.handleCountryChange = this.handleCountryChange.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleExplore = this.handleExplore.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleCovidSearch = this.handleCovidSearch.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleCorrelationChange = this.handleCorrelationChange.bind(this)
        this.handleDropCalculator = this.handleDropCalculator.bind(this)
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
        fetch("http://localhost:8081/explore/" + value, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            var updatedStateList = []
            for (var i = 0; i < results.length; i++) {
                updatedStateList.push(results[i].province)
            }
            this.setState({
                stateList : updatedStateList
            })
        })
    }

    handleStateChange(event) {
        const {name, value} = event.target
        this.setState({
            [name] : value
        })
    }

    handleExplore() {
        fetch("http://localhost:8081/explore/" + this.state.country + "/" + this.state.state, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            if (this.state.stateList.length !== 0) {
            var covidDate = []
            var covidDailyConfirmed = []
            var covidDailyDeath = []
            var covidDailyExisting = []
            var covidDailyRecovered = []
            for (var i = 0; i < results[0].length; i++) {
                covidDate.push(results[0][i].date.slice(5, 10))
                covidDailyConfirmed.push(results[0][i].daily_confirmed)
                covidDailyDeath.push(results[0][i].daily_death)
                covidDailyExisting.push(results[0][i].daily_existing)
                covidDailyRecovered.push(results[0][i].daily_recovered)
            }

            var trafficDate = []
            var trafficPercent = []
            for (i = 0; i < results[1].length; i++) {
                trafficDate.push(results[1][i].date.slice(5, 10))
                trafficPercent.push(results[1][i].traffic)
            }

            var happinessDate = []
            var happinessScore = []
            for (i = 0; i < results[2].length; i++) {
                happinessDate.push(results[2][i].year)
                happinessScore.push(results[2][i].score)
            }

            this.setState({
                showFlag : true,
                covidInfo : {
                    labels : covidDate,
                    datasets : [
                        {
                            label : 'Confirmed cases',
                            data : covidDailyConfirmed,
                            borderColor : 'orange',
                            fill :false
                    
                        },
                        {
                            label : 'Death',
                            data : covidDailyDeath,
                            borderColor : 'red',
                            fill :false
                        },
                        {
                            label : 'Recovered',
                            data : covidDailyRecovered,
                            borderColor : 'blue',
                            fill :false
                        }
                    ]
                },
                trafficInfo : {
                    labels : trafficDate,
                    datasets : [
                        {
                            label : 'Air traffic volume',
                            data : trafficPercent,
                            borderColor : 'purple',
                            fill :false
                        }
                    ]
                },
                happinessInfo : {
                    labels : happinessDate,
                    datasets : [
                        {
                            label : 'Country happiness change',
                            data : happinessScore,
                            borderColor : 'red',
                            fill :true
                        }
                    ]
                },
                covidStartDateList : covidDate,
                covidEndDateList : covidDate
            })
        }
        })
    }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
            [name] : value,
        })
    }

    handleCovidSearch() {
        fetch("http://localhost:8081/explore/" + this.state.country + "/" + this.state.state + "/" + 
        this.state.covidStartDate + "/" + this.state.covidEndDate + "/" + this.state.covidType, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            this.setState({
                growthRate : results[0].grow_rate
            })
        })
    }

    handleCorrelationChange() {
        fetch("http://localhost:8081/explore/" + this.state.country + "/" + this.state.state + "/" + 
        this.state.trafficStartDate + "/" + this.state.trafficEndDate + "/" + this.state.correlationLag + "/" + this.state.correlationLag, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            if (this.state.correlationType === this.state.correlationTypeList[0]) {
                this.setState({
                    correlationOutput : results[0].correlation_coefficient_population
                })
            }
            else if (this.state.correlationType === this.state.correlationTypeList[1]){
                this.setState({
                    correlationOutput : results[0].correlation_coefficient_sample
                })
            }
        })
    }

    handleDropCalculator() {
        fetch("http://localhost:8081/dropCalculator/" + this.state.country + "/" + this.state.dropCalculatorType, {match : "GET"})
        .then((res)=>res.json())
        .then((results)=>{
            
            if (this.state.dropCalculatorType === 'score') {
                console.log(results[1])
                this.setState({
                    dropCalculatorScore : results[1][0].increase_score
                })
            }
            if (this.state.dropCalculatorType === 'percentage') {
                console.log(results[0])
                this.setState({
                    dropCalculatorScore : results[0][0].increase_percent
                })
            }
            
        })
    }

    render() {
        return (
            <div>
                <PageNavbar active="explore"/>
                 <img src={background} alt='background' className="exploreBackground"/>


                <select className="positionSelect1" name="country" value={this.state.country} onChange={this.handleCountryChange}>
                    <option>
                        {"Please select a country"}
                    </option>
                    {this.state.countryList.map((ele, idx) => 
                        <option value={ele} key={"country" + idx}>
                            {ele}
                        </option>
                    )}
                </select>
                <select className="positionSelect2" name="state" value={this.state.state} onChange={this.handleStateChange}>
                    <option>
                        {"Please select a state"}
                    </option>
                    {this.state.stateList.map((ele, idx) => 
                        <option value={ele} key={"state" + idx}>
                            {ele}
                        </option>
                    )}
                </select>
                <button className="positionSearch" onClick={this.handleExplore}>Explore</button>



                {this.state.showFlag === false ? null : 
                    <div  className="exploreRow">

                        

                    <div className="exploreColumn">
                        <div className="graphPostion">
                          
                            <div className="graphForOtherData">
                                <Line 
                                    data={this.state.covidInfo}
                                    options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "COVID19 trend in " + this.state.state + ", " + this.state.country,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                                />
                            </div>
                            <br/>
                            <br/>
                            <div className="graphForOtherData">
                                <Line 
                                    data={this.state.trafficInfo}
                                    options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "Air traffic trend in " + this.state.state + ", " + this.state.country,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                                />
                            </div>
                            <br/>
                            <br/>
                            <div className="graphForOtherData">
                                <Line 
                                    data={this.state.happinessInfo}
                                    options = {
                                    {
                                        title : {
                                            display : true,
                                            text : "Happiness index at each year in " + this.state.country,
                                            position : 'bottom',
                                            fontSize : '20'
                                        }
                                    }
                                }
                                />
                            </div>
                            <br/>
                            <br/>
                        </div>
                        </div>

                        <div className="exploreColumn">
                        <div className="calculatePart">
                            <span className="calculatorText">Growth calculator</span>
                             <br/>
                                <select className="eachSelect" name="covidStartDate" value={this.state.covidStartDate} onChange={this.handleChange}>
                                    <option>
                                        {"Please select a Start Date"}
                                    </option>
                                    {this.state.covidStartDateList.map((ele, idx) => 
                                        <option value={ele} key={"state" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                                <select className="eachSelect" name="covidEndDate" value={this.state.covidEndDate} onChange={this.handleChange}>
                                    <option>
                                        {"Please select an End Date"}
                                    </option>
                                    {this.state.covidEndDateList.map((ele, idx) => 
                                        <option value={ele} key={"state" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                                <select className="eachSelect" name="covidType" value={this.state.covidType} onChange={this.handleChange}>
                                    <option>
                                        {"Please select a Type"}
                                    </option>
                                    {this.state.covidTypeList.map((ele, idx) => 
                                        <option value={ele} key={"state" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                                <button onClick={this.handleCovidSearch}>Search</button>
                                 <br/>
                                <span className="calculatorText">{this.state.growthRate === null ? null : this.state.growthRate}</span>
                        </div>


                        <div className="calculatePart">
                            <span className="calculatorText">Correlation Calculator</span>
                            <br/>
                            <select className="eachSelect" name="trafficStartDate" value={this.state.trafficStartDate} onChange={this.handleChange}>
                                    <option>
                                        {"Please select a Start Date"}
                                    </option>
                                    {this.state.covidStartDateList.map((ele, idx) => 
                                        <option value={ele} key={"state" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                                <select className="eachSelect" name="trafficEndDate" value={this.state.trafficEndDate} onChange={this.handleChange}>
                                    <option>
                                        {"Please select an End Date"}
                                    </option>
                                    {this.state.covidEndDateList.map((ele, idx) => 
                                        <option value={ele} key={"state" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                                <select className="eachSelect" name="correlationLag" value={this.state.correlationLag} onChange={this.handleChange}>
                                    <option>
                                        {"Please select a lag"}
                                    </option>
                                    {this.state.correlationLagList.map((ele, idx) => 
                                        <option value={ele} key={"lag" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                <br/>
                                <select className="eachSelect" name="correlationType" value={this.state.correlationType} onChange={this.handleChange}>
                                    <option>
                                        {"Please select a type"}
                                    </option>
                                    {this.state.correlationTypeList.map((ele, idx) => 
                                        <option value={ele} key={"type" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                                <button onClick={this.handleCorrelationChange}>Search</button>
                                 <br/>
                                <span className="calculatorText">{this.state.correlationOutput === null ? null : this.state.correlationOutput}</span>
                        </div>


                        <div className="calculatePart">
                            <span className="calculatorText">Drop Calculator</span>
                             <br/>
                            <select className="eachSelect" name="dropCalculatorType" value={this.state.dropCalculatorType} onChange={this.handleChange}>
                                    <option>
                                        {"Please select a type"}
                                    </option>
                                    {this.state.dropCalculatorList.map((ele, idx) => 
                                        <option value={ele} key={"type" + idx}>
                                            {ele}
                                        </option>
                                    )}
                                </select>
                                 <br/>
                            <button onClick={this.handleDropCalculator}>Search</button>
                             <br/>
                            <span className="calculatorText">{this.state.dropCalculatorScore === null ? null : this.state.dropCalculatorScore}</span>
                        </div>
                    </div>

                    

                    </div>
                }
            </div>
        )
    }
}
