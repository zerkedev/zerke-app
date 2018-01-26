
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class AddressSection extends React.Component {
  render() {
    return (
      <label>
        Card details
        <CardElement />
      </label>
    );
  }
};

export default AddressSection;