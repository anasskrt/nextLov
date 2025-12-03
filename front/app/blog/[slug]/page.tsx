import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getAllSlugs, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LatestBlogPosts from "@/components/LatestBlogPosts";

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article introuvable | MSParking",
    };
  }

  return {
    title: `${post.title} | Blog MSParking`,
    description: post.summary,
    keywords: post.keywords || "parking aéroport Bordeaux, blog MSParking",
    alternates: {
      canonical: `https://msparking.fr/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.image],
      type: "article",
      publishedTime: post.published,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const posts = getAllPosts();

  if (!post) {
    notFound();
  }

  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* En-tête de l'article */}
        <div className="bg-gradient-to-br from-navy to-navy-light text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button variant="ghost" className="text-white hover:text-gold mb-6" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux articles
              </Link>
            </Button>
            <Badge variant="outline" className="mb-4 border-gold text-gold bg-gold/10">
              {post.label}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {post.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.published).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              {post.keywords && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{post.keywords.split(',')[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image principale */}
        {post.image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Contenu de l'article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-gold hover:prose-a:text-gold-dark prose-strong:text-navy prose-img:rounded-lg">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>

          {/* Appel à l'action */}
          <div className="mt-12 bg-gradient-to-r from-navy to-navy-light text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Besoin d'un parking sécurisé à Bordeaux ?
            </h3>
            <p className="text-white/90 mb-6">
              Réservez dès maintenant votre place de parking avec MSParking
            </p>
            <Button asChild className="bg-gold hover:bg-gold-light text-navy font-bold">
              <Link href="/">
                Réserver maintenant
              </Link>
            </Button>
          </div>
        </article>

        {/* Articles similaires */}
        <LatestBlogPosts posts={posts.filter(p => p.slug !== slug)} />
      </main>
      <Footer />
    </div>
    </>
  );
}
