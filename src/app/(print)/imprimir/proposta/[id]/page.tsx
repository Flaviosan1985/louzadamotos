import { PropostaPrint } from "@/components/impressao/PropostaPrint";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropostaPrint id={id} />;
}
