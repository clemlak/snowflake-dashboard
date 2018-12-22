import React, { Component } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

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

  handleNewValueChange = (event, value) => {
    this.setState({
      newAmount: value,
    });
  }

  handleNewRateChange = (event, value) => {
    this.setState({
      newRate: value,
    });
  }

  render = () => {
    const {
      newAmount,
      newRate,
      isOpen,
    } = this.state;

    return (
      <Dialog
        open={isOpen}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New loan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to request a new loan, please fill the following form.
          </DialogContentText>
          <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
          >
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>How much do you want?</p>
              <Slider
                value={newAmount}
                onChange={this.handleNewValueChange}
                aria-labelledby="label"
                style={{ padding: 10 }}
                min={50000}
                max={5000000}
                step={50000}
              />
              <Typography color="primary" variant="h5">
                {newAmount.toLocaleString(undefined)}
              </Typography>
              <Typography color="textSecondary">
                HYDRO
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>What rate would you like?</p>
              <Slider
                value={newRate}
                onChange={this.handleNewRateChange}
                aria-labelledby="label"
                style={{ padding: 10 }}
                min={1}
                max={100}
                step={1}
              />
              <Typography color="primary" variant="h5">
                {newRate.toLocaleString(undefined)}%
              </Typography>
              <Typography color="textSecondary">
                RATE
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>Total cost:</p>
              <Typography color="primary" variant="h5">
                {((newRate * newAmount / 100) + newAmount).toLocaleString(undefined)}
              </Typography>
              <Typography color="textSecondary">
                HYDRO
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <TransactionButton
            readyText='Accept'
            method={() => this.props.contract.methods.requestLoan(newAmount, newRate, 0)}
          />
          <Button variant="outlined" onClick={this.props.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RequestLoan;
