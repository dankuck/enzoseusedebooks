import sizeText from '@libs/sizeText';
import assert from 'assert';
const {deepStrictEqual: equal} = assert;

describe('sizeText', function () {

    it('should not format short text', function () {
        equal('ohai', sizeText('ohai', 10));
    });

    it('trims leading and trailing text', function () {
        equal('ohai', sizeText(' ohai ', 10));
    });

    it('does not count leading and trailing text', function () {
        equal('hello world', sizeText(' hello world ', 11));
    });

    it('breaks long text', function () {
        equal("hello\nworld", sizeText('hello world', 5));
    });

    it('retains existing newlines', function () {
        equal("hello\nworld", sizeText("hello\nworld", 10));
    });

    it('does not break short words', function () {
        equal(
            "the rain\nin spain\nfalls\nmainly on\nthe plain",
            sizeText('the rain in spain falls mainly on the plain', 10)
        );
    });

    it('hyphenates and breaks long words', function () {
        equal("abcdefghi-\njlkmnopqr-\nstuvwxyz", sizeText('abcdefghijlkmnopqrstuvwxyz', 10));
    });

    it('puts long, broken words on their own lines, then leads into next line', function () {
        equal("the\nabcdefghi-\njklmnopqr-\nstuvwx of\nlife", sizeText('the abcdefghijklmnopqrstuvwx of life', 10));
    });

    it('dies on length less than 2', function () {
        try {
            sizeText('', 1);
        } catch (e) {
            assert(true);
            return;
        }
        assert(false);
    });

    it('restricts line count', function () {
        equal(
            "hello\nmudder\nhello\nfadder",
            sizeText(
                "hello\nmudder\nhello\nfadder\nbut not hello brother or sister",
                Infinity,
                4
            )
        );
    });

    describe('with random sentences', function () {

        const words = [
            'adorn', 'adulterine', 'adumbrant', 'advolution', 'advowtry',
            'adz', 'aerogun', 'afforce', 'affreight', 'aftward', 'agama',
            'agent', 'aggregation', 'aggry', 'agile', 'aglow', 'agnail',
            'agnus', 'agony', 'air brush', 'akinesia', 'alacrity',
            'albigenses', 'albumenize', 'alcoholometrical', 'alcoholometry',
            'aleurone', 'alewife', 'algal', 'algous', 'alible', 'alimentary',
            'alinasal', 'aliquant', 'alkalifiable', 'alkarsin',
        ];
        const longestWordSize = words.reduce((size, word) => size > word.length ? size : word.length, 0);
        const shortestWordSize = words.reduce((size, word) => size < word.length ? size : word.length, Infinity);
        const randomWord = () => words[Math.floor(Math.random() * words.length)];
        const makeSentence = function () {
            const count = Math.random() * words.length;
            let sentence = '';
            for (let i = 0; i < count; i++) {
                sentence += ' ' + randomWord();
            }
            return sentence.trim();
        };

        it('always stays within line length', function () {

            for (let i = 0; i < 10; i++) {
                const lineLength = Math.floor(Math.random() * (longestWordSize - 2)) + 2;
                const formatted = sizeText(makeSentence(), lineLength);
                const lines = formatted.split(/\n/);
                lines.forEach(line => assert(line.length <= lineLength, `Bad result: ${formatted}`));
            }
        });

        it('always stays within line count', function () {

            for (let i = 0; i < 10; i++) {
                const lineCount = Math.floor(Math.random() * 2) + 1;
                const formatted = sizeText(makeSentence(), 10, lineCount);
                const newlines = formatted.replace(/[^\n]/g, '');
                assert(newlines.length <= lineCount, `${newlines} ${newlines.length} > ${lineCount}`);
            }
        });
    });
});
