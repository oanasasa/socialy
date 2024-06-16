import { Models } from "appwrite";
import { Link } from "react-router-dom";

type GridUserListProps = {
  users?: Models.Document[];
};

const GridUserList = ({ users }: GridUserListProps) => {
  return (
    <div className="@container w-full">
      <ul className="user-grid">
        {users?.map((user) => (
          <Link key={user.$id} to={`/profile/${user.$id}`}>
            <li className="user-box">
              <img
                src={user.imageUrl}
                alt="avatar"
                className="object-cover rounded-full w-14 h-14 @lg:w-24 @lg:h-24"
              />
              <h3 className="body-medium @lg:h3-semibold">{user.name}</h3>
              <p className="subtle-semibold lg:small-regular text-light-3 mb-2">
                {user.username}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default GridUserList;
