let {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID
} = require('graphql')

//Defines the type
module.exports = new GraphQLObjectType({
    name: 'Noodle',
    description: 'A noodle',
    fields: {
        NoodleId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        NoodleName: {
            type: GraphQLString
        }
    }
})