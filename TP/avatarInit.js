var AVATAR_START_POSITION = {"x": -5 + Math.floor((Math.random() * 5)), "y": 2, "z": 3};
var AVATAR_START_YAW = 0;

MyAvatar.goToLocation(AVATAR_START_POSITION, true, Quat.fromPitchYawRollDegrees(0,AVATAR_START_YAW,0));
