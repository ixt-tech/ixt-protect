import React from 'react';
import {Button, Input, Grid, Header, Icon, Message, Segment, Checkbox, Loader, Divider} from 'semantic-ui-react';
import PasswordDialog from '../../components/password-dialog';

import './styles.css';
import moment from "moment/moment";
import httpClient from "../../services/http-client";

class Faq extends React.Component {

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
        <Header>FAQ</Header>
        <Divider fitted />
        <Grid style={{overflow: 'auto', maxHeight: 393 }}>
          { this.state.rewards.map((row) => (
              <Grid.Row className='grid-row' children={this.state.rewards} key={row.id}>
                <Grid.Column width={2}><Button style={{background: '#ffffff', color: '#000000'}}><Icon name='angle right' /></Button></Grid.Column>
                <Grid.Column width={14}><b>Question testing</b><br/>Answer testing</Grid.Column>
              </Grid.Row>
          ))}
        </Grid>
      </Segment>
    )

  }

}

export default Faq;
