import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogList from "@/components/BlogList";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog MSParking - Conseils Parking & Voyage | Bordeaux-Mérignac",
  description: "Découvrez nos articles et conseils sur le parking aéroport, l'entretien automobile, et comment bien préparer votre voyage depuis Bordeaux-Mérignac.",
  keywords: "blog parking, conseils voyage, parking aéroport Bordeaux, entretien voiture, préparation voyage, astuces parking, sécurité véhicule",
  alternates: {
    canonical: "https://msparking.fr/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-navy to-navy-light text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog MSParking
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Tous nos conseils et actualités pour voyager sereinement
            </p>
          </div>
        </div>
        <BlogList 
          posts={posts} 
          showAll={true}
          heading="Tous nos articles"
          description="Retrouvez tous nos articles, conseils et actualités sur le parking aéroport, l'entretien automobile et le voyage."
        />
        
        {/* Section des 3 derniers articles */}
        <LatestBlogPosts posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
