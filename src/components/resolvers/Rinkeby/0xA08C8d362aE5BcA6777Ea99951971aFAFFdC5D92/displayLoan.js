import React, { Component } from 'react';
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
        <DialogTitle id="form-dialog-title">Loan #{loanId}</DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={16}
          >
            <Grid item xs={12}>
              <Avatar>{borrower}</Avatar>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress variant="determinate" value={10} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

export default DisplayLoan;
