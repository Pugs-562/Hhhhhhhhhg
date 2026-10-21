class ChessBoard {
    constructor(scene, onTriggerBattle) {
        this.scene = scene;
        this.onTriggerBattle = onTriggerBattle;
        this.group = new THREE.Group();
        this.selectedSquare = null;
    }

    init() {
        // Create 8x8 Chessboard tiles
        const tileSize = 2;
        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {
                const isLight = (x + z) % 2 === 0;
                const geo = new THREE.BoxGeometry(tileSize, 0.2, tileSize);
                const mat = new THREE.MeshStandardMaterial({ color: isLight ? 0xf0d9b5 : 0xb58863 });
                const tile = new THREE.Mesh(geo, mat);
                tile.position.set((x - 3.5) * tileSize, 0, (z - 3.5) * tileSize);
                tile.userData = { gridX: x, gridZ: z };
                this.group.add(tile);
            }
        }
        this.scene.add(this.group);
        
        // Setup simple demo pieces
        this.spawnPiece('pawn', 0, 1, 0x3498db);
        this.spawnPiece('queen', 0, 6, 0xe74c3c);
    }

    spawnPiece(type, x, z, color) {
        const config = SkinRegistry.pieces[type];
        const geom = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 16);
        const mat = new THREE.MeshStandardMaterial({ color: color });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set((x - 3.5) * 2, 0.8, (z - 3.5) * 2);
        mesh.userData = { type: type };
        this.group.add(mesh);
    }

    triggerTestBattle() {
        // Simulate a capture event between a Pawn and a Queen
        if (this.onTriggerBattle) {
            this.onTriggerBattle('pawn', 'queen');
        }
    }

    destroy() {
        this.scene.remove(this.group);
    }
}
