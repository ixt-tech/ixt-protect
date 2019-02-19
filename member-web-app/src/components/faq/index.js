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
      faqs: [
        {
          key: 1,
          question: 'What is IXT?',
          answer: 'IXT is ERC20 utility token.'
        }, {
          key: 2,
          question: 'Where is IXT traded?',
          answer: 'You can get IXT on the following exchanges; Bit-Z, Liquid, EtherDelta, IDAX, HitBTC, BitBns, Tokenjar'
        }, {
          key: 3,
          question: 'Who can purchase IXT?',
          answer: 'Anyone can purchase IXT apart of residents in the following countries; United States, Syria, Cuba, North Korea, Iran, Côte d’Ivoire, Burma'
        }, {
          key: 4,
          question: 'What can I use IXT for?',
          answer: 'IXT can be used for?' +
          'Commission payments in PayRue cryptocurrency payment app, ' +
          'Staking in IXT Protect ecosystem, ' +
          'Voting rights in IXT Protect, ' +
          'Invitation rewards to IXT Protect, ' +
          'Redeem Amazon gift voucher for IXT when you are member of IXT Protect'
        }, {
          key: 5,
          question: 'What products does IXT Ltd have?',
          answer: 'IXT Protect v.1 offers it’s members protection service and was launched on the 14th December 2018'
        }, {
          key: 6,
          question: 'When are IXT project updates published?',
          answer: 'IXT blog updates are published around the second week of each month.'
        }, {
          key: 7,
          question: 'What is IXT’s mission?',
          answer: 'Our aim is to drive the adoption of blockchain and cryptocurrency across insurance'
        }, {
          key: 8,
          question: 'How can I get involved with IXT community?',
          answer: 'You can join out IXT Global telegram channel https://t.me/ixtglobal or follow us on Twitter https://twitter.com/IXT_token'
        }, {
          key: 9,
          question: 'What is IXT Protect?',
          answer: 'IXT Protect is the new product from IXT Ltd that offers protection services. By joining you benefit from Travel Crisis Protection as well as the opportunity to contribute to the ecosystem and receive rewards.'
        }, {
          key: 10,
          question: 'What type of documents are acceptable when applying for IXT Protect?',
          answer: 'Driving licence, ' +
          'Passport, ' +
          'National ID Card, ' +
          'Utility bill, ' +
          'Telephone bill'
        }, {
          key: 11,
          question: 'How much does IXT Protect cost?',
          answer: 'IXT Protect costs $59 per year or you can become a member through staking a minimum of 1000 IXT.'
        }, {
          key: 12,
          question: 'What is Metamask?',
          answer: 'MetaMask is a bridge that allows you to visit the distributed web of tomorrow in your browser today. It allows you to run Ethereum dApps right in your browser without running a full Ethereum node. ' +
          'MetaMask includes a secure identity vault, providing a user interface to manage your identities on different sites and sign blockchain transactions.'
        }, {
          key: 13,
          question: 'What is smart contract?',
          answer: 'A smart contract is a computer protocol intended to digitally facilitate, verify, or enforce the negotiation or performance of a contract. Smart contracts allow the performance of credible transactions without third parties. These transactions are trackable and irreversible.'
        }, {
          key: 14,
          question: 'How can I receive support regarding IXT Protect?',
          answer: 'You can contact us regarding any support issues at support@ixt.global or through our telegram channel https://t.me/ixtglobal.'
        }, {
          key: 15,
          question: 'How can I stake IXT?',
          answer: 'You can stake IXT and join the IXT Protect ecosystem. First you will need to complete KYC application after which you will be able to access your account and place your stake.'
        }, {
          key: 16,
          question: 'What benefits do I get staking IXT token?',
          answer: 'Voting rights in IXT Protect, ' +
          'Invitation rewards to IXT Protect'
        }, {
          key: 17,
          question: 'I have a question that is not listed here, please help.',
          answer: 'Contact us at support@ixt.global or through our telegram channel https://t.me/ixtglobal'
        }
      ],
    }

  }

  render() {

    return (
      <Segment>
        <Header>FAQ</Header>
        <Divider fitted />
        <Grid style={{overflow: 'auto', maxHeight: 400, minHeight: 400 }}>
          { this.state.faqs.map((row) => (
              <Grid.Row className='grid-row' children={this.state.rewards} key={row.key}>
                <Grid.Column width={2}><Button style={{background: '#ffffff', color: '#000000'}}><Icon name='angle right' /></Button></Grid.Column>
                <Grid.Column width={14}><b>{row.question}</b><br/>{row.answer}</Grid.Column>
              </Grid.Row>
          ))}
        </Grid>
      </Segment>
    )

  }

}

export default Faq;
