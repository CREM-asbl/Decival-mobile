// Minimal zod-like stand-in for unit-testing astro:actions handlers.
// Mirrors only the parse() semantics used by reportBug.ts.
function makeStringValidator() {
  const state = { minLen: null, maxLen: null, hasDefault: false, defaultValue: undefined, isOptional: false };
  const api = {
    min: (n) => { state.minLen = n; return api; },
    max: (n) => { state.maxLen = n; return api; },
    optional: () => { state.isOptional = true; return api; },
    default: (v) => { state.hasDefault = true; state.defaultValue = v; return api; },
    _state: state,
  };
  return api;
}

function makeChainable() {
  const withDefault = (v) => ({ default: () => v, optional: () => ({ default: () => ({}) }) });
  return {
    min: () => makeChainable(),
    max: () => makeChainable(),
    optional: () => ({ default: withDefault }),
    default: withDefault,
  };
}

export const z = {
  object: (shape) => ({
    parse: (data) => {
      const out = { ...data };
      for (const [k, validator] of Object.entries(shape)) {
        const v = out[k];
        const state = validator._state;
        if (state) {
          const hasDefault = state.hasDefault;
          const isOptional = state.isOptional;
          if ((v === undefined || v === null) && !hasDefault && !isOptional) {
            throw new Error(k + ' requis');
          }
          if (hasDefault && (v === undefined || v === null)) {
            out[k] = state.defaultValue;
            continue;
          }
          if (v === undefined || v === null) continue;
          if (typeof v !== 'string') throw new Error(k + ' doit etre une chaine');
          if (state.minLen !== null && v.length < state.minLen) {
            throw new Error(k + ' trop court');
          }
          if (state.maxLen !== null && v.length > state.maxLen) {
            throw new Error(k + ' trop long');
          }
        } else {
          const hasDefault = typeof validator.default === 'function';
          const isOptional = typeof validator.optional === 'function';
          if ((v === undefined || v === null || v === '') && !hasDefault && !isOptional) {
            throw new Error(k + ' requis');
          }
          if (hasDefault && (v === undefined || v === null)) {
            out[k] = validator.default(undefined);
          }
        }
      }
      return out;
    },
  }),
  string: () => makeStringValidator(),
  record: () => makeChainable(),
  unknown: () => makeChainable(),
};
export default z;