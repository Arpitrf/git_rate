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
           <div class="circ">
                <div class="load">LOADING...</div>
                <div class="hands"></div>
                <div class="body"></div>
                <div class="head">
                <div class="eye"></div>
                </div>
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
                        label:"Rating",
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
                    title:{
                        display:true,
                        text:"User Rating"

                    },
                    legend:{
                        display:true,
                        position:'right',
                        text:'rating'
                    },
                    maintainAspectRatio: false,
                    events :{
                        click:()=>{
                            console.log("hello")
                        }
                    }
                    
                }}
            />
            </div>
        )
    }
}

export default class Org extends Component {
    constructor() {
        super()
        this.state = {
            repos: [],
            loading: true,
        }

        this.getRankArray = this.getRankArray.bind(this)
         this.compare = this.compare.bind(this)
    }

    async getRankArray() {
               let response = await fetch(`http://localhost:5000/organ/result/${this.props.match.params.orgname}`)
//                let response = await fetch(`https://rating.gitrate.tech/organ/result/${this.props.match.params.orgname}`)
               let resp_json = await response.json()
//                let resp_json = {
//     "arr": [
//         {
//             "username": "himanshub16",
//             "rating": 150.21209221181786
//         },
//         {
//             "username": "piano-man",
//             "rating": 5.721303670817692
//         },
//         {
//             "username": "alex",
//             "rating": 171.11934473593306
//         },
//         {
//             "username": "ankurdengla1996",
//             "rating": 0.17111934473593306
//         },
//         {
//             "username": "Arpitrf",
//             "rating": 7.111934473593306
//         },
//         {
//             "username": "bosco304",
//             "rating": 17.111934473593306
//         },
//         {
//             "username": "michelle76",
//             "rating": 11.1934473593306
//         },
//         {
//             "username": "mark44",
//             "rating": 34.473593306
//         },
//         {
//             "username": "pa1557",
//             "rating": 9.34473593306
//         }
//     ]
// }
                let arr = resp_json.arr
                this.setState({
                    arr: arr,
                    loading: false
                })
    }

    componentDidMount() {
        this.getRankArray()
 
    }

    compare(a,b)
    {
        if(a.rating<b.rating)
        {
            return 1;
        }
        else{
            return -1;
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        var arr = this.state.arr
        arr.sort(this.compare);
        var len = arr.length
        var f_lang_array = []
        var f_lang_rank = []
        for(let i =0;i<len;i++)
        {
            f_lang_array[i] = arr[i].username
            f_lang_rank[i] = arr[i].rating
        }
        return (
            <div className="grid-container">
                <div className="grid-item-1" style={{color: 'white'}} />
                <div className="grid-item-2" style={{color: 'white'}}>
                    <div className="header">
                        <div>
                            Candidates sorted by rating
                        </div>
                        <hr size={1} />
                    </div>
                </div>
                <div className="grid-item-3" style={{color: 'white'}} />
                <div className="grid-item-4">
                    <div className="side">
                        <Link to="#">
                            <div className="list-group">
                                <a href="#"></a>
                            </div>
                        </Link>
                        <Link to="#">
                            <div className="list-group">
                                <a href="#"></a>
                            </div>
                        </Link>
                        <Link to='/'>
                            <div className="list-group">
                                <a href="#">Home</a>
                            </div>
                        </Link>
                        <Link to={`/organisation/${this.props.match.params.orgname}/`}>
                        <div className="list-group">
                            <a href="#">Upload another file</a>
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