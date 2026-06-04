/**
 * 👑 LEADER HITLER - OFFICIAL GAME ENGINE (ANTI-FRAUD EDITION)
 * 🎮 المطورة خصيصاً لتحدي الـ 50 جوهرة الفخم لأول 3 فائزين
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// إعدادات الشاشة المتجاوبة الفخمة مع تثبيت العرض للموبايل
function resizeCanvas() {
    canvas.width = window.innerWidth > 480 ? 420 : window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// تحميل الـ Sprite Sheet الرسمية للقائد
const spriteSheet = new Image();
spriteSheet.src = 'hitler_sprites.png'; 

// مصفوفة المهمات الفخمة ذات الأهداف والصعوبات المحددة بالتفصيل
const missions = [
    { 
        name: "برلين 1945: الهروب من الحصار", 
        bg: "#080810", 
        obstacle: "#ff2200", 
        target: 500, 
        speed: 5, 
        desc: "تخطى حواجز النيران والدفاعات الجوية للوصول لآلة الزمن المتنقلة." 
    },
    { 
        name: "سمهود 1889: اختراق الحناطير", 
        bg: "#1a1008", 
        obstacle: "#ff9900", 
        target: 800, 
        speed: 7, 
        desc: "تفادي الحناطير وعربات الكارو العثمانية الطائرة بسرعة خارقة للعادة!" 
    },
    { 
        name: "المستقبل 2045: سايبـر بنـك", 
        bg: "#010910", 
        obstacle: "#00f3ff", 
        target: 1200, 
        speed: 9, 
        desc: "دمر جدران الليزر الرقمية وبوتات الهاكرز وبسط نفوذ القائد الكامل." 
    }
];

// المتغيرات الحركية والبيئية لإدارة اللعبة
let currentMissionIndex = 0;
let gameState = "START"; 
let distanceCount = 0;
let obstacles = [];
let lasers = [];
let particles = []; // نظام جزيئات نيون فخم للخلفية والحركة
let screenShake = 0; // نظام اهتزاز الشاشة السينمائي عند الاصطدام

// كتل التحكم باللمس والحركة
let keys = { left: false, right: false };

// كائن القائد الفخم مع إحداثيات التقطيع الدقيقة
const player = {
    x: 60,
    y: 0,
    width: 75,
    height: 85,
    vY: 0,
    gravity: 0.65,
    isJumping: false,
    isCommanding: false,
    commandTimer: 0,
    
    // إدارة الـ Sprite Sheet (صفين و 6 أعمدة)
    frameX: 0,
    frameY: 0,
    tick: 0,
    animationSpeed: 5
};

// --- نظام جزيئات الغبار النيوني الفخم في الخلفية ---
function createParticle(x, y, color) {
    return {
        x: x,
        y: y,
        size: Math.random() * 3 + 1,
        speedX: -(Math.random() * 3 + 1),
        speedY: (Math.random() - 0.5) * 1,
        color: color,
        alpha: 1
    };
}

function initBackgroundParticles() {
    if (particles.length < 40 && Math.random() < 0.3) {
        let activeMission = missions[currentMissionIndex];
        particles.push(createParticle(canvas.width, Math.random() * (canvas.height - 150), activeMission.obstacle));
    }
}

// --- دالة توليد مفتاح التحقق الأمني الغريب والمشفر (API-Key Style) ---
function generateUniqueWinKey() {
    // توليد جزء عشوائي مكون من حروف وأرقام غريبة
    const chars = 'abcdef0123456789lhx';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // دمج وقت الفوز بالمللي ثانية الحالي لضمان عدم التكرار نهائياً
    const timestampPart = Date.now().toString().slice(-6);
    
    // إخراج المفتاح بشكل غريب ومحترف كأنه كود برامجي مشفر
    return `LH_API_v1_${randomPart}_TS${timestampPart}`;
}

// --- ربط أزرار اللمس على الموبايل بالـ Logic الحركي السلس ---
document.getElementById('btnLeft').addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
document.getElementById('btnLeft').addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
document.getElementById('btnRight').addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
document.getElementById('btnRight').addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });

document.getElementById('btnJump').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!player.isJumping && gameState === "PLAYING") {
        player.vY = -13.5;
        player.isJumping = true;
        for(let i=0; i<8; i++) {
            particles.push(createParticle(player.x + player.width/2, player.y + player.height, '#ffffff'));
        }
    }
});

document.getElementById('btnCommand').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!player.isCommanding && gameState === "PLAYING") {
        player.isCommanding = true;
        player.commandTimer = 15; 
        
        lasers.push({
            x: player.x + player.width - 15,
            y: player.y + 35,
            width: 30,
            height: 6,
            speed: 13
        });
    }
});

// --- إدارة حالات اللعبة ---
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    gameState = "PLAYING";
    currentMissionIndex = 0;
    resetLevel();
}
window.startGame = startGame;

function resetLevel() {
    obstacles = [];
    lasers = [];
    distanceCount = 0;
    player.x = 60;
    player.y = canvas.height - player.height - 120;
    player.vY = 0;
    player.isJumping = false;
    player.isCommanding = false;
    document.getElementById('eraName').innerText = "Leader Hitler";
}

function nextMission() {
    currentMissionIndex = (currentMissionIndex + 1) % missions.length;
    document.getElementById('winScreen').classList.add('hidden');
    gameState = "PLAYING";
    resetLevel();
}
window.nextMission = nextMission;

function triggerMissionWin() {
    gameState = "WIN_SCREEN";
    document.getElementById('winScreen').classList.remove('hidden');
    
    if (currentMissionIndex === missions.length - 1) {
        // توليد الرمز الأمني الفريد للفائز الحالي لمنع التزوير وسرقة الصور
        const uniqueKey = generateUniqueWinKey();
        
        // شاشة الفوز الأمني النهائي المحدثة لـ 50 جوهرة لأول 3 فائزين
        document.getElementById('winMessage').innerHTML = `
            <span style="color: #39ff14; font-size: 22px; font-weight: bold; text-shadow: 0 0 10px #39ff14;">👑 لقد سيطرت على العصور الفخمة! 👑</span><br><br>
            لتأكيد فوزك الساحق في التحدي وأنك من أول 3 فائزين لشحن الـ 50 جوهرة، خذ لقطة شاشة (Screenshot) كاملة الآن وأرسلها لي مباشرة للتأكيد الحتمي.<br><br>
            <div style="background: #09090f; border: 2px dashed #ff0055; padding: 12px; color: #39ff14; font-family: monospace; font-size: 14px; margin-top: 10px; border-radius: 8px; word-break: break-all;">
                🔑 API_VERIFICATION_KEY:<br>
                <span style="color: #fff; font-weight: bold; font-size: 16px;">${uniqueKey}</span>
            </div>
        `;
    } else {
        document.getElementById('winMessage').innerText = missions[currentMissionIndex + 1].desc;
    }
}

// --- معالجة الحسابات الفيزيائية والحركية للعبة ---
function update() {
    if (gameState !== "PLAYING") return;

    let activeMission = missions[currentMissionIndex];
    distanceCount += 1;
    let progress = Math.floor(distanceCount / 3);
    document.getElementById('missionObjective').innerText = `الهدف: ${progress}/${activeMission.target}m`;

    if (screenShake > 0) screenShake--;

    if (progress >= activeMission.target) {
        triggerMissionWin();
        return;
    }

    if (keys.left && player.x > 10) player.x -= (activeMission.speed - 1);
    if (keys.right && player.x < canvas.width - player.width - 10) player.x += (activeMission.speed - 1);

    player.y += player.vY;
    player.vY += player.gravity;
    const groundY = canvas.height - player.height - 120;
    if (player.y >= groundY) {
        player.y = groundY;
        player.vY = 0;
        player.isJumping = false;
    }

    player.tick++;
    if (player.tick > player.animationSpeed) {
        player.tick = 0;
        if (player.isCommanding) {
            player.frameY = 1; 
            player.frameX = 5; 
            player.commandTimer--;
            if (player.commandTimer <= 0) player.isCommanding = false;
        } else if (player.isJumping) {
            player.frameY = 0;
            player.frameX = 5; 
        } else if (keys.right || keys.left || Math.random() > 0.05) { 
            player.frameY = 0;
            player.frameX = 1 + ((player.frameX + 1) % 5);
        } else {
            player.frameY = 0;
            player.frameX = 0; 
        }
    }

    initBackgroundParticles();
    for (let p = particles.length - 1; p >= 0; p--) {
        particles[p].x += particles[p].speedX;
        particles[p].y += particles[p].speedY;
        particles[p].alpha -= 0.01;
        if (particles[p].alpha <= 0 || particles[p].x < 0) {
            particles.splice(p, 1);
        }
    }

    for (let l = lasers.length - 1; l >= 0; l--) {
        lasers[l].x += lasers[l].speed;
        if (lasers[l].x > canvas.width) lasers.splice(l, 1);
    }

    if (Math.random() < 0.018 && obstacles.length < 3) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 160,
            width: 28,
            height: 42,
            destroyed: false
        });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= activeMission.speed;

        for (let l = lasers.length - 1; l >= 0; l--) {
            if (lasers[l].x < obstacles[i].x + obstacles[i].width &&
                lasers[l].x + lasers[l].width > obstacles[i].x &&
                lasers[l].y < obstacles[i].y + obstacles[i].height &&
                lasers[l].y + lasers[l].height > obstacles[i].y) {
                    
                    for(let k=0; k<12; k++) {
                        particles.push(createParticle(obstacles[i].x, obstacles[i].y + 20, activeMission.obstacle));
                    }
                    obstacles.splice(i, 1);
                    lasers.splice(l, 1);
                    break;
            }
        }

        if (!obstacles[i]) continue;

        if (player.x + 18 < obstacles[i].x + obstacles[i].width &&
            player.x + player.width - 18 > obstacles[i].x &&
            player.y + 8 < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y) {
                
                screenShake = 10; 
                alert(`سقط القائد الفخم في مهمة: ${activeMission.name}. أعد المحاولة وكثف تركيزك للفوز بالجواهر!`);
                resetLevel();
        }

        if (obstacles[i] && obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

// --- دالة الرسم والـ Rendering البصري ---
function draw() {
    let activeMission = missions[currentMissionIndex];
    
    ctx.save();
    if (screenShake > 0) {
        let dx = (Math.random() - 0.5) * screenShake;
        let dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
    }

    ctx.fillStyle = activeMission.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    ctx.fillStyle = "#12121f";
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
    
    ctx.shadowBlur = 18;
    ctx.shadowColor = activeMission.obstacle;
    ctx.fillStyle = activeMission.obstacle;
    ctx.fillRect(0, canvas.height - 120, canvas.width, 4);
    ctx.shadowBlur = 0; 

    ctx.fillStyle = "#ff0055";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0055";
    lasers.forEach(l => ctx.fillRect(l.x, l.y, l.width, l.height));
    ctx.shadowBlur = 0;

    obstacles.forEach(obs => {
        ctx.fillStyle = activeMission.obstacle;
        ctx.shadowBlur = 10;
        ctx.shadowColor = activeMission.obstacle;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(obs.x + 6, obs.y, 4, obs.height);
    });

    let spriteCols = 6;
    let spriteRows = 2;
    let sWidth = spriteSheet.width / spriteCols;
    let sHeight = spriteSheet.height / spriteRows;
    let sx = player.frameX * sWidth;
    let sy = player.frameY * sHeight;

    ctx.drawImage(
        spriteSheet,
        sx, sy,
        sWidth, sHeight,
        player.x, player.y,
        player.width, player.height
    );

    ctx.restore(); 
}

// --- الحلقة اللانهائية المستقرة ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

spriteSheet.onload = () => {
    gameLoop();
};

// --- حماية كود اللعبة الفخم والجدار الناري للتحدي المغلق ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
});
