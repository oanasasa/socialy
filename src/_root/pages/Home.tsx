import PostCard from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";

//1. adaugat o librarie de minify care sa faca pozele mici (sa se incarce usor)
const Home = () => {
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Posts</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-9 flex-1 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.caption} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
