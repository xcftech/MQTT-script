//import { RuuviData } from '../src/ruuvidata';
//import { Transform } from '../src/transform';

const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockOnData = jest.fn();

beforeEach(() => {
  // No implementation needed
});

afterEach(() => {
  // No implementation needed
});

test('Connect ok', () => {
  expect(mockConnect.mock.calls.length).toBe(1);
});

test('Disconnect ok', () => {
  expect(mockDisconnect.mock.calls.length).toBe(1);
});

test('onData without prefix', () => {
  expect(mockOnData.mock.calls.length).toBe(1);
});