// TODO: Add resolvers for user
// 1. Queries
// 1.1. users
// 1.2. userById
// 2. Mutations
// 2.1. createUser
// 2.2. updateUser
// 2.3. deleteUser

import {GraphQLError} from 'graphql';

import userModel from '../models/userModel';
import {User} from '../../interfaces/User';

export default {
  Query: {
    users: async (): Promise<User[]> => {
      return await userModel.find();
    },
    userById: async (_parent: undefined, args: {id: string}): Promise<User> => {
      try {
        const user = await userModel.findById(args.id);
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          });
        }
        return user;
      } catch (error) {
        console.error('Error while fetching user by id:', error);
        throw new GraphQLError('Error while fetching user', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    },
  },
  Mutation: {
    createUser: async (
      _parent: undefined,
      args: {user: Omit<User, '_id'>}
    ): Promise<{message: string; user?: User}> => {
      console.log('args', args);
      console.log('args.user', args);
      const user = await userModel.create(args);
      if (!user) {
        return {
          message: 'Error while creating user',
        };
      } else {
        console.log('user', user);
        return {message: 'User created successfully', user};
      }
    },
    updateUser: async (
      _parent: undefined,
      args: {id: string; user: Omit<User, '_id'>}
    ): Promise<{message: string; user?: User}> => {
      const user = await userModel.findByIdAndUpdate(args.id, args, {
        new: true,
      });
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return {message: 'User updated successfully', user};
    },
    deleteUser: async (
      _parent: undefined,
      args: {id: string; user: Omit<User, '_id'>}
    ): Promise<{message: string; user?: User}> => {
      const user = await userModel.findByIdAndDelete(args.id);
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      return {message: 'User deleted successfully', user};
    },
  },
};
