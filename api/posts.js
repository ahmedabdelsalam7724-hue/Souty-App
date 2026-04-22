import { createClient } from '@vercel/kv';

export default async function handler(request, response) {
  try {
    const kv = createClient({
      url: process.env.STORAGE_REST_API_URL,
      token: process.env.STORAGE_REST_API_TOKEN,
    });

    const posts = await kv.get('all_posts') || [];
    return response.status(200).json(posts);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
