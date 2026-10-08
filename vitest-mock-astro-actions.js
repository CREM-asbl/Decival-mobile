// Mock for astro:actions defineAction in vitest.
// Mirrors server-side behavior: parses input through def.input schema,
// then calls handler with the parsed data.
export const defineAction = (def) => {
  const handler = def.handler;
  const fn = async (input) => {
    const parsed = def.input && def.input.parse ? def.input.parse(input) : input;
    return handler(parsed);
  };
  fn.handler = handler;
  return fn;
};