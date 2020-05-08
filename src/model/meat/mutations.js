const {
    GraphQLID,
    GraphQLString
} = require('graphql')
const type = require('./type')
const Meat = require('./meat')

//Defines the mutations
module.exports = 
{
    addMeat: {
        type,
        args: {
            MeatName:       { type: GraphQLString }
        },
        resolve: Meat.createEntry.bind(Meat)
    },
    updateMeat: {
        type,
        args: {
            MeatId:         { type: GraphQLID },
            MeatName:       { type: GraphQLString }
        },
        resolve: Meat.updateEntry.bind(Meat)
    },
    deleteMeat: {
        type,
        args: {
            MeatId:         { type: GraphQLID }
        },
        resolve: Meat.deleteEntry.bind(Meat)
    }
}