import React from 'react';
import {
  Menu,
  Container,
} from 'semantic-ui-react';
import './styles.css';
import logo from '../../images/logo.png'

const Footer = props => {
  return (
    <Menu borderless className='footer'>
      <Menu.Item as='a' href='http://ixt.global'>
        <img src={logo} className='logo'/>
      </Menu.Item>
      <Menu.Menu>
        <Menu.Item>Copyright 2019 &copy; IXT Protect</Menu.Item>
        <Menu.Item as='a' href='https://ixt.global/privacy-policy/'>Privacy Policy</Menu.Item>
        <Menu.Item as='a' href='https://ixt.global/terms-and-condition/'>Terms and Conditions</Menu.Item>
      </Menu.Menu>
      {process.env.NODE_ENV == 'development' &&
      <Menu.Menu position='right'>
        <Menu.Item>
          <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode against {process.env.REACT_APP_API_URL}</small>
        </Menu.Item>
      </Menu.Menu>
      }
    </Menu>
  );
};
export default Footer;