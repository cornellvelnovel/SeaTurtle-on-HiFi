"use strict";

var DEFAULT_GAME_SCRIPTS = [
  "TP/avatarInit.js",
  "MovementTracker.js"
];

function loadGameSettings() {
    for (var i in DEFAULT_GAME_SCRIPTS) {
        Script.load(DEFAULT_GAME_SCRIPTS[i]);
    }
}

loadGameSettings();
