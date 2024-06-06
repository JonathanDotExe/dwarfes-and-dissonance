import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";
import {Chest} from "./static/chest.js";
import {Dwarf} from "./static/dwarf.js";

const playerFrontKnife = new Image();
playerFrontKnife.src = "/res/objects/player_front_knife.png";

const playerBackKnife = new Image();
playerBackKnife.src = "/res/objects/player_back_knife.png";

const playerLeftKnife = new Image();
playerLeftKnife.src = "/res/objects/player_left_knife.png";

const playerRightKnife = new Image();
playerRightKnife.src = "/res/objects/player_right_knife.png";

const playerFrontSword = new Image();
playerFrontSword.src = "/res/objects/player_front_sword.png";

const playerBackSword = new Image();
playerBackSword.src = "/res/objects/player_back_sword.png";

const playerLeftSword = new Image();
playerLeftSword.src = "/res/objects/player_left_sword.png";

const playerRightSword = new Image();
playerRightSword.src = "/res/objects/player_right_sword.png";

const playerFrontSpear = new Image();
playerFrontSpear.src = "/res/objects/player_front_spear.png";

const playerBackSpear = new Image();
playerBackSpear.src = "/res/objects/player_back_spear.png";

const playerLeftSpear = new Image();
playerLeftSpear.src = "/res/objects/player_left_spear.png";

const playerRightSpear = new Image();
playerRightSpear.src = "/res/objects/player_right_spear.png";

const playerDead = new Image();
playerDead.src = "/res/objects/player_dead.png";

const INTERACT_COOLDWN = 250;


export class Player extends LivingObject {

    direction;
    delay = 0;

    constructor(x, y) {
        super(x, y, 100);
        this.sightRange = 6;
        this.lastTime = 0;
        this.weapon = 0;
        this.direction = {x: 0, y: 1};
        this.score = 0;
        this.isDead = false;
    }

    init(world) {
        super.init(world);
        this.respawn();
    }

    update(deltaTime, env) {
        if(!this.isDead) {
            super.update(deltaTime, env);
            const motion = env.input.movementAxis;

            // save direction for attacking
            if(motion.x !== 0 || motion.y !== 0) {
                this.direction = motion;
            }

            // attacking
            if(env.input.currentlyAttacking && this.isDead === false) {
                let curTime = new Date().getTime();
                if((curTime - this.lastTime > 500) || this.lastTime === undefined) {
                    this.attack();
                    this.lastTime = curTime;
                }
            }

            // interacting
            if(env.input.currentlyInteracting) {
                let curTime = new Date().getTime();
                if((curTime - this.lastTime > INTERACT_COOLDWN) || this.lastTime === undefined) {
                    this.interact();
                    this.lastTime = curTime;
                }
            }

            const speed = this.isInFluid() ? 2 : 4;

            this.move(motion.x * speed , motion.y * speed, deltaTime);
        } else{
            super.update(deltaTime, env);
            this.delay++;
            if(env.input.currentlyAttacking && this.delay > 150) {
                this.respawn();
            }
        }

    }

    kill() {
        this.setHealth(1);
        this.isDead = true;
    }

    respawn() {
        this._health = this._maxHealth;
        this.isDead = false;
        this.delay = 0;
        do {
            this.x = Math.floor(Math.random() * this.world.worldWidth)
            this.y = Math.floor(Math.random() * this.world.worldHeight)
        } while(this._world.getTile(this.x, this.y)?.solid);
    }

    draw(camX, camY, ctx) {
        if(this.isDead) {
            ctx.drawImage(playerDead, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            return;
        }
        if (this.weapon === 0) {
            if (this.direction === undefined) {
                ctx.drawImage(playerFrontKnife, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            } else {
                const x = this.direction.x;
                const y = this.direction.y;

                if (x < 0) {
                    ctx.drawImage(playerLeftKnife, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (x > 0) {
                    ctx.drawImage(playerRightKnife, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (y < 0) {
                    ctx.drawImage(playerBackKnife, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (y > 0) {
                    ctx.drawImage(playerFrontKnife, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                }
            }
        } else if (this.weapon === 1) {
            if (this.direction === undefined) {
                ctx.drawImage(playerFrontSword, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            } else {
                const x = this.direction.x;
                const y = this.direction.y;

                if (x < 0) {
                    ctx.drawImage(playerLeftSword, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (x > 0) {
                    ctx.drawImage(playerRightSword, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (y < 0) {
                    ctx.drawImage(playerBackSword, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (y > 0) {
                    ctx.drawImage(playerFrontSword, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                }
            }
        } else {
            if (this.direction === undefined) {
                ctx.drawImage(playerFrontSpear, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
            } else {
                const x = this.direction.x;
                const y = this.direction.y;

                if (x < 0) {
                    ctx.drawImage(playerLeftSpear, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (x > 0) {
                    ctx.drawImage(playerRightSpear, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (y < 0) {
                    ctx.drawImage(playerBackSpear, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                    return;
                }
                if (y > 0) {
                    ctx.drawImage(playerFrontSpear, (this.x - camX) * TILE_SIZE, (this.y - camY) * TILE_SIZE);
                    super.draw(camX, camY, ctx);
                }
            }

        }
    }


    doesCollide(tile) {
        return  tile == null || tile.solid
    }


    attack() {
        //check if there is an enemy in the tile in front of player (current direction)
        // For now only 1 weapon -> 1 Tile range
        // Can be updated and stats gotten from a possible future weapon or inventory class (same for dmg)
        //const motion = env.input.movementAxis;
        if(this.direction === undefined) {
            return;
        }

        const attackPosX = this.x + this.width/2 + (this.direction.x) - 0.5;
        const attackPosY = this.y + this.height/2 + (this.direction.y) - 0.5;


        if (this.weapon === 0) {
            let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1, 1);

            creatures.forEach((obj) => {
                if (obj instanceof LivingObject && obj !== this) {
                    if (obj.takeDamage(10)) {
                        this.score += obj.killScore;
                    }
                    obj.overwriteForce(this.direction.x * 6, this.direction.y * 6);
                }
            })
        } else if(this.weapon === 1) {
            let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1, 1);

            creatures.forEach((obj) => {
                if (obj instanceof LivingObject && obj !== this) {
                    if (obj.takeDamage(18)) {
                        this.score += obj.killScore;
                    }
                    obj.overwriteForce(this.direction.x * 6, this.direction.y * 6);
                }
            })
        } else {
            let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1.5, 1.5);

            creatures.forEach((obj) => {
                if (obj instanceof LivingObject && obj !== this) {
                    if (obj.takeDamage(12)) {
                        this.score += obj.killScore;
                    }
                    obj.overwriteForce(this.direction.x * 6, this.direction.y * 6);
                }
            })
        }
    }


    interact() {
        if(this.direction === undefined) {
            return;
        }

        const interactPosX = this.x + this.width/2 + this.direction.x - 0.5;
        const interactPosY = this.y + this.height/2 + this.direction.y - 0.5;
        let objInRange = this.world.getObjectsInArea(interactPosX, interactPosY, 1, 1);

        objInRange.forEach((obj) => {
            if (obj instanceof Chest) {
                obj.open();
            }
            else if(obj instanceof Dwarf && obj !== this){
                obj.healPlayer(this);
            }
        });
    }

    changeWeapon(weaponId) {
        this.weapon = weaponId % 3;
    }

    heal(amount) {
        if(this._health + amount > this._maxHealth){
            this._health = this._maxHealth;
        } else{
            this._health += amount;
        }
    }

}