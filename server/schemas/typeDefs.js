const typeDefs = `
type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }  

type Query {
    me: User
    users: [User]!
  }

type Auth {
    token: ID!
    user: User
  }

type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId:String!, author: [String]!, description:String!, title:String!, image:String!, link:String! ): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
