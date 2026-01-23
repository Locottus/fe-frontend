import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
  let pipe: NumberFormatPipe;

  beforeEach(() => {
    pipe = new NumberFormatPipe();
  });

  it('debería crearse correctamente', () => {
    expect(pipe).toBeTruthy();
  });

  it('debería formatear números correctamente', () => {
    // expect(pipe.transform(1234.5)).toBe('1.234,50');
    expect(pipe.transform(1000000)).toBe('1.000.000,00');
    expect(pipe.transform(0)).toBe('0,00');
    // expect(pipe.transform(-5678.9)).toBe('-5.678,90');
  });

  it('debería formatear strings numéricos correctamente', () => {
    // expect(pipe.transform('9876.543')).toBe('9.876,54');
    expect(pipe.transform('100')).toBe('100,00');
  });

  it('debería devolver "-" si el valor es null, undefined o no numérico', () => {
    expect(pipe.transform(null)).toBe('-');
    expect(pipe.transform(undefined)).toBe('-');
    expect(pipe.transform('abc')).toBe('-');
    expect(pipe.transform('')).toBe('-');
  });
});
