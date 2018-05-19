import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {Bar , Line , Pie } from 'react-chartjs-2'
class Loader extends Component {
    constructor(props)
    {
        super(props)
    }
    render() {
        return (
            <div class="spinner">
                <span class="ball-1"></span>
                <span class="ball-2"></span>
                <span class="ball-3"></span>
                <span class="ball-4"></span>
                <span class="ball-5"></span>
                <span class="ball-6"></span>
                <span class="ball-7"></span>
                <span class="ball-8"></span>
            </div>
        );
    }
}

class Chart extends Component{
    constructor(props)
    {
        super(props)
        this.state={
            chartData:{
                labels:this.props.labels,
                datasets:[
                    {
                        label:"Language",
                        data:this.props.values,
                        backgroundColor:'rgba(255,99,132,0.6)'
                    }
                ]

            }
        }
    }
    render(){
        return(
            <div className="chart">
            <Bar
                data={this.state.chartData}
                width={100}
                height={500}
                options={{
                    maintainAspectRatio: false,
                }}
            />
            </div>
        )
    }
}

export default class Lang extends Component {
    constructor() {
        super()
        this.state = {
            repos: [],
            loading: true,
        }

        this.getAllRepos = this.getAllRepos.bind(this)
    }

    async getAllRepos() {
                let repos = this.props.data
                console.log(repos)
                this.setState({
                    repos: repos,
                    loading: false
                })
    }

    componentDidMount() {
        this.getAllRepos()
 
    }


    render() {
        if (this.state.loading) {
            return <Loader />
        }
        var frepos = this.state.repos
        var lang_set = new Set()
        var len = frepos.length
        var lang_array = []
        var lang_rank = []
        var f_lang_array = []
        var f_lang_rank = []//-1 removed
        for(let i=0;i<len;i++)
        {
                lang_set.add(frepos[i].language)
        }
        var set_len = lang_set.size
        lang_set.forEach(v=>{
            if(v!=null)
            {
                lang_array.push(v)
            }
            })
        console.log(lang_array)
        lang_set.forEach(v=>{
            if(v!=null)
            {
                var rank = 0
                for(let i=0;i<len;i++)
                {
                    if(frepos[i].language==v)
                    {
                        rank+=frepos[i].ranking
                    }
                }
                lang_rank.push(rank)
            }

        })
        for(let j = 0;j<lang_array.length;j++)
        {
            if(lang_rank[j]!=-1)
            {
                f_lang_array.push(lang_array[j])
                f_lang_rank.push(lang_rank[j])
            }
        }
        console.log(lang_rank)
        return (
            <div className="grid-container">
                <div className="grid-item-1" style={{color: 'white'}} />
                <div className="grid-item-2" style={{color: 'white'}}>
                    <div className="header">
                        <div>
                            Language wise stats
                        </div>
                        <hr size={1} />
                    </div>
                </div>
                <div className="grid-item-3" style={{color: 'white'}} />
                <div className="grid-item-4">
                    <div className="side">
                    <Link to='/'>
                        <div className="list-group">
                            <a href="#">Home</a>
                        </div>
                    </Link>
                    <Link to={`/user/${this.props.match.params.username}/`}>
                        <div className="list-group">
                            <a href="#">Analysis</a>
                        </div>
                    </Link>
                        <Link to={`/user/${this.props.match.params.username}/repos`}>
                            <div className="list-group">
                                <a href="#">Repo wise stats</a>
                            </div>
                        </Link>
                        <Link to={`/user/${this.props.match.params.username}/languagesort`}>
                            <div className="list-group">
                                <a href="#">Language wise stats</a>
                            </div>
                        </Link>
                        <hr />
                    </div>
                </div>
                <div className="grid-item-5" style={{color: 'white'}}>
                    <div className="chart">
                        <Chart labels={f_lang_array} values={f_lang_rank}/>
                    </div>
                </div>
                <div className="grid-item-6" />
                <div className="grid-item-7" />
                <div className="grid-item-8" />
                <div className="grid-item-9" ></div>
            </div>
        );
    }
};