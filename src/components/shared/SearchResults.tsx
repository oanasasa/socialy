import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResulsProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};
const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResulsProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No resuls found</p>
  );
};

export default SearchResults;
