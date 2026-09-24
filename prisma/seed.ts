import "dotenv/config";
import { db } from "./db";

const articles = [
  {
    gameSlug: "world-of-warcraft",
    title:
      "BIGDEAL DEMO — Understanding the World of Warcraft News Cycle",
    slug: "bigdeal-demo-world-of-warcraft-news-cycle",
    excerpt:
      "Demo article showing how BIGDEAL will organize World of Warcraft news, updates, context and research.",
    content:
      "DEMO CONTENT — This article exists only to demonstrate the BIGDEAL editorial system. It is not a real news report.",
  },
  {
    gameSlug: "aion-2",
    title: "BIGDEAL DEMO — Understanding the AION 2 Update Cycle",
    slug: "bigdeal-demo-aion-2-update-cycle",
    excerpt:
      "Demo article showing how BIGDEAL will organize AION 2 news, updates, context and research.",
    content:
      "DEMO CONTENT — This article exists only to demonstrate the BIGDEAL editorial system. It is not a real news report.",
  },
  {
    gameSlug: "diablo",
    title: "BIGDEAL DEMO — Understanding the Diablo Update Cycle",
    slug: "bigdeal-demo-diablo-update-cycle",
    excerpt:
      "Demo article showing how BIGDEAL will organize Diablo news, updates, context and research.",
    content:
      "DEMO CONTENT — This article exists only to demonstrate the BIGDEAL editorial system. It is not a real news report.",
  },
];

async function main() {
  console.log("Adding BIGDEAL demo articles...");

  const games = await db.orm.public.Game
    .select("id", "name", "slug")
    .all();

  for (const article of articles) {
    const game = games.find((item) => item.slug === article.gameSlug);

    if (!game) {
      throw new Error(`Game not found: ${article.gameSlug}`);
    }

    const existingArticles = await db.orm.public.Article
      .select("id", "slug")
      .all();

    const existing = existingArticles.find(
      (item) => item.slug === article.slug
    );

    if (existing) {
      console.log(`Skipping existing article: ${article.slug}`);
      continue;
    }

    await db.orm.public.Article
      .select(
        "id",
        "gameId",
        "title",
        "slug",
        "excerpt",
        "content",
        "status"
      )
      .create({
        gameId: game.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        status: "PUBLISHED",
      });

    console.log(`Created: ${article.title}`);
  }

  console.log("Demo articles completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.runtime().close();
  });