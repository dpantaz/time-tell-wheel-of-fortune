/**
 * Bilingual time conversion (Greek & English)
 */
const TimeWords = {
    el: {
        hours: {
            1: 'μία', 2: 'δύο', 3: 'τρεις', 4: 'τέσσερις',
            5: 'πέντε', 6: 'έξι', 7: 'εφτά', 8: 'οχτώ',
            9: 'εννιά', 10: 'δέκα', 11: 'έντεκα', 12: 'δώδεκα'
        },
        minutes: {
            0: '', 1: 'ένα', 2: 'δύο', 3: 'τρία', 4: 'τέσσερα',
            5: 'πέντε', 6: 'έξι', 7: 'εφτά', 8: 'οχτώ', 9: 'εννιά',
            10: 'δέκα', 11: 'έντεκα', 12: 'δώδεκα', 13: 'δεκατρία',
            14: 'δεκατέσσερα', 15: 'δεκαπέντε', 16: 'δεκαέξι',
            17: 'δεκαεφτά', 18: 'δεκαοχτώ', 19: 'δεκαεννιά',
            20: 'είκοσι', 21: 'είκοσι ένα', 22: 'είκοσι δύο',
            23: 'είκοσι τρία', 24: 'είκοσι τέσσερα', 25: 'είκοσι πέντε',
            26: 'είκοσι έξι', 27: 'είκοσι εφτά', 28: 'είκοσι οχτώ',
            29: 'είκοσι εννιά', 30: 'τριάντα', 31: 'τριάντα ένα',
            32: 'τριάντα δύο', 33: 'τριάντα τρία', 34: 'τριάντα τέσσερα',
            35: 'τριάντα πέντε', 36: 'τριάντα έξι', 37: 'τριάντα εφτά',
            38: 'τριάντα οχτώ', 39: 'τριάντα εννιά', 40: 'σαράντα',
            41: 'σαράντα ένα', 42: 'σαράντα δύο', 43: 'σαράντα τρία',
            44: 'σαράντα τέσσερα', 45: 'σαράντα πέντε', 46: 'σαράντα έξι',
            47: 'σαράντα εφτά', 48: 'σαράντα οχτώ', 49: 'σαράντα εννιά',
            50: 'πενήντα', 51: 'πενήντα ένα', 52: 'πενήντα δύο',
            53: 'πενήντα τρία', 54: 'πενήντα τέσσερα', 55: 'πενήντα πέντε',
            56: 'πενήντα έξι', 57: 'πενήντα εφτά', 58: 'πενήντα οχτώ',
            59: 'πενήντα εννιά'
        },
        toWords(hours, minutes) {
            if (minutes === 0) return `${this.hours[hours]} ακριβώς`;
            if (minutes === 30) return `${this.hours[hours]} και μισή`;
            if (minutes === 15) return `${this.hours[hours]} και τέταρτο`;
            if (minutes === 45) {
                const next = hours === 12 ? 1 : hours + 1;
                return `${this.hours[next]} παρά τέταρτο`;
            }
            if (minutes <= 30) {
                return `${this.hours[hours]} και ${this.minutes[minutes]}`;
            }
            const next = hours === 12 ? 1 : hours + 1;
            const remaining = 60 - minutes;
            return `${this.hours[next]} παρά ${this.minutes[remaining]}`;
        }
    },

    en: {
        hours: {
            1: 'one', 2: 'two', 3: 'three', 4: 'four',
            5: 'five', 6: 'six', 7: 'seven', 8: 'eight',
            9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve'
        },
        minutes: {
            0: '', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
            5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
            10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen',
            14: 'fourteen', 15: 'fifteen', 16: 'sixteen',
            17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
            20: 'twenty', 21: 'twenty-one', 22: 'twenty-two',
            23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
            26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight',
            29: 'twenty-nine', 30: 'thirty', 31: 'thirty-one',
            32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four',
            35: 'thirty-five', 36: 'thirty-six', 37: 'thirty-seven',
            38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
            41: 'forty-one', 42: 'forty-two', 43: 'forty-three',
            44: 'forty-four', 45: 'forty-five', 46: 'forty-six',
            47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine',
            50: 'fifty', 51: 'fifty-one', 52: 'fifty-two',
            53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
            56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight',
            59: 'fifty-nine'
        },
        toWords(hours, minutes) {
            if (minutes === 0) return `${this.hours[hours]} o'clock`;
            if (minutes === 30) return `half past ${this.hours[hours]}`;
            if (minutes === 15) return `quarter past ${this.hours[hours]}`;
            if (minutes === 45) {
                const next = hours === 12 ? 1 : hours + 1;
                return `quarter to ${this.hours[next]}`;
            }
            if (minutes <= 30) {
                return `${this.minutes[minutes]} past ${this.hours[hours]}`;
            }
            const next = hours === 12 ? 1 : hours + 1;
            const remaining = 60 - minutes;
            return `${this.minutes[remaining]} to ${this.hours[next]}`;
        }
    },

    toDigits(hours, minutes) {
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        return `${h}:${m}`;
    },

    toWords(lang, hours, minutes) {
        return this[lang].toWords(hours, minutes);
    }
};
