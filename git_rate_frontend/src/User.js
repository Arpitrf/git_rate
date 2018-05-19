import React from 'react';
import { Link } from 'react-router-dom';

export default class User extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.getStarAverage = this.getStarAverage.bind(this)
  }

  async getUser() {
    let response = await fetch(`http://localhost:5000/user/ranking/${this.props.match.params.username}`)
    let resp_json = await response.json()
    let userinfo = resp_json.user
    let repos = resp_json.repos
    this.props.getDatafromUser(repos)
    let star_avg = await this.getStarAverage(repos);
    let percentile = resp_json.percentile
    this.setState({
      user: userinfo,
      repos: repos,
      star_avg:star_avg,
      percentile:percentile
    })
  }

async getStarAverage(repos)
{
  var count=0;
  for(let i=0;i<repos.length;i++)
  {
    count+=repos[i].stargazers_count
  }
  var avg = count/repos.length;
  return avg
}

  componentDidMount() {
    this.getUser()
  }
  renderStat(stat) {
    return (
      <li key={stat.name} className="user-info__stat">
        <Link to={stat.url}>
          <p className="user-info__stat-value">{stat.value}</p>
          <p className="user-info__stat-name">{stat.name}</p>
        </Link>
      </li>
    );
  }


  render() {
    if (!this.state.user) {
      return (<div className="circ">
                <div className="load">Loading. . . </div>
                <div className="hands"></div>
                <div className="body"></div>
                <div className="head">
                <div className="eye"></div>
                </div>
            </div>)
    }
    console.log(this.props.getDatafromUser)
    const user = this.state.user
    const repos = this.state.repos
    const avg = this.state.star_avg
    console.log(avg)
    const stats = [
      {
        name: 'Public Repos',
        value: user.repo_count,
        url: `/user/${this.props.match.params.username}/repos`
      },
      {
        name: 'Followers',
        value: user.followers,
        url: `/user/${this.props.match.params.username}/followers`
      },
      {
        name: 'Following',
        value: user.following,
        url: `/user/${this.props.match.params.username}/following`
      },
      {
        name: 'Recent OpenSource Commits',
        value: user.commits_count,
        url: `/user/${this.props.match.params.username}/forks`
      },
      {
        name: 'Ranking',
        value: user.ranking,
        url: `/user/${this.props.match.params.username}/forks`
      },
      {
        name: 'Language_Ranking',
        value: user.ranking,
        url: `/user/${this.props.match.params.username}/languagesort`
      }
    ];
    let foll_tip
    let star_tip
    let rep_ratio = user.repo_count / user.public_repos
    let rep_tip
    if(stats[1].value<100)
    {
      foll_tip = (
        <li>More activity needed in the git community.</li>
      )
    }
    else{
      foll_tip = (
        <li>Sufficient socialisation.</li>
      )
    }
    if(avg < 8) {
      star_tip = (
        <li>Increase understandability of repos.</li>
      )
    }
    else{
      star_tip = (
        <li>Stars to Repos ratio seems good.</li>
      )
    }
    if(rep_ratio<0.5)
    {
      rep_tip = (
        <li>Need to create more personal repos.</li>
      )
    }
    else
    {
      rep_tip = (
        <li>Sufficient number of personal repos.</li>
      )
    }
    return (
      <div className="grid-container">
        <div className="grid-item-1" style={{ color: 'white' }} />
        <div className="grid-item-2" style={{ color: 'white' }}>
          <div className="header">
            <div>
              Analysis
            </div>
            <hr size={1} />
          </div>
        </div>
        <div className="grid-item-3" style={{ color: 'white' }} />
        <div className="grid-item-4">
          <div className="side">
            <Link to='/'>
              <div className="list-group">
                <a href="#">Home</a>
              </div>
            </Link>
            <div className="list-group">
              <a href="#">Analysis</a>
            </div>
            <Link to={stats[0].url}>
              <div className="list-group">
                <a href="#">Repo wise stats</a>
              </div>
            </Link>
            <Link to={stats[5].url}>
              <div className="list-group">
                <a href="#">Language wise stats</a>
              </div>
            </Link>
            <hr />
          </div>
        </div>
        <div className="grid-item-5" style={{ color: 'white' }}>
            <div id="chartContainer3">
                <img id="chartimage" src={user.avatar_url} alt={`${user.login} avatar`} />
            </div>
            <div id="rankContainer3">
              <div id="rankvalue">
                <ul>
                  {foll_tip}
                  {star_tip}
                  {rep_tip}
                  <li>Total score: {user.ranking.toString().substr(0,7)}</li>
                </ul>
              </div>
              <div className="finalRank">
                <div className="ux-progress-radial__holder ux-progress-radial_size-l">
                  <div className="ux-progress-radial progress-75 ux-progress-radial__level-3">
                    <div className="ux-progress-radial__level-2">
                      <div className="ux-progress-radial__level-1">
                        <div className="ux-progress-radial__overlay">
                          <span className="ux-progress-radial__val">
                            <p className="percentile">
                              >{(this.state.percentile * 100).toString().substr(0,6)}%
                            </p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="grid-item-6" />
        <div className="grid-item-7" />
        <div className="grid-item-8">
          <div className="divider" style={{ color: 'white' }}>
            <div className="left"><hr /></div>
            <div className="text">QUICK STATS</div>
            <div className="right"><hr /></div>
          </div>
          <div className="stats">
            <div className="quick-stats" style={{ backgroundColor: '#00d18c' }}>
              <div className="text-quick-stats">
                <h4>REPOS</h4>
                <h1>{stats[0].value}</h1>
              </div>
            </div>
            <div className="quick-stats" style={{ backgroundColor: '#f72b4d' }}>
              <div className="text-quick-stats">
                <h4>FOLLOWERS</h4>
                <h1>{stats[1].value}</h1>
              </div>
            </div>
            <div className="quick-stats" style={{ backgroundColor: '#a974ff' }}>
              <div className="text-quick-stats">
                <h4>FOLLOWING</h4>
                <h1>{stats[2].value}</h1>
              </div>
            </div>
            <div className="quick-stats" style={{ backgroundColor: '#e3de00' }}>
              <div className="text-quick-stats">
                <h5>OPEN SOURCE COMMITS</h5>
                <h1>{stats[3].value}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="grid-item-9" />
      </div>
    );
  }
};

