const express = require('express');
const common = require('../../lib/common');
const {
    indexOrders
} = require('../../lib/indexing');
const paypal = require('paypal-rest-sdk');
const router = express.Router();


const axios = require('axios')

router.get('/checkout_cancel', (req, res, next) => {
    // return to checkout for adjustment or repayment
    res.redirect('/checkout');
});

router.get('/checkout_return', (req, res, next) => {
    const db = req.app.db;
    const config = req.app.config;
    const paymentId = req.session.paymentId;
    const payerId = req.query.PayerID;

    const details = {
        payer_id: payerId
    };
    paypal.payment.execute(paymentId, details, (error, payment) => {
        let paymentApproved = false;
        let paymentMessage = '';
        let paymentDetails = '';
        if (error) {
            paymentApproved = false;

            if (error.response.name === 'PAYMENT_ALREADY_DONE') {
                paymentApproved = false;
                paymentMessage = error.response.message;
            } else {
                paymentApproved = false;
                paymentDetails = error.response.error_description;
            }

            // set the error
            req.session.messageType = 'danger';
            req.session.message = error.response.error_description;
            req.session.paymentApproved = paymentApproved;
            req.session.paymentDetails = paymentDetails;

            res.redirect('/payment/' + req.session.orderId);
            return;
        }

        const paymentOrderId = req.session.orderId;
        let paymentStatus = 'Approved';

        // fully approved
        if (payment.state === 'approved') {
            paymentApproved = true;
            paymentStatus = 'Paid';
            paymentMessage = 'Your payment was successfully completed';
            paymentDetails = '<p><strong>Order ID: </strong>' + paymentOrderId + '</p><p><strong>Transaction ID: </strong>' + payment.id + '</p>';

            // clear the cart
            if (req.session.cart) {
                common.emptyCart(req, res, 'function');
            }
        }

        // failed
        if (payment.failureReason) {
            paymentApproved = false;
            paymentMessage = 'Your payment failed - ' + payment.failureReason;
            paymentStatus = 'Declined';
        }

        // update the order status
        db.orders.updateOne({
            _id: common.getId(paymentOrderId)
        }, {
            $set: {
                orderStatus: paymentStatus
            }
        }, {
            multi: false
        }, (err, numReplaced) => {
            if (err) {
                console.info(err.stack);
            }
            db.orders.findOne({
                _id: common.getId(paymentOrderId)
            }, (err, order) => {
                if (err) {
                    console.info(err.stack);
                }

                // add to lunr index
                indexOrders(req.app)
                    .then(() => {
                        // set the results
                        req.session.messageType = 'success';
                        req.session.message = paymentMessage;
                        req.session.paymentEmailAddr = order.orderEmail;
                        req.session.paymentApproved = paymentApproved;
                        req.session.paymentDetails = paymentDetails;

                        const paymentResults = {
                            message: req.session.message,
                            messageType: req.session.messageType,
                            paymentEmailAddr: req.session.paymentEmailAddr,
                            paymentApproved: req.session.paymentApproved,
                            paymentDetails: req.session.paymentDetails
                        };

                        // send the email with the response
                        // TODO: Should fix this to properly handle result
                        common.sendEmail(req.session.paymentEmailAddr, 'Your payment with ' + config.cartTitle, common.getEmailTemplate(paymentResults));

                        res.redirect('/payment/' + order._id);
                    });
            });
        });
    });
});

// The homepage of the site
router.post('/checkout_action', (req, res, next) => {

    // INvoking the Experience APIs:
    applyExperienceAPIs(req.session.customerFirstname, req.session.customerLastname, req.session.customerEmail, req.session.customerPhone);


    // Skip real payment... Clear the cart and return success...   
    if (req.session.cart) {
        common.emptyCart(req, res, 'function');
        req.session.message = 'Thanks for your purchase!';
        req.session.messageType = 'success';
        res.redirect('/');
        return;
    }


    const db = req.app.db;
    const config = req.app.config;
    const paypalConfig = common.getPaymentConfig();

    // setup the payment object
    const payment = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: config.baseUrl + '/paypal/checkout_return',
            cancel_url: config.baseUrl + '/paypal/checkout_cancel'
        },
        transactions: [{
            amount: {
                total: req.session.totalCartAmount,
                currency: paypalConfig.paypalCurrency
            },
            description: paypalConfig.paypalCartDescription
        }]
    };

    // set the config
    paypal.configure(paypalConfig);

    // create payment
    paypal.payment.create(payment, (error, payment) => {
        if (error) {
            req.session.message = 'There was an error processing your payment. You have not been changed and can try again.';
            req.session.messageType = 'danger';
            res.redirect('/checkout/payment');
            return;
        }
        if (payment.payer.payment_method === 'paypal') {
            req.session.paymentId = payment.id;
            let redirectUrl;
            for (let i = 0; i < payment.links.length; i++) {
                const link = payment.links[i];
                if (link.method === 'REDIRECT') {
                    redirectUrl = link.href;
                }
            }

            // if there is no items in the cart then render a failure
            if (!req.session.cart) {
                req.session.message = 'The are no items in your cart. Please add some items before checking out';
                req.session.messageType = 'danger';
                res.redirect('/');
                return;
            }

            // new order doc
            const orderDoc = {
                orderPaymentId: payment.id,
                orderPaymentGateway: 'Paypal',
                orderTotal: req.session.totalCartAmount,
                orderShipping: req.session.totalCartShipping,
                orderItemCount: req.session.totalCartItems,
                orderProductCount: req.session.totalCartProducts,
                orderEmail: req.session.customerEmail,
                orderFirstname: req.session.customerFirstname,
                orderLastname: req.session.customerLastname,
                orderAddr1: req.session.customerAddress1,
                orderAddr2: req.session.customerAddress2,
                orderCountry: req.session.customerCountry,
                orderState: req.session.customerState,
                orderPostcode: req.session.customerPostcode,
                orderPhoneNumber: req.session.customerPhone,
                orderComment: req.session.orderComment,
                orderStatus: payment.state,
                orderDate: new Date(),
                orderProducts: req.session.cart,
                orderType: 'Single'
            };

            if (req.session.orderId) {
                // we have an order ID (probably from a failed/cancelled payment previosuly) so lets use that.

                // send the order to Paypal
                res.redirect(redirectUrl);
            } else {
                // no order ID so we create a new one
                db.orders.insertOne(orderDoc, (err, newDoc) => {
                    if (err) {
                        console.info(err.stack);
                    }

                    // get the new ID
                    const newId = newDoc.insertedId;

                    // set the order ID in the session
                    req.session.orderId = newId;

                    // send the order to Paypal
                    res.redirect(redirectUrl);
                });
            }
        }
    });
});

function applyExperienceAPIs(firstName, lastName, email, mobile) {

    console.log("Applying Experience APIs at the server side after payment event...");

    const SERVER_URL = "http://100yearsofloyaltyapi.us-e2.cloudhub.io";

    const ordMgmEndpoint = "/api/inventory";
    const leadGenEndpoint = "/api/leads";
    const brandDiffEndpoint = "/api/tweet";
    const custEngEndpoint = "/api/notifications/sms";

    const leadGenBody = {
        "FirstName": firstName,
        "LastName": lastName,
        "Email": email,
        "Mobile": mobile,
        "Company": "SuperPartners"
    };

    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    const brandDiffBody = {
        "title": "100 Years Anniversary Campaign",
        "message": "At MuleQuest, we are celebrating 100 years Anniversary and today at " + hours + ":" + minutes + ":" + seconds + ", we just gave T-Shirt number 1 MILLION!!!! And it goes with a car!!!! Congratulations " + firstName + ", thanks for your loyalty!"
    };

    const custEngBody = {
        "title": "Order has been processed",
        "mobile": mobile,
        "email": email,
        "message": "Hi " + firstName + ", your order 100TSHIRTANNIV1000000 has been successful submitted. We will keep you informed until the delivery of your parcel. Thanks for your loyalty!"
    };


    // Invoking Order Management:
    fullURL = SERVER_URL + ordMgmEndpoint;
    //console.log("Invoking Order Management URL [" + fullURL + "], payload is [" + JSON.stringify(leadGenBody) + "]");

    // Invoking Lead Generation:
    fullURL = SERVER_URL + leadGenEndpoint;
    console.log("Invoking Lead Generation URL [" + fullURL + "], payload is [" + JSON.stringify(leadGenBody) + "]");
    postAPI(fullURL, leadGenBody);

    // Invoking Brand Differentiation:
    fullURL = SERVER_URL + brandDiffEndpoint;
    console.log("Invoking Brand Differentiation URL [" + fullURL + "], payload is [" + JSON.stringify(brandDiffBody) + "]");
    postAPI(fullURL, brandDiffBody);

    // Invoking Customer Engagement:
    fullURL = SERVER_URL + custEngEndpoint;
    console.log("Invoking Customer Engagement URL [" + fullURL + "], payload is [" + JSON.stringify(custEngBody) + "]");
    postAPI(fullURL, custEngBody);


}

function postAPI(url, body) {

    axios.post(url, body)
        .then((res) => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
        })
        .catch((error) => {
            console.error(error)
        })
}


module.exports = router;