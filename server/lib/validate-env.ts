export function validateEnv() {
  const required = [
    'SANITY_PROJECT_ID',
    'SANITY_DATASET',
    'SANITY_TOKEN'
  ];

  for (const name of required) {
    if (!process.env[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
}
