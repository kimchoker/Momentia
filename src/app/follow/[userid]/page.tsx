'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import FollowTabs from '../../../components/follow/followTabs';

function FollowPage() {
  const { email } = useParams(); // 현재 유저의 이메일 정보 가져오기

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{email}의 팔로워 및 팔로잉</h1>
      <FollowTabs email={email} />
    </div>
  );
}

export default FollowPage;
