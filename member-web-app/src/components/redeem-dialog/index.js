import React from 'react';
import {
  Modal,
  Form,
  Button,
  Icon,
  Card,
  Image,
  Segment,
  Grid,
  Divider,
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
      balance: 0,
      basket: {},
      basketBalance: 0
    };
  }

  handleCountryChange = (e, value) => {

//    const account = this.props.account;
//    account['country'] = e.target.value;
//    this.setState({account});

  }

  handleChange = (e, {name, value}) => this.setState({[name]: value});

  addProduct = (name, price, e) => {

    e.preventDefault();
    let basketBalance = this.state.basketBalance;
    basketBalance += price;

    if(this.props.balance < basketBalance) return;
    const basket = this.state.basket;
    let count = basket[name];
    if(!count) count = 0;
    basket[name] = ++count;
    this.setState({basket, basketBalance});

  }

  removeProduct = (name, price, e) => {

    e.preventDefault();
    const basket = this.state.basket;
    let count = basket[name];
    if(!count) {
      count = 0;
      delete basket[name];
    } else if(count > 0) {
      basket[name] = --count;
      let basketBalance = this.state.basketBalance;
      basketBalance -= price;
      this.setState({basket, basketBalance});
    }

  }

  isBasketEmpty = () => {
    return !this.state.basket || Object.entries(this.state.basket).length == 0;
  }

  handleSubmit = async (event) => {

    let body = [];
    const basket = this.state.basket;
    for(let name in basket) {
      body = body.concat(this.multiply(name, basket[name]));
    }
    httpClient.post('/redemptions', body);
    this.setState({modalOpen: false});

  }

  multiply(name, count) {

    const entries = [];
    for(let i = 0; i < count; i++) {
      entries.push({name: name, country: 'United Kingdom'});
    }
    return entries;

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
          <Grid>
            <Grid.Column width={10}>
              <Form onSubmit={this.handleSubmit}>
                <Card.Group>
                  <Card>
                    <Image src={amazonLogo} />
                    <Card.Content>
                      <Card.Header>Amazon voucher $20</Card.Header>
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
                          <option value='Japan'>Japan</option>
                          <option value='United Kingdom'>United Kingdom</option>
                        </Form.Input>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className='ui two buttons'>
                        <Button basic color='red' onClick={this.removeProduct.bind(this, 'Amazon Voucher', 200 )}>
                          <Icon name='minus' />
                          Remove
                        </Button>
                        <Button basic color='green' onClick={this.addProduct.bind(this, 'Amazon Voucher', 200 )}>
                          <Icon name='plus' />
                          Add
                        </Button>
                      </div>
                    </Card.Content>
                  </Card>
                </Card.Group>
              </Form>
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment>
                Current reward balance: <b>{this.props.balance} IXT</b>
                <br/>
                <br />
                <br />
                {this.isBasketEmpty() &&
                  <p>Nothing added yet. Please use the Add button on the item you wish to redeem</p>
                }
                {!this.isBasketEmpty() &&
                  <div>
                    Selected products to redeem
                    <Divider />
                  </div>
                }

                {this.state.basket['Amazon Voucher'] > 0 &&
                <Segment.Group horizontal>
                  <Segment><Image src={amazonLogo} size='tiny'/></Segment>
                  <Segment textAlign='center'>Quantity<br/><b>x {this.state.basket['Amazon Voucher']}</b></Segment>
                </Segment.Group>
                }

                {this.state.basketBalance > 0 &&
                  <div>
                    <Divider/>
                    Total: <b>{this.state.basketBalance}</b>
                  </div>
                }
              </Segment>
            </Grid.Column>
          </Grid>
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
