import { ApifyClient } from 'apify-client';


import 'dotenv/config';
import { ApifyClient } from '@apify/client';

const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Environment variable APIFY_TOKEN is not set. Place your token in a .env or in the environment.');

// Initialize the ApifyClient with the token from the environment
const client = new ApifyClient({ token });


export async function runActor({ actorId, input = {}, options = {} } = {}) {
  if (!actorId) throw new Error('`actorId` is required (e.g. "user/actor-name" or actorId)');
  // `call` starts the actor and waits for completion (depending on actor configuration)
  const run = await client.actor(actorId).call(input, options);
  return run;
}

// Get items from a dataset (datasetId)
export async function getDatasetItems({ datasetId, limit = 100, desc = true } = {}) {
  if (!datasetId) throw new Error('`datasetId` is required');
  const params = { limit, desc };
  const { items } = await client.dataset(datasetId).listItems(params);
  return items;
}

export function getClient() { return client; }

export default client;