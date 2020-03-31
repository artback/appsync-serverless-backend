const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB();
const wa = require("weighted-arrays");
const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];
exports.handler = (event, context, callback) => {
    get7Recipes(event.user_id, event["year_week"], callback).then();
};
const get7Recipes = async (user, year_week, callback) => {
    const weekList = await getWeekList(user, year_week).catch(err => callback('Weeklist error: ' + err));
    if (weekList.length > 0) {
        callback(null, weekList);
    }
    const ratings = await getRatings(user).catch(err => callback('Ratings error' + err));
    if (ratings.length > 0) {
        const new_recipes = get7NewRecipes(ratings);
        callback(null, new_recipes);
    } else {
        callback("User have no ratings", null);
    }
};

const getWeightBasedOnDaysAndValue = obj => {
    const daysAgo = new Date(Date.now() - new Date(obj.updated)).getDay();
    return obj.value + daysAgo;
};
const get7NewRecipes = ratings => {
    let randomizedWeekList = [];
    while (randomizedWeekList.length < 7) {
        const random = wa.random([...ratings], getWeightBasedOnDaysAndValue);
        random.weekday = weekDays[randomizedWeekList.length];
        randomizedWeekList.push(Object.assign({}, random));
        random.updated = new Date().toISOString();
    }
    return randomizedWeekList;
};

const getWeekList = async (user, year_week) => {
    const params = {
        ExpressionAttributeValues: {
            ":us": {
                S: user
            },
            ":yw": {
                S: year_week
            }
        },
        KeyConditionExpression: "user_id = :us AND year_week = :yw",
        TableName: process.env.MenuTable
    };
    return dynamo.query(params).promise().then(obj => obj.Items);
};
const getRatings = async user => {
    const params = {
        ExpressionAttributeValues: {
            ":us": {
                S: user
            }
        },
        KeyConditionExpression: "user_id = :us",
        TableName: process.env.RatingTable
    };
    return dynamo.query(params).promise().then(obj => obj.Items.map(
        item => AWS.DynamoDB.Converter.unmarshall(item)
    ));
};
