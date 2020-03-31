const test = require('tape');
const app = require('./app');
const ratings = [
    {
    user_id: '360eb9e7-ee48-45cb-8391-3b5ff0fbd4ab',
    updated: '2019-07-25T17:58:20.356Z',

        recipe_id: '1b6dfeaf0988f96b187c7c9bb69a14fa',
    value: 0
}, {
        user_id: '360eb9e7-ee48-45cb-8391-3b5ff0fbd4ab',
        updated: '1995-07-25T17:58:20.356Z',
        recipe_id: 'd7167bbdf03eb4b786684ab6a81d52b4',
        value: 5
    }
];
test('app test', function (t) {
    t.plan(1);
    t.equal(app.get7NewRecipes(ratings)[0].recipe_id, 'd7167bbdf03eb4b786684ab6a81d52b4' );
});
