import React from 'react';
import {
  Container,
  Segment,
  Form,
  Header,
  Grid,
  Message,
  Button,
  Checkbox,
} from 'semantic-ui-react';
import httpClient from '../../services/http-client';

class JoinPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formInvalid: false,
      errors: []
    }
  }

  componentDidMount = async () => {
    let query = new URLSearchParams(this.props.location.search);
    if(query) {
      this.setState({referralCode: query.get('invitation')});
    }
  };

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleCheckboxChange = (e, value) => {
    this.setState({accepted: value.checked});
  }

  isEmailValid = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleSubmit = () => {

    const errors = [];
    this.setState({formInvalid: false, errors: errors});

    // validate
    if(!this.isEmailValid(this.state.email)) {
      errors.push('Email is not valid');
      this.setState({formInvalid: true, errors: errors});
    }
    if(this.state.password.length < 8) {
      errors.push('Password must be 8 characters or more');
      this.setState({formInvalid: true, errors: errors});
    }
    if(this.state.password != this.state.password2) {
      errors.push('Passwords don\'t match');
      this.setState({formInvalid: true, errors: errors});
    }
    if(!this.state.accepted) {
      errors.push('You must accept our terms and conditions');
      this.setState({formInvalid: true, errors: errors});
    }

    if(errors.length == 0) {
      const body = {
        email: this.state.email,
        password: this.state.password,
        referralCode: this.state.referralCode
      };
      httpClient.post('/email-verifications', body).subscribe(
        response => {
          this.setState({
            disableForm: false,
            email: '',
            password: '',
            formInvalid: false,
            errors: errors
          });
          this.props.history.push("/activate");
        },
        error => {
          let errors = this.state.errors;
          errors.push(error.response.data);
          this.setState({formInvalid: true, errors: errors});
          return;
        },
      );
    }

  }

  render() {

    return (
      <div className='join-form' style={{height: '600px'}}>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.join-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
          <Grid.Column style={{maxWidth: 450}}>
            <Header as='h3' textAlign='center'>
              Sign up to IXT Protect
            </Header>
            <Segment>
              <Form size='large' onSubmit={this.handleSubmit} error={this.state.formInvalid}>
                <Message
                  error
                  header='There was a problem'
                  list={this.state.errors}
                />
                <Form.Input name='email' label='Email' onChange={this.handleChange} placeholder='e.g. name@example.com' required fluid/>
                <Form.Input name='password' label='Password' onChange={this.handleChange} placeholder='Min 8 characters' type='password' required fluid/>
                <Form.Input name='password2' label='Confirm password' onChange={this.handleChange} placeholder='Re-type password' type='password' required fluid/>
                <Form.Input name='referralCode' onChange={this.handleChange} defaultValue={this.state.referralCode} label='Invitation code' placeholder='Code' fluid />
                <Form.Field>
                  <Checkbox onChange={this.handleCheckboxChange}
                    label={<label>I accept the <a href='#'>Terms and Conditions</a> and that my data being stored inline with the guidelines set out in the <a href='#'>Privacy Policy</a></label>}/>
                </Form.Field>

                <Button color='orange' basic floated='right'>
                  Next
                </Button>
                <br/>
                <br/>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default JoinPage;
