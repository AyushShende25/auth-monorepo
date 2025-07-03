import { userQueryOptions } from "@/api/authApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/protected")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  const { data: user } = useQuery(userQueryOptions());

  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-3xl">User Profile</CardTitle>
          <CardDescription>your details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <Label className="font-semibold">First Name</Label>
            <p>{user?.firstName}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="font-semibold">Last Name</Label>
            <p>{user?.lastName}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="font-semibold">Email</Label>
            <p>{user?.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="font-semibold">Role</Label>
            <p>{user?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
