export const parseInputToProps = (
  json: unknown,
  eventProps?: string[]
): Record<string, unknown> => {
  if (typeof json !== "object" || json === null) return {};
  if (!eventProps) return {};

  return eventProps.reduce<Record<string, unknown>>((acc, prop) => {
    if (prop in json) acc[prop] = (json as Record<string, unknown>)[prop];
    return acc;
  }, {});
};
