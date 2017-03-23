import * as express from 'express';
import * as SpotifyGraphQL from 'spotify-graphql';
import * as fs from 'fs';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';
import { config } from '../config';
import * as ExpressGraphQL from 'express-graphql';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as session from 'express-session';
import * as passport from 'passport';
import * as timeout from 'connect-timeout';
const SpotifyStrategy: any = require('passport-spotify').Strategy;

const PORT = config.server.port;

let spotifyStrategy = new SpotifyStrategy({
    clientID: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret,
    callbackURL: config.spotify.redirectUri,
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

const appOnMountPath = express();
const app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: config.server.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, '../../../node_modules/')));
app.use(express.static(path.resolve(__dirname, '../../../client/')));
app.use(timeout('5s'));

// AUTH
app.get('/auth/connect',
  passport.authenticate('spotify', {scope: config.spotify.scopes}),
  (req: any, res) => {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get('/auth/callback',
  passport.authenticate('spotify'),
  (req: any, res) => {
    res.redirect(config.server.mountPath);
  }
);


app.get('/auth/logout', (req: any, res) => {
  req.logout();
  res.redirect(config.server.mountPath);
});

app.post('/graphql', (req: any, res: any) => {
  let accessToken = (req.user && req.user.accessToken) || '';
  let schema = SpotifyGraphQL.getSchema(Object.assign({}, config.spotify, {
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

if (config.server.mountPath) {
  appOnMountPath.use(
    config.server.mountPath,
    app
  )
}
console.log(`graphql server listening on port ${PORT}`);
(config.server.mountPath ? appOnMountPath : app).listen(PORT);
