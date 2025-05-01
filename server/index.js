// const express = require("express");
// const {ApolloServer} = require('@apollo/server');
// const bodyParser = require("body-parser");
// const {expressMiddleware} = require("@apollo/server/express4");
// const cors = require("cors");
// const { default: axios } = require("axios");
// const PORT = 4000;

// async function startServer(){
//     // express application
//     const app = express();
//     // creating a apollo server
//     // typeDefs is simple string ! is for required field
//     // if you want to fetch the data from the graphql server we use type Query. getTodos it will returs an Todo array
//     // if you want to give the data to the graphql server we use type Mutation
//     const server = new ApolloServer({
//         typeDefs: `
//             type Todo {
//                 id: ID!
//                 title: String!
//                 completed: Boolean!
//             }
//             type Query {
//                 getTodos: [Todo]
//             }
//         `,
//         resolvers: {
//             Query:{
//                 getTodos: async () => {
//                     try {
//                         const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
//                         return res?.data;
//                     } catch (error) {
//                         console.log(error);
//                     }
//                 }
//             }
//         }
//     });
//     // middleware
//     app.use(bodyParser.json());
//     // app.use(express.json());
//     // cors
//     app.use(cors());
//     // starting the server
//     await server.start();
//     // express middleware
//     app.use("/graphql", expressMiddleware(server));
//     app.listen(PORT, () => console.log("Server is running on port 4000"));
// }

// startServer()
// const express = require("express");
// const { ApolloServer } = require("@apollo/server");
// const { expressMiddleware } = require("@apollo/server/express4");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { default: axios } = require("axios");

// async function startServer() {
//   const app = express();
//   const server = new ApolloServer({
//     typeDefs: `

//         type Todo {
//             id: ID!
//             title: String!
//             completed: Boolean
//         }

//         type Query {
//             getTodos: [Todo]

//         }

//     `,
//     resolvers: {
//       Query: {
//         getTodos: async () => {
//           try {
//             const res = await axios.get(
//               "https://jsonplaceholder.typicode.com/todos"
//             );
//             return res?.data;
//           } catch (error) {
//             console.log(error);
//           }
//         },
//       },
//     },
//   });

//   app.use(bodyParser.json());
//   app.use(cors());

//   await server.start();

//   app.use("/graphql", expressMiddleware(server));

//   app.listen(8000, () => console.log("Serevr Started at PORT 8000"));
// }

// startServer();

// const express = require("express");
const { ApolloServer } = require("@apollo/server");
// const { expressMiddleware } = require("@apollo/server/express4");
const { startStandaloneServer } = require("@apollo/server/standalone");

const users = [
  {
    id: "1",
    name: "Munna",
    age: 20,
    isMarried: false,
  },
  {
    id: "2",
    name: "Ali",
    age: 25,
    isMarried: false,
  },
  {
    id: "3",
    name: "Julkhair",
    age: 26,
    isMarried: false,
  },
  {
    id: "4",
    name: "Mohammed",
    age: 30,
    isMarried: true,
  },
];

const typeDefs = `
type Query{
getUsers: [User]
getUserById(id: ID!): User
}
type Mutation{
createUser(name: String!, age: Int!, isMarried: Boolean!): User
updateUser(id: ID!, name: String, age: Int, isMarried: Boolean): User
deleteUser(id: ID!): Boolean
}
type User{
    id: ID!
    name: String!
    age: Int!
    isMarried: Boolean!
  }
`;
const resolvers = {
  Query: {
    getUsers: () => users,
    // parent argument allows us to access the parent object
    // args argument allows us to access the arguments passed to the query
    getUserById: (parent, args) => users.find((user) => user?.id === args?.id),
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, args) => {
      const { id, name, age, isMarried } = args;
      // const updatedUser = users.find((user) => user?.id === id);
      // updatedUser.name = name;
      // updatedUser.age = age;
      // updatedUser.isMarried = isMarried;
      // return updatedUser;
      const index = users.findIndex((user) => user?.id === id);
      if (index === -1) return null;
      // Update fields if provided
      // if (name !== undefined) users[index].name = name;
      // if (age !== undefined) users[index].age = age;
      // if (isMarried !== undefined) users[index].isMarried = isMarried;
      const updatedUser = {
        ...users[index],
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age }),
        ...(isMarried !== undefined && { isMarried }),
      };

      users[index] = updatedUser;
      return updatedUser;
    },
    deleteUser: (parent, args) => {
      // const index = users.findIndex((user) => user?.id === args?.id);
      // if(index === -1) return null;
      // const deletedUser = users[index];
      // users.splice(index, 1);
      // return deletedUser;
      const { id } = args;
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) return false;
      // const deletedUser = users[index];
      users.splice(index, 1);
      // return deletedUser;
      return true;
    },
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 8000 },
  });

  console.log(`Server started at PORT no ${url}`);
}

startServer();
