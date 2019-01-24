import React, { Component } from 'react';
import Web3 from 'web3';
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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
      deadline: 0,
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

  handleDeadlineChange = (event, value) => {
    this.setState({
      deadline: value,
    });
  }

  calculateDeadline = () => {
    const {
      deadline,
    } = this.state;

    return Math.round(Date.now() / 1000) + (deadline * 60 * 60 * 24);
  }

  render = () => {
    const {
      newAmount,
      newRate,
      deadline,
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
            You are about to request a new loan, please fill the following form:
          </DialogContentText>
          <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
          >

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>I want to borrow</p>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Slider
                value={newAmount}
                onChange={this.handleNewValueChange}
                aria-labelledby="label"
                style={{ padding: '22px 0px' }}
                min={500}
                max={2000000}
                step={1000}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'left' }}>
              <Typography color="textSecondary">
                500 HYDRO
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h5">
                {newAmount.toLocaleString(undefined)}
              </Typography>
              <Typography color="textSecondary">
                HYDRO
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              <Typography color="textSecondary">
                2 000 000 HYDRO
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Divider variant="middle" style={{ margin: '20px 0px' }}/>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>with a fixed-rate of</p>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Slider
                value={newRate}
                onChange={this.handleNewRateChange}
                aria-labelledby="label"
                style={{ padding: '22px 0px' }}
                min={1}
                max={100}
                step={1}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'left' }}>
              <Typography color="textSecondary">
                1%
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h5">
                {newRate.toLocaleString(undefined)}%
              </Typography>
              <Typography color="textSecondary">
                RATE
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              <Typography color="textSecondary">
                100%
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Divider variant="middle" style={{ margin: '20px 0px' }}/>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>and I will pay back within</p>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Slider
                value={deadline}
                onChange={this.handleDeadlineChange}
                aria-labelledby="label"
                style={{ padding: '22px 0px' }}
                min={1}
                max={180}
                step={1}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'left' }}>
              <Typography color="textSecondary">
                1 day
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h5">
                {deadline}
              </Typography>
              <Typography color="textSecondary">
                days
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: 'right' }}>
              <Typography color="textSecondary">
                180 days
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Divider variant="middle" style={{ margin: '20px 0px' }}/>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <p>Total cost:</p>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
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
            method={() => this.props.contract.methods.requestLoan(Web3.utils.toWei(newAmount.toString()), newRate, this.calculateDeadline() )}
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
