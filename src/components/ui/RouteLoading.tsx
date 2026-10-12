import { BeautifulPageLoading } from "./BeautifulSpinner";

type RouteLoadingProps = {
  title: string;
};

export default function RouteLoading({ title }: RouteLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f4f6fb_45%,_#edf1f8_100%)] p-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_24px_80px_rgba(24,39,75,0.12)] backdrop-blur-xl md:p-10">
        <BeautifulPageLoading text={title} variant="glow" size="lg" />
      </div>
    </div>
  );
}
