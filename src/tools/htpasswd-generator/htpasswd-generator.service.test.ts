import { describe, expect, it } from 'vitest';
import { generateHtpasswd } from './htpasswd-generator.service';

describe('htpasswd-generator', () => {
  it('generate correct entries', () => {
    const commonValues = { username: 'a', password: 'a' };

    expect(generateHtpasswd({ ...commonValues, saltRounds: 10, algorithm: 'bcrypt' })).toContain('a:$2a$10$');
    expect(generateHtpasswd({ ...commonValues, salt: 'k9azwE5H', algorithm: 'apr1' })).toBe('a:$apr1$k9azwE5H$zIyj4gqCWXiwB2Iof6jHf1');
    expect(generateHtpasswd({ ...commonValues, salt: 'xs4x6VWJ', algorithm: 'md5' })).toBe('a:$1$xs4x6VWJ$lOH0fBF6QyWdTOEeqcFnP/');
    expect(generateHtpasswd({ ...commonValues, salt: 'grEPbuEp', algorithm: 'sha256' })).toBe('a:$5$grEPbuEp$DUmEMT5C4TRgZCs9ZFKOJZ/IgR5FJIOUH0dasQFPw57');
    expect(generateHtpasswd({ ...commonValues, salt: 'ud.q0DEx', algorithm: 'sha512' })).toBe('a:$6$ud.q0DEx$qEMZW6k/1q3ABm4af1WrFdUj1Mc2vCFxnVNHy/pDyk1L8JjoNwzRABgAHnpRON/xrdD/f9Neo6HNIU1z1LQk9.');
    expect(generateHtpasswd({ ...commonValues, salt: 'Uk8SVGLsBuSmD75R', algorithm: 'sha512' })).toBe('a:$6$Uk8SVGLsBuSmD75R$GKnMHXxioi7K97EOtIypnjBLQQVLRyMzF1FTjNhvULyuEDOWdYngkgNTxxAdYchQ9Q0BRC3gka/NSA5RoOFzY.');
  });

  it('generate correct entries (unicode)', () => {
    const commonValues = { username: 'a', password: 'àùé' };

    expect(generateHtpasswd({ ...commonValues, saltRounds: 10, algorithm: 'bcrypt' })).toContain('a:$2a$10$');
    expect(() => generateHtpasswd({ ...commonValues, salt: 'mL016JCr', algorithm: 'apr1' })).toThrow();
    expect(() => generateHtpasswd({ ...commonValues, salt: 'YshCU1p1', algorithm: 'md5' })).toThrow();
    expect(generateHtpasswd({ ...commonValues, salt: 'Rojf48Kp', algorithm: 'sha256' })).toBe('a:$5$Rojf48Kp$/dY3S.yDqW2ZH/YKrF85q6JszyP.bhIF/Qu31Q49Oa5');
    expect(generateHtpasswd({ ...commonValues, salt: '1BPDHHko', algorithm: 'sha512' })).toBe('a:$6$1BPDHHko$jKZNRvgloMD2eAyyPRZt59hOifLwCK0FCSNr35eVgQd0tK0LJQWIp1IsmomVjHWUjiSWjSiP9AGO.G8FbkV3a.');
    expect(generateHtpasswd({ ...commonValues, salt: 'Uk8SVGLsBuSmD75R', algorithm: 'sha512' })).toBe('a:$6$Uk8SVGLsBuSmD75R$j7tejonAnUpOkwVTzTwQnfmq14SDJsGaFvW67m2pLCeaCjy.IT0aniZaRFnx3Azh9x5Lui60F76F9K6mZRbma.');
  });
});
