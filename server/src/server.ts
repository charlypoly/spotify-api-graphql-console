import * as express from 'express';
import * as cors from 'cors';
import * as SpotifyGraphQL from 'spotify-graphql';
import * as fs from 'fs';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';
import {config} from '../config';
import * as ExpressGraphQL from 'express-graphql';


const bodyParser:any = require('body-parser');
const cookieParser:any = require('cookie-parser');
const methodOverride:any = require('method-override');
const session:any = require('express-session');
const PORT = 4000;

const passport: any = require('passport');
let SpotifyStrategy: any = require('passport-spotify').Strategy;

let spotifyStrategy = new SpotifyStrategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.redirectUri,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      done(null, Object.assign({}, profile, { accessToken }));
    });
  }
 );

passport.use(spotifyStrategy);

function userSerializer(user, done) {
  done(null, user);
}
passport.serializeUser(userSerializer);
passport.deserializeUser(userSerializer);

const app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: config.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, '../../../')))

// AUTH
app.get('/auth/connect',
  passport.authenticate('spotify', {scope: config.scopes}),
  (req: any, res) => {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get('/auth/callback',
  passport.authenticate('spotify'),
  (req: any, res) => {
    res.redirect('/');
  }
);


app.get('/auth/logout', (req: any, res) => {
  req.logout();
  res.redirect('/');
});


app.post('/graphql', (req: any, res: any) => {
  let accessToken = (req.user && req.user.accessToken) || '';
  let schema = SpotifyGraphQL.getSchema(Object.assign({}, config, {
    accessToken: accessToken
  }));
  return ExpressGraphQL({
    schema: schema,
    graphiql: true
  })(req, res);
});

app.get('/', (req: any, res) => {
  res.set('Content-Type', 'text/html');
  res.send(new Buffer(fs.readFileSync(path.resolve(__dirname, '../../../client/index.html'))));
});

console.log(`graphql server listening on port ${PORT}`)
app.listen(PORT);