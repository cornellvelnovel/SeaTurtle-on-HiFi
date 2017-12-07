var TURTLE_ID = "{6595a81e-a43a-4480-a31a-1d560533173e}";
var AVATAR_START_POSITION = {"x": -5 + Math.floor((Math.random() * 5)), "y": 2, "z": 3};
var AVATAR_START_YAW = 0;

var position;

function updateCamera() {
    position = Entities.getEntityProperties(TURTLE_ID).position;
    MyAvatar.setEnableMeshVisible(false);
    Camera.setOrientation(MyAvatar.headOrientation);
    Camera.setPosition(position);
}

Camera.setModeString("independent");
MyAvatar.goToLocation(AVATAR_START_POSITION, true, Quat.fromPitchYawRollDegrees(0,AVATAR_START_YAW,0));
Script.update.connect(updateCamera);
