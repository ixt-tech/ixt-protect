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
      formInvalid: false,
    }
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
        if (response.accessToken) {
          localStorage.setItem('ACCESS_TOKEN', response.accessToken);
          this.props.history.push("/account");
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

                <Button color='orange' floated='right'>
                  Sign in
                </Button>
                <br/>
                <br/>
              </Form>
            </Segment>
            <br/>
            New to us? <a href='/join'>Sign Up</a>. Forgot your password? <a href='/password-reminder'>Reset it</a>.
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default SignInPage;
