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
      rows: [],
    }
    this.getData = this.getData.bind(this);

  }

  componentDidMount = () => {

    this.refresh();

  };

  refresh = () => {

    this.getData('/rewards');
    this.getData('/redemptions');

    httpClient.get('/rewards/balance').subscribe(
      response => {
        const rewardBalance = response.rewardBalance;
        this.setState({rewardBalance: rewardBalance});
      }
    );

  }

  getData = (type) => {

    httpClient.get(type).subscribe(
      response => {
        let rows = this.state.rows;
        const length = rows.length;
        response.forEach(function(row, index, array) {
          row['index'] = length + index;
          rows.push(row);
        });
        rows.sort((a,b) => (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0));
        this.setState({ rows: rows });
      }
    );

  }

  render() {

    return (
      <Segment style={{minHeight: 457}}>
        <Header>Rewards</Header>
        <Divider />

        {this.state.rows.length > 0 &&
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>Balance: <b>{this.state.rewardBalance} IXT</b></Grid.Column>
            <Grid.Column width={9}>
              <RedeemDialog balance={this.state.rewardBalance} refresh={this.refresh}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        }
        <Grid style={{overflow: 'auto', maxHeight: 327}}>
          {this.state.rows.length > 0 &&
          <Grid.Row className='grid-header'>
            <Grid.Column width={9}>Description</Grid.Column>
            <Grid.Column width={3}>Amount</Grid.Column>
            <Grid.Column width={3}>Time</Grid.Column>
          </Grid.Row>
          }
          { this.state.rows.length == 0 &&
          <Grid.Row>
            <Grid.Column>
              No rewards yet
            </Grid.Column>
          </Grid.Row>
          }
          { this.state.rows.map((row) => (
              <Grid.Row className='grid-row' children={this.state.rows} key={row.index}>
                <Grid.Column width={9}>{ row.description }</Grid.Column>
                <Grid.Column width={3}>{ row.amount }</Grid.Column>
                <Grid.Column width={3}>{ formatTimestamp(row.createdAt) }</Grid.Column>
              </Grid.Row>
          ))}
        </Grid>
      </Segment>
    )

  }

}

export default Rewards;
