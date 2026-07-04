import { translate as t } from '@/plugins/i18n.plugin';

/* eslint-disable prefer-const */
/*
            JavaScript functions for positional astronomy

                  by John Walker  --  September, MIM
                       http://www.fourmilab.ch/

                This program is in the public domain.
*/

//  Frequently-used constants

const J2000 = 2451545.0; // Julian day of J2000 epoch
const JulianCentury = 36525.0; // Days in Julian century
const JulianMillennium = (JulianCentury * 10); // Days in Julian millennium
const AstronomicalUnit = 149597870.0; // Astronomical unit in kilometres
const TropicalYear = 365.24219878; // Mean solar tropical year

/*  ASTOR  --  Arc-seconds to radians.  */

function astor(a: number) {
  return a * (Math.PI / (180.0 * 3600.0));
}

/*  DTR  --  Degrees to radians.  */

function dtr(d: number) {
  return (d * Math.PI) / 180.0;
}

/*  RTD  --  Radians to degrees.  */

function rtd(r: number) {
  return (r * 180.0) / Math.PI;
}

/*  FIXANGLE  --  Range reduce angle in degrees.  */

function fixangle(a: number) {
  return a - 360.0 * (Math.floor(a / 360.0));
}

/*  FIXANGR  --  Range reduce angle in radians.  */

function fixangr(a: number) {
  return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
}

//  DSIN  --  Sine of an angle in degrees

function dsin(d: number) {
  return Math.sin(dtr(d));
}

//  DCOS  --  Cosine of an angle in degrees

function dcos(d: number) {
  return Math.cos(dtr(d));
}

/*  MOD  --  Modulus function which works for non-integers.  */

function mod(a: number, b: number) {
  return a - (b * Math.floor(a / b));
}

//  AMOD  --  Modulus function which returns numerator if modulus is zero

function amod(a: number, b: number) {
  return mod(a - 1, b) + 1;
}

/*  JHMS  --  Convert Julian time to hour, minutes, and seconds,
              returned as a three-element array.  */

function jhms(j: number) {
  let ij;

  j += 0.5; /* Astronomical to civil */
  ij = ((j - Math.floor(j)) * 86400.0) + 0.5;
  return [
    Math.floor(ij / 3600),
    Math.floor((ij / 60) % 60),
    Math.floor(ij % 60)];
}

//  JWDAY  --  Calculate day of week from Julian day

const Weekdays = [
  t('tools.calendar-converter.service.text.sunday'),
  t('tools.calendar-converter.service.text.monday'),
  t('tools.calendar-converter.service.text.tuesday'),
  t('tools.calendar-converter.service.text.wednesday'),
  t('tools.calendar-converter.service.text.thursday'),
  t('tools.calendar-converter.service.text.friday'),
  t('tools.calendar-converter.service.text.saturday'),
];

function jwday(j: number) {
  return mod(Math.floor((j + 1.5)), 7);
}

/*  OBLIQEQ  --  Calculate the obliquity of the ecliptic for a given
                 Julian date.  This uses Laskar's tenth-degree
                 polynomial fit (J. Laskar, Astronomy and
                 Astrophysics, Vol. 157, page 68 [1986]) which is
                 accurate to within 0.01 arc second between AD 1000
                 and AD 3000, and within a few seconds of arc for
                 +/-10000 years around AD 2000.  If we're outside the
                 range in which this fit is valid (deep time) we
                 simply return the J2000 value of the obliquity, which
                 happens to be almost precisely the mean.  */

const oterms = [
  -4680.93,
  -1.55,
  1999.25,
  -51.38,
  -249.67,
  -39.05,
  7.12,
  27.87,
  5.79,
  2.45,
];

function obliqeq(jd: number) {
  let eps, u, v, i;

  v = u = (jd - J2000) / (JulianCentury * 100);

  eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

  if (Math.abs(u) < 1.0) {
    for (i = 0; i < 10; i++) {
      eps += (oterms[i] / 3600.0) * v;
      v *= u;
    }
  }
  return eps;
}

/* Periodic terms for nutation in longiude (delta \Psi) and
   obliquity (delta \Epsilon) as given in table 21.A of
   Meeus, "Astronomical Algorithms", first edition. */

const nutArgMult = [
  0, 0, 0, 0, 1,
  -2, 0, 0, 2, 2,
  0, 0, 0, 2, 2,
  0, 0, 0, 0, 2,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  -2, 1, 0, 2, 2,
  0, 0, 0, 2, 1,
  0, 0, 1, 2, 2,
  -2, -1, 0, 2, 2,
  -2, 0, 1, 0, 0,
  -2, 0, 0, 2, 1,
  0, 0, -1, 2, 2,
  2, 0, 0, 0, 0,
  0, 0, 1, 0, 1,
  2, 0, -1, 2, 2,
  0, 0, -1, 0, 1,
  0, 0, 1, 2, 1,
  -2, 0, 2, 0, 0,
  0, 0, -2, 2, 1,
  2, 0, 0, 2, 2,
  0, 0, 2, 2, 2,
  0, 0, 2, 0, 0,
  -2, 0, 1, 2, 2,
  0, 0, 0, 2, 0,
  -2, 0, 0, 2, 0,
  0, 0, -1, 2, 1,
  0, 2, 0, 0, 0,
  2, 0, -1, 0, 1,
  -2, 2, 0, 2, 2,
  0, 1, 0, 0, 1,
  -2, 0, 1, 0, 1,
  0, -1, 0, 0, 1,
  0, 0, 2, -2, 0,
  2, 0, -1, 2, 1,
  2, 0, 1, 2, 2,
  0, 1, 0, 2, 2,
  -2, 1, 1, 0, 0,
  0, -1, 0, 2, 2,
  2, 0, 0, 2, 1,
  2, 0, 1, 0, 0,
  -2, 0, 2, 2, 2,
  -2, 0, 1, 2, 1,
  2, 0, -2, 0, 1,
  2, 0, 0, 0, 1,
  0, -1, 1, 0, 0,
  -2, -1, 0, 2, 1,
  -2, 0, 0, 0, 1,
  0, 0, 2, 2, 1,
  -2, 0, 2, 0, 1,
  -2, 1, 0, 2, 1,
  0, 0, 1, -2, 0,
  -1, 0, 1, 0, 0,
  -2, 1, 0, 0, 0,
  1, 0, 0, 0, 0,
  0, 0, 1, 2, 0,
  -1, -1, 1, 0, 0,
  0, 1, 1, 0, 0,
  0, -1, 1, 2, 2,
  2, -1, -1, 2, 2,
  0, 0, -2, 2, 2,
  0, 0, 3, 2, 2,
  2, -1, 0, 2, 2,
];

const nutArgCoeff = [
  -171996, -1742, 92095, 89, /*  0,  0,  0,  0,  1 */
  -13187, -16, 5736, -31, /* -2,  0,  0,  2,  2 */
  -2274, -2, 977, -5, /*  0,  0,  0,  2,  2 */
  2062, 2, -895, 5, /*  0,  0,  0,  0,  2 */
  1426, -34, 54, -1, /*  0,  1,  0,  0,  0 */
  712, 1, -7, 0, /*  0,  0,  1,  0,  0 */
  -517, 12, 224, -6, /* -2,  1,  0,  2,  2 */
  -386, -4, 200, 0, /*  0,  0,  0,  2,  1 */
  -301, 0, 129, -1, /*  0,  0,  1,  2,  2 */
  217, -5, -95, 3, /* -2, -1,  0,  2,  2 */
  -158, 0, 0, 0, /* -2,  0,  1,  0,  0 */
  129, 1, -70, 0, /* -2,  0,  0,  2,  1 */
  123, 0, -53, 0, /*  0,  0, -1,  2,  2 */
  63, 0, 0, 0, /*  2,  0,  0,  0,  0 */
  63, 1, -33, 0, /*  0,  0,  1,  0,  1 */
  -59, 0, 26, 0, /*  2,  0, -1,  2,  2 */
  -58, -1, 32, 0, /*  0,  0, -1,  0,  1 */
  -51, 0, 27, 0, /*  0,  0,  1,  2,  1 */
  48, 0, 0, 0, /* -2,  0,  2,  0,  0 */
  46, 0, -24, 0, /*  0,  0, -2,  2,  1 */
  -38, 0, 16, 0, /*  2,  0,  0,  2,  2 */
  -31, 0, 13, 0, /*  0,  0,  2,  2,  2 */
  29, 0, 0, 0, /*  0,  0,  2,  0,  0 */
  29, 0, -12, 0, /* -2,  0,  1,  2,  2 */
  26, 0, 0, 0, /*  0,  0,  0,  2,  0 */
  -22, 0, 0, 0, /* -2,  0,  0,  2,  0 */
  21, 0, -10, 0, /*  0,  0, -1,  2,  1 */
  17, -1, 0, 0, /*  0,  2,  0,  0,  0 */
  16, 0, -8, 0, /*  2,  0, -1,  0,  1 */
  -16, 1, 7, 0, /* -2,  2,  0,  2,  2 */
  -15, 0, 9, 0, /*  0,  1,  0,  0,  1 */
  -13, 0, 7, 0, /* -2,  0,  1,  0,  1 */
  -12, 0, 6, 0, /*  0, -1,  0,  0,  1 */
  11, 0, 0, 0, /*  0,  0,  2, -2,  0 */
  -10, 0, 5, 0, /*  2,  0, -1,  2,  1 */
  -8, 0, 3, 0, /*  2,  0,  1,  2,  2 */
  7, 0, -3, 0, /*  0,  1,  0,  2,  2 */
  -7, 0, 0, 0, /* -2,  1,  1,  0,  0 */
  -7, 0, 3, 0, /*  0, -1,  0,  2,  2 */
  -7, 0, 3, 0, /*  2,  0,  0,  2,  1 */
  6, 0, 0, 0, /*  2,  0,  1,  0,  0 */
  6, 0, -3, 0, /* -2,  0,  2,  2,  2 */
  6, 0, -3, 0, /* -2,  0,  1,  2,  1 */
  -6, 0, 3, 0, /*  2,  0, -2,  0,  1 */
  -6, 0, 3, 0, /*  2,  0,  0,  0,  1 */
  5, 0, 0, 0, /*  0, -1,  1,  0,  0 */
  -5, 0, 3, 0, /* -2, -1,  0,  2,  1 */
  -5, 0, 3, 0, /* -2,  0,  0,  0,  1 */
  -5, 0, 3, 0, /*  0,  0,  2,  2,  1 */
  4, 0, 0, 0, /* -2,  0,  2,  0,  1 */
  4, 0, 0, 0, /* -2,  1,  0,  2,  1 */
  4, 0, 0, 0, /*  0,  0,  1, -2,  0 */
  -4, 0, 0, 0, /* -1,  0,  1,  0,  0 */
  -4, 0, 0, 0, /* -2,  1,  0,  0,  0 */
  -4, 0, 0, 0, /*  1,  0,  0,  0,  0 */
  3, 0, 0, 0, /*  0,  0,  1,  2,  0 */
  -3, 0, 0, 0, /* -1, -1,  1,  0,  0 */
  -3, 0, 0, 0, /*  0,  1,  1,  0,  0 */
  -3, 0, 0, 0, /*  0, -1,  1,  2,  2 */
  -3, 0, 0, 0, /*  2, -1, -1,  2,  2 */
  -3, 0, 0, 0, /*  0,  0, -2,  2,  2 */
  -3, 0, 0, 0, /*  0,  0,  3,  2,  2 */
  -3, 0, 0, 0, /*  2, -1,  0,  2,  2 */
];

/*  NUTATION  --  Calculate the nutation in longitude, deltaPsi, and
                  obliquity, deltaEpsilon for a given Julian date
                  jd.  Results are returned as a two element Array
                  giving (deltaPsi, deltaEpsilon) in degrees.  */

function nutation(jd: number) {
  let deltaPsi;
  let deltaEpsilon;
  let i;
  let j;
  const t = (jd - 2451545.0) / 36525.0;
  let t2;
  let t3;
  let to10;
  const ta = [];
  let dp = 0;
  let de = 0;
  let ang;

  t3 = t * (t2 = t * t);

  /* Calculate angles.  The correspondence between the elements
       of our array and the terms cited in Meeus are:

       ta[0] = D  ta[0] = M  ta[2] = M'  ta[3] = F  ta[4] = \Omega

    */

  ta[0] = dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2
                + t3 / 189474.0);
  ta[1] = dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2
                - t3 / 300000.0);
  ta[2] = dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2
                + t3 / 56250.0);
  ta[3] = dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2
                + t3 / 327270);
  ta[4] = dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2
                + t3 / 450000.0);

  /* Range reduce the angles in case the sine and cosine functions
       don't do it as accurately or quickly. */

  for (i = 0; i < 5; i++) {
    ta[i] = fixangr(ta[i]);
  }

  to10 = t / 10.0;
  for (i = 0; i < 63; i++) {
    ang = 0;
    for (j = 0; j < 5; j++) {
      if (nutArgMult[(i * 5) + j] !== 0) {
        ang += nutArgMult[(i * 5) + j] * ta[j];
      }
    }
    dp += (nutArgCoeff[(i * 4) + 0] + nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
    de += (nutArgCoeff[(i * 4) + 2] + nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
  }

  /* Return the result, converting from ten thousandths of arc
       seconds to radians in the process. */

  deltaPsi = dp / (3600.0 * 10000.0);
  deltaEpsilon = de / (3600.0 * 10000.0);

  return [deltaPsi, deltaEpsilon];
}

/*  ECLIPTOEQ  --  Convert celestial (ecliptical) longitude and
                   latitude into right ascension (in degrees) and
                   declination.  We must supply the time of the
                   conversion in order to compensate correctly for the
                   varying obliquity of the ecliptic over time.
                   The right ascension and declination are returned
                   as a two-element Array in that order.  */

function ecliptoeq(jd: number, Lambda: number, Beta: number) {
  let eps, Ra, Dec;

  /* Obliquity of the ecliptic. */

  eps = dtr(obliqeq(jd));
  //   log += 'Obliquity: ' + rtd(eps) + '\n';

  Ra = rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda))
                        - (Math.tan(dtr(Beta)) * Math.sin(eps))),
  Math.cos(dtr(Lambda))));
  //   log += 'RA = ' + Ra + '\n';
  Ra = fixangle(rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda))
                        - (Math.tan(dtr(Beta)) * Math.sin(eps))),
  Math.cos(dtr(Lambda)))));
  Dec = rtd(Math.asin((Math.sin(eps) * Math.sin(dtr(Lambda)) * Math.cos(dtr(Beta)))
                 + (Math.sin(dtr(Beta)) * Math.cos(eps))));

  return [Ra, Dec];
}

/*  DELTAT  --  Determine the difference, in seconds, between
                Dynamical time and Universal time.  */

/*  Table of observed Delta T values at the beginning of
    even numbered years from 1620 through 2002.  */

const deltaTtab = [
  121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46,
  44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12,
  11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10,
  10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13,
  13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
  16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12,
  11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6,
  5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7,
  1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6,
  -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16,
  18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7,
  24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2,
  33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5,
  52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6,
];

function deltat(year: number) {
  let dt, f, i, t;

  if ((year >= 1620) && (year <= 2000)) {
    i = Math.floor((year - 1620) / 2);
    f = ((year - 1620) / 2) - i; /* Fractional part of year */
    dt = deltaTtab[i] + ((deltaTtab[i + 1] - deltaTtab[i]) * f);
  }
  else {
    t = (year - 2000) / 100;
    if (year < 948) {
      dt = 2177 + (497 * t) + (44.1 * t * t);
    }
    else {
      dt = 102 + (102 * t) + (25.3 * t * t);
      if ((year > 2000) && (year < 2100)) {
        dt += 0.37 * (year - 2100);
      }
    }
  }
  return dt;
}

/*  EQUINOX  --  Determine the Julian Ephemeris Day of an
                 equinox or solstice.  The "which" argument
                 selects the item to be computed:

                    0   March equinox
                    1   June solstice
                    2   September equinox
                    3   December solstice

*/

//  Periodic terms to obtain true time

const EquinoxpTerms = [
  485, 324.96, 1934.136,
  203, 337.23, 32964.467,
  199, 342.08, 20.186,
  182, 27.85, 445267.112,
  156, 73.14, 45036.886,
  136, 171.52, 22518.443,
  77, 222.54, 65928.934,
  74, 296.72, 3034.906,
  70, 243.58, 9037.513,
  58, 119.81, 33718.147,
  52, 297.17, 150.678,
  50, 21.02, 2281.226,
  45, 247.54, 29929.562,
  44, 325.15, 31555.956,
  29, 60.93, 4443.417,
  18, 155.12, 67555.328,
  17, 288.79, 4562.452,
  16, 198.04, 62894.029,
  14, 199.76, 31436.921,
  12, 95.39, 14577.848,
  12, 287.11, 31931.756,
  12, 320.81, 34777.259,
  9, 227.73, 1222.114,
  8, 15.45, 16859.074,
];

const JDE0tab1000 = [
  [1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071],
  [1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025],
  [1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074],
  [1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006],
];

const JDE0tab2000 = [
  [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030],
  [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
];

function equinox(year: number, which: number) {
  let deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

  /*  Initialise terms for mean equinox and solstices.  We
        have two sets: one for years prior to 1000 and a second
        for subsequent years.  */

  if (year < 1000) {
    JDE0tab = JDE0tab1000;
    Y = year / 1000;
  }
  else {
    JDE0tab = JDE0tab2000;
    Y = (year - 2000) / 1000;
  }

  JDE0 = JDE0tab[which][0]
           + (JDE0tab[which][1] * Y)
           + (JDE0tab[which][2] * Y * Y)
           + (JDE0tab[which][3] * Y * Y * Y)
           + (JDE0tab[which][4] * Y * Y * Y * Y);

  // this.document.debug.log += "JDE0 = " + JDE0 + "\n";

  T = (JDE0 - 2451545.0) / 36525;
  // this.document.debug.log += "T = " + T + "\n";
  W = (35999.373 * T) - 2.47;
  // this.document.debug.log += "W = " + W + "\n";
  deltaL = 1 + (0.0334 * dcos(W)) + (0.0007 * dcos(2 * W));
  // this.document.debug.log += "deltaL = " + deltaL + "\n";

  //  Sum the periodic terms for time T

  S = 0;
  for (i = j = 0; i < 24; i++) {
    S += EquinoxpTerms[j] * dcos(EquinoxpTerms[j + 1] + (EquinoxpTerms[j + 2] * T));
    j += 3;
  }

  // this.document.debug.log += "S = " + S + "\n";
  // this.document.debug.log += "Corr = " + ((S * 0.00001) / deltaL) + "\n";

  JDE = JDE0 + ((S * 0.00001) / deltaL);

  return JDE;
}

/*  SUNPOS  --  Position of the Sun.  Please see the comments
                on the return statement at the end of this function
                which describe the array it returns.  We return
                intermediate values because they are useful in a
                variety of other contexts.  */

function sunpos(jd: number) {
  let T, T2, L0, M, e, C, sunLong, sunAnomaly, sunR,
    Omega, Lambda, epsilon, epsilon0, Alpha, Delta,
    AlphaApp, DeltaApp;

  T = (jd - J2000) / JulianCentury;
  // this.document.debug.log += "Sunpos.  T = " + T + "\n";
  T2 = T * T;
  L0 = 280.46646 + (36000.76983 * T) + (0.0003032 * T2);
  // this.document.debug.log += "L0 = " + L0 + "\n";
  L0 = fixangle(L0);
  // this.document.debug.log += "L0 = " + L0 + "\n";
  M = 357.52911 + (35999.05029 * T) + (-0.0001537 * T2);
  // this.document.debug.log += "M = " + M + "\n";
  M = fixangle(M);
  // this.document.debug.log += "M = " + M + "\n";
  e = 0.016708634 + (-0.000042037 * T) + (-0.0000001267 * T2);
  // this.document.debug.log += "e = " + e + "\n";
  C = ((1.914602 + (-0.004817 * T) + (-0.000014 * T2)) * dsin(M))
        + ((0.019993 - (0.000101 * T)) * dsin(2 * M))
        + (0.000289 * dsin(3 * M));
  // this.document.debug.log += "C = " + C + "\n";
  sunLong = L0 + C;
  // this.document.debug.log += "sunLong = " + sunLong + "\n";
  sunAnomaly = M + C;
  // this.document.debug.log += "sunAnomaly = " + sunAnomaly + "\n";
  sunR = (1.000001018 * (1 - (e * e))) / (1 + (e * dcos(sunAnomaly)));
  // this.document.debug.log += "sunR = " + sunR + "\n";
  Omega = 125.04 - (1934.136 * T);
  // this.document.debug.log += "Omega = " + Omega + "\n";
  Lambda = sunLong + (-0.00569) + (-0.00478 * dsin(Omega));
  // this.document.debug.log += "Lambda = " + Lambda + "\n";
  epsilon0 = obliqeq(jd);
  // this.document.debug.log += "epsilon0 = " + epsilon0 + "\n";
  epsilon = epsilon0 + (0.00256 * dcos(Omega));
  // this.document.debug.log += "epsilon = " + epsilon + "\n";
  Alpha = rtd(Math.atan2(dcos(epsilon0) * dsin(sunLong), dcos(sunLong)));
  // this.document.debug.log += "Alpha = " + Alpha + "\n";
  Alpha = fixangle(Alpha);
  /// /this.document.debug.log += "Alpha = " + Alpha + "\n";
  Delta = rtd(Math.asin(dsin(epsilon0) * dsin(sunLong)));
  /// /this.document.debug.log += "Delta = " + Delta + "\n";
  AlphaApp = rtd(Math.atan2(dcos(epsilon) * dsin(Lambda), dcos(Lambda)));
  // this.document.debug.log += "AlphaApp = " + AlphaApp + "\n";
  AlphaApp = fixangle(AlphaApp);
  // this.document.debug.log += "AlphaApp = " + AlphaApp + "\n";
  DeltaApp = rtd(Math.asin(dsin(epsilon) * dsin(Lambda)));
  // this.document.debug.log += "DeltaApp = " + DeltaApp + "\n";

  return [ //  Angular quantities are expressed in decimal degrees
    L0, //  [0] Geometric mean longitude of the Sun
    M, //  [1] Mean anomaly of the Sun
    e, //  [2] Eccentricity of the Earth's orbit
    C, //  [3] Sun's equation of the Centre
    sunLong, //  [4] Sun's true longitude
    sunAnomaly, //  [5] Sun's true anomaly
    sunR, //  [6] Sun's radius vector in AU
    Lambda, //  [7] Sun's apparent longitude at true equinox of the date
    Alpha, //  [8] Sun's true right ascension
    Delta, //  [9] Sun's true declination
    AlphaApp, // [10] Sun's apparent right ascension
    DeltaApp, // [11] Sun's apparent declination
  ];
}

/*  EQUATIONOFTIME  --  Compute equation of time for a given moment.
                        Returns the equation of time as a fraction of
                        a day.  */

function equationOfTime(jd: number) {
  let alpha, deltaPsi, E, epsilon, L0, tau;

  tau = (jd - J2000) / JulianMillennium;
  // this.document.debug.log += "equationOfTime.  tau = " + tau + "\n";
  L0 = 280.4664567 + (360007.6982779 * tau)
         + (0.03032028 * tau * tau)
         + ((tau * tau * tau) / 49931)
         + (-((tau * tau * tau * tau) / 15300))
         + (-((tau * tau * tau * tau * tau) / 2000000));
  // this.document.debug.log += "L0 = " + L0 + "\n";
  L0 = fixangle(L0);
  // this.document.debug.log += "L0 = " + L0 + "\n";
  alpha = sunpos(jd)[10];
  // this.document.debug.log += "alpha = " + alpha + "\n";
  deltaPsi = nutation(jd)[0];
  // this.document.debug.log += "deltaPsi = " + deltaPsi + "\n";
  epsilon = obliqeq(jd) + nutation(jd)[1];
  // this.document.debug.log += "epsilon = " + epsilon + "\n";
  E = L0 + (-0.0057183) + (-alpha) + (deltaPsi * dcos(epsilon));
  // this.document.debug.log += "E = " + E + "\n";
  E = E - 20.0 * (Math.floor(E / 20.0));
  // this.document.debug.log += "Efixed = " + E + "\n";
  E = E / (24 * 60);
  // this.document.debug.log += "Eday = " + E + "\n";

  return E;
}

/*
       JavaScript functions for the Fourmilab Calendar Converter

                  by John Walker  --  September, MIM
              http://www.fourmilab.ch/documents/calendar/

                This program is in the public domain.
*/

/*  You may notice that a variety of array variables logically local
    to functions are declared globally here.  In JavaScript, construction
    of an array variable from source code occurs as the code is
    interpreted.  Making these variables pseudo-globals permits us
    to avoid overhead constructing and disposing of them in each
    call on the function in which whey are used.  */

const J0000 = 1721424.5; // Julian date of Gregorian epoch: 0000-01-01
const J1970 = 2440587.5; // Julian date at Unix epoch: 1970-01-01
const JMJD = 2400000.5; // Epoch of Modified Julian Date system
const J1900 = 2415020.5; // Epoch (day 1) of Excel 1900 date system (PC)
const J1904 = 2416480.5; // Epoch (day 0) of Excel 1904 date system (Mac)

const NormLeap = [
  t('tools.calendar-converter.service.text.normal-year'),
  t('tools.calendar-converter.service.text.leap-year'),
];

/*  WEEKDAY_BEFORE  --  Return Julian date of given weekday (0 = Sunday)
                        in the seven days ending on jd.  */

function weekday_before(weekday: number, jd: number) {
  return jd - jwday(jd - weekday);
}

/*  SEARCH_WEEKDAY  --  Determine the Julian date for:

            weekday      Day of week desired, 0 = Sunday
            jd           Julian date to begin search
            direction    1 = next weekday, -1 = last weekday
            offset       Offset from jd to begin search
*/

function search_weekday(weekday: number, jd: number, direction: number, offset: number) {
  return weekday_before(weekday, jd + (direction * offset));
}

//  Utility weekday functions, just wrappers for search_weekday

function nearest_weekday(weekday: number, jd: number) {
  return search_weekday(weekday, jd, 1, 3);
}

function next_weekday(weekday: number, jd: number) {
  return search_weekday(weekday, jd, 1, 7);
}

function next_or_current_weekday(weekday: number, jd: number) {
  return search_weekday(weekday, jd, 1, 6);
}

function previous_weekday(weekday: number, jd: number) {
  return search_weekday(weekday, jd, -1, 1);
}

function previous_or_current_weekday(weekday: number, jd: number) {
  return search_weekday(weekday, jd, 1, 0);
}

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

function leap_gregorian(year: number) {
  return ((year % 4) === 0)
            && (!(((year % 100) === 0) && ((year % 400) !== 0)));
}

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

const GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year: number, month: number, day: number) {
  return (GREGORIAN_EPOCH - 1)
           + (365 * (year - 1))
           + Math.floor((year - 1) / 4)
           + (-Math.floor((year - 1) / 100))
           + Math.floor((year - 1) / 400)
           + Math.floor((((367 * month) - 362) / 12)
           + ((month <= 2)
             ? 0
             : (leap_gregorian(year) ? -1 : -2)
           )
           + day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

function jd_to_gregorian(jd: number) {
  let wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad,
    yindex, dyindex, year, yearday, leapadj, month, day;

  wjd = Math.floor(jd - 0.5) + 0.5;
  depoch = wjd - GREGORIAN_EPOCH;
  quadricent = Math.floor(depoch / 146097);
  dqc = mod(depoch, 146097);
  cent = Math.floor(dqc / 36524);
  dcent = mod(dqc, 36524);
  quad = Math.floor(dcent / 1461);
  dquad = mod(dcent, 1461);
  yindex = Math.floor(dquad / 365);
  year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
  if (!((cent === 4) || (yindex === 4))) {
    year++;
  }
  yearday = wjd - gregorian_to_jd(year, 1, 1);
  leapadj = ((wjd < gregorian_to_jd(year, 3, 1))
    ? 0
    : (leap_gregorian(year) ? 1 : 2)
  );
  month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
  day = (wjd - gregorian_to_jd(year, month, 1)) + 1;

  return [year, month, day];
}

//  ISO_TO_JULIAN  --  Return Julian day of given ISO year, week, and day

function n_weeks(weekday: number, jd: number, nthweek: number) {
  let j = 7 * nthweek;

  if (nthweek > 0) {
    j += previous_weekday(weekday, jd);
  }
  else {
    j += next_weekday(weekday, jd);
  }
  return j;
}

function iso_to_julian(year: number, week: number, day: number) {
  return day + n_weeks(0, gregorian_to_jd(year - 1, 12, 28), week);
}

//  JD_TO_ISO  --  Return array of ISO (year, week, day) for Julian day

function jd_to_iso(jd: number) {
  let year, week, day;

  year = jd_to_gregorian(jd - 3)[0];
  if (jd >= iso_to_julian(year + 1, 1, 1)) {
    year++;
  }
  week = Math.floor((jd - iso_to_julian(year, 1, 1)) / 7) + 1;
  day = jwday(jd);
  if (day === 0) {
    day = 7;
  }
  return [year, week, day];
}

//  ISO_DAY_TO_JULIAN  --  Return Julian day of given ISO year, and day of year

function iso_day_to_julian(year: number, day: number) {
  return (day - 1) + gregorian_to_jd(year, 1, 1);
}

//  JD_TO_ISO_DAY  --  Return array of ISO (year, day_of_year) for Julian day

function jd_to_iso_day(jd: number) {
  let year, day;

  year = jd_to_gregorian(jd)[0];
  day = Math.floor(jd - gregorian_to_jd(year, 1, 1)) + 1;
  return [year, day];
}

/*  PAD  --  Pad a string to a given length with a given fill character.  */

function pad(str: string, howlong: number, padwith: string) {
  let s = str.toString();

  while (s.length < howlong) {
    s = padwith + s;
  }
  return s;
}

//  JULIAN_TO_JD  --  Determine Julian day number from Julian calendar date

const JULIAN_EPOCH = 1721423.5;

function leap_julian(year: number) {
  return mod(year, 4) === ((year > 0) ? 0 : 3);
}

function julian_to_jd(year: number, month: number, day: number) {
  /* Adjust negative common era years to the zero-based notation we use.  */

  if (year < 1) {
    year++;
  }

  /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */

  if (month <= 2) {
    year--;
    month += 12;
  }

  return ((Math.floor((365.25 * (year + 4716)))
            + Math.floor((30.6001 * (month + 1)))
            + day) - 1524.5);
}

//  JD_TO_JULIAN  --  Calculate Julian calendar date from Julian day

function jd_to_julian(td: number) {
  let z, a, alpha, b, c, d, e, year, month, day;

  td += 0.5;
  z = Math.floor(td);

  a = z;
  b = a + 1524;
  c = Math.floor((b - 122.1) / 365.25);
  d = Math.floor(365.25 * c);
  e = Math.floor((b - d) / 30.6001);

  month = Math.floor((e < 14) ? (e - 1) : (e - 13));
  year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
  day = b - d - Math.floor(30.6001 * e);

  /*  If year is less than 1, subtract one to convert from
        a zero based date system to the common era system in
        which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

  if (year < 1) {
    year--;
  }

  return [year, month, day];
}

//  HEBREW_TO_JD  --  Determine Julian day from Hebrew date

const HEBREW_EPOCH = 347995.5;

//  Is a given Hebrew year a leap year ?

function hebrew_leap(year: number) {
  return mod(((year * 7) + 1), 19) < 7;
}

//  How many months are there in a Hebrew year (12 = normal, 13 = leap)

function hebrew_year_months(year: number) {
  return hebrew_leap(year) ? 13 : 12;
}

//  Test for delay of start of new year and to avoid
//  Sunday, Wednesday, and Friday as start of the new year.

function hebrew_delay_1(year: number) {
  let months, day, parts;

  months = Math.floor(((235 * year) - 234) / 19);
  parts = 12084 + (13753 * months);
  day = (months * 29) + Math.floor(parts / 25920);

  if (mod((3 * (day + 1)), 7) < 3) {
    day++;
  }
  return day;
}

//  Check for delay in start of new year due to length of adjacent years

function hebrew_delay_2(year: number) {
  let last, present, next;

  last = hebrew_delay_1(year - 1);
  present = hebrew_delay_1(year);
  next = hebrew_delay_1(year + 1);

  return ((next - present) === 356)
    ? 2
    : (((present - last) === 382) ? 1 : 0);
}

//  How many days are in a Hebrew year ?

function hebrew_year_days(year: number) {
  return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
}

//  How many days are in a given month of a given year

function hebrew_month_days(year: number, month: number) {
  //  First of all, dispose of fixed-length 29 day months

  if (month === 2 || month === 4 || month === 6
        || month === 10 || month === 13) {
    return 29;
  }

  //  If it's not a leap year, Adar has 29 days

  if (month === 12 && !hebrew_leap(year)) {
    return 29;
  }

  //  If it's Heshvan, days depend on length of year

  if (month === 8 && !(mod(hebrew_year_days(year), 10) === 5)) {
    return 29;
  }

  //  Similarly, Kislev varies with the length of year

  if (month === 9 && (mod(hebrew_year_days(year), 10) === 3)) {
    return 29;
  }

  //  Nope, it's a 30 day month

  return 30;
}

//  Finally, wrap it all up into...

function hebrew_to_jd(year: number, month: number, day: number) {
  let jd, mon, months;

  months = hebrew_year_months(year);
  jd = HEBREW_EPOCH + hebrew_delay_1(year)
         + hebrew_delay_2(year) + day + 1;

  if (month < 7) {
    for (mon = 7; mon <= months; mon++) {
      jd += hebrew_month_days(year, mon);
    }
    for (mon = 1; mon < month; mon++) {
      jd += hebrew_month_days(year, mon);
    }
  }
  else {
    for (mon = 7; mon < month; mon++) {
      jd += hebrew_month_days(year, mon);
    }
  }

  return jd;
}

/*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                      This works by making multiple calls to
                      the inverse function, and is this very
                      slow.  */

function jd_to_hebrew(jd: number) {
  let year, month, day, i, count, first;

  jd = Math.floor(jd) + 0.5;
  count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
  year = count - 1;
  for (i = count; jd >= hebrew_to_jd(i, 7, 1); i++) {
    year++;
  }
  first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
  month = first;
  for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)); i++) {
    month++;
  }
  day = (jd - hebrew_to_jd(year, month, 1)) + 1;
  return [year, month, day];
}

/*  EQUINOXE_A_PARIS  --  Determine Julian day and fraction of the
                          September equinox at the Paris meridian in
                          a given Gregorian year.  */

function equinoxe_a_paris(year: number) {
  let equJED, equJD, equAPP, equParis, dtParis;

  //  September equinox in dynamical time
  equJED = equinox(year, 2);

  //  Correct for delta T to obtain Universal time
  equJD = equJED - (deltat(year) / (24 * 60 * 60));

  //  Apply the equation of time to yield the apparent time at Greenwich
  equAPP = equJD + equationOfTime(equJED);

  /*  Finally, we must correct for the constant difference between
        the Greenwich meridian and that of Paris, 2°20'15" to the
        East.  */

  dtParis = (2 + (20 / 60.0) + (15 / (60 * 60.0))) / 360;
  equParis = equAPP + dtParis;

  return equParis;
}

/*  PARIS_EQUINOXE_JD  --  Calculate Julian day during which the
                           September equinox, reckoned from the Paris
                           meridian, occurred for a given Gregorian
                           year.  */

function paris_equinoxe_jd(year: number) {
  let ep, epg;

  ep = equinoxe_a_paris(year);
  epg = Math.floor(ep - 0.5) + 0.5;

  return epg;
}

/*  ANNEE_DE_LA_REVOLUTION  --  Determine the year in the French
                                revolutionary calendar in which a
                                given Julian day falls.  Returns an
                                array of two elements:

                                    [0]  Année de la Révolution
                                    [1]  Julian day number containing
                                         equinox for this year.
*/

const FRENCH_REVOLUTIONARY_EPOCH = 2375839.5;

function annee_da_la_revolution(jd: number) {
  let guess = jd_to_gregorian(jd)[0] - 2;
  let lasteq;
  let nexteq;
  let adr;

  lasteq = paris_equinoxe_jd(guess);
  while (lasteq > jd) {
    guess--;
    lasteq = paris_equinoxe_jd(guess);
  }
  nexteq = lasteq - 1;
  while (!((lasteq <= jd) && (jd < nexteq))) {
    lasteq = nexteq;
    guess++;
    nexteq = paris_equinoxe_jd(guess);
  }
  adr = Math.round((lasteq - FRENCH_REVOLUTIONARY_EPOCH) / TropicalYear) + 1;

  return [adr, lasteq];
}

/*  JD_TO_FRENCH_REVOLUTIONARY  --  Calculate date in the French Revolutionary
                                    calendar from Julian day.  The five or six
                                    "sansculottides" are considered a thirteenth
                                    month in the results of this function.  */

function jd_to_french_revolutionary(jd: number) {
  let an, mois, decade, jour,
    adr, equinoxe;

  jd = Math.floor(jd) + 0.5;
  adr = annee_da_la_revolution(jd);
  an = adr[0];
  equinoxe = adr[1];
  mois = Math.floor((jd - equinoxe) / 30) + 1;
  jour = (jd - equinoxe) % 30;
  decade = Math.floor(jour / 10) + 1;
  jour = (jour % 10) + 1;

  return [an, mois, decade, jour];
}

/*  FRENCH_REVOLUTIONARY_TO_JD  --  Obtain Julian day from a given French
                                    Revolutionary calendar date.  */

function french_revolutionary_to_jd(an: number, mois: number, decade: number, jour: number) {
  let adr, equinoxe, guess, jd;

  guess = FRENCH_REVOLUTIONARY_EPOCH + (TropicalYear * ((an - 1) - 1));
  adr = [an - 1, 0];

  while (adr[0] < an) {
    adr = annee_da_la_revolution(guess);
    guess = adr[1] + (TropicalYear + 2);
  }
  equinoxe = adr[1];

  jd = equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
  return jd;
}

//  LEAP_ISLAMIC  --  Is a given year a leap year in the Islamic calendar ?

function leap_islamic(year: number) {
  return (((year * 11) + 14) % 30) < 11;
}

//  ISLAMIC_TO_JD  --  Determine Julian day from Islamic date

const ISLAMIC_EPOCH = 1948439.5;
const ISLAMIC_WEEKDAYS = ['al-\'ahad (الأحد)', 'al-\'ithnayn (الإثنين)',
  'ath-thalatha\' (الثلاثاء)', 'al-\'arb`a\' (الأربعاء)',
  'al-khamis (الخميس)', 'al-jum`a (الجمعة)', 'as-sabt (السبت)'];

function islamic_to_jd(year: number, month: number, day: number) {
  return (day
            + Math.ceil(29.5 * (month - 1))
            + (year - 1) * 354
            + Math.floor((3 + (11 * year)) / 30)
            + ISLAMIC_EPOCH) - 1;
}

//  JD_TO_ISLAMIC  --  Calculate Islamic date from Julian day

function jd_to_islamic(jd: number) {
  let year, month, day;

  jd = Math.floor(jd) + 0.5;
  year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
  month = Math.min(12,
    Math.ceil((jd - (29 + islamic_to_jd(year, 1, 1))) / 29.5) + 1);
  day = (jd - islamic_to_jd(year, month, 1)) + 1;
  return [year, month, day];
}

/*  TEHRAN_EQUINOX  --  Determine Julian day and fraction of the
                        March equinox at the Tehran meridian in
                        a given Gregorian year.  */

function tehran_equinox(year: number) {
  let equJED, equJD, equAPP, equTehran, dtTehran;

  //  March equinox in dynamical time
  equJED = equinox(year, 0);

  //  Correct for delta T to obtain Universal time
  equJD = equJED - (deltat(year) / (24 * 60 * 60));

  //  Apply the equation of time to yield the apparent time at Greenwich
  equAPP = equJD + equationOfTime(equJED);

  /*  Finally, we must correct for the constant difference between
        the Greenwich meridian andthe time zone standard for
    Iran Standard time, 52°30' to the East.  */

  dtTehran = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
  equTehran = equAPP + dtTehran;

  return equTehran;
}

/*  TEHRAN_EQUINOX_JD  --  Calculate Julian day during which the
                           March equinox, reckoned from the Tehran
                           meridian, occurred for a given Gregorian
                           year.  */

function tehran_equinox_jd(year: number) {
  const ep = tehran_equinox(year);
  const epg = Math.floor(ep);

  return epg;
}

/*  PERSIANA_YEAR  --  Determine the year in the Persian
                       astronomical calendar in which a
                       given Julian day falls.  Returns an
                        array of two elements:

                            [0]  Persian year
                            [1]  Julian day number containing
                                 equinox for this year.
*/

const PERSIAN_EPOCH = 1948320.5;
const PERSIAN_WEEKDAYS = [
  'Yekshanbeh (یکشنبه)', 'Doshanbeh (دوشنبه)', 'Seshhanbeh (سه‌شنبه)',
  'Chaharshanbeh (چهارشنبه)', 'Panjshanbeh (پنجشنبه)', 'Jomeh (جمعه)',
  'Shanbeh (شنبه)'];

function persiana_year(jd: number) {
  let guess = jd_to_gregorian(jd)[0] - 2;
  let lasteq;
  let nexteq;
  let adr;

  lasteq = tehran_equinox_jd(guess);
  while (lasteq > jd) {
    guess--;
    lasteq = tehran_equinox_jd(guess);
  }
  nexteq = lasteq - 1;
  while (!((lasteq <= jd) && (jd < nexteq))) {
    lasteq = nexteq;
    guess++;
    nexteq = tehran_equinox_jd(guess);
  }
  adr = Math.round((lasteq - PERSIAN_EPOCH) / TropicalYear) + 1;

  return [adr, lasteq];
}

/*  JD_TO_PERSIANA  --  Calculate date in the Persian astronomical
                        calendar from Julian day.  */

function jd_to_persiana(jd: number) {
  let year, month, day,
    adr, equinox, yday;

  jd = Math.floor(jd) + 0.5;
  adr = persiana_year(jd);
  year = adr[0];
  equinox = adr[1];
  day = Math.floor((jd - equinox) / 30) + 1;

  yday = (Math.floor(jd) - persiana_to_jd(year, 1, 1)) + 1;
  month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
  day = (Math.floor(jd) - persiana_to_jd(year, month, 1)) + 1;

  return [year, month, day];
}

/*  PERSIANA_TO_JD  --  Obtain Julian day from a given Persian
                        astronomical calendar date.  */

function persiana_to_jd(year: number, month: number, day: number) {
  let adr, equinox, guess, jd;

  guess = (PERSIAN_EPOCH - 1) + (TropicalYear * ((year - 1) - 1));
  adr = [year - 1, 0];

  while (adr[0] < year) {
    adr = persiana_year(guess);
    guess = adr[1] + (TropicalYear + 2);
  }
  equinox = adr[1];

  jd = equinox
            + ((month <= 7)
              ? ((month - 1) * 31)
              : (((month - 1) * 30) + 6)
            )
            + (day - 1);
  return jd;
}

/*  LEAP_PERSIANA  --  Is a given year a leap year in the Persian
                       astronomical calendar ?  */

function leap_persiana(year: number) {
  return (persiana_to_jd(year + 1, 1, 1)
            - persiana_to_jd(year, 1, 1)) > 365;
}

//  LEAP_PERSIAN  --  Is a given year a leap year in the Persian calendar ?

function leap_persian(year: number) {
  return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
}

//  PERSIAN_TO_JD  --  Determine Julian day from Persian date

function persian_to_jd(year: number, month: number, day: number) {
  let epbase, epyear;

  epbase = year - ((year >= 0) ? 474 : 473);
  epyear = 474 + mod(epbase, 2820);

  return day
            + ((month <= 7)
              ? ((month - 1) * 31)
              : (((month - 1) * 30) + 6)
            )
            + Math.floor(((epyear * 682) - 110) / 2816)
            + (epyear - 1) * 365
            + Math.floor(epbase / 2820) * 1029983
            + (PERSIAN_EPOCH - 1);
}

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day

function jd_to_persian(jd: number) {
  let year, month, day, depoch, cycle, cyear, ycycle,
    aux1, aux2, yday;

  jd = Math.floor(jd) + 0.5;

  depoch = jd - persian_to_jd(475, 1, 1);
  cycle = Math.floor(depoch / 1029983);
  cyear = mod(depoch, 1029983);
  if (cyear === 1029982) {
    ycycle = 2820;
  }
  else {
    aux1 = Math.floor(cyear / 366);
    aux2 = mod(cyear, 366);
    ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522)
                    + aux1 + 1;
  }
  year = ycycle + (2820 * cycle) + 474;
  if (year <= 0) {
    year--;
  }
  yday = (jd - persian_to_jd(year, 1, 1)) + 1;
  month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
  day = (jd - persian_to_jd(year, month, 1)) + 1;
  return [year, month, day];
}

//  MAYAN_COUNT_TO_JD  --  Determine Julian day from Mayan long count

const MAYAN_COUNT_EPOCH = 584282.5;

function mayan_count_to_jd(baktun: number, katun: number, tun: number, uinal: number, kin: number) {
  return MAYAN_COUNT_EPOCH
           + (baktun * 144000)
           + (katun * 7200)
           + (tun * 360)
           + (uinal * 20)
           + kin;
}

//  JD_TO_MAYAN_COUNT  --  Calculate Mayan long count from Julian day

function jd_to_mayan_count(jd: number) {
  let d, baktun, katun, tun, uinal, kin;

  jd = Math.floor(jd) + 0.5;
  d = jd - MAYAN_COUNT_EPOCH;
  baktun = Math.floor(d / 144000);
  d = mod(d, 144000);
  katun = Math.floor(d / 7200);
  d = mod(d, 7200);
  tun = Math.floor(d / 360);
  d = mod(d, 360);
  uinal = Math.floor(d / 20);
  kin = mod(d, 20);

  return [baktun, katun, tun, uinal, kin];
}

//  JD_TO_MAYAN_HAAB  --  Determine Mayan Haab "month" and day from Julian day

const MAYAN_HAAB_MONTHS = ['Pop', 'Uo', 'Zip', 'Zotz', 'Tzec', 'Xul',
  'Yaxkin', 'Mol', 'Chen', 'Yax', 'Zac', 'Ceh',
  'Mac', 'Kankin', 'Muan', 'Pax', 'Kayab', 'Cumku', 'Uayeb'];

function jd_to_mayan_haab(jd: number) {
  jd = Math.floor(jd) + 0.5;
  const lcount = jd - MAYAN_COUNT_EPOCH;
  const day = mod(lcount + 8 + ((18 - 1) * 20), 365);

  return [Math.floor(day / 20) + 1, mod(day, 20)];
}

//  JD_TO_MAYAN_TZOLKIN  --  Determine Mayan Tzolkin "month" and day from Julian day

const MAYAN_TZOLKIN_MONTHS = ['Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan',
  'Cimi', 'Manik', 'Lamat', 'Muluc', 'Oc',
  'Chuen', 'Eb', 'Ben', 'Ix', 'Men',
  'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau'];

function jd_to_mayan_tzolkin(jd: number) {
  let lcount;

  jd = Math.floor(jd) + 0.5;
  lcount = jd - MAYAN_COUNT_EPOCH;
  return [amod(lcount + 20, 20), amod(lcount + 4, 13)];
}

//  INDIAN_CIVIL_TO_JD  --  Obtain Julian day for Indian Civil date

const INDIAN_CIVIL_WEEKDAYS = ['ravivara (रविवार)',
  'somavara (सोमवार)', 'mangalavara (मंगलवार)',
  'budhavara (बुधवार)', 'brahaspativara (बृहस्पतिवार)',
  'sukravara (शुक्रवार)', 'sanivara (शनिवार)'];

function indian_civil_to_jd(year: number, month: number, day: number) {
  let Caitra, gyear, leap, start, jd, m;

  gyear = year + 78;
  leap = leap_gregorian(gyear); // Is this a leap year ?
  start = gregorian_to_jd(gyear, 3, leap ? 21 : 22);
  Caitra = leap ? 31 : 30;

  if (month === 1) {
    jd = start + (day - 1);
  }
  else {
    jd = start + Caitra;
    m = month - 2;
    m = Math.min(m, 5);
    jd += m * 31;
    if (month >= 8) {
      m = month - 7;
      jd += m * 30;
    }
    jd += day - 1;
  }

  return jd;
}

//  JD_TO_INDIAN_CIVIL  --  Calculate Indian Civil date from Julian day

function jd_to_indian_civil(jd: number) {
  let Caitra, Saka, greg, greg0, leap, start, year, yday, mday, month, day;

  Saka = 79 - 1; // Offset in years from Saka era to Gregorian epoch
  start = 80; // Day offset between Saka and Gregorian

  jd = Math.floor(jd) + 0.5;
  greg = jd_to_gregorian(jd); // Gregorian date for Julian day
  leap = leap_gregorian(greg[0]); // Is this a leap year?
  year = greg[0] - Saka; // Tentative year in Saka era
  greg0 = gregorian_to_jd(greg[0], 1, 1); // JD at start of Gregorian year
  yday = jd - greg0; // Day number (0 based) in Gregorian year
  Caitra = leap ? 31 : 30; // Days in Caitra this year

  if (yday < start) {
    //  Day is at the end of the preceding Saka year
    year--;
    yday += Caitra + (31 * 5) + (30 * 3) + 10 + start;
  }

  yday -= start;
  if (yday < Caitra) {
    month = 1;
    day = yday + 1;
  }
  else {
    mday = yday - Caitra;
    if (mday < (31 * 5)) {
      month = Math.floor(mday / 31) + 2;
      day = (mday % 31) + 1;
    }
    else {
      mday -= 31 * 5;
      month = Math.floor(mday / 30) + 7;
      day = (mday % 30) + 1;
    }
  }

  return [year, month, day];
}

export class CalendarConverter {
  public document = reactive({
    gregorian: {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      min: 0,
      sec: 0,
      wday: '',
      leap: '',
    },
    modifiedjulianday: {
      day: 0,
    },
    julianday: {
      day: 0,
    },
    juliancalendar: {
      year: 0,
      month: 0,
      day: 0,
      wday: '',
      leap: '',
    },
    hebrew: {
      is_leap: false,
      year: 0,
      month: 0,
      day: 0,
      leap: '',
    },
    islamic: {
      year: 0,
      month: 0,
      day: 0,
      wday: '',
      leap: '',
    },
    persian: {
      year: 0,
      month: 0,
      day: 0,
      wday: '',
      leap: '',
    },
    persiana: {
      year: 0,
      month: 0,
      day: 0,
      wday: '',
      leap: '',
    },
    mayancount: {
      baktun: 0,
      katun: 0,
      tun: 0,
      uinal: 0,
      kin: 0,
      haab: '',
      tzolkin: '',
    },
    indiancivilcalendar: {
      year: 0,
      month: 0,
      day: 0,
      weekday: '',
      leap: '',
    },
    french: {
      an: 0,
      mois: 0,
      decade: 0,
      jour: 0,
    },
    gregserial: {
      day: 0,
    },
    excelserial1900: {
      day: 0,
    },
    excelserial1904: {
      day: 0,
    },
    unixtime: {
      time: 0,
    },
    isoweek: {
      year: 0,
      week: 0,
      day: 0,
    },
    isoday: {
      year: 0,
      day: 0,
    },
  });
  /*  updateFromGregorian  --  Update all calendars from Gregorian.
                             "Why not Julian date?" you ask.  Because
                             starting from Gregorian guarantees we're
                             already snapped to an integral second, so
                             we don't get roundoff errors in other
                             calendars.  */

  updateFromGregorian() {
    let j, year, mon, mday, hour, min, sec,
      weekday, julcal, hebcal, islcal, hmindex, utime, isoweek,
      may_countcal, mayhaabcal, maytzolkincal, frrcal,
      indcal, isoday, xgregcal;

    year = (this.document.gregorian.year);
    mon = this.document.gregorian.month;
    mday = (this.document.gregorian.day);
    hour = min = sec = 0;
    hour = (this.document.gregorian.hour);
    min = (this.document.gregorian.min);
    sec = (this.document.gregorian.sec);

    //  Update Julian day

    j = gregorian_to_jd(year, mon, mday)
           + (Math.floor(sec + 60 * (min + 60 * hour) + 0.5) / 86400.0);

    this.document.julianday.day = j;
    this.document.modifiedjulianday.day = j - JMJD;

    //  Update day of week in Gregorian box

    weekday = jwday(j);
    this.document.gregorian.wday = Weekdays[weekday];

    //  Update leap year status in Gregorian box

    this.document.gregorian.leap = NormLeap[leap_gregorian(year) ? 1 : 0];

    //  Update Julian Calendar

    julcal = jd_to_julian(j);
    this.document.juliancalendar.year = julcal[0];
    this.document.juliancalendar.month = julcal[1];
    this.document.juliancalendar.day = julcal[2];
    this.document.juliancalendar.leap = NormLeap[leap_julian(julcal[0]) ? 1 : 0];
    weekday = jwday(j);
    this.document.juliancalendar.wday = Weekdays[weekday];

    //  Update Hebrew Calendar

    hebcal = jd_to_hebrew(j);
    this.document.hebrew.is_leap = hebrew_leap(hebcal[0]);
    this.document.hebrew.year = hebcal[0];
    this.document.hebrew.month = hebcal[1];
    this.document.hebrew.day = hebcal[2];
    hmindex = hebcal[1];
    if (hmindex === 12 && !hebrew_leap(hebcal[0])) {
      hmindex = 14;
    }
    switch (hebrew_year_days(hebcal[0])) {
      case 353:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.common-deficient-353-days');
        break;

      case 354:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.common-regular-354-days');
        break;

      case 355:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.common-complete-355-days');
        break;

      case 383:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.embolismic-deficient-383-days');
        break;

      case 384:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.embolismic-regular-384-days');
        break;

      case 385:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.embolismic-complete-385-days');
        break;

      default:
        this.document.hebrew.leap = t('tools.calendar-converter.service.text.invalid-year-length-hebrew_year_days-hebcal-0-days',
          [hebrew_year_days(hebcal[0])]);
        break;
    }

    //  Update Islamic Calendar

    islcal = jd_to_islamic(j);
    this.document.islamic.year = islcal[0];
    this.document.islamic.month = islcal[1];
    this.document.islamic.day = islcal[2];
    this.document.islamic.wday = `yawm ${ISLAMIC_WEEKDAYS[weekday]}`;
    this.document.islamic.leap = NormLeap[leap_islamic(islcal[0]) ? 1 : 0];

    //  Update Persian Calendar

    let perscal = jd_to_persian(j);
    this.document.persian.year = perscal[0];
    this.document.persian.month = perscal[1];
    this.document.persian.day = perscal[2];
    this.document.persian.wday = PERSIAN_WEEKDAYS[weekday];
    this.document.persian.leap = NormLeap[leap_persian(perscal[0]) ? 1 : 0];

    //  Update Persian Astronomical Calendar

    perscal = jd_to_persiana(j);
    this.document.persiana.year = perscal[0];
    this.document.persiana.month = perscal[1];
    this.document.persiana.day = perscal[2];
    this.document.persiana.wday = PERSIAN_WEEKDAYS[weekday];
    this.document.persiana.leap = NormLeap[leap_persiana(perscal[0]) ? 1 : 0];

    //  Update Mayan Calendars

    may_countcal = jd_to_mayan_count(j);
    this.document.mayancount.baktun = may_countcal[0];
    this.document.mayancount.katun = may_countcal[1];
    this.document.mayancount.tun = may_countcal[2];
    this.document.mayancount.uinal = may_countcal[3];
    this.document.mayancount.kin = may_countcal[4];
    mayhaabcal = jd_to_mayan_haab(j);
    this.document.mayancount.haab = `${mayhaabcal[1]} ${MAYAN_HAAB_MONTHS[mayhaabcal[0] - 1]}`;
    maytzolkincal = jd_to_mayan_tzolkin(j);
    this.document.mayancount.tzolkin = `${maytzolkincal[1]} ${MAYAN_TZOLKIN_MONTHS[maytzolkincal[0] - 1]}`;

    //  Update Indian Civil Calendar

    indcal = jd_to_indian_civil(j);
    this.document.indiancivilcalendar.year = indcal[0];
    this.document.indiancivilcalendar.month = indcal[1];
    this.document.indiancivilcalendar.day = indcal[2];
    this.document.indiancivilcalendar.weekday = INDIAN_CIVIL_WEEKDAYS[weekday];
    this.document.indiancivilcalendar.leap = NormLeap[leap_gregorian(indcal[0] + 78) ? 1 : 0];

    //  Update French Republican Calendar

    frrcal = jd_to_french_revolutionary(j);
    this.document.french.an = frrcal[0];
    this.document.french.mois = frrcal[1] - 1;
    this.document.french.decade = frrcal[2] - 1;
    this.document.french.jour = ((frrcal[1] <= 12) ? frrcal[3] : (frrcal[3] + 11)) - 1;

    //  Update Gregorian serial number

    if (this.document.gregserial != null) {
      this.document.gregserial.day = j - J0000;
    }

    //  Update Excel 1900 and 1904 day serial numbers

    this.document.excelserial1900.day = (j - J1900) + 1
            /*  Microsoft marching morons thought 1900 was a leap year.
                Adjust dates after 1900-02-28 to compensate for their
                idiocy.  */
            + ((j > 2415078.5) ? 1 : 0)
    ;
    this.document.excelserial1904.day = j - J1904;

    //  Update Unix time()

    utime = (j - J1970) * (60 * 60 * 24 * 1000);
    this.document.unixtime.time = Math.round(utime / 1000);

    //  Update ISO Week

    isoweek = jd_to_iso(j);
    this.document.isoweek.year = isoweek[0];
    this.document.isoweek.week = isoweek[1];
    this.document.isoweek.day = isoweek[2];

    //  Update ISO Day

    isoday = jd_to_iso_day(j);
    this.document.isoday.year = isoday[0];
    this.document.isoday.day = isoday[1];
  }

  //  calcGregorian  --  Perform calculation starting with a Gregorian date

  calcGregorian() {
    this.updateFromGregorian();
  }

  //  calcJulian  --  Perform calculation starting with a Julian date

  calcJulian() {
    let j, date, time;

    j = (this.document.julianday.day);
    date = jd_to_gregorian(j);
    time = jhms(j);
    this.document.gregorian.year = date[0];
    this.document.gregorian.month = date[1];
    this.document.gregorian.day = date[2];
    this.document.gregorian.hour = time[0];
    this.document.gregorian.min = time[1];
    this.document.gregorian.sec = time[2];
    this.updateFromGregorian();
  }

  //  setJulian  --  Set Julian date and update all calendars

  setJulian(j: number) {
    this.document.julianday.day = (j);
    this.calcJulian();
  }

  //  calcModifiedJulian  --  Update from Modified Julian day

  calcModifiedJulian() {
    this.setJulian(((this.document.modifiedjulianday.day)) + JMJD);
  }

  //  calcJulianCalendar  --  Update from Julian calendar

  calcJulianCalendar() {
    this.setJulian(julian_to_jd(((this.document.juliancalendar.year)),
      this.document.juliancalendar.month,
      ((this.document.juliancalendar.day))));
  }

  //  calcHebrew  --  Update from Hebrew calendar

  calcHebrew() {
    this.setJulian(hebrew_to_jd(((this.document.hebrew.year)),
      this.document.hebrew.month,
      ((this.document.hebrew.day))));
  }

  //  calcIslamic  --  Update from Islamic calendar

  calcIslamic() {
    this.setJulian(islamic_to_jd(((this.document.islamic.year)),
      this.document.islamic.month,
      ((this.document.islamic.day))));
  }

  //  calcPersian  --  Update from Persian calendar

  calcPersian() {
    this.setJulian(persian_to_jd(((this.document.persian.year)),
      this.document.persian.month,
      ((this.document.persian.day))));
  }

  //  calcPersiana  --  Update from Persian astronomical calendar

  calcPersiana() {
    this.setJulian(persiana_to_jd(((this.document.persiana.year)),
      this.document.persiana.month,
      ((this.document.persiana.day))) + 0.5);
  }

  //  calcMayanCount  --  Update from the Mayan Long Count

  calcMayanCount() {
    this.setJulian(mayan_count_to_jd(((this.document.mayancount.baktun)),
      ((this.document.mayancount.katun)),
      ((this.document.mayancount.tun)),
      ((this.document.mayancount.uinal)),
      ((this.document.mayancount.kin))));
  }

  //  calcIndianCivilCalendar  --  Update from Indian Civil Calendar

  calcIndianCivilCalendar() {
    this.setJulian(indian_civil_to_jd(
      ((this.document.indiancivilcalendar.year)),
      this.document.indiancivilcalendar.month,
      ((this.document.indiancivilcalendar.day))));
  }

  //  calcFrench  -- Update from French Republican calendar

  calcFrench() {
    let decade, j, mois;

    j = this.document.french.jour;
    decade = this.document.french.decade;
    mois = this.document.french.mois;

    /*  If the currently selected day is one of the sansculottides,
        adjust the index to be within that period and force the
        decade to zero and the month to 12, designating the
        intercalary interval.  */

    if (j > 9) {
      j -= 11;
      decade = 0;
      mois = 12;
    }

    /*  If the selected month is the pseudo-month of the five or
        six sansculottides, ensure that the decade is 0 and the day
        number doesn't exceed six.  To avoid additional overhead, we
        don't test whether a day number of 6 is valid for this year,
        but rather simply permit it to wrap into the first day of
        the following year if this is a 365 day year.  */

    if (mois === 12) {
      decade = 0;
      if (j > 5) {
        j = 0;
      }
    }

    this.setJulian(french_revolutionary_to_jd(((this.document.french.an)),
      mois + 1,
      decade + 1,
      j + 1));
  }

  //  calcGregSerial  --  Update from Gregorian serial day number

  calcGregSerial() {
    this.setJulian(((this.document.gregserial.day)) + J0000);
  }

  //  calcExcelSerial1900  --  Perform calculation starting with an Excel 1900 serial date

  calcExcelSerial1900() {
    let d = (this.document.excelserial1900.day);

    /* Idiot Kode Kiddies didn't twig to the fact
       (proclaimed in 1582) that 1900 wasn't a leap year,
       so every Excel day number in every database on Earth
       which represents a date subsequent to February 28,
       1900 is off by one.  Note that there is no
       acknowledgement of this betrayal or warning of its
       potential consequences in the Excel help file.  Thank
       you so much Mister Talking Paper Clip.  Some day
       we're going to celebrate your extinction like it was
       February 29 ... 1900.  */

    if (d > 60) {
      d--;
    }

    this.setJulian((d - 1) + J1900);
  }

  //  calcExcelSerial1904  --  Perform calculation starting with an Excel 1904 serial date

  calcExcelSerial1904() {
    this.setJulian(((this.document.excelserial1904.day)) + J1904);
  }

  //  calcUnixTime  --  Update from specified Unix time() value

  calcUnixTime() {
    const t = (this.document.unixtime.time);

    this.setJulian(J1970 + (t / (60 * 60 * 24)));
  }

  //  calcIsoWeek  --  Update from specified ISO year, week, and day

  calcIsoWeek() {
    const year = (this.document.isoweek.year);
    const week = (this.document.isoweek.week);
    const day = (this.document.isoweek.day);

    this.setJulian(iso_to_julian(year, week, day));
  }

  //  calcIsoDay  --  Update from specified ISO year and day of year

  calcIsoDay() {
    const year = (this.document.isoday.year);
    const day = (this.document.isoday.day);

    this.setJulian(iso_day_to_julian(year, day));
  }

  /*  setDateToToday  --  Preset the fields in
    the request form to today's date.  */
  setDateToToday() {
    const today = new Date();

    this.document.gregorian.year = today.getFullYear();
    this.document.gregorian.month = today.getMonth() + 1;
    this.document.gregorian.day = today.getDate();
    this.document.gregorian.hour = 0;
    this.document.gregorian.min = 0;
    this.document.gregorian.sec = 0;
  }

  constructor() {
    this.setDateToToday();
    this.updateFromGregorian();
  }
}
