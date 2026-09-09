const OPERATOR_KEY = /^\$/;

export function assertNoMongoOperators(value: unknown, path = "body"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoMongoOperators(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      if (OPERATOR_KEY.test(key) || key.includes(".")) {
        throw new Error(`Disallowed query operator at ${path}.${key}`);
      }
      assertNoMongoOperators(nested, `${path}.${key}`);
    }
  }
}
