import React, { Component } from 'react'
import { Link } from 'react-router-dom'
var parse = require('parse-link-header');


class Loader extends Component {
    constructor(props) {
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

export default class Repo extends Component {
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


    renderRepo = (stat) => {
        if (stat.fork === false) {
            return (

                <div className="flip-card">
                    <div className="card-front">
                        <div className="card-info-front"><h3>{stat.name}</h3></div>
                        <div className="card-info-front-value">Rating: {stat.ranking.toString().substr(0, 5)}</div>
                    </div>
                    <div className="card-back">
                        <p className="card-info-back">Stars:{stat.stargazers_count}</p>
                        <p className="card-info-back">Forks:{stat.forks_count}</p>
                        <p className="card-info-back">Watchers:{stat.watchers}</p>
                        <p className="card-info-back">Language:{stat.language}</p>
                        <p className="card-info-back">Commits:{stat.commit_count}</p>
                        <p className="card-info-back">Last Commit:{stat.pushed_at}</p>
                        <p className="card-info-back">Open Issues:{stat.open_issues}</p>
                        <p className="card-info-back">Contributors:{stat.contri_count}</p>
                        <p className="card-info-back">Rating:{stat.ranking}</p>

                    </div>
                </div>
            );
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        console.log(this.state.repos)
        return (
            <div class="repo-grid-container">
                <div class="repo-grid1"></div>
                <div class="repo-grid2">
                    <div className="header" style={{ color: 'white' }}>
                        <div>
                            Repo wise stats
                            </div>
                        <hr className="rule" size={1} />
                    </div>
                </div>
                <div class="repo-grid3"></div>
                <div className="grid-item-4">
                    <div className="side">
                    <Link to='/'>
                        <div className="list-group">
                            <a href="#">Home</a>
                        </div>
                    </Link>
                    <Link to={`/user/${this.props.match.params.username}`}>
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
                <div className="repoInfo">
                    {this.state.repos.map(this.renderRepo)}
                </div>
            </div>
        );
    }
};