import React,{Component} from 'react';
import {BrowserRouter,Route,Link} from 'react-router-dom';
import Home from './Home'
import User from './User'
import Repo from './Repo'
import Org from './Org'
import Lang from './Lang'
import Main from './FileUpload'
export default class Search extends Component
{
    constructor(){
        super()
        this.state = {
            data: null,
        }
        //this.getDatafromUser = this.getDatafromUser.bind(this)
    }

    getDatafromUser = (data) =>
    {
        console.log(data)
        this.setState({
            data:data
        })
    }
    render(){

        return(
            
            <div>
            <Route exact path="/" component={Home}/>
            <Route exact path={'/user/:username'}   render={(props) => <User {...props} getDatafromUser={this.getDatafromUser} hello="hello" />}/> 
            <Route exact path={'/user/:username/repos'} render={(props) => <Repo {...props} data = {this.state.data}/>}/>
            <Route exact path={'/user/:username/languagesort'} render={(props) => <Lang {...props} data = {this.state.data}/>}/>            
            <Route exact path={'/organisation/:orgname'} component={Main}/>
            <Route exact path={'/organisation/result/:orgname'} component={Org}/>         
            </div>
        )

    }
};