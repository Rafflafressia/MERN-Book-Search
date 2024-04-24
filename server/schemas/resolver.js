const { login } = require('../controllers/user-controller');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        profiles: async () => {
            return User.find();
        }
    },

    profile: async (parent, { profileId }) => {
        return User.findOne({ _id: profileId });
    },

    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};
