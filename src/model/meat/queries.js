const {
    GraphQLID,
    GraphQLString,
    GraphQLList
} = require('graphql')
const type = require('./type')
const Meat = require('./meat')

// Defines the queries
module.exports = 
{
    Meats: {
        type: new GraphQLList(type),
        args: {
            MeatName:       { type: GraphQLString }
        },
        resolve: Meat.findMatching.bind(Meat)
    },
    Meat: {
        type,
        args: {
            MeatId:         { type: GraphQLID }
        },
        resolve: Meat.getByID.bind(Meat)
    }
}