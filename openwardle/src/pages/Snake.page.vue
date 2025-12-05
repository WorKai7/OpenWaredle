<template>
    <div ref="gameContainer"></div>
</template>

<script setup>
    import Phaser from "phaser";
    import { onMounted, ref } from 'vue';
    import { useRouter } from "vue-router";

    const gameContainer = ref<HTMLDivElement | null>(null);

    const router = useRouter();

    onMounted (() => {
        const CELL_SIZE = 40;
        const GRID_SIZE = 20;

        let direction = "right";
        let nextDirection = "right";
        let snake = [{ x: 10, y: 10 }];
        let food = null;
        let gameOver = false;
        let gameOverMsg = "Game over !"
        let gameOverText = null
        let score = 0
        let scoreText = null
        let game

        function placeFood() {
            let emptyCells = [];
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (!snake.some(seg => seg.x === j && seg.y === i)) {
                        emptyCells.push({ x: j, y: i });
                    }
                }
            }
            food = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        function moveSnake() {
            if (gameOver) return;

            direction = nextDirection;
            const head = { ...snake[0] };
            switch (direction) {
                case "up": head.y -= 1; break;
                case "down": head.y += 1; break;
                case "left": head.x -= 1; break;
                case "right": head.x += 1; break;
            }

            // Collision
            if (
                head.x < 0 || head.x >= GRID_SIZE ||
                head.y < 0 || head.y >= GRID_SIZE ||
                snake.some(seg => seg.x === head.x && seg.y === head.y)
            ) {
                gameOver = true;
                console.log("Game Over");
                return;
            }

            snake.unshift(head);

            // Manger la nourriture
            if (food && head.x === food.x && head.y === food.y) {
                score++
                placeFood();
            } else {
                snake.pop();
            }
        }

        const SnakeScene = new Phaser.Scene("SnakeScene");

        SnakeScene.preload = function () {
            this.load.image("apple", "/assets/snake/apple.png");
            this.load.image("snake_body", "/assets/snake/snake_body.png");
            this.load.image("snake_head", "/assets/snake/snake_head.png");
            this.load.image("snake_turn", "/assets/snake/snake_turn.png");
            this.load.image("snake_end", "/assets/snake/snake_end.png");
        };

        SnakeScene.create = function () {
            placeFood();
            this.snakeSprites = [];

            // Timer pour déplacer le serpent
            this.time.addEvent({
                delay: 200,
                loop: true,
                callback: moveSnake
            });

            // Contrôles clavier
            this.input.keyboard.on("keydown", (event) => {
                switch (event.code) {
                    case "ArrowUp": if (direction !== "down") nextDirection = "up"; break;
                    case "ArrowDown": if (direction !== "up") nextDirection = "down"; break;
                    case "ArrowLeft": if (direction !== "right") nextDirection = "left"; break;
                    case "ArrowRight": if (direction !== "left") nextDirection = "right"; break;
                }
            });

            scoreText = SnakeScene.add.text(SnakeScene.scale.width/2, 50, "Score: 0").setOrigin(0.5, 0.5)
            gameOverText = SnakeScene.add.text(SnakeScene.scale.width/2, SnakeScene.scale.height/2, gameOverMsg).setOrigin(0.5, 0.5).setAlpha(0)
        };

        SnakeScene.update = function () {
            // Supprime les anciens sprites
            this.snakeSprites.forEach(sprite => sprite.destroy());
            this.snakeSprites = [];

            // Dessiner le serpent
            snake.forEach((seg, index) => {
                let spriteKey = "snake_body";
                let angle = 0;

                if (index === 0) {
                    spriteKey = "snake_head";
                    switch (direction) {
                        case "up": angle = -90; break;
                        case "down": angle = 90; break;
                        case "left": angle = 180; break;
                        case "right": angle = 0; break;
                    }
                } else if (index === snake.length - 1) {
                    spriteKey = "snake_end";
                    const prev = snake[index - 1];
                    if (prev.x === seg.x) angle = (prev.y < seg.y) ? -90 : 90;
                    else angle = (prev.x < seg.x) ? 180 : 0;
                } else {
                    const prev = snake[index - 1];
                    const next = snake[index + 1];

                    // Virage ?
                    if ((prev.x !== seg.x && next.y !== seg.y) || (prev.y !== seg.y && next.x !== seg.x)) {
                        spriteKey = "snake_turn";

                        // Déterminer le bon angle du virage
                        if ((prev.x < seg.x && next.y > seg.y) || (next.x < seg.x && prev.y > seg.y)) angle = 0;
                        else if ((prev.x > seg.x && next.y > seg.y) || (next.x > seg.x && prev.y > seg.y)) angle = -90;
                        else if ((prev.x > seg.x && next.y < seg.y) || (next.x > seg.x && prev.y < seg.y)) angle = 180;
                        else angle = 90;
                    } else {
                        // Corps droit
                        if (prev.x === seg.x) angle = 90; // vertical
                        else angle = 0; // horizontal
                    }
                }

                const sprite = this.add.image(seg.x * CELL_SIZE + CELL_SIZE / 2, seg.y * CELL_SIZE + CELL_SIZE / 2, spriteKey);
                sprite.setDisplaySize(CELL_SIZE, CELL_SIZE);
                sprite.angle = angle;
                this.snakeSprites.push(sprite);
            });

            // Dessiner la nourriture
            if (food) {
                if (!this.foodSprite) {
                    this.foodSprite = this.add.image(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, "apple");
                    this.foodSprite.setDisplaySize(CELL_SIZE, CELL_SIZE);
                } else {
                    this.foodSprite.setPosition(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2);
                }
            }

            scoreText.setText("Score: " + score)
            

            if (gameOver) {
                gameOverText.setAlpha(1)

                setTimeout(() => {
                    game.destroy(true)
                    router.push('/');
                }, 2000);
            }
        };

        const config = {
            type: Phaser.AUTO,
            scale: {
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: gameContainer.value,
            scene: SnakeScene
        };

        game = new Phaser.Game(config);
    });
</script>

<style scoped>

</style>
