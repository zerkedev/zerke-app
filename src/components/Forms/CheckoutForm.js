import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements';


import AddressSection from '../../components/StripeFormFields/AddressSection';
import CardSection from '../../components/StripeFormFields/CardSection';

class CheckoutForm extends React.Component {


  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {
      console.log('Received Stripe token:', token);
    });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  }

  render() {
    return (
      <Elements>
        <form onSubmit={this.handleSubmit}>
          <AddressSection />
           <CardSection />
        <button>Confirm order</button>
        <button>Cancel order</button>

      </form>
      </Elements>
    );
  }
} 
 
export default injectStripe(CheckoutForm);


