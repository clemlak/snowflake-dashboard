import React, { Component } from 'react';
import Web3 from 'web3';
import {
  Button,
  Typography,
  Grid,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Divider,
  LinearProgress,
  TextField,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import HelpIcon from '@material-ui/icons/Help';
import MoneyIcon from '@material-ui/icons/Money';

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
      reimburseNow: 0,
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

  displayDeadline = () => {
    const {
      deadline,
    } = this.state;

    const date = new Date(deadline * 1000);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    return date.toLocaleDateString("en-US", options);
  }

  displayProgress = () => {
    const {
      currentDebt,
      amount,
      rate,
      reimburseNow,
      loanId,
      status,
    } = this.state;

    const BN = Web3.utils.BN;

    const bigAmount = new BN(amount);
    const bigDebt = new BN(currentDebt);
    const bigRate = new BN(rate);
    const bigHundred = new BN(100);

    const bigInterests = bigAmount.mul(bigRate).div(bigHundred);

    const bigDue = bigAmount.add(bigInterests);

    const bigProgress = bigDue.sub(bigDebt);

    let bigProgressPercents = new BN(0);

    if (!bigDue.isZero()) {
      bigProgressPercents = bigProgress.mul(bigHundred).div(bigDue);
    }

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography color="primary" style={{ marginBottom: 20 }}>
            Reimbursement
          </Typography>
        </Grid>

        <Grid item xs={12} style={{ marginBottom: 10 }}>
          <LinearProgress color="secondary" variant="determinate" value={bigProgressPercents.toNumber()} />
        </Grid>

        <Grid item xs={12} style={{ marginBottom: 20, textAlign: 'center' }}>
          <Typography color="primary" variant="h5">
            {Web3.utils.fromWei(bigProgress.toString())}
          </Typography>
          <Typography>
            were reimbursed
          </Typography>
        </Grid>

        {status === '1' &&
          <div>
            <Grid item xs={6} style={{ marginBottom: 20, textAlign: 'center' }}>
              <TextField
                id="reimbursedAmount"
                label="Reimburse now"
                value={reimburseNow}
                onChange={this.handleChange('reimburseNow')}
                margin="normal"
              />
            </Grid>

            <Grid item xs={6} style={{ marginBottom: 20, textAlign: 'center' }}>
              <TransactionButton
                readyText='Reimburse'
                method={() => this.props.contract.methods.reimburse(loanId, Web3.utils.toWei(reimburseNow.toString() ))}
              />
            </Grid>
          </div>
        }
      </Grid>
    );
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  displayLoanStatus = () => {
    const {
      status,
    } = this.state;

    if (status === '0') {
      return <Chip color="primary" label="Open" icon={<HelpIcon />} />;
    } else if (status === '1') {
      return <Chip color="default" label="Funded" icon={<MoneyIcon />} />;
    } else if (status === '2') {
      return <Chip color="secondary" label="Completed" icon={<DoneIcon />} />;
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
          Loan {loanId}
          {' '}
          {this.displayLoanStatus()}
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >

            {status === '0' ? (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                  <Avatar style={{ marginBottom: 10 }}>
                    {borrower}
                  </Avatar>
                </Grid>

                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Typography style={{ marginBottom: 10 }}>
                    is requesting a loan
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={3} style={{ textAlign: 'center', justifyContent: 'center' }}>
                  <Avatar style={{ margin: '0 auto', marginBottom: 10 }}>
                    {borrower}
                  </Avatar>

                  <Typography color="textSecondary">
                    requested a loan
                  </Typography>
                </Grid>

                <Grid item xs={3} style={{ textAlign: 'center' }}>
                  <Avatar style={{ margin: '0 auto', marginBottom: 10 }}>
                    {lender}
                  </Avatar>

                  <Typography color="textSecondary">
                    funded the loan
                  </Typography>
                </Grid>

              </Grid>
            )}

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Divider variant="middle" style={{ margin: '20px 0px' }}/>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Typography color="primary" style={{ marginBottom: 20 }}>
                Borrower metrics
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(borrowerCurrentDebt.toString())}
              </Typography>
              <Typography color="textSecondary">
                Current debt
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(borrowerLent.toString())}
              </Typography>
              <Typography color="textSecondary">
                Total lent
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(borrowerBorrowed.toString())}
              </Typography>
              <Typography color="textSecondary">
                Total borrowed
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(borrowerReimbursed.toString())}
              </Typography>
              <Typography color="textSecondary">
                Total reimbursed
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Divider variant="middle" style={{ margin: '20px 0px' }}/>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Typography color="primary" style={{ marginBottom: 20 }}>
                Loan metrics
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(amount.toString())}
              </Typography>
              <Typography color="textSecondary">
                AMOUNT
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {`${rate}%`}
              </Typography>
              <Typography color="textSecondary">
                RATE
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(currentDebt.toString())}
              </Typography>
              <Typography color="textSecondary">
                DUE
              </Typography>
            </Grid>

            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {this.displayDeadline()}
              </Typography>
              <Typography color="textSecondary">
                DEADLINE
              </Typography>
            </Grid>

            {status !== '0' &&
              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Divider variant="middle" style={{ margin: '20px 0px' }}/>
              </Grid>
            }

            {status !== '0' &&
              this.displayProgress()
            }

          </Grid>
        </DialogContent>
        <DialogActions>
          {status === '0' &&
            <TransactionButton
              readyText='Fund this loan'
              method={() => this.props.contract.methods.lend(loanId)}
            />
          }
          <Button variant="outlined" onClick={this.props.handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DisplayLoan;
