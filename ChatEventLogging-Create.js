'use strict';
console.log('Loading Chat Log Handler...');

// Only needed for local
require('dotenv').config();

const {dbConnect} = require('./config/db');

// Init DB
dbConnect().catch((err) => console.log(err));

// Error Init
const LogEvent = require('./model/ChatEventLog');

exports.handler = async (event) => {
    let response;
    let responseCode;
    let responseBody;
    let body;

    function isJSON(str){
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }

    if(isJSON(event.body)){
        body = JSON.parse(event.body);
    } else {
        body = event.body
    }


    try {

        const {leadID, department, type, message, capturedUrl} = body;
        console.log(leadID, type, message)
        if(!leadID || !type || !message){
            responseCode = 400;
            throw new Error('All fields are required, please try again.')
        }


        let log = await LogEvent.create({
            leadID: leadID,
            department: department,
            capturedUrl: capturedUrl
        });

        log.events.push({type, message})
        log.save();

        if(log){
            responseCode = 200;

            responseBody = {
                ok: Boolean(true),
                id: log._id,
                message: ''
            };

            response = {
                statusCode: responseCode,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                body: JSON.stringify(responseBody)
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
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            body: JSON.stringify(responseBody)
        };

        return response;
    }
};
