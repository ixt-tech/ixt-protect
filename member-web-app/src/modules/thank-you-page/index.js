import React from 'react';
import {
  Header,
  Grid,
  Button,
  Icon,
} from 'semantic-ui-react';

class ThankYouPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className='sign-in-form' style={{height: '600px'}}>
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.sign-in-form {
        height: 100%;
      }
    `}</style>
        <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
          <Grid.Column style={{maxWidth: 450}}>
            <Header as='h3' textAlign='center'>
              Thank you for purchasing IXT Protect.
            </Header>
            You are now a member of IXT Protect.
            <br/>
            <br/>
            <Button icon basic labelPosition='left' color='orange'>
              <Icon name='download' />
              IXT Protect PDF
            </Button>
            <Button icon basic labelPosition='left' color='orange'>
              <Icon name='user' />
              Your account
            </Button>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ThankYouPage;
