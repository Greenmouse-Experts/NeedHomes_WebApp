import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";

export default function Header() {
  const links = [
    {
      name: "Company",
      path: "/",
    },
    {
      name: "Investment",
      path: "/",
    },
    {
      name: "Resources",
      path: "/",
    },
    {
      name: "Support",
      path: "/",
    },
  ];
  return (
    <div className="h-20 grid place-items-center bg-base-200">
      <nav className="contain mx-auto flex justify-between px-4 md:px-0 items-center">
        <h2 className="text-xl font-bold">
          <img src="logo.png" className="h-12" alt="" />
        </h2>
        <div className=" hidden lg:block space-x-2">
          {links.map((link) => (
            <Link to={link.path} key={link.name} className="btn btn-ghost">
              {link.name} <ChevronDown size={12} />
            </Link>
          ))}
        </div>
        <label
          htmlFor="home-drawer"
          className="lg:hidden btn btn-square btn-ghost"
        >
          {/*<label htmlFor="home-drawer" className="btn drawer-button">
            Open drawer
          </label>*/}
          <Menu />
        </label>
        <div className="space-x-2 hidden lg:block">
          <button className="btn btn-neutral btn-outline">Sign In</button>
          <button className="btn btn-primary">Get Free Account</button>
        </div>
      </nav>
    </div>
  );
}
