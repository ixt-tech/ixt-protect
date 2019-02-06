import React from 'react';
import {
  Modal,
  Form,
  Button,
} from 'semantic-ui-react';
import httpClient from '../../services/http-client';

import './styles.css';

class PasswordDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      isValid: false,
      modalOpen: false,
      oldPassword: '',
      newPassword: ''
    };
  }

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleSubmit = async (event) => {

    const body = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    };
    httpClient.put('/members/password', body);
    this.setState({oldPassword: ''});
    this.setState({newPassword: ''});
    this.setState({modalOpen: false});
  }

  handleOpen = (e) => {
    e.preventDefault();
    this.setState({modalOpen: true})
  }

  handleClose = () => this.setState({modalOpen: false})

  render() {
    return (
      <Modal size='tiny'
             open={this.state.modalOpen}
             trigger={<Form.Button
               className='password-button'
               onClick={this.handleOpen}
               onClose={this.handleClose}>Change password</Form.Button>}>

        <Modal.Header>Change your password</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input label='Old password' placeholder='Old password' name='oldPassword' type='password' onChange={this.handleChange}/>
            <Form.Input label='New password' placeholder='New password' name='newPassword' type='password' onChange={this.handleChange}/>
            <Form.Input label='Confirm password' placeholder='Re-type password' name='password2' type='password' onChange={this.handleChange}/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleClose}>
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color='orange'>
            OK
          </Button>
        </Modal.Actions>

      </Modal>
    );
  }

}

export default PasswordDialog;
