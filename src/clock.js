/**
 * Display-only analog clock (no dragging)
 */
class AnalogClock {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.hourHand = document.getElementById('hour-hand');
        this.minuteHand = document.getElementById('minute-hand');
        
        this.hours = 12;
        this.minutes = 0;
        
        this.centerX = 200;
        this.centerY = 200;
        
        this.init();
    }

    init() {
        this.drawMarkers();
    }

    drawMarkers() {
        const hourMarkersGroup = document.getElementById('hour-markers');
        const minuteMarkersGroup = document.getElementById('minute-markers');

        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            
            const numRadius = 155;
            const nx = this.centerX + numRadius * Math.cos(angle);
            const ny = this.centerY + numRadius * Math.sin(angle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', nx);
            text.setAttribute('y', ny);
            text.setAttribute('class', 'hour-number');
            text.textContent = i;
            hourMarkersGroup.appendChild(text);

            const markerInner = 170;
            const markerOuter = 180;
            const x1 = this.centerX + markerInner * Math.cos(angle);
            const y1 = this.centerY + markerInner * Math.sin(angle);
            const x2 = this.centerX + markerOuter * Math.cos(angle);
            const y2 = this.centerY + markerOuter * Math.sin(angle);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('class', 'hour-marker');
            hourMarkersGroup.appendChild(line);
        }

        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) continue;
            const angle = (i * 6 - 90) * Math.PI / 180;
            const markerInner = 175;
            const markerOuter = 180;
            const x1 = this.centerX + markerInner * Math.cos(angle);
            const y1 = this.centerY + markerInner * Math.sin(angle);
            const x2 = this.centerX + markerOuter * Math.cos(angle);
            const y2 = this.centerY + markerOuter * Math.sin(angle);
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', x2);
            line.setAttribute('y2', y2);
            line.setAttribute('class', 'minute-marker');
            minuteMarkersGroup.appendChild(line);
        }
    }

    updateHourHand() {
        const angle = ((this.hours % 12) * 30 + this.minutes * 0.5 - 90) * Math.PI / 180;
        const length = 90;
        const x2 = this.centerX + length * Math.cos(angle);
        const y2 = this.centerY + length * Math.sin(angle);
        this.hourHand.setAttribute('x2', x2);
        this.hourHand.setAttribute('y2', y2);
    }

    updateMinuteHand() {
        const angle = (this.minutes * 6 - 90) * Math.PI / 180;
        const length = 130;
        const x2 = this.centerX + length * Math.cos(angle);
        const y2 = this.centerY + length * Math.sin(angle);
        this.minuteHand.setAttribute('x2', x2);
        this.minuteHand.setAttribute('y2', y2);
    }

    setTime(hours, minutes) {
        this.hours = hours;
        this.minutes = minutes;
        this.updateHourHand();
        this.updateMinuteHand();
    }

    setRandomTime() {
        this.hours = Math.floor(Math.random() * 12) + 1;
        this.minutes = Math.floor(Math.random() * 12) * 5;
        this.updateHourHand();
        this.updateMinuteHand();
    }

    getTime() {
        return { hours: this.hours, minutes: this.minutes };
    }
}
