import ChatBot from '@chat/ChatBot';
import assert from 'assert';
const {
    deepStrictEqual: equal,
    notDeepStrictEqual: notEqual,
} = assert;
const assertException = function (cb) {
    let caught;
    try {
        cb();
    } catch (e) {
        caught = e;
    }
    assert(caught, 'Expected an exception, but no exception was thrown');
};

describe('ChatBot', function () {

    it('instantiates', function () {
        new ChatBot();
    });

    it('should add a question', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?');
        assert(chatbot instanceof ChatBot);
        // no whammy
    });

    it('should not double-add a question', function () {
        let caughtError;
        assertException(() => {
            new ChatBot()
                .add('Q1', 'Do you?')
                .add('Q1', 'Dont you?');
        });
    });

    it('should ask a question', function () {
        let asked = false;
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?', [], () => asked = true);
        chatbot.ask('Q1');
        assert(asked);
    });

    it('should fail to ask no-such-question', function () {
        const chatbot = new ChatBot();
        assertException(() => {
            chatbot.ask('Q1');
        });
    });

    it('should tell if a question has been asked', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?');
        chatbot.ask('Q1');
        assert(chatbot.wasAsked('Q1'));
        assert(!chatbot.wasAsked('Q2'));
    });

    it('should give unasked questions', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?');
        chatbot.ask('Q1');
        const unasked = chatbot.choose();
        equal(1, unasked.length);
        equal('Q2', unasked[0].code);
        equal('Dont you?', unasked[0].text);
    });

    it('should give questions conditionally', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?', [() => false])
            .add('Q2', 'Dont you?', [() => true])
            .add('Q3', 'Did you?', [() => true, () => false]);
        const unasked = chatbot.choose();
        equal(1, unasked.length);
        equal('Q2', unasked[0].code);
        equal('Dont you?', unasked[0].text);
    });

    it('should give chatbot to the condition callback', function () {
        let caughtBot;
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?', [chatbot => caughtBot = chatbot]);
        chatbot.choose();
        assert(caughtBot === chatbot);
    });

    it('should give this unasked question only after this other question is asked', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?', [() => chatbot.wasAsked('Q1')]);
        const unasked1 = chatbot.choose();
        equal(1, unasked1.length);
        equal('Q1', unasked1[0].code);
        chatbot.ask('Q1');
        const unasked2 = chatbot.choose();
        equal(1, unasked2.length);
        equal('Q2', unasked2[0].code);
    });

    it('should get list of asked codes', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?');
        chatbot.ask('Q1');
        const asked = chatbot.getAskedCodes();
        equal(1, asked.length);
        equal('Q1', asked[0]);
    });

    it('should instantiate with list of asked codes', function () {
        const chatbot = new ChatBot({askedCodes: ['Q1']})
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?');
        assert(chatbot.wasAsked('Q1'));
        assert(!chatbot.wasAsked('Q2'));
    });

    it('should update the codes array it is given', function () {
        const askedCodes = [];
        const chatbot = new ChatBot({askedCodes})
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?');
        chatbot.ask('Q1');
        assert(askedCodes.length === 1);
        assert(askedCodes[0] === 'Q1');
    });

    it('should build an "after" callback', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?');
        chatbot.ask('Q1');
        const after = ChatBot.after('Q1');
        assert(after(chatbot));
    });

    it('should use an "after" callback', function () {
        const chatbot = new ChatBot()
            .add('Q1', 'Do you?')
            .add('Q2', 'Dont you?', [ChatBot.after('Q1')]);
        chatbot.ask('Q1');
        const questions = chatbot.choose();
        assert(questions.length === 1);
        assert(questions[0].code === 'Q2');
    });

});
