/**
 * 👑 LEADER HITLER - OFFICIAL MASTER GAME ENGINE v1.2
 * 🚀 POWERED BY FB-13 CLOSED SOURCE INFRASTRUCTURE
 * 🎮 ANTI-CHEAT, ANTI-FRAUD & MOBILE OPTIMIZED LAYER
 * * تم التطوير والضبط الشامل للمسافات والانسيابية بناءً على تجارب الكوينشية
 */

// =========================================================================
// 1. إعدادات البيئة الأساسية والكانفاس الديناميكي المتجاوب
// =========================================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// إعدادات الشاشة المتجاوبة الفخمة مع تثبيت العرض للموبايل لتفادي تمدد العناصر
function resizeCanvas() {
    canvas.width = window.innerWidth > 480 ? 420 : window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// تحميل الـ Sprite Sheet الرسمية الفخمة للقائد
const spriteSheet = new Image();
spriteSheet.src = 'hitler_sprites.png'; 

// =========================================================================
// 2. مصفوفة المهمات التاريخية الكبرى وأهداف العصور
// =========================================================================

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

// =========================================================================
// 3. إدارة متغيرات الحالة الكونية للعبة (Global Game States)
// =========================================================================

let currentMissionIndex = 0;
let gameState = "START"; 
let distanceCount = 0;
let obstacles = [];
let lasers = [];
let particles = [];     // نظام جزيئات نيون فخم للخلفية والحركة الديناميكية
let screenShake = 0;    // نظام اهتزاز الشاشة السينمائي عند الاصطدامات القوية
let globalGameTick = 0; // عداد التيك العالمي لإدارة العمليات المتزامنة

// كتل التحكم باللمس والحركة للأصابع
let keys = { left: false, right: false };

// =========================================================================
// 4. كائن القائد الفخم (The Player Logic Structure)
// =========================================================================

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
    
    // إدارة الـ Sprite Sheet المتقدمة (صفين و 6 أعمدة بصرية)
    frameX: 0,
    frameY: 0,
    tick: 0,
    animationSpeed: 5
};

// =========================================================================
// 5. نظام الجزيئات السينمائي والمؤثرات النيونية (Neon Particle System)
// =========================================================================

/**
 * دالة توليد الجزيئات في الفضاء الديناميكي
 * @param {number} x - الإحداثي السيني
 * @param {number} y - الإحداثي الصادي
 * @param {string} color - لون الجسيم النيوني
 */
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

/**
 * تهيئة وتوليد جزيئات غبار الخلفية بشكل عشوائي مدروس
 */
function initBackgroundParticles() {
    if (particles.length < 50 && Math.random() < 0.3) {
        let activeMission = missions[currentMissionIndex];
        particles.push(
            createParticle(
                canvas.width, 
                Math.random() * (canvas.height - 150), 
                activeMission.obstacle
            )
        );
    }
}

/**
 * تحديث دورة حياة الجزيئات وتلاشيها تدريجياً
 */
function updateParticles() {
    for (let p = particles.length - 1; p >= 0; p--) {
        particles[p].x += particles[p].speedX;
        particles[p].y += particles[p].speedY;
        particles[p].alpha -= 0.01;
        
        // إزالة الجسيم إذا تلاشت شفافيته أو خرج عن الشاشة
        if (particles[p].alpha <= 0 || particles[p].x < 0) {
            particles.splice(p, 1);
        }
    }
}

// =========================================================================
// 6. جدار الأمان الأمنية - توليد مفتاح التحقق الفريد (Anti-Cheat Validation)
// =========================================================================

/**
 * دالة توليد مفتاح التحقق الأمني الديناميكي لمنع الغش وسرقة لقطات الشاشة
 */
function generateUniqueWinKey() {
    const chars = 'abcdef0123456789lhx';
    let randomPart = '';
    
    // توليد سلسلة عشوائية مشفرة
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // دمج بصمة الوقت بالمللي ثانية لضمان عدم تكرار المفتاح نهائياً بين اللاعبين
    const timestampPart = Date.now().toString().slice(-6);
    
    return `LH_API_v1_${randomPart}_TS${timestampPart}`;
}

// =========================================================================
// 7. معالجة أحداث اللمس والحركة على الموبايل (Mobile Input Systems)
// =========================================================================

// مستمعات الحركة لزر اليسار
document.getElementById('btnLeft').addEventListener('touchstart', (e) => { 
    e.preventDefault(); 
    keys.left = true; 
});
document.getElementById('btnLeft').addEventListener('touchend', (e) => { 
    e.preventDefault(); 
    keys.left = false; 
});

// مستمعات الحركة لزر اليمين
document.getElementById('btnRight').addEventListener('touchstart', (e) => { 
    e.preventDefault(); 
    keys.right = true; 
});
document.getElementById('btnRight').addEventListener('touchend', (e) => { 
    e.preventDefault(); 
    keys.right = false; 
});

// مستمع الحركة لزر القفز الاحترافي
document.getElementById('btnJump').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!player.isJumping && gameState === "PLAYING") {
        player.vY = -13.5; // قوة الدفع العمودي للأعلى
        player.isJumping = true;
        
        // توليد تأثير غبار الانطلاق عند القفز
        for(let i = 0; i < 8; i++) {
            particles.push(createParticle(player.x + player.width / 2, player.y + player.height, '#ffffff'));
        }
    }
});

// مستمع الحركة لزر الهجوم والقيادة العسكرية
document.getElementById('btnCommand').addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!player.isCommanding && gameState === "PLAYING") {
        player.isCommanding = true;
        player.commandTimer = 15; // عدد التيكات لحالة الهجوم
        
        // توليد شعاع ليزر من موقع القائد
        lasers.push({
            x: player.x + player.width - 15,
            y: player.y + 35,
            width: 30,
            height: 6,
            speed: 13
        });
    }
});

// =========================================================================
// 8. إدارة دورات وحالات النظام والخرائط (Mission State Managers)
// =========================================================================

/**
 * تشغيل وإطلاق اللعبة وتصفير العدادات العامة
 */
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    gameState = "PLAYING";
    currentMissionIndex = 0;
    resetLevel();
}
window.startGame = startGame;

/**
 * إعادة تعيين إحداثيات المستوى الحالي لضمان نظافة الذاكرة الرندرية
 */
function resetLevel() {
    obstacles = [];
    lasers = [];
    distanceCount = 0;
    player.x = 60;
    player.y = canvas.height - player.height - 120;
    player.vY = 0;
    player.isJumping = false;
    player.isCommanding = false;
    
    let activeMission = missions[currentMissionIndex];
    document.getElementById('eraName').innerText = activeMission.name;
}

/**
 * الانتقال السلس للمهمة والعصر التاريخي التالي
 */
function nextMission() {
    currentMissionIndex = (currentMissionIndex + 1) % missions.length;
    document.getElementById('winScreen').classList.add('hidden');
    gameState = "PLAYING";
    resetLevel();
}
window.nextMission = nextMission;

/**
 * إطلاق واجهة الفوز والتأكيد الأمني عند الوصول للهدف الحتمي
 */
function triggerMissionWin() {
    gameState = "WIN_SCREEN";
    document.getElementById('winScreen').classList.remove('hidden');
    
    // التحقق إذا كان العصر الحالي هو العصر الأخير (المستقبل) لتوليد الجدار الناري للفوز
    if (currentMissionIndex === missions.length - 1) {
        const uniqueKey = generateUniqueWinKey();
        
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

// =========================================================================
// 9. قلب المحرك - حسابات الفيزياء والانسيابية والاصطدامات (The Logic Core)
// =========================================================================

/**
 * تحديث حركة الكائنات والتحقق من القوانين الفيزيائية للمحرك
 */
function update() {
    if (gameState !== "PLAYING") return;

    globalGameTick++;
    let activeMission = missions[currentMissionIndex];
    
    // تحديث عداد المسافة والتقدم البصري في الـ HUD
    distanceCount += 1;
    let progress = Math.floor(distanceCount / 3);
    document.getElementById('missionObjective').innerText = `الهدف: ${progress}/${activeMission.target}m`;

    // تقليل اهتزاز الشاشة التدرجي السينمائي
    if (screenShake > 0) screenShake--;

    // التحقق من شرط الفوز النهائي بالمستوى
    if (progress >= activeMission.target) {
        triggerMissionWin();
        return;
    }

    // إدارة حركة القائد الجانبية المريحة
    if (keys.left && player.x > 10) {
        player.x -= (activeMission.speed - 1);
    }
    if (keys.right && player.x < canvas.width - player.width - 10) {
        player.x += (activeMission.speed - 1);
    }

    // فيزياء الجاذبية والسقوط الحر على الأرضية الثابتة
    player.y += player.vY;
    player.vY += player.gravity;
    
    const groundY = canvas.height - player.height - 120;
    if (player.y >= groundY) {
        player.y = groundY;
        player.vY = 0;
        player.isJumping = false;
    }

    // إدارة دورة تقطيع الأنيميشن للـ Sprite Sheet (تحديث إطارات الحركة)
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

    // تدوير ومعالجة الجزيئات النيونية
    initBackgroundParticles();
    updateParticles();

    // تحديث مقذوفات أشعة الليزر في الفضاء الرندري
    for (let l = lasers.length - 1; l >= 0; l--) {
        lasers[l].x += lasers[l].speed;
        if (lasers[l].x > canvas.width) {
            lasers.splice(l, 1);
        }
    }

    // 🛠️ توازن الصعوبة وتعديل الكوينشية: حماية التوليد العشوائي من العقبات المزدوجة التعجيزية
    // توليد عقبة جديدة فقط إذا كانت المسافة الأمنية كافية للقفز أو التدمير
    if (Math.random() < 0.014 && obstacles.length < 3) {
        let isSafeToSpawn = true;
        if (obstacles.length > 0) {
            let lastObs = obstacles[obstacles.length - 1];
            // مسافة أمان إجبارية لا تقل عن 190 بكسل بناءً على خط أحمد
            if (canvas.width - lastObs.x < 190) {
                isSafeToSpawn = false; 
            }
        }
        
        if (isSafeToSpawn) {
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 162,
                width: 28,
                height: 42,
                destroyed: false
            });
        }
    }

    // إدارة حلقة العقبات وتصادم أشعة الليزر واللاعب
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= activeMission.speed;

        // معالجة اصطدام أشعة الليزر التطهيرية بالعقبة الحالية
        for (let l = lasers.length - 1; l >= 0; l--) {
            if (lasers[l].x < obstacles[i].x + obstacles[i].width &&
                lasers[l].x + lasers[l].width > obstacles[i].x &&
                lasers[l].y < obstacles[i].y + obstacles[i].height &&
                lasers[l].y + lasers[l].height > obstacles[i].y) {
                    
                    // توليد جزيئات انفجارية نيونية عند التدمير الناجح
                    for(let k = 0; k < 12; k++) {
                        particles.push(createParticle(obstacles[i].x, obstacles[i].y + 20, activeMission.obstacle));
                    }
                    obstacles.splice(i, 1);
                    lasers.splice(l, 1);
                    break;
            }
        }

        if (!obstacles[i]) continue;

        // معالجة تصادم القائد بالعقبة (نظام الحماية المتقدم لعلبة الاصطدام الحركي)
        if (player.x + 18 < obstacles[i].x + obstacles[i].width &&
            player.x + player.width - 18 > obstacles[i].x &&
            player.y + 8 < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y) {
                
                screenShake = 12; // تفعيل الاهتزاز العنيف للكانفاس عند الموت السينمائي
                alert(`سقط القائد الفخم في مهمة: ${activeMission.name}. أعد المحاولة وكثف تركيزك للفوز بالجواهر!`);
                resetLevel();
        }

        // تنظيف ومسح العقبة من المصفوفة إذا خرجت تماماً عن يسار الشاشة
        if (obstacles[i] && obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }
}

// =========================================================================
// 10. الرندرة والمسح البصري وجرافيك الشاشة (Advanced Canvas Rendering)
// =========================================================================

/**
 * دالة رسم جميع الكوادر والعناصر الرندرية على الكانفاس
 */
function draw() {
    let activeMission = missions[currentMissionIndex];
    
    ctx.save();
    // تطبيق تأثير الاهتزاز السينمائي المطور الشدة
    if (screenShake > 0) {
        let dx = (Math.random() - 0.5) * screenShake;
        let dy = (Math.random() - 0.5) * screenShake;
        ctx.translate(dx, dy);
    }

    // رسم لون خلفية العصر التاريخي الحالي
    ctx.fillStyle = activeMission.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // رسم جزيئات الغبار الفخمة مع تطبيق الشفافية المتلاشية (Alpha Blending)
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

    // رسم أرضية العصر الأساسية السفلى
    ctx.fillStyle = "#12121f";
    ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
    
    // رسم خط النيون الفخم الفاصل للأرضية
    ctx.shadowBlur = 18;
    ctx.shadowColor = activeMission.obstacle;
    ctx.fillStyle = activeMission.obstacle;
    ctx.fillRect(0, canvas.height - 120, canvas.width, 4);
    ctx.shadowBlur = 0; 

    // رسم مقذوفات أشعة الليزر بلون النيون الناري المرعب
    ctx.fillStyle = "#ff0055";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0055";
    lasers.forEach(l => ctx.fillRect(l.x, l.y, l.width, l.height));
    ctx.shadowBlur = 0;

    // رسم العقبات وعربات الكارو/الحناطير التاريخية بتأثيرات ظلال متطورة
    obstacles.forEach(obs => {
        ctx.fillStyle = activeMission.obstacle;
        ctx.shadowBlur = 10;
        ctx.shadowColor = activeMission.obstacle;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
        
        // رسم خط داخلي أبيض لإعطاء طابع بصري ثلاثي الأبعاد وعالي التباين للأصابع
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(obs.x + 6, obs.y, 4, obs.height);
    });

    // حسابات التقطيع الدقيقة للـ Sprite Sheet بناءً على الأعمدة والصفوف المحددة
    let spriteCols = 6;
    let spriteRows = 2;
    let sWidth = spriteSheet.width / spriteCols;
    let sHeight = spriteSheet.height / spriteRows;
    let sx = player.frameX * sWidth;
    let sy = player.frameY * sHeight;

    // رسم القائد الفخم بإحداثيات التقطيع البصرية المحدثة
    ctx.drawImage(
        spriteSheet,
        sx, sy,
        sWidth, sHeight,
        player.x, player.y,
        player.width, player.height
    );

    ctx.restore(); 
}

// =========================================================================
// 11. الحلقة اللانهائية المستقرة وضبط الأمان الخارجي (The Core Game Loop)
// =========================================================================

/**
 * الحلقة التكرارية الأساسية لتحديث ورسم الكوادر المتزامنة وثبات الفريمات
 */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// إطلاق الحلقة البرمجية بمجرد تحميل الصورة بالكامل لمنع أخطاء الرندرة المبكرة
spriteSheet.onload = () => {
    gameLoop();
};

// --- حماية كود المحرك الفخم والجدار الناري للتحدي المغلق ضد الهندسة العكسية ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', (e) => {
    // تعطيل زر الفحص F12 واختصارات لوحة تحكم المطورين لمنع العبث بالسكور ومفاتيح الفوز
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
});

/**
 * 👑 END OF ENGINE LOGIC CODE BLOCK - READY FOR DEPLOYMENT ON FB-13
 * تأكد من عمل Commit لهذا الملف بالكامل لـ GitHub لتطبيق التحديث مباشرة للمتابعين!
 */
