import { readItems } from '@directus/sdk';
import RSS from 'rss';

export default defineEventHandler(async event => {

  const feed = new RSS({
    title: 'Denis Starov',
    site_url: 'https://academy.chromatone.center',
    feed_url: `https://academy.chromatone.center/rss`,
  });

  const db = usePublicDirectus()

  const news = await db.request(readItems('news', {
    field: ['title', 'description', 'date_created', 'slug']
  }))

  for (const post of news) {
    feed.item({
      title: post?.title,
      url: `${useRuntimeConfig().public.appDomain}/news/${post?.slug}`,
      description: post?.description,
      date: post?.date_created,
      // categories: post.tag_list,
    });
  }

  const feedString = feed.xml({ indent: true });

  event.node.res.setHeader('content-type', 'text/xml');
  event.node.res.end(feedString);

})