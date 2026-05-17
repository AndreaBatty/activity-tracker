type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="space-y-5 px-3 py-5 sm:space-y-6 sm:px-4 sm:py-6">
      {children}
    </div>
  );
}
