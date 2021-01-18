import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import Root from './components/Root';
import store from './redux/store';

function App() {
    return (
        <ReduxProvider store={store}>
            <Root />
        </ReduxProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
