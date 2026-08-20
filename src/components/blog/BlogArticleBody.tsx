import Image from "next/image";
import { BlogPost, ContentBlock } from "@/types/Blog";
import VideoEmbed from "@/components/blog/VideoEmbed";

interface BlogArticleBodyProps {
  post: BlogPost;
  /** When true, omit the post title h1 (use when a parent already renders it). */
  omitTitle?: boolean;
}

function linkifyText(text: string): React.ReactNode {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-secondary-indigo hover:text-secondary-indigo/80"
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  const type =
    (block.type as string) === "heading" ? "h2" : block.type;

  switch (type) {
    case "h1":
      return (
        <h1
          key={index}
          className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl sm:mb-6 lg:text-4xl"
        >
          {block.text}
        </h1>
      );
    case "h2":
      return (
        <h2
          key={index}
          className="mb-4 text-xl font-bold text-text-primary sm:text-2xl sm:mb-6 lg:text-3xl"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={index}
          className="mb-4 text-lg font-bold text-text-primary sm:text-xl sm:mb-6 lg:text-2xl"
        >
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p
          key={index}
          className="mb-4 text-sm leading-relaxed text-text-secondary sm:text-base sm:mb-6 lg:text-lg"
        >
          {linkifyText(block.text || "")}
        </p>
      );
    case "code":
      return (
        <pre
          key={index}
          className="p-3 mb-6 overflow-x-auto text-xs text-green-400 bg-gray-900 rounded-xl sm:p-4 sm:text-sm sm:mb-8"
        >
          <code className="break-words whitespace-pre-wrap">{block.text}</code>
        </pre>
      );
    case "list":
      return (
        <ul
          key={index}
          className="mb-6 space-y-2 list-disc list-inside text-text-secondary sm:mb-8"
        >
          {block.items?.map((item, itemIndex) => (
            <li key={itemIndex} className="text-sm sm:text-base lg:text-lg">
              {linkifyText(item)}
            </li>
          ))}
        </ul>
      );
    case "image":
      return block.imageUrl ? (
        <figure key={index} className="mb-6 sm:mb-8">
          <Image
            src={block.imageUrl}
            alt={block.text || "Blog post image"}
            width={800}
            height={600}
            className="w-full h-auto rounded-xl"
            style={{ width: "100%", height: "auto" }}
            unoptimized
          />
          {block.text ? (
            <figcaption className="mt-2 text-xs italic text-center text-gray-600 sm:text-sm">
              {linkifyText(block.text)}
            </figcaption>
          ) : null}
        </figure>
      ) : null;
    case "video":
      return block.videoUrl ? (
        <div key={index} className="mb-6 sm:mb-8">
          <VideoEmbed videoUrl={block.videoUrl} caption={block.text} />
        </div>
      ) : null;
    default:
      return null;
  }
}

/**
 * Server-rendered article body — plain semantic HTML for crawlers.
 * No client hooks, no opacity:0 animations.
 */
export default function BlogArticleBody({
  post,
  omitTitle = false,
}: BlogArticleBodyProps) {
  return (
    <div className="space-y-6">
      {!omitTitle && (
        <h1 className="mb-4 text-2xl font-bold text-text-primary sm:text-3xl lg:text-4xl">
          {post.title}
        </h1>
      )}

      {post.excerpt ? (
        <p className="p-4 text-sm leading-relaxed rounded-xl bg-blue-50 text-text-secondary sm:p-6 sm:text-base lg:text-lg">
          {linkifyText(post.excerpt)}
        </p>
      ) : null}

      <div className="max-w-none prose prose-lg">
        {post.content?.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}
