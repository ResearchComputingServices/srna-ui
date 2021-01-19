import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Root from './components/Root';
import store from './redux/store';
import commonEn from './translations/en/common.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

function App() {
    return (
        <I18nextProvider i18n={i18next}>
            <ReduxProvider store={store}>
                <Root />
            </ReduxProvider>
        </I18nextProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
