import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import GridUserList from "./GridUserList";
import Loader from "./Loader";

const CreatorsSideBar = () => {
  const { data: creators, isLoading: isUserLoading } = useGetUsers(5);

  return (
    <div className="creators-sidebar">
      {isUserLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-11">
          <h2 className="h3-bold text-left w-full">Top Creators</h2>
          <GridUserList users={creators?.documents} />
        </div>
      )}
    </div>
  );
};

export default CreatorsSideBar;
