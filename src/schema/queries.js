const { GraphQLObjectType } = require('graphql')
const soupQueries = require('../model/soup/queries')
const noodleQueries = require('../model/noodle/queries')
const seasoningQueries = require('../model/seasoning/queries')
const meatQueries = require('../model/meat/queries')
const toppingQueries = require('../model/topping/queries')

module.exports = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Soup: soupQueries.Soup,
        Soups: soupQueries.Soups,
        Noodle: noodleQueries.Noodle,
        Noodles: noodleQueries.Noodles,
        Seasoning: seasoningQueries.Seasoning,
        Seasonings: seasoningQueries.Seasonings,
        Meat: meatQueries.Meat,
        Meats: meatQueries.Meats,
        Topping: toppingQueries.Topping,
        Toppings: toppingQueries.Toppings
    }
})