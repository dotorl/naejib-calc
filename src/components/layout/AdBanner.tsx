interface AdBannerProps {
  className?: string;
}

export default function AdBanner({ className }: AdBannerProps) {
  return (
    <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
      <p className="text-gray-500">광고 영역</p>
    </div>
  );
}
