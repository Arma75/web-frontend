import * as THREE from 'three';

// --- 초기 설정 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // 하늘색

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light, new THREE.AmbientLight(0x404040));

// --- 바닥 생성 ---
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// --- 캐릭터(플레이어) 생성 ---
const playerGroup = new THREE.Group();
const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({ color: 0x0000ff }));
playerGroup.add(body);
playerGroup.position.y = 1;
scene.add(playerGroup);

// 카메라는 플레이어를 따라다님
camera.position.set(0, 5, 10);
playerGroup.add(camera);

// --- 몬스터 시스템 ---
const monsters = [];
function spawnMonster() {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    mesh.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20);
    mesh.userData = { hp: 30 };
    scene.add(mesh);
    monsters.push(mesh);
}
for(let i=0; i<10; i++) spawnMonster();

// --- 컨트롤 상태 ---
const keys = {};
let playerStats = { hp: 100, exp: 0 };
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// --- 사냥(공격) 로직 ---
function attack() {
    // 플레이어 정면 일정 거리 내의 몬스터 탐색
    monsters.forEach((monster, index) => {
        const dist = playerGroup.position.distanceTo(monster.position);
        if (dist < 3) {
            monster.userData.hp -= 10;
            console.log("공격 성공!");
            if (monster.userData.hp <= 0) {
                scene.remove(monster);
                monsters.splice(index, 1);
                playerStats.exp += 10;
                document.getElementById('exp').innerText = playerStats.exp;
                spawnMonster(); // 새 몬스터 충원
            }
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') attack();
});

// --- 메인 루프 ---
function animate() {
    requestAnimationFrame(animate);

    // 이동 로직
    const speed = 0.1;
    if (keys['KeyW']) playerGroup.translateZ(-speed);
    if (keys['KeyS']) playerGroup.translateZ(speed);
    if (keys['KeyA']) playerGroup.rotation.y += 0.05;
    if (keys['KeyD']) playerGroup.rotation.y -= 0.05;

    renderer.render(scene, camera);
}

animate();

// 리사이즈 대응
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});