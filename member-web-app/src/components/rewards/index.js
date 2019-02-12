import React from 'react';
import {Button, Form, Grid, Header, Icon, Message, Segment, Checkbox, Loader, Divider} from 'semantic-ui-react';
import {formatTimestamp} from "../../utils/date";

import './styles.css';
import httpClient from "../../services/http-client";
import RedeemDialog from '../../components/redeem-dialog';

class Rewards extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      rewards: [],
    }

  }

  componentDidMount = () => {

    httpClient.get('/rewards').subscribe(
      response => {
        const balance = 123.00;
        this.setState({ rewards: response, balance: balance });
      }
    );

  };

  render() {

    return (
      <Segment>
        <Header>Rewards</Header>
        <Divider />

        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>Balance: <b>{this.state.balance} IXT</b></Grid.Column>
            <Grid.Column width={9}>
              <RedeemDialog balance={this.state.balance}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid style={{overflow: 'auto', maxHeight: 320 }}>
          <Grid.Row className='grid-header'>
            <Grid.Column width={9}>Description</Grid.Column>
            <Grid.Column width={3}>Amount</Grid.Column>
            <Grid.Column width={4}>Time</Grid.Column>
          </Grid.Row>
          { this.state.rewards.length == 0 &&
          <Grid.Row>
            <Grid.Column>
              No rewards yet
            </Grid.Column>
          </Grid.Row>
          }
          { this.state.rewards.map((row) => (
              <Grid.Row className='grid-row' children={this.state.rewards} key={row.id}>
                <Grid.Column width={9}>{ row.description }</Grid.Column>
                <Grid.Column width={3}>{ row.amount }</Grid.Column>
                <Grid.Column width={4}>{ formatTimestamp(row.createdAt) }</Grid.Column>
              </Grid.Row>
          ))}
        </Grid>
      </Segment>
    )

  }

}

export default Rewards;
