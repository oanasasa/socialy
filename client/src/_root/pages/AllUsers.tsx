import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import GridUserList from "@/components/shared/GridUserList";

const AllUsers = () => {
  const { data: creators, isLoading: isUserLoading } = useGetUsers(10);

  if (!creators) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="user-container">
      <div className="flex-between w-full max-w-5xl mb-7">
        <h2 className="h3-bold md:h2-bold w-full flex gap-3">
          <img
            src="/assets/icons/people.svg"
            width={30}
            height={30}
            alt="people"
            className="invert-white"
          />
          All users
        </h2>
      </div>

      <div className="flex flex-wrap gap-5 w-full max-w-5xl">
        {isUserLoading ? (
          <Loader />
        ) : (
          <GridUserList users={creators?.documents} />
        )}
      </div>
    </div>
  );
};

export default AllUsers;
