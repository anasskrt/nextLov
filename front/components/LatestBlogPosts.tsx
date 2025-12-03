"use client";

import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

const LatestBlogPosts = ({ posts }: LatestBlogPostsProps) => {
  // Afficher uniquement les 3 derniers articles
  const latestPosts = posts.slice(0, 3);

  if (latestPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-16">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-gold/10 text-gold border-gold/30 px-4 py-1">
            📰 Blog & Actualités
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
            Nos Derniers Articles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conseils pratiques, guides complets et actualités pour voyager sereinement depuis Bordeaux-Mérignac
          </p>
        </div>

        {/* Grille d'articles */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post, index) => (
            <Card
              key={post.slug}
              className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Image de l'article */}
              <Link href={`/blog/${post.slug}`} className="block relative overflow-hidden">
                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {/* Badge label sur l'image */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gold text-white border-0 shadow-md">
                    {post.label}
                  </Badge>
                </div>
              </Link>

              <CardContent className="p-6">
                {/* Meta informations */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(post.published).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Titre */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {/* Résumé */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.summary}
                </p>

                {/* Lien de lecture */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all group/link"
                >
                  Lire l'article
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton "Voir tous les articles" */}
        {posts.length > 3 && (
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-navy hover:bg-navy/90 text-white px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/blog" className="flex items-center gap-2">
                Voir tous les articles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlogPosts;
