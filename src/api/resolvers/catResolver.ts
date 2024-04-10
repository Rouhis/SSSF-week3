// TODO: Add resolvers for cat
// 1. Queries
// 1.1. cats
// 1.2. catById
// 1.3. catsByOwner
// 1.4. catsByArea
// 2. Mutations
// 2.1. createCat
// 2.2. updateCat
// 2.3. deleteCat

import {GraphQLError} from 'graphql';
import {Cat} from '../../interfaces/Cat';
import catModel from '../models/catModel';

export default {
  Query: {
    cats: async (): Promise<Cat[]> => {
      return await catModel.find();
    },
    catById: async (_parent: undefined, args: {id: string}): Promise<Cat> => {
      const cat = await catModel.findById(args.id);
      if (!cat) {
        throw new GraphQLError('Cat not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return cat;
    },
    catsByOwner: async (
      _parent: undefined,
      args: {owner: string}
    ): Promise<Cat[]> => {
      return await catModel.find({owner: args.owner});
    },
    catsByArea: async (
      _parent: undefined,
      args: {location: {type: string; coordinates: number[]}}
    ): Promise<Cat[]> => {
      return await catModel.find({
        location: {
          $near: {
            $geometry: {
              type: args.location.type,
              coordinates: args.location.coordinates,
            },
            $maxDistance: 1000,
          },
        },
      });
    },
  },
  Mutation: {
    createCat: async (
      _parent: undefined,
      args: {cat: Omit<Cat, '_id'>}
    ): Promise<{message: string; cat?: Cat}> => {
      const cat = await catModel.create(args.cat);
      if (cat) {
        return {message: 'Cat added', cat};
      } else {
        return {message: 'Cat not added'};
      }
    },
    updateCat: async (
      _parent: undefined,
      args: {cat: Omit<Cat, '_id'>; id: string}
    ): Promise<{message: string; cat?: Cat}> => {
      const cat = await catModel.findByIdAndUpdate(args.id, args.cat, {
        new: true,
      });
      if (cat) {
        return {message: 'Cat updated', cat};
      } else {
        return {message: 'Cat not updated'};
      }
    },
    deleteCat: async (
      _parent: undefined,
      args: {id: string}
    ): Promise<{message: string; cat?: Cat}> => {
      const cat = await catModel.findByIdAndDelete(args.id);
      if (cat) {
        return {message: 'Cat deleted', cat};
      } else {
        return {message: 'Cat not deleted'};
      }
    },
  },
};
