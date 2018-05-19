import React,{Redirect,Component} from 'react';
import {BrowserRouter,Route,Link} from 'react-router-dom';
export default class Home extends Component{
    constructor(props)
    {
        super(props);

        this.handlesubmit=this.handlesubmit.bind(this);
        this.handlesubmit2=this.handlesubmit2.bind(this);
    }
 
    handlesubmit(e)
    {
        e.preventDefault();
        this.props.history.push(`/user/${this.refs.userInput.value}`)
    }
    handlesubmit2(e)
    {
        e.preventDefault();
        this.props.history.push(`/organisation/${this.refs.orgInput.value}`)
    }
    render()
    {
        return(
            <div className="login-page">
                <div className="login-form">
                    <div className="t1">
                    </div>
                    <div className="t2">
                        <form onSubmit={this.handlesubmit}>
                            <div className="t2-input">
                                <input ref="userInput" className="login-page_input" type="text" placeholder="Enter Github Username" />
                            </div>
                            <div className="t2-button">
                                <button className="login-page_button">Search</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="login-form">
                    <div className="t1">
                    </div>
                    <div className="t2">
                        <form onSubmit={this.handlesubmit2}>
                        <div className="t2-input">
                            <input ref="orgInput" className="login-page_input" type="text" placeholder="Enter Organisation name"/>
                        </div>
                        <div className="t2-button">
                            <button className="login-page_button">Initiate</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        );
    }
}