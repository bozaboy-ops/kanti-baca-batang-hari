import StoryBook from "@/components/StoryBook";

export default async function BacaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryBook storyId={id} />;
}