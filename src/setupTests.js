// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect';
import MutationObserver from 'mutation-observer';

global.MutationObserver = MutationObserver;
