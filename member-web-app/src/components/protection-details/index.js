import React from 'react';
import {Button, Popup, Grid, Header, Icon, Message, Segment, Checkbox, Loader, Divider} from 'semantic-ui-react';
import PasswordDialog from '../../components/password-dialog';

import './styles.css';
import moment from "moment/moment";
import httpClient from "../../services/http-client";

class ProtectionDetails extends React.Component {

  state = {invitationLink: ''};

  constructor(props) {

    super(props);
    this.copy = this.copy.bind(this);

  }

  componentDidMount = async () => {
    const invitationLink = 'protect.ixt.global/join?invitation=';
    this.setState({invitationLink});
  }

  copy() {
    let _tmp = document.createElement('input');
    document.body.appendChild(_tmp);
    _tmp.value = this.state.invitationLink;
    _tmp.select();
    document.execCommand('copy');
    document.body.removeChild(_tmp);
  }

  render() {

    return (
      <Segment padded>
        <Header>Protection Details</Header>
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>Membership number</Grid.Column>
            <Grid.Column width={11}><b>{this.props.account.id}</b></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>Start date</Grid.Column>
            <Grid.Column width={11}><b>{this.props.account.startDate}</b></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>End date</Grid.Column>
            <Grid.Column width={11}><b>{this.props.account.endDate}</b></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>Status</Grid.Column>
            <Grid.Column width={11}><b>{this.props.account.status}</b></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5}>Invitation link</Grid.Column>
            <Grid.Column width={11}>
              <b>{this.state.invitationLink + this.props.account.invitationCode}</b>
              <Popup trigger={<Button className='invitation' size='small' icon='copy outline' onClick={this.copy}/>}
                     content='Copied to clipboard' on='click' hideOnScroll/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5} style={{color:'white'}}>.</Grid.Column>
            <Grid.Column width={11}></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5} style={{color:'white'}}>.</Grid.Column>
            <Grid.Column width={11}></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Button icon color='orange' basic floated='right' onClick={this.toggleEditMode}>
                <Icon name='file pdf outline' /> Download
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )

  }

}

export default ProtectionDetails;
