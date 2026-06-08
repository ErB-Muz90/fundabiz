export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-600">FundaBiz</h1>
          <p className="text-sm text-gray-500 mt-1">Empowering Kenyan SMEs</p>
        </div>
        {children}
      </div>
    </div>
  );
}
