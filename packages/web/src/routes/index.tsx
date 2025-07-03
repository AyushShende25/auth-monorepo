import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-20">This route is accessible for public</h1>
    </div>
  );
}
