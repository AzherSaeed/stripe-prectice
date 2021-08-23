import StripeCheckout from 'react-stripe-checkout';
import React , {useState} from 'react';


const CreatePaymentForm = () => {

    const [product, setproduct] = useState({
        name : 'mobile',
        price : 10
    })


    const makepayment = (token) => {
        console.log('token,' , token)
        const body = {
            token ,
            product
        }

        const headers = {
            'Content_Type' : 'application/json'
        };


        return fetch('http://localhost:5000/createpayment' , {
            method : 'POST',
            headers,
            body : JSON.stringify(body)
        }).then((res) => {
            const {status} = res
            console.log(status)
        })
        .catch((err) => console.log(err))
    }
    return (
        <div>
            
            <StripeCheckout
                stripeKey='pk_test_51JMvNpAIsBBwEZbsJuMCirc88j6z96mKj9ycl497ozu9ljMEIHFWBc7cIVVqKHdY34B8q3u4mn0jeXqM1rvP3szs00PzPtx0ZX'
                token={makepayment}
                amount={product.price * 100}

            >
                <button>Buy</button>
            </StripeCheckout>
        </div>
    )
}

export default CreatePaymentForm
