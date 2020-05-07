const { GraphQLObjectType } = require('graphql')
const soupMutations = require('../model/soup/mutations')
const noodleMutations = require('../model/noodle/mutations')

module.exports = new GraphQLObjectType({
    name: 'RootMutationsType',
    fields: {
        addSoup: soupMutations.addSoup,
        updateSoup: soupMutations.updateSoup,
        deleteSoup: soupMutations.deleteSoup,
        addNoodle: noodleMutations.addNoodle,
        updateNoodle: noodleMutations.updateNoodle,
        deleteNoodle: noodleMutations.deleteNoodle
    }
})