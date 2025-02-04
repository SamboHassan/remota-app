import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <a href="/">Home</a>
      {user ? (
        <>
          <a href="/profile">Profile</a>
          {user.role === "admin" && <a href="/admin">Admin</a>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
};

export default Navbar;
