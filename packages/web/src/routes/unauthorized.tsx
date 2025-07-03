import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="text-center text-red-500 my-10">
      You do not have permissions to access that route
    </div>
  );
}
