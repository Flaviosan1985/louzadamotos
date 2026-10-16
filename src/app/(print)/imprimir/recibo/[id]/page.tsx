import { ReciboPrint } from "@/components/impressao/ReciboPrint";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReciboPrint id={id} />;
}
