import { userQueryOptions } from "@/api/authApi";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (!user || user?.role !== "admin") {
      throw redirect({ to: "/unauthorized" });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/admin"!</div>;
}
