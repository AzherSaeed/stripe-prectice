const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('sk_test_51JMvNpAIsBBwEZbso1kOvCD7Hafw6KMZqldrYfVrKUY7pIBrfn1qyzTmWx7z0vn2qJMMxhMYoavxpBd9hyrq4DVt00q6d7tmuk');

const port = 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

app.post('/pay', async (req, res) => {
    const { email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' },
        receipt_email: email,
    });

    res.json({ 'client_secret': paymentIntent['client_secret'] })
})


app.post('/sub' , async (req, res) => {
    const {email , payment_method} = req.body

    const customer = await stripe.customers.create({
        payment_method : payment_method,
        email : email,
        invoice_setting: {
            default_payment_method : payment_method
        },
    });

    const subcriptions = await stripe.subcriptions.create({
        customer : customer.id,
        item : [{plan : 'price_1JPnxPAIsBBwEZbsQVzVOqKi'}],
        expand : ['latest_invoice.payment_intent']
    })

    const status = subcriptions['latest_invoice']['payment_intent']['status']
    const client_secret = subcriptions['latest_invoice']['payment_intent']['client_secret']

    res.json({'client_secret' : client_secret , 'status' : status })
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))