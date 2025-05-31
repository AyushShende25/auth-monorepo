import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
function Navbar() {
  return (
    <nav className="px-4 py-8 bg-secondary">
      <div className="hidden md:flex gap-4 ">
        <Link
          className="capitalize"
          activeProps={{
            style: {
              fontWeight: "bold",
            },
          }}
          to="/"
        >
          Home
        </Link>
        <Link
          className="capitalize"
          activeProps={{
            style: {
              fontWeight: "bold",
            },
          }}
          to="/signup"
        >
          signup
        </Link>
        <Link
          className="capitalize"
          activeProps={{
            style: {
              fontWeight: "bold",
            },
          }}
          to="/login"
        >
          login
        </Link>
        <Link
          className="capitalize"
          activeProps={{
            style: {
              fontWeight: "bold",
            },
          }}
          to="/protected"
        >
          protected
        </Link>
        <Link
          className="capitalize"
          activeProps={{
            style: {
              fontWeight: "bold",
            },
          }}
          to="/admin"
        >
          admin
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden text-center">
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to="/">
              <DropdownMenuItem>Home</DropdownMenuItem>
            </Link>
            <Link to="/admin">
              <DropdownMenuItem>admin</DropdownMenuItem>
            </Link>
            <Link to="/protected">
              <DropdownMenuItem>protected</DropdownMenuItem>
            </Link>
            <Link to="/login">
              <DropdownMenuItem>login</DropdownMenuItem>
            </Link>
            <Link to="/signup">
              <DropdownMenuItem>signup</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
export default Navbar;
