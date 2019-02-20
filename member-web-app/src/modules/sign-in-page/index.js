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
import { Redirect } from 'react-router-dom';

class SignInPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formInvalid: false,
      redirect: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleSubmit = () => {
    const body = {
      email: this.state.email,
      password: this.state.password,
    };
    // validate
    httpClient.post('/sign-ins', body).subscribe(
      response => {
        if(response.accessToken) {
          localStorage.setItem('ACCESS_TOKEN', response.accessToken);
          this.setState({redirect: true, destination: response.redirect, account: response.account});
        } else {
          localStorage.setItem('ACCESS_TOKEN', undefined);
          this.setState({formInvalid: true});
        }
      },
      error => {
        this.setState({formInvalid: true});
      },
    );

    this.setState({
      disableForm: false,
      email: '',
      password: '',
      formInvalid: false,
    });

  }

  render() {

    if (this.state.redirect === true) {
      return (<Redirect to={{
        pathname: this.state.destination,
        state: { account: this.state.account }}} />)
    } else {

      return (
        <div className='sign-in-form' style={{height: '600px'}}>
          <style>{`
        body > div,
        body > div > div,
        body > div > div > div.sign-in-form {
          height: 100%;
        }
      `}</style>
          <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 450}}>
              <Header as='h3' textAlign='center'>
                Sign in to your account
              </Header>
              <Segment>
                <Form size='large' onSubmit={this.handleSubmit} error={this.state.formInvalid}>
                  <Message
                    error
                    content='Sign in failed'
                  />
                  <Form.Input icon='user' name='email' onChange={this.handleChange} iconPosition='left'
                              placeholder='Email address' required fluid/>
                  <Form.Input icon='lock' name='password' onChange={this.handleChange} iconPosition='left'
                              placeholder='Password' type='password' required fluid/>
                  <Button color='orange' basic floated='right'>Sign in</Button>
                  <br/>
                  <br/>
                </Form>
              </Segment>
              <br/>
              New to us? <a href='/join'>Sign up</a>. Forgot your password? <a href='/password-reset'>Reset it</a>.
              <br/>
              <br/>
              <b>Looking for the staking account? <a href='https://staking.ixt.global/account'>It's here</a>.</b>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

  }
}

export default SignInPage;
