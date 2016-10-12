'use strict';

let Response = require('../models/response.model');
let logger = require('../libs/logger.lib');
let inputHandler = require('../handlers/input.handler');
let Promise = require('bluebird');

class Route {

    constructor(opts) {
        this._client = opts.client;
        this.res = new Response(opts);
        this.req = null;
    }

    getBotName() {
        return this._client.getName();
    }

    on(eventName, cb) {
        this._client.on(eventName, cb);
    }

    onNewChatParticipant(cb) {
        this._client.onNewChatParticipant(cb);
    }

    onLeftChatParticipant(cb) {
        this._client.onLeftChatParticipant(cb);
    }

    onText(regex, cb) {
        this._client.onText(regex, cb);
    }

    parseCommand(cmd, opts) {
        return inputHandler.parseCommand(cmd, opts)
            .then(req => {
                this.req = req;
                return null;
            });
    }

    catch(req) {
        return Promise.resolve()
            .catch(err => {
                logger.error({err, req}, 'An unhandled exception occurred while executing a command.');
                if (req) {
                    let recipientId = req.chatId || req.from.id;
                    if (recipientId) {
                        return this._client.sendMessage('Whoops... Something went wrong. Please tell @ilai... He might be able to fix me ^^.');
                    } else {
                        logger.error('Could not deliver exception message to recipient.')
                    }

                }
            });
    }

}

module.exports = Route;