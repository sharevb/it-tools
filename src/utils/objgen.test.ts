import { describe, expect, it } from 'vitest';
import { ObjGen2Json } from './objgen';

describe('ObjGen', () => {
  describe('ObjGen2Json()', () => {
    it('should generate correct JSON from model', () => {
      expect(ObjGen2Json(`// Model & generate Live JSON data values
// interactively using a simple syntax.
// String is the default value type
product = Live JSON generator

// Number, Date & Boolean are also supported
// Specify types after property names
version n = 3.1
releaseDate d = 2014-06-25
demo b = true

// Tabs or spaces define complex values
person
  id number = 12345
  name = John Doe
  phones
    home = 800-123-4567
    mobile = 877-123-1234

  // Use [] to define simple type arrays
  email[] s = jd@example.com, jd@example.org
  dateOfBirth d = 1980-01-02
  registered b = true

  // Use [] or [n] to define object arrays
  emergencyContacts[]
    name s = Jane Doe
    phone s = 888-555-1212
    relationship = spouse
  emergencyContacts[]
    name s = Justin Doe
    phone s = 877-123-1212
    relationship = parent

// See our Help page for additional info
// We hope you enjoy the tool!
`)).toBe(`{
  "product": "Live JSON generator",
  "version": 3.1,
  "releaseDate": "2014-06-25T00:00:00.000Z",
  "demo": true,
  "person": {
    "id": 12345,
    "name": "John Doe",
    "phones": {
      "home": "800-123-4567",
      "mobile": "877-123-1234"
    },
    "email": [
      "jd@example.com",
      "jd@example.org"
    ],
    "dateOfBirth": "1980-01-02T00:00:00.000Z",
    "registered": true,
    "emergencyContacts": [
      {
        "name": "Jane Doe",
        "phone": "888-555-1212",
        "relationship": "spouse"
      },
      {
        "name": "Justin Doe",
        "phone": "877-123-1212",
        "relationship": "parent"
      }
    ]
  }
}`);
    });
    it('should generate a simple JSON object', () => {
      const simple = {
        id: '1',
        name: 'test',
        amount: 100,
        when: '2017-03-09T12:34:56.789Z',
      };

      const model = 'id s = 1\n'
        + 'name = test\n'
        + 'amount n = 100\n'
        + 'when d = 2017-03-09T12:34:56.789Z';

      expect(JSON.parse(ObjGen2Json(model))).to.deep.eq(simple);
    });

    it('should generate a JSON object that uses _dots_ in prop names', () => {
      const dots = {
        'this.that': 'xxx',
      };

      expect(JSON.parse(ObjGen2Json('this.that s = xxx'))).to.deep.eq(dots);
    });

    it('should generate an array of strings', () => {
      const model = 'a[] = 1, 2, 3';
      const strings = { a: ['1', '2', '3'] };
      expect(JSON.parse(ObjGen2Json(model))).to.deep.eq(strings);
    });

    it('should generate an array of objects using explicit indicies', () => {
      const model = 'a[0]\n'
        + '  id n = 1\n'
        + '  name = one\n'
        + 'a[1]\n'
        + '  id n = 2\n'
        + '  name = two\n';

      const objects = {
        a: [
          {
            id: 1,
            name: 'one',
          },
          {
            id: 2,
            name: 'two',
          }],
      };

      expect(JSON.parse(ObjGen2Json(model))).to.deep.eq(objects);
    });

    it('should generate an array of objects using implied indicies', () => {
      const model = 'a[]\n'
        + '  id n = 1\n'
        + '  name = one\n'
        + 'a[]\n'
        + '  id n = 2\n'
        + '  name = two\n';

      const objects = {
        a: [
          {
            id: 1,
            name: 'one',
          },
          {
            id: 2,
            name: 'two',
          }],
      };

      expect(JSON.parse(ObjGen2Json(model))).to.deep.eq(objects);
    });

    it('should generate a top level object array', () => {
      const model = '[]\n'
        + '  id n = 1\n'
        + '  name = one\n'
        + '[]\n'
        + '  id n = 2\n'
        + '  name = two\n'
        + '[]\n'
        + '  id n = 3\n'
        + '  name = three\n';

      const array = [
        {
          id: 1,
          name: 'one',
        },
        {
          id: 2,
          name: 'two',
        },
        {
          id: 3,
          name: 'three',
        },
      ];

      expect(JSON.parse(ObjGen2Json(model))).to.deep.eq(array);
    });

    it('should generate a complex object', () => {
      const model = 'id n = 1\n'
        + 'name = one\n'
        + 'child\n'
        + '  id n = 1.1\n'
        + '  name = one.one\n'
        + 'child2\n'
        + '  id n = 2.1\n'
        + '  name = two.one\n'
        + '  subArray[]\n'
        + '    id n = 2.11\n'
        + '    name = two.one.one\n'
        + '  subArray[]\n'
        + '    id n = 2.12\n'
        + '    name = two.one.two\n'
        + '  subArray[]\n'
        + '    id n = 2.13\n'
        + '    name = two.one.three\n'
        + 'child3\n'
        + '  id n = 3.1\n'
        + '  name = three.one\n'
        + 'flag b = true\n';

      const complex = {
        id: 1,
        name: 'one',
        child: {
          id: 1.1,
          name: 'one.one',
        },
        child2: {
          id: 2.1,
          name: 'two.one',
          subArray: [
            {
              id: 2.11,
              name: 'two.one.one',
            },
            {
              id: 2.12,
              name: 'two.one.two',
            },
            {
              id: 2.13,
              name: 'two.one.three',
            },
          ],
        },
        child3: {
          id: 3.1,
          name: 'three.one',
        },
        flag: true,
      };

      expect(JSON.parse(ObjGen2Json(model))).to.deep.eq(complex);
    });
  });
});
