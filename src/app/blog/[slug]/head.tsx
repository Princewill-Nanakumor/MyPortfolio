import connectDB from "@/db/mongodb";
import blogPost from "@/models/blogPost";

interface BlogHeadProps {
  params: Promise<{ slug: string }>;
}

export default async function Head({ params }: BlogHeadProps) {
  const resolved = await params;
  const slug = decodeURIComponent(resolved.slug).trim();

  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      return null;
    }

    const post = await blogPost.findOne({ slug, published: true }).lean();
    if (!post) {
      return null;
    }

    const title = `${post.title} | Nanakumor Princewill`;
    const description =
      post.excerpt?.trim() ||
      "Read software engineering articles by Nanakumor Princewill.";
    const canonicalUrl = `https://princewillnanakumor.com/blog/${post.slug}`;
    const imageUrl = post.image?.trim() || "https://princewillnanakumor.com/myPhoto.jpg";

    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </>
    );
  } catch (error) {
    console.error("Failed to generate blog head metadata:", error);
    return null;
  }
}
