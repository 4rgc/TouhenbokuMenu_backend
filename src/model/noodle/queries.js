const { 
        GraphQLList,
        GraphQLID,
        GraphQLString 
} = require('graphql')
const type = require('./type')
const Noodle = require('./noodle')

// Defines the queries
module.exports = 
{
    Noodles: {
        type: new GraphQLList(type),
        args: {
            NoodleName: { type: GraphQLString }
        },
        resolve: Noodle.findMatching.bind(Noodle)
    },
    Noodle: {
        type,
        args: {
            NoodleId: { type: GraphQLID }
        },
        resolve: Noodle.getByID.bind(Noodle)
    }
}