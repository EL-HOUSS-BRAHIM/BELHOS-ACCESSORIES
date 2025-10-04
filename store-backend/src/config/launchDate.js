const DEFAULT_LAUNCH_DATE_ISO = '2025-10-01T09:00:00.000Z';

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getConfiguredLaunchDate = () => {
  const configured = parseDate(process.env.CAMPAIGN_LAUNCH_DATE);
  return configured || new Date(DEFAULT_LAUNCH_DATE_ISO);
};

const resolveTimestamp = (provided, { fallbackToCurrent = false } = {}) => {
  const parsedProvided = parseDate(provided);
  if (parsedProvided) {
    return parsedProvided;
  }

  if (!fallbackToCurrent) {
    return getConfiguredLaunchDate();
  }

  return new Date();
};

module.exports = {
  DEFAULT_LAUNCH_DATE_ISO,
  getConfiguredLaunchDate,
  resolveTimestamp,
};
