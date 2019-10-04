#!node

const path = require('path');
const filename = path.resolve(__dirname, 'data/selected.json');
const fs = require('fs');

const selected = JSON.parse(fs.readFileSync(filename));

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
    if (book.tags.includes('bargain')) {
        groups.bargain[book.title] = book;
    } else if (is_childrens) {
        groups.children[book.title] = book;
    } else if (book.is_fiction) {
        groups.fiction[book.title] = book;
    } else {
        groups.nonfiction[book.title] = book;
    }
});

Object.keys(groups)
    .forEach(group => {
        const fullfile = path.resolve(__dirname, `data/${group}.json`);
        fs.writeFileSync(fullfile, JSON.stringify(Object.values(groups[group])));
    });
