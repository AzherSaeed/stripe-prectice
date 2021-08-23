const express = require('express')
const app = express();
var fs = require("fs");
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('sk_test_51JMvNpAIsBBwEZbso1kOvCD7Hafw6KMZqldrYfVrKUY7pIBrfn1qyzTmWx7z0vn2qJMMxhMYoavxpBd9hyrq4DVt00q6d7tmuk');
const port = 5000

const savedata = fs.readFileSync('data.json')
const customer = JSON.parse(savedata)

// console.log(customer.email, 'this is created customer')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors())

var data = [];

fs.writeFile("temp.txt", data, (err) => {
  if (err) console.log(err);
});


app.get('/fetchcustomer/:email', (req, res) => {
  const getemail = req.params.email
  const checkcustomer = customer.email == getemail

  if (checkcustomer) {
    res.send({
      detail: customer,
      message: 'this email exists',
      status: checkcustomer
    })
  }
  else {
    res.send({
      email: getemail,
      message: 'this email does not exists',
      status: checkcustomer
    })
  }



})

app.post('/customerList', async (req, res) => {
  const { customerid } = req.body
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerid,
    type: 'card',
  });

  console.log(paymentMethods, 'paymentMethods')
  res.send("customer list find")

})


app.post('/savepayment', async (req, res) => {


  const { email, payment_method } = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const newcustomer = JSON.stringify(customer, null, 2)
  fs.writeFile('data.json', newcustomer, finished)

  function finished(err) {
    console.log('all set')
  }




  const paymentIntent = await stripe.paymentIntents.create({
    amount: 7000,
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
    receipt_email: email,
    setup_future_usage: 'off_session'
    // customer: customer.id,
    // off_session: true,
    // confirm: true,
    // payment_method: payment_method,
  });
  // console.log(paymentIntent, "PI")

  res.json({ 'client_secret': paymentIntent['client_secret'] })

})

app.post('/updatecard', async (req, res) => {
  const { email , customerId , customersourese } = req.body;

  console.log(email , customerId , customersourese)

  const card = await stripe.customers.updateSource(
    customerId,
    customersourese,
    {email: email}
  );
    console.log(card)

})

app.post('/singlepayment', async (req, res) => {

  // const {customerId} = req.body

  // const paymentMethods = await stripe.paymentMethods.list({
  //   customer: customerId,
  //   type: 'card',
  // });

  // console.log(paymentMethods , 'paymentMethods')
  // res.send("helo")
  const { email, payment_method } = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
    description: 'My First Test Customer (created for API docs)',
  });

  console.log(customer, 'this is customer')

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 7000,
    currency: 'usd',
    metadata: { integration_check: 'accept_a_payment' },
    receipt_email: email,
    setup_future_usage: 'off_session'
    // customer: customer.id,
    // off_session: true,
    // confirm: true,
    // payment_method: payment_method,
  });
  console.log(paymentIntent, "PI")

  res.json({ 'client_secret': paymentIntent['client_secret'] })

})

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

app.post('/sub', async (req, res) => {
  const { email, payment_method } = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });




  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1JPnxPAIsBBwEZbsQVzVOqKi' }],
    expand: ['latest_invoice.payment_intent']
  });

  const status = subscription['latest_invoice']['payment_intent']['status']
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  res.json({ 'client_secret': client_secret, 'status': status });
})


app.post('/webhook', express.json({ type: 'application/json' }), (request, response) => {
  const event = request.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('webhook successfully created')
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json('webhook successfully created');
});



app.post('/createpayment' , (req , body) => {
  const {product , token} = req.body
  const dsfds = req.body
  console.log(dsfds, 'this is token')
  // console.log(product, 'this is product')
  const idemontencyKey = 345;

  return stripe.customers.create({
    email : token.email,
    sourse  : token.id
  })
  .then((customer) => {
    stripe.charges.create({
      amount : product.price * 100,
      currency : 'usd',
      customer : customer.id,
      receipt_email : token.email,
      description : product.name,
      shipping : {
        name : token.card.name,
        address : {
          country : token.card.address_country
        }
      }
    } , {idemontencyKey})
  })
  .then((result) => res.status(200).json(result))
  .catch((err) => console.log(err))

})


app.listen(port, () => console.log(`App listening on port ${port}!`))