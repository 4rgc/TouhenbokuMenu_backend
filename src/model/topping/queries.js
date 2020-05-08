const {
    GraphQLList,
    GraphQLID,
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt
} = require('graphql')
const type = require('./type')
const Topping = require('./topping')

//Defines the queries
module.exports = 
{
    Toppings: {
        type: new GraphQLList(type),
        args: {
            ToppingName:        { type: GraphQLString },
            ToppingPrice:       { type: GraphQLInt },
            ToppingExtra:       { type: GraphQLBoolean }
        },
        resolve: Topping.findMatching.bind(Topping)
    },
    Topping: {
        type,
        args: {
            ToppingId:          { type: GraphQLID }
        },
        resolve: Topping.getByID.bind(Topping)
    }
}