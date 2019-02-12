import React from 'react';
import {Button, Form, Grid, Header, Icon, Message, Segment, Checkbox, Loader, Divider} from 'semantic-ui-react';
import {formatTimestamp} from "../../utils/date";

import './styles.css';
import httpClient from "../../services/http-client";

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
        this.setState({ rewards: response });
      }
    );

  };

  render() {

    return (
      <Segment>
        <Header>Rewards</Header>
        <Grid style={{overflow: 'auto', maxHeight: 400 }}>
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
