import React from 'react';
import {Button, Form, Grid, Header, Image, Message, Segment, Checkbox, Loader} from 'semantic-ui-react';
import './styles.css';
import httpClient from '../../services/http-client';
import PersonalDetails from '../../components/personal-details';
import Rewards from '../../components/rewards';
import ProtectionDetails from '../../components/protection-details';
import Faq from '../../components/faq';
import moment from 'moment';

class AccountPage extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      account: {},
      formInvalid: false,
      showSuccess: false,
      errors: [],
      rows: []
    }
    this.handleSaveAccount = this.handleSaveAccount.bind(this);

  }

  componentDidMount = () => {

    httpClient.get('/members').subscribe(
      response => {
        const account = response;
        this.setState({account: account});
      },
      error => {
        const errors = this.state.errors;
        errors.push(error.response.data);
        this.setState({ formInvalid: true, errors: errors });
      },
    );

  };

  handleSaveAccount = (account) => {

    const errors = [];

    // validate
    httpClient.put('/members', account).subscribe(
      response => {
        const account = response;
        this.setState({account: account, showSuccess: true});
        localStorage.setItem('ACCOUNT', account);
        setTimeout(() => {
          this.setState({ showSuccess: false })
        }, 5000)
      },
      error => {
        errors.push(error.response.data);
        this.setState({ formInvalid: true, showSuccess: false, errors: errors });
      },
    );

  }

  render() {

    return (

      <div className='account-form'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <PersonalDetails account={this.state.account} handleSubmit={this.handleSaveAccount} showSuccess={this.state.showSuccess}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <ProtectionDetails account={this.state.account}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Rewards account={this.state.account}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Faq />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default AccountPage;
