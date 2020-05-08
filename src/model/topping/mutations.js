const {
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLString
} = require('graphql')
const type = require('./type')
const Topping = require('./topping')

//Defines the mutations
module.exports = 
{
    addTopping: {
        type,
        args: {
            ToppingName:        { type: GraphQLString },
            ToppingPrice:       { type: GraphQLInt },
            ToppingExtra:       { type: GraphQLBoolean  }
        },
        resolve: Topping.createEntry.bind(Topping)
    },
    updateTopping: {
        type,
        args: {
            ToppingId:          { type: GraphQLID },
            ToppingName:        { type: GraphQLString },
            ToppingPrice:       { type: GraphQLInt },
            ToppingExtra:       { type: GraphQLBoolean }
        },
        resolve: Topping.updateEntry.bind(Topping)
    },
    deleteTopping: {
        type,
        args: {
            ToppingId:          { type: GraphQLID}
        },
        resolve: Topping.deleteEntry.bind(Topping)
    }
}