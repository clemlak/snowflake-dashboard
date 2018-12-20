import React, { Component } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  TextField,
  Modal,
} from '@material-ui/core';

import TransactionButton from '../../../common/TransactionButton';

class RequestLoan extends Component {
  constructor(props) {
    super(props);

    const {
      isOpen,
    } = this.props;

    this.state = {
      newAmount: 0,
      newRate: 0,
      isOpen,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      isOpen,
    } = this.state;

    if (this.props.isOpen !== isOpen) {
      this.setState({
        isOpen: this.props.isOpen,
      });
    }
  }

  updateValue = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleClose = () => {
    this.setState({
      isOpen: false,
    });
  }

  render = () => {
    const {
      newAmount,
      newRate,
      isOpen,
    } = this.state;

    return (
      <Modal
        aria-labelledby="request-loan-modal"
        aria-describedby="request-loan-description"
        open={isOpen}
        onClose={this.handleClose}
      >
        <Card>
          <CardContent>
            <Typography>
              Request a new loan
            </Typography>
            <TextField
              id="newAmount"
              label="Amount"
              helperText="The amount for a new loan."
              type="number"
              margin="normal"
              value={newAmount}
              onChange={this.updateValue('newAmount')}
             />
             <TextField
               id="newRate"
               label="Rate"
               helperText="The rate for a new loan."
               type="number"
               margin="normal"
               value={newRate}
               onChange={this.updateValue('newRate')}
              />
            <TransactionButton
              readyText='Request loan'
              method={() => this.props.contract.methods.requestLoan(newAmount, newRate, 0)}
            />
          </CardContent>
        </Card>
      </Modal>
    );
  }
}

export default RequestLoan;
