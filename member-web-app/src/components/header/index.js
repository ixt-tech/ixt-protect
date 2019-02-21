import React from 'react';
import {
  Menu,
  Container,
} from 'semantic-ui-react';
import './styles.css';
import logo from '../../images/logo.png'

class Header extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      signedIn: localStorage.getItem('ACCESS_TOKEN'),
      redirect: false
    };

  }

  signIn = () => {

    this.setState({redirect: true});

  }

  render() {

    const signedIn = this.state.signedIn;
    return (
      <Menu borderless className='header'>

        <Menu.Item as='a' href='https://ixt.global'>
          <img src={logo} className='logo'/>
        </Menu.Item>
        <Menu.Menu>
          <Menu.Item as='a' href='https://ixt.global/ixt-protect'>Home</Menu.Item>
          {signedIn &&
          <Menu.Item as='a' href='/account'>Account</Menu.Item>
          }
          <Menu.Item as='a' href='https://medium.com/@ixt'>Blog</Menu.Item>
          <Menu.Item as='a' href='https://www.ixt.global/contact-us/'>Contact Us</Menu.Item>
          {signedIn &&
          <Menu.Item as='a' onClick={this.props.signOut}>Sign out</Menu.Item>
          }
          {!signedIn &&
          <Menu.Item as='a' href='/sign-in'>Sign In</Menu.Item>
          }
        </Menu.Menu>
      </Menu>
    )

  };

}

export default Header;