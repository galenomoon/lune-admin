export const SkeletonWrapper = ({
  SkeletonComponent,
  isPending, 
  children 
}: { 
  SkeletonComponent: React.ComponentType;
  isPending: boolean; 
  children: React.ReactNode; 
}) => {
  return isPending ? <SkeletonComponent /> : <>{children}</>;
};