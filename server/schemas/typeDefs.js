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
  type Auth {
      token: ID!
      user: User
    }

  type Query {
      me: User
    }


`;

module.exports = typeDefs;
