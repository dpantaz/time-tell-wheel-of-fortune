/**
 * Wheel of Fortune - spinning wheel with canvas
 */
class WheelOfFortune {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 180;
        
        this.segments = [
            { label: '100', value: 100, color: '#e74c3c' },
            { label: '200', value: 200, color: '#3498db' },
            { label: '300', value: 300, color: '#2ecc71' },
            { label: '400', value: 400, color: '#f39c12' },
            { label: '500', value: 500, color: '#9b59b6' },
            { label: '100', value: 100, color: '#1abc9c' },
            { label: '200', value: 200, color: '#e67e22' },
            { label: '300', value: 300, color: '#2980b9' },
            { label: 'ΧΡΕΟΚΟΠΙΑ', value: -1, color: '#2c3e50' },
            { label: '400', value: 400, color: '#27ae60' },
            { label: '500', value: 500, color: '#8e44ad' },
            { label: '200', value: 200, color: '#d35400' },
        ];
        
        this.currentAngle = 0;
        this.isSpinning = false;
        this.onSpinComplete = null;
        
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const segmentAngle = (2 * Math.PI) / this.segments.length;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw segments
        for (let i = 0; i < this.segments.length; i++) {
            const startAngle = this.currentAngle + i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            
            // Segment fill
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.centerY);
            ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = this.segments[i].color;
            ctx.fill();
            
            // Segment border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Label
            ctx.save();
            ctx.translate(this.centerX, this.centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = this.segments[i].value === -1 ? 'bold 11px sans-serif' : 'bold 18px sans-serif';
            ctx.fillText(this.segments[i].label, this.radius - 20, 5);
            ctx.restore();
        }
        
        // Center circle
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        
        // Random spin: 3-6 full rotations + random offset
        const totalRotation = (3 + Math.random() * 3) * 2 * Math.PI + Math.random() * 2 * Math.PI;
        const duration = 4000;
        const startAngle = this.currentAngle;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            this.currentAngle = startAngle + totalRotation * eased;
            
            this.draw();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                const result = this.getSelectedSegment();
                if (this.onSpinComplete) {
                    this.onSpinComplete(result);
                }
            }
        };
        
        requestAnimationFrame(animate);
    }

    getSelectedSegment() {
        // The pointer is at the top (270 degrees or -PI/2)
        const segmentAngle = (2 * Math.PI) / this.segments.length;
        // Normalize angle - pointer at top means we check which segment is at -PI/2
        const pointerAngle = -Math.PI / 2;
        const normalizedAngle = ((pointerAngle - this.currentAngle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const index = Math.floor(normalizedAngle / segmentAngle);
        return this.segments[index];
    }
}
