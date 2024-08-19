import { Profile, ProfileFallback, ProfileImage } from "../ui/profile"
import { Button } from "../ui/button";


const MainProfile = () => {

	return(
		<div className="bg-[#d6d6d6] p-5 border-b-2 border-black z-10">
					<div>

					</div>
          <div className="flex flex-row justify-start">
            {/* 프로필 이미지 */}
            <Profile>
              <ProfileImage src="https://firebasestorage.googleapis.com/v0/b/snsproject-85107.appspot.com/o/images%2Fkuromi.jpg?alt=media&token=b82213e1-0e86-4146-b1f4-5454fcd6220e"/>
              <ProfileFallback />
            </Profile>
            {/* 닉네임/아이디 */}
            <div className="flex flex-row justify-end ml-5">
              <div className="flex flex-col ml-3">
								<div className="flex flex-row justify-between">
									<p className="font-bold text-xl">최정화이팅</p>
									<Button variant="outline">프로필 수정</Button>
								</div>
                
                <p className="text-s">sample@naver.com</p>
                {/* 상태메시지 */}
                <div className="mt-3 mb-5">
                  <p className="text-s">
                    상태메시지입니다. 최대 40자까지 입력할 수 있으며 자신의 상태를
                    나타내는 간단한 문구를 입력하는 입력란입니다.
                  </p>
                </div>
                <div className='flex flex-row justify-start mb-2 text-m font-bold'>
                  <p className='mr-[120px]'>팔로잉 {}</p>
                  <p>팔로워</p>
                </div>
              </div>
            </div>
          </div>
        </div>
	)
}

export default MainProfile;