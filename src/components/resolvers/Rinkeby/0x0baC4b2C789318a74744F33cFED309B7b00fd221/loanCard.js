import React, { Component } from 'react';
import Web3 from 'web3';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Chip,
} from '@material-ui/core';

import DisplayLoan from './displayLoan';

class LoanCard extends Component {
  constructor(props) {
    super(props);

    const { loanId } = this.props;

    this.state = {
      isDisplayLoanOpen: false,
      loanId,
      borrower: 0,
      amount: 0,
      rate: 0,
      status: 0,
      currentDebt: 0,
    };
  }

  componentDidMount = () => {
    const {
      loanId,
    } = this.state;

    this.props.contract.methods.getLoanInfo(loanId).call()
      .then((info) => {
        this.setState({
          borrower: info[4],
          amount: info[0],
          rate: info[2],
          currentDebt: info[1],
        });

        return this.props.contract.methods.getLoanStatus(loanId).call();
      })
      .then((status) => {
        this.setState({
          status,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDisplayLoanClick = () => {
    this.setState({
      isDisplayLoanOpen: true,
    });
  }

  closeDisplayLoan = () => {
    this.setState({
      isDisplayLoanOpen: false,
    });
  }

  render = () => {
    const {
      loanId,
      isDisplayLoanOpen,
      borrower,
      amount,
      rate,
      status,
      currentDebt,
    } = this.state;

    return (
      <Card style={{ marginBottom: 10 }}>
        <CardContent>
          <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
          >
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Chip
                color={status === '0' ?  "primary" : "default"}
                label={status === '0' ? "Open" : "Funded"}
              />
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {borrower}
              </Typography>
              <Typography color="textSecondary">
                BORROWER
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(amount.toString())}
              </Typography>
              <Typography color="textSecondary">
                AMOUNT
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {`${rate}%`}
              </Typography>
              <Typography color="textSecondary">
                RATE
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {Web3.utils.fromWei(currentDebt.toString())}
              </Typography>
              <Typography color="textSecondary">
                DUE
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={this.handleDisplayLoanClick}>
                More
              </Button>
              <DisplayLoan
                loanId={loanId}
                contract={this.props.contract}
                isOpen={isDisplayLoanOpen}
                handleClose={this.closeDisplayLoan}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default LoanCard;
