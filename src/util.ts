import Parser from "rss-parser";

type CustomFeed = { foo: string };
type CustomItem = { bar: number };

interface Post {
  title: string;
  subtitle: string;
  guid: string;
  link: string;
  body: string[];
  date: string;
  type: PostType;
}
type PostType = "Blog" | "Short Story";

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    feed: ["foo"],
    item: ["bar"],
  },
});

function cleanString(str: string) {
  const reg = /<(?!\/p\s*\/?)[^>]+>/g;
  const string = decodeCharacterReferences(str).replace(reg, "");
  const paragraphs = string.split("</p>");
  return paragraphs;
}

// Source: https://stackoverflow.com/a/4292506
function decodeCharacterReferences(s: string) {
  return s
    .replace(/&#(\d+);/g, function (_, n) {
      return String.fromCodePoint(parseInt(n, 10));
    })
    .replace(/&#x([0-9a-f]+);/gi, function (_, n) {
      return String.fromCodePoint(parseInt(n, 16));
    })
    .replace(/&amp;/g, "&");
}

async function getRSSFeed(url: string) {
  const feed = await parser.parseURL(url);
  const data = await feed.items;
  let posts: Post[] = [];

  data.forEach((item, index) => {
    const result = cleanString(Object.values(item)[4]);
    let type: PostType = "Blog";
    if (item.content) {
      type = item.content.slice(1, 2) == "S" ? "Short Story" : "Blog";
    }

    let newPost: Post = {
      title: `${item.title}`,
      subtitle: `${item.content}`,
      guid: `${item.guid}`,
      link: `${item.link}`,
      body: result,
      date: `${item.pubDate}`.slice(0, 16),
      type,
    };
    posts.push(newPost);
  });

  return posts;
}

export { getRSSFeed };
