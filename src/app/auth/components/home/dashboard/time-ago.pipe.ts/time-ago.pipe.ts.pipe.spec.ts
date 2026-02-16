import { TimeAgo.pipe.tsPipe } from './time-ago.pipe.ts.pipe';

describe('TimeAgo.pipe.tsPipe', () => {
  const pipe: TimeAgo.pipe.tsPipe = new TimeAgo.pipe.tsPipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns null for input', () => {
    expect(pipe.transform(null)).toStrictEqual(null);
  });
});
