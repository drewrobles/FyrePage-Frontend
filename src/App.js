import React, { Component } from 'react';
import Nav from './components/Nav';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import LinkForm from './components/LinkForm';
import './App.css';
import ManageLinkForm from './components/ManageLinkForm';

const base_url = 'http://localhost:8000'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      links: [],
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch(base_url + '/core/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
      
        fetch(base_url + '/core/links/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ links: json.links });
        });
    }
  }


  handle_login = (e, data) => {
    e.preventDefault();
    fetch(base_url + '/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };
  
  handle_add_link = (e, data) => {
    e.preventDefault();
    fetch(base_url + '/core/links/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })

            fetch(base_url + '/core/links/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ links: json.links });
        });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch(base_url + '/core/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username
        });
      });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    return (
      <div className="App">
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        {form}
        <h3>
          {this.state.logged_in
            ? `Hello, ${this.state.username}`
            : 'Please Log In'}
        </h3>
        <div>
          {this.state.logged_in
            ? <LinkForm handle_submit={this.handle_add_link}/>
            : <span/>
          }
          {
            this.state.logged_in && this.state.links && this.state.links.length > 0
            ? this.state.links.map(currLink => <LinkForm 
              text={currLink.text}
              url={currLink.url}
              handle_submit={() => {alert('hello world')}}
            />) 
            : <span/>
          }
        </div>
      </div>
    );
  }
}

export default App;
