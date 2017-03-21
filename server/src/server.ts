import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as cors from 'cors';
import * as SpotifyGraphQL from 'spotify-graphql';
import { GraphQLSchema } from 'graphql';
import {config} from '../config';

const PORT = 4000;

let schema = SpotifyGraphQL.getSchema(config);

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

console.log(`graphql server listening on port ${PORT}`)
app.listen(PORT);