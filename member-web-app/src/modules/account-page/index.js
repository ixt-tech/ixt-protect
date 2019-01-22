import React from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment, Checkbox } from 'semantic-ui-react';
import './styles.css';
import httpClient from '../../services/http-client';
import PasswordDialog from '../../components/password-dialog';
import InvitationLink from '../../components/invitation-link';
import moment from 'moment';

class AccountPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      account: {}
    }
  }

  componentDidMount = () => {
    let account = {
      email: 'email@test.com',
      firstName: 'firswrweretName',
      lastName: 'lastName',
      dateOfBirth: moment('1977-04-03T00:00:00'),
      addressLine1: 'address1',
      addressLine2: 'address2',
      town: 'town',
      postcode: 'postcode',
      country: 'Sweden',
    }
    const day = moment(account.dateOfBirth).date();
    const month = moment(account.dateOfBirth).month();
    const year = moment(account.dateOfBirth).year();
    this.setState({ account: account, day: day, month: month, year: year });
  };

  handleDateChange = (e, data) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChange = (e, { name, value }) => {
    const account = this.state.account;
    account[name] = value;
    this.setState({account});
  }

  handleSubmit = () => {
    const account = this.state.account;
    let dateOfBirth = moment();
    dateOfBirth.date(this.state.day);
    dateOfBirth.month(this.state.month);
    dateOfBirth.year(this.state.year);
    account.dateOfBirth = dateOfBirth.utc();
    this.setState({ formInvalid: true });
    // validate
    //httpClient.post('/accounts', account);
  }

  handlePasswordChange = () => {

  }

  render() {

    const { account, day, month, year } = this.state;
    return (

      <div className='account-form'>
        <Grid>
          <Grid.Column>
            <Form size='large' error={this.state.formInvalid} onSubmit={this.handleSubmit}>
              <Segment>
                <Message
                  error
                  header='Action Forbidden'
                  content='You can only sign up for an account once with a given e-mail address.'
                />
                <Button.Group floated='right'>
                  <Button color='blue'>Save</Button>
                </Button.Group>

                <Form.Group>
                  <Form.Input name='firstName' value={account.firstName} label='First name' placeholder='First name' onChange={this.handleChange} required width={4} fluid />
                  <Form.Input name='lastName' defaultValue={account.lastName} label='Last name' placeholder='Last name' onChange={this.handleChange} required width={4} fluid />
                </Form.Group>

                <Form.Group>
                  <Form.Dropdown name='day' label='Date of Birth' value={day} placeholder='Day' onChange={this.handleDateChange} control='select' required>
                    <option value=''>Day</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                    <option value='7'>7</option>
                    <option value='8'>8</option>
                    <option value='9'>9</option>
                    <option value='10'>10</option>
                    <option value='11'>11</option>
                    <option value='12'>12</option>
                    <option value='13'>13</option>
                    <option value='14'>14</option>
                    <option value='15'>15</option>
                    <option value='16'>16</option>
                    <option value='17'>17</option>
                    <option value='18'>18</option>
                    <option value='19'>19</option>
                    <option value='20'>20</option>
                    <option value='21'>21</option>
                    <option value='22'>22</option>
                    <option value='23'>23</option>
                    <option value='24'>24</option>
                    <option value='25'>25</option>
                    <option value='26'>26</option>
                    <option value='27'>27</option>
                    <option value='28'>28</option>
                    <option value='29'>29</option>
                    <option value='30'>30</option>
                    <option value='31'>31</option>
                  </Form.Dropdown>
                  <Form.Input name='month' value={month} placeholder='Month' onChange={this.handleDateChange} control='select' className='no-label'>
                    <option value=''>Month</option>
                    <option value='0'>January</option>
                    <option value='1'>February</option>
                    <option value='2'>March</option>
                    <option value='3'>April</option>
                    <option value='4'>May</option>
                    <option value='5'>June</option>
                    <option value='6'>July</option>
                    <option value='7'>August</option>
                    <option value='8'>September</option>
                    <option value='9'>October</option>
                    <option value='10'>November</option>
                    <option value='11'>December</option>
                  </Form.Input>
                  <Form.Input name='year' value={year} placeholder='Year' onChange={this.handleDateChange} control='select' className='no-label'>
                    <option value=''>Year</option>
                    <option value='2003'>2003</option>
                    <option value='2002'>2002</option>
                    <option value='2001'>2001</option>
                    <option value='2000'>2000</option>
                    <option value='1999'>1999</option>
                    <option value='1998'>1998</option>
                    <option value='1997'>1997</option>
                    <option value='1996'>1996</option>
                    <option value='1995'>1995</option>
                    <option value='1994'>1994</option>
                    <option value='1993'>1993</option>
                    <option value='1992'>1992</option>
                    <option value='1991'>1991</option>
                    <option value='1990'>1990</option>
                    <option value='1989'>1989</option>
                    <option value='1988'>1988</option>
                    <option value='1987'>1987</option>
                    <option value='1986'>1986</option>
                    <option value='1985'>1985</option>
                    <option value='1984'>1984</option>
                    <option value='1983'>1983</option>
                    <option value='1982'>1982</option>
                    <option value='1981'>1981</option>
                    <option value='1980'>1980</option>
                    <option value='1979'>1979</option>
                    <option value='1978'>1978</option>
                    <option value='1977'>1977</option>
                    <option value='1976'>1976</option>
                    <option value='1975'>1975</option>
                    <option value='1974'>1974</option>
                    <option value='1973'>1973</option>
                    <option value='1972'>1972</option>
                    <option value='1971'>1971</option>
                    <option value='1970'>1970</option>
                    <option value='1969'>1969</option>
                    <option value='1968'>1968</option>
                    <option value='1967'>1967</option>
                    <option value='1966'>1966</option>
                    <option value='1965'>1965</option>
                    <option value='1964'>1964</option>
                    <option value='1963'>1963</option>
                    <option value='1962'>1962</option>
                    <option value='1961'>1961</option>
                    <option value='1960'>1960</option>
                    <option value='1959'>1959</option>
                    <option value='1958'>1958</option>
                    <option value='1957'>1957</option>
                    <option value='1956'>1956</option>
                    <option value='1955'>1955</option>
                    <option value='1954'>1954</option>
                    <option value='1953'>1953</option>
                    <option value='1952'>1952</option>
                    <option value='1951'>1951</option>
                    <option value='1950'>1950</option>
                    <option value='1949'>1949</option>
                    <option value='1948'>1948</option>
                    <option value='1947'>1947</option>
                    <option value='1946'>1946</option>
                    <option value='1945'>1945</option>
                    <option value='1944'>1944</option>
                    <option value='1943'>1943</option>
                    <option value='1942'>1942</option>
                    <option value='1941'>1941</option>
                    <option value='1940'>1940</option>
                    <option value='1939'>1939</option>
                  </Form.Input>
                </Form.Group>

                <Form.Group>
                  <Form.Input name='email' defaultValue={account.email} label='Email' placeholder='Email' onChange={this.handleChange} required width={8} fluid />
                  <PasswordDialog />
                </Form.Group>

                <Form.Group>
                  <Form.Input name='addressLine1' defaultValue={account.addressLine1} label='Address line 1' placeholder='Address line 1' onChange={this.handleChange} width={8} required fluid />
                </Form.Group>

                <Form.Group>
                  <Form.Input name='addressLine2' defaultValue={account.addressLine2} label='Address line 2' placeholder='Address line 2' onChange={this.handleChange} width={8} fluid />
                </Form.Group>

                <Form.Group>
                  <Form.Input name='town' defaultValue={account.town} label='Town' placeholder='Town' onChange={this.handleChange} width={4} required fluid />
                  <Form.Input name='postcode' defaultValue={account.postcode} label='Postcode' placeholder='Postcode' onChange={this.handleChange} width={4} required fluid />
                </Form.Group>

                <Form.Group>
                  <Form.Input name='country' value={account.country} label='Country' placeholder='Country' onChange={this.handleChange} control='select' required>
                    <option value=''>Select country</option>
                    <option value='Sweden'>Sweden</option>
                  </Form.Input>
                </Form.Group>

                <Form.Group>
                  <InvitationLink />
                </Form.Group>

              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AccountPage;
