function SkeletonNewsCard() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 p-4 border rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800">
      <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-md" />
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}

export default SkeletonNewsCard;
