import React from 'react';
import {
  Menu,
  Container,
} from 'semantic-ui-react';
import './styles.css';
import logo from '../../images/logo.png'
import httpClient from "../../services/http-client";
import { withRouter } from 'react-router-dom';

class Header extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      signedIn: localStorage.getItem('ACCESS_TOKEN')
    };

  }

  signOut = () => {

    localStorage.removeItem('ACCESS_TOKEN');
    this.setState({signedIn: false});
    httpClient.delete('/sessions').subscribe(
      response => {
        this.props.history.push('/sign-in');
      },
      error => {
        this.props.history.push('/sign-in');
      },
    );

  }

  render() {

    const signedIn = this.state.signedIn;
    return (
      <Menu borderless className='header'>

        <Menu.Item as='a' href='http://ixt.global'>
          <img src={logo} className='logo'/>
        </Menu.Item>
        <Menu.Menu>
          <Menu.Item as='a' href='https://ixt.global/ixt-protect'>Home</Menu.Item>
          {signedIn &&
          <Menu.Item as='a' href='/account'>Account</Menu.Item>
          }
          <Menu.Item as='a' href='http://ixt.global'>Blog</Menu.Item>
          <Menu.Item as='a' href='https://www.ixt.global/contact-us/'>Contact us</Menu.Item>
          {signedIn &&
          <Menu.Item as='a' onClick={this.signOut}>Sign out</Menu.Item>
          }
        </Menu.Menu>
      </Menu>

    );

  };

}

export default withRouter(Header);