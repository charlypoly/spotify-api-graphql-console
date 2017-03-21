import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as GraphiQL from 'graphiql';
import * as fetch from 'isomorphic-fetch';

function graphQLFetcher(graphQLParams) {
    return fetch('http://localhost:4000/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher} editorTheme="solarized" />, document.getElementsByTagName('body')[0]);