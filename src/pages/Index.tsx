import TypingTest from "@/components/TypingTest";
import { Vortex } from "@/components/ui/vortex";

export default function Index() {
  return (
    <div className="h-screen w-full overflow-hidden bg-background text-foreground">
      <Vortex backgroundColor="black" className="h-full w-full">
        <TypingTest />
      </Vortex>
    </div>
  );
}
