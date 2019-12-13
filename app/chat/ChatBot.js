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
        this.askedCodesThisSession = [];
        Object.assign(this, data);
    }

    add(code, text, conditions = [], onAsk = null) {
        if (this.questions[code]) {
            throw new Error(`${code} has already been added`);
        }
        const noAutoConditions = conditions
            .reduce((acc, condition) => acc || condition.noAutoConditions, false);
        // The until-self-is-asked condition is implied, so we auto-add it for
        // ease-of-use. That is except under certain conditions such as the
        // `always`  and `everySession` conditions.
        if (!noAutoConditions) {
            conditions.push(ChatBot.until(code));
        }
        this.questions[code] = {
            onAsk,
            code,
            text,
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
        this.askedCodesThisSession.push(code);
        question.onAsk && question.onAsk();
    }

    wasAsked(code) {
        return this.askedCodes.includes(code);
    }

    wasAskedThisSession(code) {
        return this.askedCodesThisSession.includes(code);
    }

    choose() {
        return Object.values(this.questions)
            .filter(question => {
                return question.conditions.reduce((met, condition) => met && condition(this, question.code), true);
            });
    }
};

/**
 * Builds a condition that only returns true after another given question has
 * been asked.
 * @param  {string} code The code of the question that must be asked first
 * @return {Function}
 */
ChatBot.after = function after(code) {
    return chatbot => chatbot.wasAsked(code);
};

/**
 * Builds a condition that returns true only until another given question has
 * been asked.
 * @param  {string} code The code of the question
 * @return {Function}
 */
ChatBot.until = function until(code) {
    return chatbot => ! chatbot.wasAsked(code);
};

/**
 * Builds a special-case condition that ensures this question doesn't
 * disappear after it is asked.
 * @return {Function}
 */
ChatBot.always = function always() {
    const always = () => true;
    always.noAutoConditions = true;
    return always;
};

/**
 * Builds a special-case condition that ensures this question will appear again
 * after being asked as long as a new session has been started.
 * @return {Function}
 */
ChatBot.everySession = function everySession() {
    const everySession = (chatbot, code) => ! chatbot.wasAskedThisSession(code);
    everySession.noAutoConditions = true;
    return everySession;
};
