import ChatBot from '@chat/ChatBot';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;

describe.only('ChatBot', function () {

    it('instantiates', function () {
        new ChatBot();
    });

    it('should add a question', function () {
        const chatbot = new ChatBot()
            .add('Q1', [() => true], 'Do you?');
        assert(chatbot instanceof ChatBot);
        // no whammy
    });

    it('should not double-add a question', function () {
        let caughtError;
        try {
            const chatbot = new ChatBot()
                .add('Q1', [() => true], 'Do you?')
                .add('Q1', [() => true], 'Dont you?');
        } catch (e) {
            caughtError = e;
        }
        assert(caughtError);
    });

    it('should ask a question', function () {
        let asked = false;
        const chatbot = new ChatBot()
            .add('Q1', [() => true], 'Do you?', () => { asked = true });
        chatbot.ask('Q1');
        assert(asked);
    });

    it('should fail to ask no-such-question', function () {
        const chatbot = new ChatBot();
        let caughtError;
        try {
            chatbot.ask('Q1');
        } catch (e) {
            caughtError = e;
        }
        assert(caughtError);
    });

    it('should tell if a question has been asked', function () {
        const chatbot = new ChatBot()
            .add('Q1', [() => true], 'Do you?')
            .add('Q2', [() => true], 'Dont you?');
        chatbot.ask('Q1');
        assert(chatbot.wasAsked('Q1'));
        assert(!chatbot.wasAsked('Q2'));
    });

    it('should give unasked questions', function () {
        const chatbot = new ChatBot()
            .add('Q1', [() => true], 'Do you?')
            .add('Q2', [() => true], 'Dont you?');
        chatbot.ask('Q1');
        const unasked = chatbot.getUnasked();
        equal(1, unasked.length);
        equal('Q2', unasked[0].code);
        equal('Dont you?', unasked[0].question);
    });

    it('should give questions conditionally', function () {
        const chatbot = new ChatBot()
            .add('Q1', [() => false], 'Do you?')
            .add('Q2', [() => true], 'Dont you?')
            .add('Q3', [() => true, () => false], 'Did you?');
        const unasked = chatbot.getUnasked();
        equal(1, unasked.length);
        equal('Q2', unasked[0].code);
        equal('Dont you?', unasked[0].question);
    });

    it('should give this unasked question only after this other question is asked', function () {
        const chatbot = new ChatBot()
            .add('Q1', [], 'Do you?')
            .add('Q2', [() => chatbot.wasAsked('Q1')], 'Dont you?');
        const unasked1 = chatbot.getUnasked();
        equal(1, unasked1.length);
        equal('Q1', unasked1[0].code);
        chatbot.ask('Q1');
        const unasked2 = chatbot.getUnasked();
        equal(1, unasked2.length);
        equal('Q2', unasked2[0].code);
    });

    it('should get list of asked codes', function () {
        const chatbot = new ChatBot()
            .add('Q1', [() => true], 'Do you?')
            .add('Q2', [() => true], 'Dont you?');
        chatbot.ask('Q1');
        const asked = chatbot.getAskedCodes();
        equal(1, asked.length);
        equal('Q1', asked[0]);
    });

    it('should instantiate with list of asked codes', function () {
        const chatbot = new ChatBot({askedCodes: ['Q1']})
            .add('Q1', [() => true], 'Do you?')
            .add('Q2', [() => true], 'Dont you?');
        assert(chatbot.wasAsked('Q1'));
        assert(!chatbot.wasAsked('Q2'));
    });
});
