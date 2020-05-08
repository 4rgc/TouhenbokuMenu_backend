const {
    GraphQLString,
    GraphQLID
} = require('graphql')
const type = require('./type')
const Noodle = require('./noodle')

//Defines the mutations
module.exports = 
{
    addNoodle: {
        type,
        args: {
            NoodleName:     { type: GraphQLString }
        },
        resolve: Noodle.createEntry.bind(Noodle)
    },
    updateNoodle: {
        type,
        args: {
            NoodleId:       { type: GraphQLID },
            NoodleName:     { type: GraphQLString }
        },
        resolve: Noodle.updateEntry.bind(Noodle)
    },
    deleteNoodle: {
        type,
        args: {
            NoodleId:       { type: GraphQLID }
        },
        resolve: Noodle.deleteEntry.bind(Noodle)
    }
}