import React from 'react';
import {
  Grid,
  Segment,
  Button,
  Icon,
  Popup,
} from 'semantic-ui-react';
import './styles.css';
import { fromBn, asNum } from "../../utils/number";

class InvitationLink extends React.Component {

  state = { invitationLink: '' };

  constructor(props) {
    super(props);
    this.copy = this.copy.bind(this);
  }

  componentDidMount = async () => {
    const member = this.props.member;
    const invitationLink = 'https://protect.ixt.global/join?invitation=' + this.props.invitationCode;
    const invitationReward = this.props.invitationReward;
    this.setState({ invitationLink, invitationReward });
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
      <div className='invitation'>
        Simply copy and send the link below to anyone you wish to invite to join IXT Protect.
        <br/>
        <Grid>
          <Grid.Column width={16}>
            <Segment>
              <b>{ this.state.invitationLink }</b>
              <Popup trigger={<Button className='invitation' size='small' icon='copy outline' onClick={this.copy} />} content='Copied to clipboard' on='click' hideOnScroll/>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }

}

export default InvitationLink;
