#!node

const path = require('path');
const filename = path.resolve(__dirname, 'data/selected.json');
const fs = require('fs');

const selected = JSON.parse(fs.readFileSync(filename));

const slimBook = function (book) {
    const {
        title,
        isbn,
        url,
        image,
        by,
        dimensions,
        published_at,
        prices,
    } = book;
    return {
        title,
        isbn,
        url,
        image,
        by,
        dimensions,
        published_at,
        prices,
    };
};

const groups = {
    bargain: {},
    fiction: {},
    nonfiction: {},
    children: {},
};

selected.forEach(book => {
    const categories = book.categories.join('; ');
    const is_childrens = /children/i.test(categories)
        && !/studies/i.test(categories)
        && !/adult/i.test(categories);
    const slim = slimBook(book);
    if (book.tags.includes('bargain')) {
        groups.bargain[book.title] = slim;
    } else if (is_childrens) {
        groups.children[book.title] = slim;
    } else if (book.is_fiction) {
        groups.fiction[book.title] = slim;
    } else {
        groups.nonfiction[book.title] = slim;
    }
});

Object.keys(groups)
    .forEach(group => {
        const fullfile = path.resolve(__dirname, `data/${group}.json`);
        fs.writeFileSync(fullfile, JSON.stringify(Object.values(groups[group])));
    });
