import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
import 'jest-localstorage-mock';
import { TextEncoder, TextDecoder } from 'text-encoding-polyfill';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

fetchMock.enableMocks();
