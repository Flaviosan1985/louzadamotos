import { EntregaPrint } from "@/components/impressao/EntregaPrint";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EntregaPrint id={id} />;
}
