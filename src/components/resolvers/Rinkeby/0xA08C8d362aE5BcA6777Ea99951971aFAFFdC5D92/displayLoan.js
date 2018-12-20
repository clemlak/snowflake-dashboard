import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';

const DisplayLoan = (props) => {
  const {
    amount,
    currentDebt,
    status,
    rate,
    deadline,
    borrower,
    lender,
  } = props;

  return (
    <Card>
      <CardContent>
        <h1>
          {borrower}
        </h1>
        <p>
          {amount}
        </p>
      </CardContent>
      <CardActions>
        <Button>
          Lend funds
        </Button>
      </CardActions>
    </Card>
  );
}

export default DisplayLoan;
