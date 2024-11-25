const SkeletonLoader = ({ count }) => {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className="relative w-full sm:w-[90%] md:w-[90%] h-[400px] bg-gray-200 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform ml-3 mt-3 animate-pulse"
    >
      <div className="absolute inset-0 bg-gray-300" />
      <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
        <div className="w-10 h-10 bg-gray-400 rounded-full" />
        <div className="flex flex-col space-y-1">
          <div className="w-24 h-4 bg-gray-400 rounded" />
          <div className="w-16 h-3 bg-gray-400 rounded" />
        </div>
      </div>
    </div>
  ));
};

export default SkeletonLoader;
