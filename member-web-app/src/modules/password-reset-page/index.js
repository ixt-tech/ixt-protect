import React from 'react';
import {
  Container,
  Segment,
  Form,
  Header,
  Grid,
  Message,
  Button,
} from 'semantic-ui-react';
import httpClient from '../../services/http-client';

class PasswordReminderPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    const body = {
      email: this.state.email
    };
    this.setState({ formInvalid: true });
    // validate
    //httpClient.post('/password-reminders', email);
  }

  render() {

    return (
      <div className='password-reset-form' style={{height: '600px'}}>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.password-reset-form {
        height: 100%;
      }
    `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
              Email password reset link
            </Header>
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment>
                <Form.Input name='email' icon='user' onChange={this.handleChange} iconPosition='left' placeholder='Email address' fluid />
                <Button color='blue' fluid>
                  Send
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default PasswordReminderPage;
