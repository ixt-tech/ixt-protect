import React from 'react';
import {Button, Form, Grid, Header, Image, Message, Segment, Checkbox} from 'semantic-ui-react';
import './styles.css';
import httpClient from '../../services/http-client';
import PasswordDialog from '../../components/password-dialog';
import InvitationLink from '../../components/invitation-link';
import moment from 'moment';

class AccountPage extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      account: {},
      formInvalid: false,
      showSuccess: false,
      errors: []
    }

  }

  componentDidMount = () => {

    httpClient.get('/members').subscribe(
      response => {
        const account = response;
        const dateOfBirth = moment(account.dateOfBirth);
        const day = dateOfBirth.date();
        const month = dateOfBirth.month();
        const year = dateOfBirth.year();
        this.setState({account: account, day: day, month: month, year: year});
      },
      error => {
        const errors = this.state.errors;
        errors.push(error.response.data);
        this.setState({ formInvalid: true, errors: errors });
      },
    );

  };

  handleDateChange = (e, value) => {

    this.setState({[e.target.name]: e.target.value});
    let dateOfBirth = moment();
    dateOfBirth.date(this.state.day);
    dateOfBirth.month(this.state.month);
    dateOfBirth.year(this.state.year);

  }

  handleCountryChange = (e, value) => {

    const account = this.state.account;
    account['country'] = e.target.value;
    this.setState({account});

  }

  handleChange = (e, {name, value}) => {

    const account = this.state.account;
    account[name] = value;
    this.setState({account});

  }

  handleSubmit = () => {

    const errors = [];
    const account = this.state.account;
    let dateOfBirth = moment().year(this.state.year).month(this.state.month).date(this.state.day);
    account.dateOfBirth = dateOfBirth.valueOf();

    // validate
    httpClient.put('/members', account).subscribe(
      response => {
        const account = response;
        const dateOfBirth = moment(account.dateOfBirth);
        const day = dateOfBirth.date();
        const month = dateOfBirth.month();
        const year = dateOfBirth.year();
        this.setState({account: account, day: day, month: month, year: year, showSuccess: true});
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

    const {account, day, month, year} = this.state;
    return (

      <div className='account-form'>
        <Grid>
          <Grid.Column>
            <Form size='large' error={this.state.formInvalid} onSubmit={this.handleSubmit}>
              <Segment>

                <Message
                  error
                  header='There was a problem'
                  list={this.state.errors}
                />
                {
                  this.state.showSuccess &&
                  <Message
                    positive
                    content='Account saved successfully'
                  />
                }

                <Form.Group>
                  <Form.Input fluid label='First name' defaultValue={this.state.account.firstName} placeholder='First name' required width={4}/>
                  <Form.Input fluid label='Last name' defaultValue={this.state.account.lastName} placeholder='Last name' required width={4}/>
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
                  <Form.Input name='email' defaultValue={account.email} label='Email' placeholder='Email' onChange={this.handleChange} required width={5} fluid/>
                  <PasswordDialog/>
                </Form.Group>

                <Form.Group>
                  <Form.Input name='addressLine1' defaultValue={account.addressLine1} label='Address line 1' placeholder='Address line 1' onChange={this.handleChange} width={8} required fluid/>
                </Form.Group>

                <Form.Group>
                  <Form.Input name='addressLine2' defaultValue={account.addressLine2} label='Address line 2' placeholder='Address line 2' onChange={this.handleChange} width={8} fluid/>
                </Form.Group>

                <Form.Group>
                  <Form.Input name='town' defaultValue={account.town} label='Town' placeholder='Town' onChange={this.handleChange} width={4} required fluid/>
                  <Form.Input name='postcode' defaultValue={account.postcode} label='Postcode' placeholder='Postcode' onChange={this.handleChange} width={4} required fluid/>
                </Form.Group>

                <Form.Group>
                  <Form.Input name='country' value={account.country} label='Country' onChange={this.handleCountryChange} placeholder='Country' control='select' required>
                    <option value=''>Select country</option>
                    <option value='South Korea'>South Korea</option>
                    <option value='Japan'>Japan</option>
                    <option value='Russian Federation'>Russian Federation</option>
                    <option value='Italy'>Italy</option>
                    <option value='United Kingdom'>United Kingdom</option>
                    <option value='Afghanistan'>Afghanistan</option>
                    <option value='Åland Islands'>Åland Islands</option>
                    <option value='Albania'>Albania</option>
                    <option value='Algeria'>Algeria</option>
                    <option value='American Samoa'>American Samoa</option>
                    <option value='Andorra'>Andorra</option>
                    <option value='Angola'>Angola</option>
                    <option value='Anguilla'>Anguilla</option>
                    <option value='Antigua and Barbuda'>Antigua and Barbuda</option>
                    <option value='Argentina'>Argentina</option>
                    <option value='Armenia'>Armenia</option>
                    <option value='Aruba'>Aruba</option>
                    <option value='Australia'>Australia</option>
                    <option value='Austria'>Austria</option>
                    <option value='Azerbaijan'>Azerbaijan</option>
                    <option value='Bahamas'>Bahamas</option>
                    <option value='Bahrain'>Bahrain</option>
                    <option value='Bangladesh'>Bangladesh</option>
                    <option value='Barbados'>Barbados</option>
                    <option value='Belarus'>Belarus</option>
                    <option value='Belgium'>Belgium</option>
                    <option value='Belize'>Belize</option>
                    <option value='Benin'>Benin</option>
                    <option value='Bermuda'>Bermuda</option>
                    <option value='Bhutan'>Bhutan</option>
                    <option value='Bolivia'>Bolivia</option>
                    <option value='Bonaire'>Bonaire</option>
                    <option value='Bosnia and Herzegovina'>Bosnia and Herzegovina</option>
                    <option value='Botswana'>Botswana</option>
                    <option value='Bouvet Island'>Bouvet Island</option>
                    <option value='Brazil'>Brazil</option>
                    <option value='British Indian Ocean Territory'>British Indian Ocean Territory</option>
                    <option value='British Virgin Islands'>British Virgin Islands</option>
                    <option value='Brunei Darussalam'>Brunei Darussalam</option>
                    <option value='Bulgaria'>Bulgaria</option>
                    <option value='Burkina Faso'>Burkina Faso</option>
                    <option value='Burma'>Burma</option>
                    <option value='Burundi'>Burundi</option>
                    <option value='Cabo Verde'>Cabo Verde</option>
                    <option value='Cambodia'>Cambodia</option>
                    <option value='Cameroon'>Cameroon</option>
                    <option value='Canada'>Canada</option>
                    <option value='Cayman Islands'>Cayman Islands</option>
                    <option value='Central African Republic'>Central African Republic</option>
                    <option value='Chad'>Chad</option>
                    <option value='Chile'>Chile</option>
                    <option value='China'>China</option>
                    <option value='Christmas Island'>Christmas Island</option>
                    <option value='Cocos (Keeling) Islands'>Cocos (Keeling) Islands</option>
                    <option value='Colombia'>Colombia</option>
                    <option value='Comoros'>Comoros</option>
                    <option value='Cook Islands'>Cook Islands</option>
                    <option value='Costa Rica'>Costa Rica</option>
                    <option value='Cote d Ivoire'>Cote dIvoire</option>
                    <option value='Croatia'>Croatia</option>
                    <option value='Cuba'>Cuba</option>
                    <option value='Curaçao'>Curaçao</option>
                    <option value='Cyprus'>Cyprus</option>
                    <option value='Czech Republic'>Czech Republic</option>
                    <option value='Denmark'>Denmark</option>
                    <option value='Djibouti'>Djibouti</option>
                    <option value='Dominica'>Dominica</option>
                    <option value='Dominican Republic'>Dominican Republic</option>
                    <option value='Ecuador'>Ecuador</option>
                    <option value='Egypt'>Egypt</option>
                    <option value='El Salvador'>El Salvador</option>
                    <option value='Equatorial Guinea'>Equatorial Guinea</option>
                    <option value='Eritrea'>Eritrea</option>
                    <option value='Estonia'>Estonia</option>
                    <option value='Eswatini'>Eswatini</option>
                    <option value='Ethiopia'>Ethiopia</option>
                    <option value='Falkland Islands (Malvinas)'>Falkland Islands (Malvinas)</option>
                    <option value='Faroe Islands'>Faroe Islands</option>
                    <option value='Fiji'>Fiji</option>
                    <option value='Finland'>Finland</option>
                    <option value='France'>France</option>
                    <option value='French Guiana'>French Guiana</option>
                    <option value='French Polynesia'>French Polynesia</option>
                    <option value='French Southern Territories'>French Southern Territories</option>
                    <option value='Gabon'>Gabon</option>
                    <option value='Gambia'>Gambia</option>
                    <option value='Georgia'>Georgia</option>
                    <option value='Germany'>Germany</option>
                    <option value='Ghana'>Ghana</option>
                    <option value='Gibraltar'>Gibraltar</option>
                    <option value='Greece'>Greece</option>
                    <option value='Greenland'>Greenland</option>
                    <option value='Grenada'>Grenada</option>
                    <option value='Guadeloupe'>Guadeloupe</option>
                    <option value='Guam'>Guam</option>
                    <option value='Guatemala'>Guatemala</option>
                    <option value='Guernsey'>Guernsey</option>
                    <option value='Guinea'>Guinea</option>
                    <option value='Guinea-Bissau'>Guinea-Bissau</option>
                    <option value='Guyana'>Guyana</option>
                    <option value='Haiti'>Haiti</option>
                    <option value='Hawaiian Islands'>Hawaiian Islands</option>
                    <option value='Heard Island and McDonald Islands'>Heard Island and McDonald Islands</option>
                    <option value='Holy See (Vatican City State)'>Holy See (Vatican City State)</option>
                    <option value='Honduras'>Honduras</option>
                    <option value='Hong Kong'>Hong Kong</option>
                    <option value='Hungary'>Hungary</option>
                    <option value='Iceland'>Iceland</option>
                    <option value='India'>India</option>
                    <option value='Indonesia'>Indonesia</option>
                    <option value='Ireland'>Ireland</option>
                    <option value='Isle of Man'>Isle of Man</option>
                    <option value='Israel'>Israel</option>
                    <option value='Jamaica'>Jamaica</option>
                    <option value='Jersey'>Jersey</option>
                    <option value='Jordan'>Jordan</option>
                    <option value='Kazakhstan'>Kazakhstan</option>
                    <option value='Kenya'>Kenya</option>
                    <option value='Kiribati'>Kiribati</option>
                    <option value='Kuwait'>Kuwait</option>
                    <option value='Kyrgyzstan'>Kyrgyzstan</option>
                    <option value='Lao Peoples Democratic Republic'>Lao Peoples Democratic Republic</option>
                    <option value='Latvia'>Latvia</option>
                    <option value='Lebanon'>Lebanon</option>
                    <option value='Lesotho'>Lesotho</option>
                    <option value='Libya'>Libya</option>
                    <option value='Liechtenstein'>Liechtenstein</option>
                    <option value='Lithuania'>Lithuania</option>
                    <option value='Luxembourg'>Luxembourg</option>
                    <option value='Macao'>Macao</option>
                    <option value='Macedonia'>Macedonia</option>
                    <option value='Madagascar'>Madagascar</option>
                    <option value='Malawi'>Malawi</option>
                    <option value='Malaysia'>Malaysia</option>
                    <option value='Maldives'>Maldives</option>
                    <option value='Mali'>Mali</option>
                    <option value='Malta'>Malta</option>
                    <option value='Marshall Islands'>Marshall Islands</option>
                    <option value='Martinique'>Martinique</option>
                    <option value='Mauritania'>Mauritania</option>
                    <option value='Mauritius'>Mauritius</option>
                    <option value='Mayotte'>Mayotte</option>
                    <option value='Mexico'>Mexico</option>
                    <option value='Micronesia'>Micronesia</option>
                    <option value='Moldova'>Moldova</option>
                    <option value='Monaco'>Monaco</option>
                    <option value='Mongolia'>Mongolia</option>
                    <option value='Montenegro'>Montenegro</option>
                    <option value='Montserrat'>Montserrat</option>
                    <option value='Morocco'>Morocco</option>
                    <option value='Mozambique'>Mozambique</option>
                    <option value='Myanmar'>Myanmar</option>
                    <option value='Namibia'>Namibia</option>
                    <option value='Nauru'>Nauru</option>
                    <option value='Nepal'>Nepal</option>
                    <option value='Netherlands'>Netherlands</option>
                    <option value='New Caledonia'>New Caledonia</option>
                    <option value='New Zealand'>New Zealand</option>
                    <option value='Nicaragua'>Nicaragua</option>
                    <option value='Niger'>Niger</option>
                    <option value='Nigeria'>Nigeria</option>
                    <option value='Niue'>Niue</option>
                    <option value='Norfolk Island'>Norfolk Island</option>
                    <option value='Northern Mariana Islands'>Northern Mariana Islands</option>
                    <option value='Norway'>Norway</option>
                    <option value='Oman'>Oman</option>
                    <option value='Pakistan'>Pakistan</option>
                    <option value='Palau'>Palau</option>
                    <option value='Palestine'>Palestine</option>
                    <option value='Panama'>Panama</option>
                    <option value='Papua New Guinea'>Papua New Guinea</option>
                    <option value='Paraguay'>Paraguay</option>
                    <option value='Peru'>Peru</option>
                    <option value='Philippines'>Philippines</option>
                    <option value='Pitcairn'>Pitcairn</option>
                    <option value='Poland'>Poland</option>
                    <option value='Portugal'>Portugal</option>
                    <option value='Puerto Rico'>Puerto Rico</option>
                    <option value='Qatar'>Qatar</option>
                    <option value='Reunion'>Reunion</option>
                    <option value='Romania'>Romania</option>
                    <option value='Rwanda'>Rwanda</option>
                    <option value='Saint Barthelemy'>Saint Barthelemy</option>
                    <option value='Saint Helena'>Saint Helena</option>
                    <option value='Saint Kitts and Nevis'>Saint Kitts and Nevis</option>
                    <option value='Saint Lucia'>Saint Lucia</option>
                    <option value='Saint Martin'>Saint Martin</option>
                    <option value='Saint Pierre and Miquelon'>Saint Pierre and Miquelon</option>
                    <option value='Saint Vincent and theGrenadines'>Saint Vincent and theGrenadines</option>
                    <option value='Samoa'>Samoa</option>
                    <option value='San Marino'>San Marino</option>
                    <option value='Sao Tome and Principe'>Sao Tome and Principe</option>
                    <option value='Saudi Arabia'>Saudi Arabia</option>
                    <option value='Senegal'>Senegal</option>
                    <option value='Serbia'>Serbia</option>
                    <option value='Seychelles'>Seychelles</option>
                    <option value='Sierra Leone'>Sierra Leone</option>
                    <option value='Singapore'>Singapore</option>
                    <option value='Sint Maarten(Netherlands)'>Sint Maarten(Netherlands)</option>
                    <option value='Slovakia'>Slovakia</option>
                    <option value='Slovenia'>Slovenia</option>
                    <option value='Solomon Islands'>Solomon Islands</option>
                    <option value='Somalia'>Somalia</option>
                    <option value='South Africa'>South Africa</option>
                    <option value='South Georgia and the South Sandwich Islands'>South Georgia and the South Sandwich Islands</option>
                    <option value='South Sudan'>South Sudan</option>
                    <option value='Spain'>Spain</option>
                    <option value='Sri Lanka'>Sri Lanka</option>
                    <option value='Suriname'>Suriname</option>
                    <option value='Svalbard & Jan Mayen Islands'>Svalbard & Jan Mayen Islands</option>
                    <option value='Sweden'>Sweden</option>
                    <option value='Switzerland'>Switzerland</option>
                    <option value='Taiwan'>Taiwan</option>
                    <option value='Tajikistan'>Tajikistan</option>
                    <option value='Tanzania'>Tanzania</option>
                    <option value='Thailand'>Thailand</option>
                    <option value='Timor-Leste'>Timor-Leste</option>
                    <option value='Togo'>Togo</option>
                    <option value='Tokelau'>Tokelau</option>
                    <option value='Tonga'>Tonga</option>
                    <option value='Trinidad and Tobago'>Trinidad and Tobago</option>
                    <option value='Tunisia'>Tunisia</option>
                    <option value='Turkey'>Turkey</option>
                    <option value='Turkmenistan'>Turkmenistan</option>
                    <option value='Turks and Caicos Islands'>Turks and Caicos Islands</option>
                    <option value='Tuvalu'>Tuvalu</option>
                    <option value='Uganda'>Uganda</option>
                    <option value='Ukraine'>Ukraine</option>
                    <option value='United Arab Emirates'>United Arab Emirates</option>
                    <option value='Uruguay'>Uruguay</option>
                    <option value='Uzbekistan'>Uzbekistan</option>
                    <option value='Vanuatu'>Vanuatu</option>
                    <option value='Venezuela'>Venezuela</option>
                    <option value='Vietnam'>Vietnam</option>
                    <option value='Wallis and Futuna'>Wallis and Futuna</option>
                    <option value='Western Sahara'>Western Sahara</option>
                    <option value='Yemen'>Yemen</option>
                    <option value='Zambia'>Zambia</option>
                    <option value='Zimbabwe'>Zimbabwe</option>
                  </Form.Input>
                </Form.Group>

                <Form.Group>
                  <InvitationLink/>
                </Form.Group>

                <Button.Group floated='right'>
                  <Button color='orange'>Save</Button>
                </Button.Group>
                <br/>
                <br/>

              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AccountPage;
