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
      this.setState({invitationCode: query.get('invitation')});
    }
  };

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleSubmit = () => {

    this.setState({formInvalid: false, errors: []});

    // validate
    if(this.state.password.length < 8) {
      let errors = this.state.errors;
      errors.push('Password must be 8 characters or more');
      this.setState({formInvalid: true, errors: errors});
      return;
    }
    if(this.state.password != this.state.password2) {
      let errors = this.state.errors;
      errors.push('Passwords don\'t match');
      this.setState({formInvalid: true, errors: errors});
      return;
    }
    const body = {
      email: this.state.email,
      password: this.state.password,
    };
    httpClient.post('/email-verifications', body).subscribe(
      response => {
        this.props.history.push("/activate");
      },
      error => {
        let errors = this.state.errors;
        errors.push(error.message);
        this.setState({formInvalid: true, errors: errors});
        return;
      },
    );

    this.setState({
      disableForm: false,
      email: '',
      password: '',
      formInvalid: false,
      errors: []
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
              Sign up to IXT Protect
            </Header>
            <Segment>
              <Form size='large' onSubmit={this.handleSubmit} error={this.state.formInvalid}>
                <Message
                  error
                  list={this.state.errors}
                />
                <Form.Input name='email' label='Email' onChange={this.handleChange} placeholder='e.g. name@example.com' required fluid/>
                <Form.Input name='password' label='Password' onChange={this.handleChange} placeholder='Min 8 characters' type='password' required fluid/>
                <Form.Input name='password2' label='Confirm password' onChange={this.handleChange} placeholder='Re-type password' type='password' required fluid/>

                {this.state.invitationCode &&
                <Form.Input name='invitationCode' defaultValue={this.state.invitationCode} label='Invitation code' placeholder='Code' readOnly/>
                }
                <Form.Field>
                  <Checkbox
                    label={<label>I accept the <a href='#'>Terms and Conditions</a> and that my data being stored inline with the guidelines set out in the <a href='#'>Privacy Policy</a></label>}/>
                </Form.Field>

                <Button color='orange' floated='right'>
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
