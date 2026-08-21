export type ProjectBlogRef = {
  slug: string;
  blogSlug?: string;
};

export type PublishedBlogRef = {
  slug: string;
  projectSlug?: string;
};

/**
 * Pure matcher used by project detail pages for the Read Blog button.
 * Order: explicit project.blogSlug → post.projectSlug → blog slug shape.
 */
export function selectBlogSlugForProject(
  project: ProjectBlogRef,
  posts: PublishedBlogRef[]
): string | null {
  if (posts.length === 0) return null;

  if (project.blogSlug) {
    const exact = posts.find((post) => post.slug === project.blogSlug);
    if (exact) return exact.slug;
  }

  const byProjectField = posts.find(
    (post) => post.projectSlug && post.projectSlug === project.slug
  );
  if (byProjectField) return byProjectField.slug;

  const bySlugShape = posts.find((post) => {
    const s = post.slug;
    return (
      s === project.slug ||
      s.startsWith(`${project.slug}-`) ||
      s.includes(`-${project.slug}-`) ||
      s.endsWith(`-${project.slug}`)
    );
  });
  if (bySlugShape) return bySlugShape.slug;

  return null;
}
