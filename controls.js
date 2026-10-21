class Controls {
    constructor() {
        this.moveVector = { x: 0, y: 0 };
        this.lookDelta = { x: 0, y: 0 };
        this.actions = { attack: false, dodge: false, abil1: false, abil2: false };
        
        this.initJoystick();
        this.initLookDrag();
        this.initButtons();
    }

    initJoystick() {
        const base = document.getElementById('joystick-base');
        const stick = document.getElementById('joystick-stick');
        let active = false;
        let centerX = 0, centerY = 0;

        base.addEventListener('pointerdown', (e) => {
            active = true;
            const rect = base.getBoundingClientRect();
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
        });

        window.addEventListener('pointermove', (e) => {
            if (!active) return;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const dist = Math.min(50, Math.sqrt(dx * dx + dy * dy));
            const angle = Math.atan2(dy, dx);

            const moveX = Math.cos(angle) * dist;
            const moveY = Math.sin(angle) * dist;

            stick.style.transform = `translate(${moveX}px, ${moveY}px)`;
            this.moveVector.x = moveX / 50;
            this.moveVector.y = moveY / 50;
        });

        window.addEventListener('pointerup', () => {
            if (!active) return;
            active = false;
            stick.style.transform = `translate(0px, 0px)`;
            this.moveVector.x = 0;
            this.moveVector.y = 0;
        });
    }

    initLookDrag() {
        const lookZone = document.getElementById('look-zone');
        let dragging = false;
        let lastX = 0, lastY = 0;

        lookZone.addEventListener('pointerdown', (e) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        window.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            this.lookDelta.x = e.clientX - lastX;
            this.lookDelta.y = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        window.addEventListener('pointerup', () => {
            dragging = false;
            this.lookDelta.x = 0;
            this.lookDelta.y = 0;
        });
    }

    initButtons() {
        const bindBtn = (id, actionName) => {
            const btn = document.getElementById(id);
            btn.addEventListener('pointerdown', () => { this.actions[actionName] = true; });
            btn.addEventListener('pointerup', () => { this.actions[actionName] = false; });
        };

        bindBtn('btn-attack', 'attack');
        bindBtn('btn-dodge', 'dodge');
        bindBtn('btn-abil1', 'abil1');
        bindBtn('btn-abil2', 'abil2');
    }

    consumeLook() {
        const delta = { ...this.lookDelta };
        this.lookDelta.x = 0;
        this.lookDelta.y = 0;
        return delta;
    }
}
