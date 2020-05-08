const { GraphQLObjectType } = require('graphql')
const soupMutations = require('../model/soup/mutations')
const noodleMutations = require('../model/noodle/mutations')
const seasoningMutations = require('../model/seasoning/mutations')
const meatMutations = require('../model/meat/mutations')
const toppingMutations = require('../model/topping/mutations')

module.exports = new GraphQLObjectType({
    name: 'RootMutationsType',
    fields: {
        addSoup: soupMutations.addSoup,
        updateSoup: soupMutations.updateSoup,
        deleteSoup: soupMutations.deleteSoup,
        addNoodle: noodleMutations.addNoodle,
        updateNoodle: noodleMutations.updateNoodle,
        deleteNoodle: noodleMutations.deleteNoodle,
        addSeasoning: seasoningMutations.addSeasoning,
        updateSeasoning: seasoningMutations.updateSeasoning,
        deleteSeasoning: seasoningMutations.deleteSeasoning,
        addMeat: meatMutations.addMeat,
        updateMeat: meatMutations.updateMeat,
        deleteMeat: meatMutations.deleteMeat,
        addTopping: toppingMutations.addTopping,
        updateTopping: toppingMutations.updateTopping,
        deleteTopping: toppingMutations.deleteTopping
    }
})