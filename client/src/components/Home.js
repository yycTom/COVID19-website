import React, { Component } from 'react'
import PageNavbar from "./PageNavbar";
import {Link} from "react-router-dom";
import Home_background from './pictures/Home_background.jpg'
import first_col from './pictures/first_col.jpg'
import second_col from './pictures/second_col.jpg'
import third_col from './pictures/third_col.jpg'
import forth_col from './pictures/forth_col.jpg'
import './../style/Home.css'
export default class Home extends Component {

    constructor(props){
        super()
        this.state = {
            columnList : ["COVID19 world map", "Compare two countries", "Explore more", "First case and death"]
        }
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        var columnName = event.target.id
        for (var i = 0; i < this.state.columnList.length; i++) {
            if (columnName === this.state.columnList[i]) {
                console.log(event.target.id)
                return <Link to = {"/covid19_world_map"}> Link</Link>
            }
        }
    }

    render() {
        return (
            
            <div>
                <PageNavbar active="home"/>
                <div>
                    <img src={Home_background} alt='background' className="background"/>
                     <span className="introduction">
                        At the end of 2019, 
                        a novel coronavirus was identified as the cause of a cluster of pneumonia cases in Wuhan, 
                        a city in the Hubei Province of China. It rapidly spread, resulting in an epidemic throughout China, 
                        followed by a global pandemic. In February 2020, the World Health Organization designated the disease COVID-19, 
                        which stands for coronavirus disease 2019.
                    </span>
                </div>
        
            <div className="row">
                <div   className="column">     
                    <Link to={'/covid19_world_map'} >{this.state.columnList[0]}</Link>
                    <Link to={'/covid19_world_map'} ><img src={first_col} alt="first_col" className="each_col"/></Link>
                </div>
                
                
                <div  className="column">
                    <Link to={'/compare'} >{this.state.columnList[1]}</Link>
                    <Link to={'/compare'} ><img src={second_col} alt="second_col" className="each_col"/></Link>
                </div>

                <div  className="column">
                    <Link to={'/explore'} >{this.state.columnList[2]}</Link>
                    <Link to={'/explore'} ><img src={third_col} alt="third_col" className="each_col"/></Link>
                </div>

                <div  className="column">
                    <Link to={'/first_case_death'} >{this.state.columnList[3]}</Link>
                    <Link to={'/first_case_death'} ><img src={forth_col} alt="forth_col"  className="each_col"/></Link>
                </div>
            </div>

            </div>
        )
    }
}
