//all model urls
var FOOD_ENTITY_MODEL_URL = "https://s3-us-west-2.amazonaws.com/novelteam/jellyFish.FBX ";

//all script urls
var FOOD_ENTITY_SCRIPT_URL = "https://s3-us-west-2.amazonaws.com/novelteam/scripts/food.js";

//all params
var INDEX_OF_PLAYER_1 = 0;
var INDEX_OF_PLAYER_2 = 1;

var TURTLE_BODY_ID = "{6595a81e-a43a-4480-a31a-1d560533173e}";
var TURTLE_STARTING_POSITION = {"x": -5, "y": 2, "z": 3};
//ar TURTLE_ENDING_POSITION = {"x": -50, "y": 2, "z": 3};
var TURTLE_STARTING_YAW = 0;
var FOOD_AMOUNT = 6;
//var WATER_RESISTANCE = 0.15;

print("INITIALIZING...");

Entities.editEntity(TURTLE_BODY_ID, {visible: true, position: TURTLE_STARTING_POSITION, rotation: Quat.fromPitchYawRollDegrees(0,TURTLE_STARTING_YAW,0), density: 1000});

//get avatars
var activeAvatars = AvatarList.getAvatarIdentifiers();
// print(activeAvatars);

//define player
function createPlayer(avatarIndex) {
    var player = function() {
        this.avatar = AvatarList.getAvatar(activeAvatars[avatarIndex]);
        // print(this.avatar.sessionUUID);
    };
    player.prototype = {
        bodyRot: function() {
            return Quat.fromPitchYawRollDegrees(this.avatar.bodyPitch, this.avatar.bodyYaw+90, this.avatar.bodyRoll);
        },
        bodyYaw: function() {
            // return (this.avatar.bodyYaw+90)/180*Math.PI;
            return (this.avatar.bodyYaw)/180*Math.PI;
        },
        leftHandPos: function() {
            return Vec3.subtract(this.avatar.getJointPosition("LeftHand"), this.avatar.position);
        },
        rightHandPos: function() {
            return Vec3.subtract(this.avatar.getJointPosition("RightHand"), this.avatar.position);
        },
        getLeftMove: function() {
            return getYawOriented(this.bodyYaw(), this.leftHandPos());
        },
        getRightMove: function() {
            return getYawOriented(this.bodyYaw(), this.rightHandPos());
        }
    };
    return new player();
}

//construct players
var Player1 = createPlayer(INDEX_OF_PLAYER_1);
var Player2 = createPlayer(INDEX_OF_PLAYER_2);

// print(JSON.stringify(Player1));
// print(JSON.stringify(Player2));

print("PLAYERS READY");

//update the turtle's body movement
var bodyRot;
var leftPosLast1 = Player1.getLeftMove();
var rightPosLast1 = Player1.getRightMove();
var leftPosLast2 = Player2.getRightMove();
var rightPosLast2 = Player2.getRightMove();
var leftDeltaX, rightDeltaX, deltaX, leftDeltaY, rightDeltaY, deltaY;
var orientation, velocity;
function updateBody() {

    // bodyRot = Quat.fromPitchYawRollRadians(0, (Player1.bodyYaw() + Player2.bodyYaw())/2, 0);
    bodyRot = Quat.fromPitchYawRollRadians(0, (Player1.bodyYaw() + Player2.bodyYaw()), 0);
    Entities.editEntity(TURTLE_BODY_ID, { rotation: bodyRot});

    leftPos1 = Player1.getLeftMove();
    leftPos2 = Player2.getLeftMove();
    rightPos1 = Player1.getRightMove();
    rightPos2 = Player2.getRightMove();

    // leftDeltaX = (leftPos1.x - leftPosLast1.x) + (leftPos2.x - leftPosLast2.x);
    // rightDeltaX = (rightPos1.x - rightPosLast1.x) + (rightPos2.x - rightPosLast2.x);
    // deltaX = (leftDeltaX + rightDeltaX)/2 * 60;


    // leftDeltaY = (leftPos1.y - leftPosLast1.y) + (leftPos2.y - leftPosLast2.y);
    // rightDeltaY = (rightPos1.y - rightPosLast1.y) + (rightPos2.y - rightPosLast2.y);

    leftDeltaZ = (leftPos1.z - leftPosLast1.z) + (leftPos2.z - leftPosLast2.z);
    rightDeltaZ = (rightPos1.z - rightPosLast1.z) + (rightPos2.z - rightPosLast2.z);
    // if (leftDelatZ < 0  && rightDeltaZ > 0) {
    //  deltaY = (leftDeltaY + rightDeltaY) * 60;
    // }
    deltaZ =  (leftDeltaZ + rightDeltaZ)/2 * 60;


    orientation = Quat.safeEulerAngles(bodyRot).y/180*Math.PI;
    velocity = {
        x: deltaZ * Math.sin(orientation),
        y: 0,
        z: deltaZ * Math.cos(orientation)
    };

    if (deltaZ < 0) {
    // if (deltaX < 0) {
        Entities.editEntity(TURTLE_BODY_ID, {velocity: velocity});
        print("turtle body vel:"+JSON.stringify(velocity));
    }

    //store data from last frame
    leftPosLast1 = leftPos1;
    leftPosLast2 = leftPos2;
    rightPosLast1 = rightPos1;
    rightPosLast2 = rightPos2;
}

function getYawOriented(bodyYaw, coordinates) {
    return {
        x: coordinates.x*Math.cos(bodyYaw) - coordinates.z*Math.sin(bodyYaw),
        y: coordinates.y,
        z: coordinates.x*Math.sin(bodyYaw) + coordinates.z*Math.cos(bodyYaw)
    };
}

print("TURTLE BODY READY");


//Generate Foods
// Script.load("generateFoods.js");

/* Food Script */
var FOODS = FOODS || (function(){
    var _args = {};

    return {
        init: function(Args) {
            _args = Args;
        },
        addFood: function(position) {
            Entities.addEntity({
                "clientOnly": 0,
                "dimensions": {
                    "x": 0.3174*1.2,
                    "y": 0.4591*1.2,
                    "z": 0.3109*1.2
                },
                "locked": 0,
                "modelURL": _args.model,
                "name": "Turtle Food",
                "owningAvatarID": "{00000000-0000-0000-0000-000000000000}",
                "position": position,
                "shapeType": "simple-hull",
                "type": "Model",
                "density": 10000,
                "dynamic": 1,
                "collidesWith": "static,dynamic,kinematic",
                "collisionsWillMove": 0,
                "script": _args.script
            });
        }
    }
}());

FOODS.init({model: FOOD_ENTITY_MODEL_URL, script: FOOD_ENTITY_SCRIPT_URL});
for (var i = FOOD_AMOUNT - 1; i >= 0; i--) {
    FOODS.addFood({
        x: -5 + ((i%2 == 0) ? i/4 : -i/4),
        y: 2,
        z: - 4 * i
    });
}

    print("FOODS READY");


/*Game Script*/

function updateGame() {
    updateBody();
    //print("foods left:" + JSON.stringify(foods));
}

function endGame() {
    Entities.editEntity(TURTLE_BODY_ID, {visible: false});
}

//Script.update.connect(updateGame);
Script.setInterval(updateGame, 30);
Script.scriptEnding.connect(endGame);
