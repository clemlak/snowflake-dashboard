import React, { Component } from 'react';
import Web3 from 'web3';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Modal,
  Grid,
  Paper,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Chip,
} from '@material-ui/core';

import TransactionButton from '../../../common/TransactionButton';

class DisplayLoan extends Component {
  constructor(props) {
    super(props);

    const {
      loanId,
      isOpen,
    } = this.props;

    this.state = {
      isOpen,
      loanId,
      amount : 0,
      currentDebt: 0,
      status: 0,
      rate: 0,
      deadline: 0,
      borrower: 0,
      lender: 0,
      borrowerCurrentDebt: 0,
      borrowerLent: 0,
      borrowerBorrowed: 0,
      borrowerReimbursed: 0,
    };
  }

  componentDidMount = () => {
    const {
      loanId,
    } = this.state;

    this.props.contract.methods.getLoanStatus(loanId).call()
      .then((status) => {
        this.setState({
          status,
        });

        return this.props.contract.methods.getLoanInfo(loanId).call();
      })
      .then((info) => {
        this.setState({
          amount: info[0],
          currentDebt: info[1],
          rate: info[2],
          deadline: info[3],
          borrower: info[4],
          lender: info[5],
        });

        return this.props.contract.methods.getUserinfo(info[4]).call();
      })
      .then((user) => {
        this.setState({
          borrowerCurrentDebt: user[0],
          borrowerLent: user[1],
          borrowerBorrowed: user[2],
          borrowerReimbursed: user[3],
        });
      })
      .catch((err) => {
        console.log(err);
      });
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

  render = () => {
    const {
      isOpen,
      loanId,
      amount,
      currentDebt,
      status,
      rate,
      deadline,
      borrower,
      lender,
      borrowerCurrentDebt,
      borrowerLent,
      borrowerBorrowed,
      borrowerReimbursed,
    } = this.state;

    return (
      <Dialog
        aria-labelledby="display-loan-modal"
        open={isOpen}
        onClose={this.props.handleClose}
      >
        <DialogTitle id="form-dialog-title">
          Loan #{loanId}
          {' '}
          <Chip
            color={status === 0 ? "default" : "primary"}
            label={status === 0 ? "Funded" : "Open"}
          />
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <Avatar>
                {borrower}
              </Avatar>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Typography style={{ marginBottom: 20 }}>
                is requesting a loan
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={16}
          >

            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(amount.toString())}
              </Typography>
              <Typography color="textSecondary">
                AMOUNT
              </Typography>
            </Grid>

            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {`${rate}%`}
              </Typography>
              <Typography color="textSecondary">
                RATE
              </Typography>
            </Grid>

            <Grid item xs={4} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(currentDebt.toString())}
              </Typography>
              <Typography color="textSecondary">
                TOTAL
              </Typography>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <TransactionButton
            readyText='Fund this loan'
            method={() => this.props.contract.methods.lend(loanId)}
          />
          <Button variant="outlined" onClick={this.props.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DisplayLoan;
