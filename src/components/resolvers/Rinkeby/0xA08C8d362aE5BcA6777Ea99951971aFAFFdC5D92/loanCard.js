import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Chip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';


class LoanCard extends Component {
  constructor(props) {
    super(props);

    const { loanId } = this.props;

    this.state = {
      loanId,
      borrower: 0,
      amount: 0,
      rate: 0,
      status: 0,
    };
  }

  componentDidMount = () => {
    const {
      loanId,
    } = this.state;

    this.props.contract.methods.getLoanInfo(loanId).call()
      .then((info) => {
        console.log(info);

        this.setState({
          borrower: info[4],
          amount: info[0],
          rate: info[2],
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

  render = () => {
    const {
      borrower,
      amount,
      rate,
      status,
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
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Chip
                color={status === 0 ? "default" : "primary"}
                label={status === 0 ? "Funded" : "Open"}
              />
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {borrower}
              </Typography>
              <Typography color="textSecondary">
                BORROWER
              </Typography>
            </Grid>
            <Grid item xs={3} style={{ textAlign: 'center' }}>
              <Typography color="primary" variant="h4">
                {amount}
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
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default LoanCard;
