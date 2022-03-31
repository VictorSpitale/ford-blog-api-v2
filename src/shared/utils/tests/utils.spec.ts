import { uuid } from '../password.utils';

describe('test utils methods', () => {
  it('should generate an uuid', () => {
    const uniqueId = uuid();
    expect(uniqueId).not.toBeNull();
    expect(uniqueId).toMatch(new RegExp(/[\w]{8}(-[\w]{4}){3}-[\w]{12}/gm));
  });
});
