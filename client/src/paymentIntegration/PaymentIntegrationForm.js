import React, { useState, useEffect } from 'react';
import PaymentForm from '../PaymentForm'
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles } from '@material-ui/core/styles';

const PaymentIntegrationForm = () => {
    const classes = useStyles();
    const stripe = useStripe();
    const elements = useElements();

    const [customerDetail, setcustomerDetail] = useState('')

    const email = 'zaptaa99@gmail.com';

    useEffect(() => {
        async function fetchData() {
            const fetchRes = await axios.get(`http://localhost:5000/fetchcustomer/${email}`);
            setcustomerDetail(fetchRes.data.detail)
        }
        fetchData()
    }, [])

    const handleCustomerList = async () => {
        const res = await axios.post('http://localhost:5000/customerList', { 'customerid': customerDetail.id });
        console.log(res, 'this is customer list')

    }

    const handleCustomerUpdateCard = () => {
        // const updateCard = axios.post(`http://localhost:5000/updatecard/customers/:${customerDetail.id}/sources/:${customerDetail.invoice_settings.default_payment_method}` , {'email' : email});
        const updateCard = axios.post('http://localhost:5000/updatecard' , {'email' : email ,'customerId' : customerDetail.id , 'customersourese' : customerDetail.invoice_settings.default_payment_method });
        console.log('update card' , updateCard)
    }

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
            const res = await axios.post('http://localhost:5000/savepayment', { 'payment_method': results.paymentMethod.id, 'email': email });


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

            {!customerDetail ? (
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
            ) : (
                    <div className="custemer-detail" >
                        <h1>Customer Detail</h1>
                        <p>Customer ID = {customerDetail.id}</p>
                        <p>Customer Email = {customerDetail.email}</p>
                        <p>Payment Method = {customerDetail.invoice_settings.default_payment_method}</p>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={handleCustomerList} >
                            Pay
                        </Button>
                        <Button variant="contained" color="primary" className={classes.button} onClick={handleCustomerUpdateCard} >
                            Update
                        </Button>
                    </div>
                )}

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



export default PaymentIntegrationForm
