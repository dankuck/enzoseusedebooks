/**
 |------------------------
 | doorAnswerPhrases.js
 |------------------------
 | Call pull() to get a random phrase that a robot might use when traveling to
 | a door to answer it. It cycles and uses math to make it unlikely that you'll
 | get the same phrase twice in a short succession.
 */
export default {
    pool: [
        "I'm coming!",
        "Hold your electric sheep!",
        "Don't get your wires in a knot!",
        "Keep your chassis on!",
        "I'm going as fast as my servos will work!",
        "Calm down, these books aren't going anywhere!",
        "Alan Turing's Ghost! What's your hurry?",
    ],
    used: [],
    pull() {
        if (this.pool.length === 0) {
            this.pool = this.used;
            this.used = [];
        }
        const {pool, used} = this;
        // We want to favor the first half of the list so that it's less likely
        // that you'll get the same phrase twice in a row at the moment the
        // pool gets refilled. That's why we use random * random. In a list of
        // 10, it gave the following distribution one time:
        // [32%, 18%, 14%, 11%, 9%, 7%, 4%, 4%, 1%, <1%]
        const [chosen] = pool.splice(Math.floor(Math.random() * Math.random() * pool.length), 1);
        used.push(chosen);
        return chosen;
    },
};
