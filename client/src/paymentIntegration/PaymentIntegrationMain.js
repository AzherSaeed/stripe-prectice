import '../App.css';
import PaymentIntegrationForm from './PaymentIntegrationForm'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js'

const public_key = 'pk_test_51JMvNpAIsBBwEZbsJuMCirc88j6z96mKj9ycl497ozu9ljMEIHFWBc7cIVVqKHdY34B8q3u4mn0jeXqM1rvP3szs00PzPtx0ZX';
const stripeTestPromise = loadStripe(public_key);



function App() {
  return (
    <div className="App">
      <h1>Stripe Integration</h1>
      <Elements stripe={stripeTestPromise} >
        <PaymentIntegrationForm />
      </Elements>
    </div>
  );
}

export default App;
