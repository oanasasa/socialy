import { useUserContext } from "@/context/AuthContext";

const Header = () => {
  const { user } = useUserContext();

  return (
    <div className="header_banner">{user && <>Welcome {user.name}!</>}</div>
  );
};

export default Header;
