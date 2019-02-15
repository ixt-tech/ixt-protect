import React from 'react';
import {
  Modal,
  Form,
  Button,
  Icon,
  Card,
  Image,
} from 'semantic-ui-react';
import httpClient from '../../services/http-client';
import amazonLogo from '../../images/amazon-logo.jpg';

import './styles.css';

class RedeemDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      isValid: false,
      modalOpen: false,
    };
  }

  handleCountryChange = (e, value) => {

//    const account = this.props.account;
//    account['country'] = e.target.value;
//    this.setState({account});

  }

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  handleSubmit = async (event) => {

    const body = {
      name: 'Amazon Voucher',
      country: 'United Kingdom'
    };
    httpClient.post('/redemptions', body);
    this.setState({modalOpen: false});

  }

  handleOpen = (e) => {
    e.preventDefault();
    this.setState({modalOpen: true})
  }

  handleClose = (e) => {
    e.preventDefault();
    this.setState({modalOpen: false})
  }

  render() {
    return (
      <Modal open={this.state.modalOpen}
             trigger={<Form.Button
             basic
             color='orange'
             floated='right'
             onClick={this.handleOpen}
             onClose={this.handleClose}><Icon name='money bill alternate outline' /> Redeem</Form.Button>}>

        <Modal.Header>Redeem your reward IXT</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Card>
              <Image src={amazonLogo} />
              <Card.Content>
                <Card.Header>Amazon voucher $25</Card.Header>
                <Card.Meta>
                  <span><b>IXT Price: 200</b></span>
                </Card.Meta>
                <Card.Meta>
                  <span>The voucher code will be sent to your account email address<br/></span>
                </Card.Meta>
                <Card.Description>
                  <Form.Input name='country' value={this.state.country} label='Country' onChange={this.handleCountryChange} placeholder='Country' control='select' required>
                    <option value=''>Select country</option>
                    <option value='South Korea'>South Korea</option>
                  </Form.Input>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button basic color='green'>
                    Select
                  </Button>
                  <Button basic color='red'>
                    Unselect
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='orange' onClick={this.handleClose}>
            Close
          </Button>
          <Button basic color='orange' onClick={this.handleSubmit}>
            Redeem
          </Button>
        </Modal.Actions>

      </Modal>
    );
  }

}

export default RedeemDialog;
