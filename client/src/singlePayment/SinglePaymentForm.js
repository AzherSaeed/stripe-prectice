import PaymentForm from '../PaymentForm'
import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles } from '@material-ui/core/styles';

const SinglePaymentForm = () => {
    const classes = useStyles();
    const stripe = useStripe();
    const elements = useElements();

    const email = 'zapta99@gmail.com'


    const handlePayment = async () => {
        if (!stripe || !elements) { return }

        const results = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
                email: email,
            },
        });

        if (results.error) {
            console.log(results.error.message);
        } else {


            // const res = await axios.post('http://localhost:5000/singlepayment', { 'customerId' : 'cus_K52KXiEbyfhfLRNBWU' });
            const res = await axios.post('http://localhost:5000/singlepayment', {'payment_method': results.paymentMethod.id, 'email': email });


            const clientSecret = res.data['client_secret'];

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email: email,
                    },
                },
            });

            if (result.error) {
                console.log(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Money is in the bank ok!', result.paymentIntent);
                }
            }
        }

    }
    return (
        <div>
            <h1>Single Payment Method</h1>

            <Card className={classes.root}>
                <CardContent className={classes.content}>
                    <PaymentForm />
                    <div className={classes.div}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={handlePayment} >
                            Pay
                        </Button>
                        {/* <Button variant="contained" color="primary" className={classes.button}  >
                            Subscription
	                    </Button> */}
                    </div>
                </CardContent>
            </Card>



        </div>
    )
}

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
        margin: '35vh auto',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
    },
    div: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
    },
    button: {
        margin: '2em auto 1em',
    },
});




export default SinglePaymentForm










