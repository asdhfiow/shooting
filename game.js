// ゲーム関連の変数
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player, enemies, keys, score, gameOver, enemySpeed;

// 音声ファイルのパス
const shootSoundSrc = "shoot.mp3";
const hitSoundSrc = "hit.mp3";
const gameOverSoundSrc = "gameover.mp3";

// 音を鳴らす関数
function playSound(src) {
    let sound = new Audio(src);
    sound.currentTime = 0;
    sound.play();
}

function initGame() {
    player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        speed: 5,
        bullets: []
    };
    enemies = [];
    enemySpeed = 2;
    keys = {};
    score = 0;
    gameOver = false;

    document.addEventListener("keydown", (e) => keys[e.key] = true);
    document.addEventListener("keyup", (e) => keys[e.key] = false);

    document.getElementById("restartBtn").style.display = "none";
}

document.getElementById("restartBtn").addEventListener("click", () => {
    initGame();
    gameLoop();
});

function update() {
    if (gameOver) return;

    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;

    // 弾の移動
    player.bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // 敵の移動
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            gameOver = true;
            document.getElementById("restartBtn").style.display = "block";

            // ゲームオーバー音を再生
            playSound(gameOverSoundSrc);
        }
    });

    // 弾と敵の当たり判定
    player.bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                player.bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;

                // ヒット音を再生
                playSound(hitSoundSrc);
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "red";
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    ctx.fillStyle = "green";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // スコア表示
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 80, canvas.height / 2);
    }
}

// 敵を追加
setInterval(() => {
    if (!gameOver) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30
        });
    }
}, 1000);

// ショット発射
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        player.bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 5,
            height: 10
        });
        playSound(shootSoundSrc);
    }
});

function gameLoop() {
    update();
    draw();
    if (!gameOver) requestAnimationFrame(gameLoop);
}

initGame();
gameLoop();
