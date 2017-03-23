import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as GraphiQL from 'graphiql';
import * as fetch from 'isomorphic-fetch';
import { config } from '../config';

let defaultQuery = `# Welcome to Spotify GraphQL Console
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# Keyboard shortcuts:
#
#       Run Query:  Ctrl-Enter
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
{
  track(name: "XO") {
    name
    artists {
      name
    }
    album {
      name
    }
  }
}
`

let defaultResponse = `
// Press Ctrl-Enter to see the result!
`;

function graphQLFetcher(graphQLParams) {
    return fetch(`${config.mountPath}/graphql`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
        credentials: 'include'
    }).then(response => {
        return response.json();
    }).then(function(json) {
        if (json && json.errors && json.errors.length) {
            if (json.errors[0].message === 'Unauthorized') {
                if (confirm('This request need to be authenticated, press "OK" to log with Spotify.')) {
                    window.location.href = `${config.mountPath}/auth/connect`;
                }
            }
        }
        return json;
    });
}

ReactDOM.render(<GraphiQL 
    fetcher={graphQLFetcher}
    defaultQuery={defaultQuery}
    response={defaultResponse}
    editorTheme="ambiance">
      <GraphiQL.Logo>
        <table>
          <tr>
            <td>
              <img src="Spotify_Icon_RGB_Green.png" className='spotify-logo' alt=""/>
            </td>
            <td className='app-name'>
              Spotify GraphQL Console
            </td>
          </tr>
        </table>
      </GraphiQL.Logo>
      <GraphiQL.Toolbar />
    </GraphiQL>,
    document.getElementsByTagName('body')[0]
);