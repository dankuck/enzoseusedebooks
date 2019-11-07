/**
 |----------------------------
 | ChatBot
 |----------------------------
 | A class that holds questions that can be asked and helps to show only the
 | ones that are ready to be asked.
 */

export default class ChatBot {

    constructor(data = {}) {
        this.questions = {};
        this.askedCodes = [];
        Object.assign(this, data);
    }

    add(code, conditions, question, onAsk) {
        if (this.questions[code]) {
            throw new Error(`${code} has already been added`);
        }
        this.questions[code] = {
            onAsk,
            code,
            question,
            conditions,
        };
        return this;
    }

    ask(code) {
        const question = this.questions[code];
        if (!question) {
            throw new Error(`Not found: ${code}`);
        }
        this.askedCodes.push(code);
        question.onAsk && question.onAsk();
    }

    wasAsked(code) {
        return this.askedCodes.includes(code);
    }

    choose() {
        return Object.values(this.questions)
            .filter(question => ! this.wasAsked(question.code))
            .filter(question => {
                return question.conditions.reduce((met, condition) => met && condition(), true);
            });
    }

    getAskedCodes() {
        return Object.values(this.questions)
            .filter(question => this.wasAsked(question.code))
            .map(question => question.code);
    }
};
