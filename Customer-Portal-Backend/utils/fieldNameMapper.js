export const renameFields = (obj, mapping) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [mapping[key] || key, value])
    );
  }
  