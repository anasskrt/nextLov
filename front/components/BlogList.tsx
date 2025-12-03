import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";

interface BlogListProps {
  tagline?: string;
  heading?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  posts: BlogPost[];
  showAll?: boolean;
}

const BlogList = ({
  tagline = "Actualités & Conseils",
  heading = "Blog MSParking",
  description = "Découvrez nos articles sur le parking aéroport, l'entretien automobile, et tous nos conseils pour voyager sereinement depuis Bordeaux-Mérignac.",
  buttonText = "Voir tous les articles",
  buttonUrl = "/blog",
  posts = [],
  showAll = false,
}: BlogListProps) => {
  const displayedPosts = showAll ? posts : posts.slice(0, 3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto flex flex-col items-center gap-16 px-4 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6 bg-gold/20 text-navy border-gold">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-pretty text-3xl font-semibold text-navy md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {heading}
          </h2>
          <p className="text-gray-600 mb-8 md:text-base lg:max-w-2xl lg:text-lg">
            {description}
          </p>
          {!showAll && posts.length > 3 && (
            <Button variant="link" className="w-full sm:w-auto text-gold hover:text-gold-dark" asChild>
              <Link href={buttonUrl}>
                {buttonText}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 w-full">
          {displayedPosts.map((post) => (
            <Card
              key={post.slug}
              className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0 hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video w-full overflow-hidden">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block transition-opacity duration-200 hover:opacity-70"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs border-gold text-gold">
                    {post.label}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(post.published).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold hover:underline md:text-xl text-navy line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{post.summary}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gold flex items-center hover:underline font-medium"
                >
                  Lire la suite
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogList;
