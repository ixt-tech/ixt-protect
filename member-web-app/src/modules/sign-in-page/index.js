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

class SignInPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = () => {
    this.setState({ formInvalid: true });
    const body = {
      email: this.state.email,
      password: this.state.password,
    };
    // validate
    httpClient.post('/sign-ins', body).subscribe(
      resp => {
        if(resp.accessToken) {
          localStorage.setItem('token', resp.accessToken);
        } else {
          localStorage.setItem('token', undefined);
        }
      },
      error => console.log(error),
    );

    this.setState({
      disableForm: false,
      errors: {},
      email: '',
      password: '',
      touched: {
        email: false,
        password: false,
      }
    });

  }

  render() {

    return (
      <div className='sign-in-form' style={{height: '600px'}}>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.sign-in-form {
        height: 100%;
      }
    `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
              Sign in to your account
            </Header>
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment>
                <Form.Input icon='user' name='email' onChange={this.handleChange} iconPosition='left' placeholder='Email address' required fluid />
                <Form.Input icon='lock' name='password' onChange={this.handleChange} iconPosition='left' placeholder='Password' type='password' required fluid />

                <Button color='blue' fluid>
                  Sign in
                </Button>
              </Segment>
            </Form>
            <br/>
            New to us? <a href='/join'>Sign Up</a>. Forgot your password? <a href='/password-reminder'>Reset it</a>.
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default SignInPage;
