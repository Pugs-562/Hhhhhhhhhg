class GameApp {
    constructor() {
        this.container = document.getElementById('game-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.controls = new Controls();
        this.net = new NetworkManager();
        this.currentState = 'menu';
        
        this.initThree();
        this.initUIEvents();
    }

    initThree() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 12, 12);
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.animate();
    }

    initUIEvents() {
        document.getElementById('btn-play-local').addEventListener('click', () => {
            this.startGame('local');
        });

        document.getElementById('btn-multiplayer').addEventListener('click', () => {
            document.getElementById('multiplayer-box').classList.remove('hidden');
        });

        document.getElementById('btn-create-room').addEventListener('click', () => {
            this.net.createRoom();
            this.startGame('multiplayer');
        });

        document.getElementById('btn-join-room').addEventListener('click', () => {
            const code = document.getElementById('room-input').value;
            if (this.net.joinRoom(code)) {
                this.startGame('multiplayer');
            }
        });
    }

    startGame(mode) {
        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('ui-overlay').classList.remove('hidden');
        this.currentState = 'chess';

        this.chessBoard = new ChessBoard(this.scene, (attacker, defender) => {
            this.startArenaBattle(attacker, defender);
        });
        this.chessBoard.init();

        // Debug helper: Double click screen to trigger a battle transition
        window.addEventListener('dblclick', () => {
            if (this.currentState === 'chess') {
                this.chessBoard.triggerTestBattle();
            }
        });
    }

    startArenaBattle(attacker, defender) {
        this.currentState = 'arena';
        this.chessBoard.destroy();
        
        this.camera.position.set(0, 8, 10);
        this.camera.lookAt(0, 0, 0);

        this.arena = new BattleArena(this.scene, attacker, defender, (winner) => {
            // Return to chess after battle
            this.arena = null;
            this.startGame('local');
        });
        this.arena.init();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Handle camera looking rotation from drag controls
        const lookDelta = this.controls.consumeLook();
        if (lookDelta.x !== 0 || lookDelta.y !== 0) {
            this.camera.position.x -= lookDelta.x * 0.01;
            this.camera.position.y += lookDelta.y * 0.01;
            this.camera.lookAt(0, 0, 0);
        }

        if (this.currentState === 'arena' && this.arena) {
            this.arena.update(this.controls, 0.016);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Start Game on Window Load
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new GameApp();
});
