'use strict';
console.log('Loading Chat Log Handler...');

const {dbConnect} = require('./config/db');

// Init DB
dbConnect().catch((err) => console.log(err));

// Error Init
const LogError = require('./model/Error');

exports.handler = async (event) => {
    let response;
    let responseCode;
    let responseBody;

    let body = JSON.parse(event.body);

    try {
        if(!body.type || !body.message){
            responseCode = 400;
            throw new Error('All fields are required, please try again.')
        }

        let error = await LogError.create(body);

        if(error){
            responseCode = 200;

            responseBody = {
                ok: Boolean(true),
                message: body.message,
                type: body.type
            };

            response = {
                statusCode: responseCode,
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(error)
            };

            return response;
        } else {
            responseCode = 400;
            throw new Error('There was a problem inserting the data into the log.')
        }
    } catch (err) {

        responseBody = {
            ok: Boolean(false),
            message: err.message,
            type: ""
        };

        response = {
            statusCode: responseCode,
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(responseBody)
        };

        return response;
    }


};