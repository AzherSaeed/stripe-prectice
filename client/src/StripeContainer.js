import React, { useState } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { makeStyles } from '@material-ui/core/styles';
import PaymentForm from './PaymentForm';



function HomePage() {
	const classes = useStyles();
	const [email, setEmail] = useState('');

	const stripe = useStripe();
	const elements = useElements();

	const handleSubmitpay = async (event) => {
		if (!stripe || !elements) {
			return;
		}

		const res = await axios.post('http://localhost:5000/pay', { email: email });

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
	};


	const handleSubmitSub = async (event) => {
		if (!stripe || !elements) {
			return;
		}

		const result = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardElement),
			billing_details: {
				email: email,
			},
		});

		if (result.error) {
			console.log(result.error.message);
		} else {
			const res = await axios.post('http://localhost:5000/sub', { 'payment_method': result.paymentMethod.id, 'email': email });
			const { client_secret, status } = res.data;

			if (status === 'requires_action') {
				stripe.confirmCardPayment(client_secret).then(function (result) {
					if (result.error) {
						console.log('There was an issue!');
						console.log(result.error);
					} else {
						console.log('You got the money one!', status);
					}
				});
			} else {
				console.log('You got the money two!' , res.data);
			}
		}

	}

	return (
		<Card className={classes.root}>
			<CardContent className={classes.content}>
				<TextField
					label='Email'
					id='outlined-email-input'
					helperText={`Email you'll recive updates and receipts on`}
					margin='normal'
					variant='outlined'
					type='email'
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
				/>
				<PaymentForm />
				<div className={classes.div}>
					<Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitpay}>
						Pay
	          </Button>
					<Button variant="contained" color="primary" className={classes.button} onClick={handleSubmitSub} >
						Subscription
	          </Button>
				</div>
			</CardContent>
		</Card>
	);
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


export default HomePage;