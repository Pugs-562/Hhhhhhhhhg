class BattleArena {
    constructor(scene, attackerType, defenderType, onComplete) {
        this.scene = scene;
        this.attackerType = attackerType;
        this.defenderType = defenderType;
        this.onComplete = onComplete;
        this.group = new THREE.Group();
        this.fighters = [];
    }

    init() {
        // Build Mini Arena Environment
        const floorGeo = new THREE.PlaneGeometry(20, 20);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x34495e });
        this.floor = new THREE.Mesh(floorGeo, floorMat);
        this.floor.rotation.x = -Math.PI / 2;
        this.group.add(this.floor);

        // Ambient Arena Light
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(5, 10, 5);
        this.group.add(this.light);

        // Create Attacker and Defender 3D placeholders
        this.attackerMesh = this.createFighterMesh(this.attackerType, -3, 0);
        this.defenderMesh = this.createFighterMesh(this.defenderType, 3, 0);

        this.scene.add(this.group);
    }

    createFighterMesh(type, x, z) {
        const config = SkinRegistry.pieces[type] || SkinRegistry.pieces.pawn;
        const geom = new THREE.BoxGeometry(1, config.scale * 2, 1);
        const mat = new THREE.MeshStandardMaterial({ color: config.color });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(x, config.scale, z);
        this.group.add(mesh);
        return mesh;
    }

    update(controls, delta) {
        // Simple mock loop for active battle movement
        if (this.attackerMesh) {
            this.attackerMesh.position.x += controls.moveVector.x * 0.1;
            this.attackerMesh.position.z += controls.moveVector.y * 0.1;
        }

        // Check for basic attack trigger simulation
        if (controls.actions.attack) {
            // Trigger quick win condition for testing transition back to chess
            setTimeout(() => this.endBattle(this.attackerType), 1000);
        }
    }

    endBattle(winner) {
        this.scene.remove(this.group);
        if (this.onComplete) this.onComplete(winner);
    }
}
