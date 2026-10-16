import { FichaPrint } from "@/components/impressao/FichaPrint";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FichaPrint id={id} />;
}
