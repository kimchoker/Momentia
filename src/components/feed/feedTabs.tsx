'use client';

const FeedTabs = ({ selectedTab, onTabChange }) => {
  return (
    <div className="flex w-full justify-between bg-white rounded-xl shadow-md">
      {['all', 'following'].map((tab) => (
        <button
          key={tab}
          className={`flex-grow py-4 flex items-center justify-center font-semibold transition duration-300 ${
            selectedTab === tab
              ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab === 'all' ? '전체 피드' : '팔로잉 피드'}
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
