import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Tabs,
  Tab,
  AppBar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useAccountEffect, useWeb3Context } from 'web3-react/hooks';

import { useGenericContract, useNamedContract } from '../../../../common/hooks'
import TransactionButton from '../../../common/TransactionButton'

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

  const [newAmount, setNewAmount] = useState('');
  const [newRate, setNewRate] = useState('');

  const [isRequestLoanOpen, setRequestLoanOpen] = useState(false);

  const clientRaindropContract = useNamedContract('clientRaindrop');
  const liquidLoanContract = useGenericContract('0xc9A8204d6d07FD929D288050506A2F9A3911C532', ABI);

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

  function handleNewLoanClick() {
    setRequestLoanOpen(true);
  }

  function closeRequestLoan() {
    setRequestLoanOpen(false);
  }

  return (
    <div>
      <AppBar position="static">
        <Tabs value={tabValue} onChange={updateTabValue}>
          <Tab label="Item one" />
          <Tab label="Item two" />
          <Tab label="Item three" />
        </Tabs>
      </AppBar>
      {tabValue === 0 && <Typography component="div" style={{ padding: 8 * 3 }}>Item one</Typography>}
      {tabValue === 1 && <Paper>Item two</Paper>}
      {tabValue === 2 && <Paper>Item three</Paper>}
      <Typography color="primary" variant="h2" style={{ marginBottom: 20 }}>
        Welcome to LiquidLoan!
      </Typography>
      <Typography color="primary" variant="h3" style={{ marginBottom: 20 }}>
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
              {parseInt(currentDebt, 10).toLocaleString(undefined)}
            </Typography>
            <Typography color="textSecondary">
              Current debt
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {parseInt(lent, 10).toLocaleString(undefined)}
            </Typography>
            <Typography color="textSecondary">
              Lent amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {parseInt(borrowed, 10).toLocaleString(undefined)}
            </Typography>
            <Typography color="textSecondary">
              Borrowed amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {parseInt(reimbursed, 10).toLocaleString(undefined)}
            </Typography>
            <Typography color="textSecondary">
              Reimbursed amount
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Divider variant="middle"  style={{ marginBottom: 20 }} />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ marginBottom: 20 }}
      >
        <Grid item xs={6}>
          <Typography color="primary" variant="h3">
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
  );
}
