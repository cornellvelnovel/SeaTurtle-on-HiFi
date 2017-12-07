//all model urls
var FOOD_ENTITY_MODEL_URL = "https://s3-us-west-2.amazonaws.com/novelteam/jellyFish.FBX ";
var SEATURTLE_MODEL_URL = "https://s3-us-west-2.amazonaws.com/novelteam/turtleFinalFinal/seaturtleFinal/SeaTurtle.fst";

//all script urls
var FOOD_ENTITY_SCRIPT_URL = "https://s3-us-west-2.amazonaws.com/novelteam/scripts/food.js";

//all params
var INDEX_OF_PLAYER_1 = 0;
var INDEX_OF_PLAYER_2 = 2;
var TURTLE_BODY_ID = "{6595a81e-a43a-4480-a31a-1d560533173e}";
var TURTLE_STARTING_POSITION = {"x": -5, "y": 2, "z": 3};
var TURTLE_ENDING_POSITION = {"x": -50, "y": 2, "z": 3};
var TURTLE_STARTING_YAW = 0;

//Modify the amount of jellyfish here
var FOOD_AMOUNT = 6;

//Modify the resistance factor here (must be greater than 0)
var RESISTANCE = 1;


//var ANGULAR_RANGE = 45/180*Math.PI;

print("INITIALIZING...");

Entities.editEntity(TURTLE_BODY_ID, {position: TURTLE_STARTING_POSITION, rotation: Quat.fromPitchYawRollDegrees(0,TURTLE_STARTING_YAW,0)});

//get avatars
var activeAvatars = AvatarList.getAvatarIdentifiers();

//define player
function createPlayer(avatarIndex) {
    var player = function() {
        this.avatar = AvatarList.getAvatar(activeAvatars[avatarIndex]);
        // this.avatar.goToLocation({x: -2, y:2, z:6.5}, true);
        // this.avatar.orientation = {x: 0, y:0, z:0, w:0};
    };
    player.prototype = {
        bodyRot: function() {
            return Quat.fromPitchYawRollDegrees(this.avatar.bodyPitch, this.avatar.bodyYaw+90, this.avatar.bodyRoll);
        },
        bodyYaw: function() {
            // print("Player " + avatarIndex + ": "+ (this.avatar.bodyYaw + 180));
            // return (this.avatar.bodyYaw+180)/180*Math.PI;
            return (this.avatar.bodyYaw)/180*Math.PI;
        },
        leftHandPos: function() {
            print()
            return Vec3.subtract(this.avatar.getLeftPalmPosition(), this.avatar.position);
            // return Vec3.subtract(this.avatar.getJointPosition("LeftHand"), this.avatar.position);
        },
        rightHandPos: function() {
            return Vec3.subtract(this.avatar.getRightPalmPosition(), this.avatar.position);
            // return Vec3.subtract(this.avatar.getJointPosition("RightHand"), this.avatar.position);
        },
        getLeftMove: function() {
            return getYawOriented(this.bodyYaw(), this.leftHandPos());
        },
        getRightMove: function() {
            return getYawOriented(this.bodyYaw(), this.rightHandPos());
        },
        leftArmRot: function() {
            return this.avatar.getJointRotation("LeftArm");
        },
        rightArmRot: function() {
            return this.avatar.getJointRotation("RightArm");
        }
    };
    return new player();
}

//construct players
var Player1 = createPlayer(INDEX_OF_PLAYER_1);
var Player2 = createPlayer(INDEX_OF_PLAYER_2);

print("PLAYERS READY");

//adding the sea turtle
var seaturtle, seaturtleID;
seaturtleID = TURTLE_BODY_ID;
seaturtle = Entities.getEntityProperties(seaturtleID);

//update the turtle's body movement
var bodyStates;
var bodyRot;
var leftPosLast1 = Player1.getLeftMove();
var rightPosLast1 = Player1.getRightMove();
var leftPosLast2 = Player2.getRightMove();
var rightPosLast2 = Player2.getRightMove();
var leftDeltaX, rightDeltaX, deltaX, leftDeltaY, rightDeltaY, deltaY;
var orientation, velocity;
function updateBody() {
    bodyStates = Entities.getEntityProperties(seaturtleID);

    var turtleBodyYaw = (Player1.bodyYaw() + Player2.bodyYaw())/2;
    // if (Player1.bodyYaw() == Math.PI || Player1.bodyYaw() == (-1) * Math.PI) {
    //     turtleBodyYaw =  Math.PI * 2 + turtleBodyYaw;
    // }
    // bodyRot = Quat.fromPitchYawRollRadians(0, (Player1.bodyYaw() + Player2.bodyYaw())/2, 0);
    bodyRot = Quat.fromPitchYawRollRadians(0, turtleBodyYaw, 0);
    Entities.editEntity(seaturtleID, { rotation: bodyRot});

    // print(Player1.bodyYaw(), Player2.bodyYaw(), turtleBodyYaw);


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
    //     deltaY = (leftDeltaY + rightDeltaY) * 60;
    // }
    deltaZ =  (leftDeltaZ + rightDeltaZ)/2 * 60;

    orientation = Quat.safeEulerAngles(bodyStates.rotation).y/180*Math.PI;
    velocity = {
        // x: -deltaX * Math.cos(orientation),
        // y: 0,
        // z: deltaX * Math.sin(orientation)
        x: deltaZ * Math.sin(orientation),
        y: 0,
        z: deltaZ * Math.cos(orientation)
    };

    // if (deltaX < 0) {
    if (deltaZ < 0) {
        Entities.editEntity(seaturtleID, {velocity: velocity});
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

/*Food Script*/

//defining food positions
    var foodPositions = [];
    var foodPos;

    for (var i = 0; i <= FOOD_AMOUNT-1; i++) {
        foodPos = {
            x: -5 + ((i%2 == 0) ? i/4 : -i/4),
            y: 2,
            z: - 4 * i
        };
        foodPositions.push(foodPos);
    }

    //defining foods
    var foodProps = function(index) {
        return {
            "clientOnly": 0,
            "dimensions": {
                "x": 0.3174*1.2,
                "y": 0.4591*1.2,
                "z": 0.3109*1.2
            },
            "locked": 0,
            "modelURL": FOOD_ENTITY_MODEL_URL,
            "name": "Turtle Food",
            "owningAvatarID": "{00000000-0000-0000-0000-000000000000}",
            "position": foodPositions[index],
            "shapeType": "simple-hull",
            "type": "Model",
            "dynamic": 1,
            "collidesWith": "static,dynamic,kinematic",
            "collisionsWillMove": 0,
            "script": FOOD_ENTITY_SCRIPT_URL
        };
    };

    //adding foods
    var foods = [];
    var food;

    for (var i = FOOD_AMOUNT - 1; i >= 0; i--) {
        food = Entities.addEntity(foodProps(i));
        foods.push(food);
    }

    print("FOODS READY");


/*Game Script*/

//update game progress: turtle movements and food tracking
function updateGame() {
    updateBody();
}

function endGame() {
    Entities.deleteEntity(seaturtleID);
}

//Script.update.connect(updateGame);
Script.setInterval(updateGame, 30);
Script.scriptEnding.connect(endGame);
