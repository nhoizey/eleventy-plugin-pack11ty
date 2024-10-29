// Luxon is already an Eleventy dependency anyway
import { DateTime } from 'luxon';

// TODO: allow setting the timezone and locale
const timezone = 'Europe/Paris';
const locale = 'en-GB';

const dateObj = (eleventyDate) => {
	if (eleventyDate === undefined) {
		return DateTime.now().setZone(timezone).setLocale(locale);
	}
	return DateTime.fromJSDate(eleventyDate, {
		zone: timezone,
	}).setLocale(locale);
};

// 14 October 1983
export const readableDate = (date) =>
	dateObj(date).toLocaleString(DateTime.DATE_FULL);

// 14 October 1983
export const readableDateTime = (date) =>
	dateObj(date).toLocaleString(DateTime.DATETIME_FULL);

// 1983-10-14
export const attributeDate = (date) => dateObj(date).toISODate();

// 1983-10-14T20:04:00.000Z
export const isoDate = (date) => dateObj(date).toUTC().toISO();

export const readableDateFromIso = (date) =>
	DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_FULL);
