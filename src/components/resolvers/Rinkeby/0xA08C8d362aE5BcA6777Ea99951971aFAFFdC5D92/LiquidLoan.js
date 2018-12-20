import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
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

  const [loansCount, setLoansCount] = useState('');

  const [currentDebt, setCurrentDebt] = useState('');
  const [lent, setLent] = useState('');
  const [borrowed, setBorrowed] = useState('');
  const [reimbursed, setReimbursed] = useState('');

  const [newAmount, setNewAmount] = useState('');
  const [newRate, setNewRate] = useState('');

  const [isRequestLoanOpen, setRequestLoanOpen] = useState(false);

  const clientRaindropContract = useNamedContract('clientRaindrop');
  const liquidLoanContract = useGenericContract('0xA08C8d362aE5BcA6777Ea99951971aFAFFdC5D92', ABI);

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

  return (
    <div>
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
              {`${currentDebt}`}
            </Typography>
            <Typography color="textSecondary">
              Current debt
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {`${lent}`}
            </Typography>
            <Typography color="textSecondary">
              Lent amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {`${borrowed}`}
            </Typography>
            <Typography color="textSecondary">
              Borrowed amount
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper style={{ padding: 10, textAlign: 'center' }}>
            <Typography color="primary" variant="h4">
              {`${reimbursed}`}
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
