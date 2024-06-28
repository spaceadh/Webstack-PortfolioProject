import request from "request";
import 'dotenv/config'

export const obtainMpesaAccessToken = (req, res, next) => {
    try {
        const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
        const auth = new Buffer.from(`${process.env.MPESA_API_KEY}:${process.env.MPESA_API_SECRET}`).toString('base64');

        request(
            {
                url: url,
                headers: {
                    "Authorization": "Basic " + auth
                }
            },
            (error, response, body) => {
                if (error) {
                    console.error("Request error: ", error);
                    handleError(res, error);
                } else {
                    if (response.statusCode === 200) {
                        req.safaricom_access_token = JSON.parse(body).access_token;
                        next();
                    } else {
                        console.error("API response error: ", response.statusCode, body);
                        handleError(res, JSON.parse(body));
                    }
                }
            }
        );
    } catch (error) {
        console.error("Access token error: ", error);
        handleError(res, error);
    }
}

function handleError(res, error) {
    if (res) {
        res.status(401).send({
            "message": 'Something went wrong when trying to process your payment',
            "error": error.message
        });
    } else {
        console.error("Response object is undefined in handleError function");
    }
}
