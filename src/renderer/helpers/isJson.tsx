import Ajv from 'ajv';

export const isJson = (data: string) => {
  const ajv = new Ajv({ allErrors: true, schemaId: 'auto' });
  const validate = ajv.compile(true);
  const valid = validate(data);

  return valid;
};
