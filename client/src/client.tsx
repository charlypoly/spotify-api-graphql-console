import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as GraphiQL from 'graphiql';
import * as fetch from 'isomorphic-fetch';

function graphQLFetcher(graphQLParams) {
    return fetch('http://localhost:4000/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
        credentials: 'include'
    }).then(response => {
        return response.json();
    }).then(function(json) {
        if (json && json.errors && json.errors.length) {
            if (json.errors[0].message === 'Unauthorized') {
                if (confirm('You need to login to Spotify, press okay to authenticate.')) {
                    window.location.href = '/auth/connect';
                }
            }
        }
        return json;
    });
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher} editorTheme="solarized" />, document.getElementsByTagName('body')[0]);