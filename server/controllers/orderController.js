import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe";
import User from "../models/User.js";

//Place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if(!address|| items.length === 0 ) {
            return res.json({ success: false, message: 'Address is required' });
        }
        //Calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + (product.price * item.quantity);

        },0); 
        //Add charge(2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
        });
        res.json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Place order stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;
        if(!address|| items.length === 0 ) {
            return res.json({ success: false, message: 'Address is required' });
        }

        let productData = [];
        //Calculate amount using items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + (product.price * item.quantity);
        },0); 
        //Add charge(2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "Online",
        });

        //Stripe gateway Initialize
        const stripe = new stripe(process.env.STRIPE_SECRET_KEY);

        //create lineItems for stripe
        const lineItems = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price*0.02) * 100
                },
                quantity: item.quantity,
            };
        });

        //create session
        const session = await stripeInstance.checkout.sessions.create({
            lineItems,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`, 
            metadata:{
                orderId : order._id.toString(),
                userId,

            }
        }); 
        res.json({ success: true, url: session.url });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//Stripe webhooks to verify payments Action : /stripe

export const stripeWebhooks = async (request, response) => {
    //stripe gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the event
    switch(event.type){
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                paymentIntent : paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;
            
            //Mark payment as paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true});

            //Clear cart items
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
        }

        case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                paymentIntent : paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;

            await Order.findByIdAndDelete(orderId);
            break;
        }

        default:
            console.error(`Unhandled event type ${event.type}`);
            break;
    }response.json({received: true});
}

// Get Orders by UserId : /api/order/get
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ 
            userId,
            $or : [{paymentType:'COD'}, {isPaid:true}]
         }).populate('items.product address').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    }catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get All Orders (for seller/admin ): /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            $or : [{paymentType:'COD'}, {isPaid:true}]
         }).populate('items.product address');
        res.json({ success: true, orders });
    }catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

