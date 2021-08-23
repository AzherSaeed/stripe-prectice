import React from 'react';
import App from './App';
import SinglePaymentMain from './singlePayment/SinglePaymentMain';
import PaymentIntegrationMain from './paymentIntegration/PaymentIntegrationMain';
import CreatePaymentMain from './createPayment/CreatePaymentMain';

const Combine = () => {
    return (
        <div>
            {/* <App/> */}
            {/* <SinglePaymentMain/> */}
            {/* <PaymentIntegrationMain/> */}
            <CreatePaymentMain/>
        </div>
    )
}

export default Combine
