import Footer from "@/components/home/Footer";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
      <section className="mt-12">
        <Footer />
      </section>
    </>
  );
}
