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

class ActivatePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activationCode: '',
      formInvalid: false,
      error: ''
    }
  }

  componentDidMount = async () => {
    let query = new URLSearchParams(this.props.location.search);
    if(query) {
      this.setState({activationCode: query.get('activationCode')});
    }
  };

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleSubmit = () => {
    const body = {
      activationCode: this.state.activationCode
    };
    // validate
    httpClient.post('/activations', body).subscribe(
      response => {
        localStorage.setItem('ACCESS_TOKEN', response.accessToken);
        this.props.history.push({
          pathname: '/personal-details',
          state: { account: response.account }
        })
      },
      error => {
        this.setState({formInvalid: true, error: error.response.data});
      },
    );

    this.setState({
      disableForm: false,
      activationCode: '',
      formInvalid: false,
      error: ''
    });

  }

  render() {

    return (
      <div className='activate-form' style={{height: '600px'}}>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.activate-form {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
          <Grid.Column style={{maxWidth: 450}}>
            <Header as='h3' textAlign='center'>
              Activate your IXT Protect account
            </Header>
            <Segment>
              <Form size='large' onSubmit={this.handleSubmit} error={this.state.formInvalid}>
                <Message
                  error
                  content='Invalid activation code'
                />
                <Form.Input name='activationCode' defaultValue={this.state.activationCode} label='Activation code' onChange={this.handleChange}
                            placeholder='Enter your 6 digit code' required fluid/>
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

export default ActivatePage;
