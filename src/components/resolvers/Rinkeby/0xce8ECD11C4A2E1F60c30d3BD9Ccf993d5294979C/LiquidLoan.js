import React, { useState } from 'react';
import Web3 from 'web3';
import {
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Tabs,
  Tab,
  AppBar,
} from '@material-ui/core';
import { useAccountEffect, useWeb3Context } from 'web3-react/hooks';

import { useGenericContract, useNamedContract } from '../../../../common/hooks'

import { ABI } from './index';

import LoanCard from './loanCard';
import RequestLoan from './requestLoan';

export default function LiquidLoad ({ ein }) {
  const context = useWeb3Context();

  const [tabValue, setTabValue] = useState(0);

  const [username, setUsername] = useState('');

  const [loansCount, setLoansCount] = useState('');

  const [currentDebt, setCurrentDebt] = useState('');
  const [lent, setLent] = useState('');
  const [borrowed, setBorrowed] = useState('');
  const [reimbursed, setReimbursed] = useState('');

  const [lentLoans, setLentLoans] = useState('');
  const [borrowedLoans, setBorrowedLoans] = useState('');

  const [isRequestLoanOpen, setRequestLoanOpen] = useState(false);

  const clientRaindropContract = useNamedContract('clientRaindrop');
  const liquidLoanContract = useGenericContract('0xce8ECD11C4A2E1F60c30d3BD9Ccf993d5294979C', ABI);

  useAccountEffect(() => {
    liquidLoanContract.methods.getUserinfo(ein).call()
      .then((infos) => {
        setCurrentDebt(infos[0]);
        setLent(infos[1]);
        setBorrowed(infos[2]);
        setReimbursed(infos[3]);
      })
      .catch((err) => {
        console.log(err);
      });

    liquidLoanContract.methods.getLoansCount().call()
      .then((count) => {
        setLoansCount(count);
      })
      .catch((err) => {
        console.log(err);
      });

    liquidLoanContract.methods.getUserLentLoans(ein).call()
      .then((lentLoans) => {
        setLentLoans(lentLoans);
        console.log('Lent loans:', lentLoans);
      })
      .catch((err) => {
        console.log(err);
      });

    liquidLoanContract.methods.getUserBorrowedLoans(ein).call()
      .then((borrowedLoans) => {
        setBorrowedLoans(borrowedLoans);
        console.log('Borrowed loans:', borrowedLoans);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  function updateTabValue(e, newValue) {
    setTabValue(newValue);
  }

  function displayLoanCards() {
    const loans = [];

    for (let i = 0; i < loansCount; i += 1) {
      loans.push(
        <LoanCard
          key={i}
          contract={liquidLoanContract}
          loanId={i}
        />
      );
    }

    return loans;
  }

  function displayLentLoans() {
    const loans = [];

    for (let i = 0; i < lentLoans.length; i += 1) {
      loans.push(
        <LoanCard
          key={i}
          contract={liquidLoanContract}
          loanId={lentLoans[i]}
        />
      );
    }

    return loans;
  }

  function displayBorrowedLoans() {
    const loans = [];

    for (let i = 0; i < borrowedLoans.length; i += 1) {
      loans.push(
        <LoanCard
          key={i}
          contract={liquidLoanContract}
          loanId={borrowedLoans[i]}
        />
      );
    }

    return loans;
  }

  function handleNewLoanClick() {
    setRequestLoanOpen(true);
  }

  function closeRequestLoan() {
    setRequestLoanOpen(false);
  }

  return (
    <div>
      <Typography color="primary" variant="h5" style={{ marginBottom: 20 }}>
        Your profile
      </Typography>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={16}
        style={{ marginBottom: 20 }}
      >
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {Web3.utils.fromWei(currentDebt.toString())}
            </Typography>
            <Typography color="textSecondary">
              Current debt
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {Web3.utils.fromWei(lent.toString())}
            </Typography>
            <Typography color="textSecondary">
              Lent amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {Web3.utils.fromWei(borrowed.toString())}
            </Typography>
            <Typography color="textSecondary">
              Borrowed amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {Web3.utils.fromWei(reimbursed.toString())}
            </Typography>
            <Typography color="textSecondary">
              Reimbursed amount
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Divider variant="middle" style={{ marginBottom: 20 }} />
      <AppBar position="static" style={{ marginBottom: 20 }} >
        <Tabs value={tabValue} onChange={updateTabValue}>
          <Tab label="All loans" />
          <Tab label="Lent" />
          <Tab label="Borrowed" />
        </Tabs>
      </AppBar>
      {tabValue === 0 &&
        <div>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginBottom: 20 }}
          >
            <Grid item xs={6}>
              <Typography color="primary" variant="h5">
                {`${loansCount} loans found`}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right'}}>
              <Button variant="contained" color="primary" onClick={ handleNewLoanClick }>
                Request new loan
              </Button>
              <RequestLoan
                contract={liquidLoanContract}
                isOpen={isRequestLoanOpen}
                handleClose={closeRequestLoan}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {displayLoanCards()}
            </Grid>
          </Grid>
        </div>
      }
      {tabValue === 1 &&
        <div>
          <Typography color="primary" variant="h5" style={{ marginBottom: 20 }}>
            {`${lentLoans.length} loans found`}
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              {displayLentLoans()}
            </Grid>
          </Grid>
        </div>
      }
      {tabValue === 2 &&
        <div>
          <Typography color="primary" variant="h5" style={{ marginBottom: 20 }}>
            {`${borrowedLoans.length} loans found`}
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              {displayBorrowedLoans()}
            </Grid>
          </Grid>
        </div>
      }
    </div>
  );
}
