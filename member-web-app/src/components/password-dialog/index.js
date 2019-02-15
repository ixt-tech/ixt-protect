import React from 'react';
import {
  Modal,
  Form,
  Button,
  Message,
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
      formInvalid: false,
      errors: [],
      oldPassword: '',
      newPassword: ''
    };
  }

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleSubmit = async (event) => {

    const errors = [];

    const body = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    };
    httpClient.put('/members/password', body).subscribe(
      response => {
        this.setState({oldPassword: ''});
        this.setState({newPassword: ''});
        this.setState({modalOpen: false});
      },
      error => {
        errors.push(error.response.data);
        this.setState({ formInvalid: true, errors: errors });
      },
    );

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
               basic
               color='orange'
               onClick={this.handleOpen}
               onClose={this.handleClose}>Change password</Form.Button>}>

        <Modal.Header>Change your password</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit} error={this.state.formInvalid}>
            <Message
              error
              header='There was a problem'
              list={this.state.errors}
            />
            {
              this.props.showSuccess &&
              <Message
                positive
                content='Account saved successfully'
              />
            }
            <Form.Input label='Old password' placeholder='Old password' name='oldPassword' type='password' onChange={this.handleChange}/>
            <Form.Input label='New password' placeholder='New password' name='newPassword' type='password' onChange={this.handleChange}/>
            <Form.Input label='Confirm password' placeholder='Re-type password' name='password2' type='password' onChange={this.handleChange}/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='orange' onClick={this.handleClose}>
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} basic color='orange'>
            OK
          </Button>
        </Modal.Actions>

      </Modal>
    );
  }

}

export default PasswordDialog;
