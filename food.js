(function(){

    var _this;

     function food() {
     	_this = this;
     }

     food.prototype = {
            entityID: null,
         preload: function(entityID) {
             _this.entityID = entityID;
         },

     	collisionWithEntity: function(me, otherEntity, collision) {
                print("TURTLE BUMP!" + JSON.stringify(collision.type));

            Entities.deleteEntity(_this.entityID);
     	}

 //        eat: function() {
   //                   Entities.deleteEntity(_this.entityID);
//         }
     }

    return new food();

 })
