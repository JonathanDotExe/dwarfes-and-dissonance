import { LivingObject } from "./livingobject.js";
import { TILE_SIZE } from "./tile.js";
import {Chest} from "./static/chest.js";

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

const INTERACT_COOLDWN = 250;

export class Player extends LivingObject {

    direction;

    constructor(x, y) {
        super(x, y, 100);
        this.sightRange = 6;
        this.lastTime = 0;
        this.weapon = 0;
    }

    init(world) {
        super.init(world);
        this.respawn();
    }

    update(deltaTime, env) {
        super.update(deltaTime, env);
        const motion = env.input.movementAxis;

        // save direction for attacking
        if(motion.x !== 0 || motion.y !== 0) {
            this.direction = motion;
        }

        // attacking
        if(env.input.currentlyAttacking) {
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
        const speed = this.isInFluid() ? 1 : 4;

        this.move(motion.x * speed , motion.y * speed, deltaTime);
    }

    kill() {
        this.respawn();
    }

    respawn() {
        this._health = this._maxHealth;
        do {
            this.x = Math.floor(Math.random() * this.world.worldWidth)
            this.y = Math.floor(Math.random() * this.world.worldHeight)
        } while(this._world.getTile(this.x, this.y)?.solid);
    }

    draw(camX, camY, ctx) {
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
                    obj.takeDamage(10);
                }
            })
        } else if(this.weapon === 1) {
            let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1, 1);

            creatures.forEach((obj) => {
                if (obj instanceof LivingObject && obj !== this) {
                    obj.takeDamage(18);
                }
            })
        } else {
            let creatures = this.world.getObjectsInArea(attackPosX, attackPosY, 1.5, 1.5);

            creatures.forEach((obj) => {
                if (obj instanceof LivingObject && obj !== this) {
                    obj.takeDamage(12);
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
        })
    }


    changeWeapon(weaponId) {
        this.weapon = weaponId % 3;
    }
}