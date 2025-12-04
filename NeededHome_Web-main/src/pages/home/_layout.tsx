import { Outlet } from "@tanstack/react-router";
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
export default function index() {
  return (
    <>
      <div className="drawer">
        <input id="home-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <main>
            <Outlet />
          </main>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="home-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-100 min-h-full w-80 p-4 space-y-2">
            <div className="h-18 mb-4">
              <img src="logo.png" className="h-16" alt="" />
            </div>
            {/* Sidebar content here */}
            {links.map((link) => (
              <li key={link.name}>
                <a href={link.path}>{link.name}</a>
              </li>
            ))}
            <li>
              <a href="" className="btn btn-block btn-outline btn-neural">
                Sign In
              </a>
            </li>
            <li>
              <a href="" className="btn btn-primary btn-block">
                Get Free Account
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
