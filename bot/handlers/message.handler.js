'use strict';

let GameState = require('../enums/GameState');

exports.parseCurrentGameState = (state) => {

    switch(state) {
        case GameState.ACTIVE: return 'Game is active.';
        case GameState.CANCELLED: return 'Game is cancelled.';
        case GameState.FINISHED: return 'Game is finished.';
        case GameState.INIT: return 'Game waits for players to join.';
        case GameState.VOTE_ROUND: return 'Game is in the middle of a voting round.';
        default: return 'Unknown game state.';
    }

};