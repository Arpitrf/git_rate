import React from 'react';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('text',this.refs.langpref.value)

    // fetch(`https://localhost:5000/upload/${this.props.match.params.orgname}`, {
    //   method: 'POST',
    //   body: data,
    // }).then(()=>{
    //   this.props.history.push(`/organisation/result/${this.props.match.params.orgname}`)

    // }
    fetch(`http://localhost:5000/upload/${this.props.match.params.orgname}`, {
      method: 'POST',
      body: data,
    }).then(()=>{
      this.props.history.push(`/organisation/result/${this.props.match.params.orgname}`)

    }
    )
  }

  render() {
    return (
      <div className="fileUploadBody">
        <div className="fileUpload">
          <div className="login-form">
          <form onSubmit={this.handleUploadImage}>
            <div className="x">
              <input className="fileUploadInput" ref={(ref) => { this.uploadInput = ref; }} type="file" />
            </div>
              <div className="t2-input">
              <input className="login-page_input" ref="langpref" type="text" placeholder="Enter Language Preference" />
            </div>
            <br />
            <div>
              <button className="login-page_button">View Results</button>
            </div>
          </form>
          </div>
        </div>
      </div>
    );
  }
}