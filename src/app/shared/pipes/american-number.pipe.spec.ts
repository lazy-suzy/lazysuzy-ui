import { AmericanNumberPipe } from './american-number.pipe';

describe('AmericanNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new AmericanNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
