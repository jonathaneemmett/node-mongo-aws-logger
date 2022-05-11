'use strict';
console.log('Loading Chat Log Handler...');
const mongoose = require('mongoose');

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

    /**
     * @desc Handles from fetch or from postman
     */
    if(isJSON(event)){
        body = JSON.parse(event);
    } else {
        body = event
    }


    const {id, type, message} = body;

    try {
        if(!id || !type || !message){
            responseCode = 400;
            throw new Error('All fields are required, please try again.')
        }


        const log = await LogEvent.findById(id);
        let ts = Date.now();
        let time = new Date(ts).toISOString();

        console.log(time);
        log.events.push({time, type, message});
        const newLog = await log.save();
        console.log(newLog);

        if(log !== null){
            responseCode = 200;

            responseBody = {
                ok: Boolean(true),
                log: newLog._id
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
            console.log("Response: ", response);
            return response;
        } else {
            responseCode = 401;
            throw new Error(`That chat log: ${id} does not exist`)
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