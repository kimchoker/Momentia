import { useState, EventHandler, ReactNode } from 'react'

const 마이페이지 = () => {
	return (<div className="relative w-[1234px] h-[845px] bg-[linear-gradient(0deg,#fff_0%,#fff_100%),#fff] overflow-hidden">
  <div className="absolute left-0 right-0 top-0 h-[845px] bg-[#eeedeb]"></div>
  <div className="absolute left-0 right-0 top-0 h-[845px] bg-[#eeedeb]">
    <div className="absolute left-[359px] top-[63px] w-[515px] h-[782px] bg-[#fff]"></div>
    <div className="absolute left-0 top-0 w-[1234px] h-[63px] bg-[#d9d9d9]"></div>
    <div className="absolute left-[31px] top-[24px] text-[40px] leading-[15px] font-['Just_Me_Again_Down_Here'] text-[#000] whitespace-nowrap">zzangganziproject</div>
    <img className="absolute left-[359px] top-[63px]" width="514" height="202" src="bg 115_168.png"></img>
    <div className="absolute left-[709px] top-[305px] text-[25px] leading-[15px] font-['Inter'] text-[#000] whitespace-nowrap">nickname</div>
    <div className="absolute left-[719px] top-[338px] text-[18px] leading-[15px] font-['Inter'] text-[#000] whitespace-nowrap">@idunique</div>
    <div className="absolute left-[696px] top-[150px] w-[139px] h-[139px] bg-[#b2b2b2] rounded-full"></div>
    <img className="absolute left-[58.35%] right-[34.28%] top-[21.18%] bottom-[68.99%]" width="91" height="83" src="person-fill15_165.png"></img>
    <div className="absolute left-[398px] top-[321px] text-[15px] leading-[25px] font-['Inter'] text-[#000] whitespace-nowrap">상태메시지입니다간단한메시지<br/>를입력해주세요(25자이내)</div>
    <div className="absolute left-[398px] top-[290px] text-[18px] leading-[25px] font-['Inter'] text-[#000] whitespace-nowrap">팔로잉 23                   팔로워 23</div>
  </div>
  <img className="absolute left-[95.46%] right-[1.78%] top-[1.89%] bottom-[94.44%]" width="34" height="31" src="person-fill15_163.png"></img>
  <img className="absolute left-[66.45%] right-[30.96%] top-[9.94%] bottom-[86.27%]" width="32" height="32" src="Union15_171.png"></img>
  <img className="absolute left-[547px] top-[929px]" width="141" height="141" src="ddd 517_186.png"></img>
  <img className="absolute left-[1122px] top-[15px]" width="32" height="32" src="chat-left-fill17_194.png"></img>
  <img className="absolute left-[1011px] top-[15px]" width="33" height="33" src="search18_196.png"></img>
  <div className="absolute left-[359px] top-[390px] w-[515px] h-[342px] bg-[#d9d9d9] border-[solid] border-#000 border border-[1px_0_0]"></div>
  <div className="absolute left-[409px] top-[474px] w-[413px] text-[13px] leading-[15px] font-['Inter'] text-[#000]">어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구</div>
  <div className="absolute left-[398px] top-[401px] w-[52px] h-[52px] bg-[#b2b2b2] rounded-full"></div>
  <div className="absolute left-[462px] top-[416px] text-[20px] leading-[15px] font-['Inter'] text-[#000] whitespace-nowrap">nickname</div>
  <div className="absolute left-[462px] top-[438px] text-[13px] leading-[15px] font-['Inter'] text-[#000] whitespace-nowrap">@idunique</div>
  <div className="absolute left-[409px] top-[703px] text-[13px] leading-[15px] font-['Inter'] font-extrabold text-[#000] whitespace-nowrap">댓글 5개</div>
  <img className="absolute left-[32.98%] right-[64.26%] top-[48.76%] bottom-[47.57%]" width="34" height="31" src="person-fill18_483.png"></img>
  <img className="absolute left-[410px] top-[534px]" width="421" height="157" src="ddd 618_484.png"></img>
  <div className="absolute left-[359px] top-[732px] w-[515px] h-[342px] flex">
    <div className="absolute left-0 top-0 w-[515px] h-[342px] bg-[#d9d9d9] border-[solid] border-#000 border border-[1px_0_0]"></div>
    <div className="absolute left-[50px] top-[84px] w-[413px] text-[13px] leading-[15px] font-['Inter'] text-[#000]">어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구어쩌구저쩌구</div>
    <div className="absolute left-[39px] top-[11px] w-[52px] h-[52px] bg-[#b2b2b2] rounded-full"></div>
    <div className="absolute left-[103px] top-[26px] text-[20px] leading-[15px] font-['Inter'] text-[#000] whitespace-nowrap">nickname</div>
    <div className="absolute left-[103px] top-[48px] text-[13px] leading-[15px] font-['Inter'] text-[#000] whitespace-nowrap">@idunique</div>
    <div className="absolute left-[50px] top-[313px] text-[13px] leading-[15px] font-['Inter'] font-extrabold text-[#000] whitespace-nowrap">댓글 5개</div>
    <img className="absolute left-[9.32%] right-[84.08%] top-[6.43%] bottom-[84.5%]" width="34" height="31" src="person-fill18_493.png"></img>
    <img className="absolute left-[51px] top-[144px]" width="421" height="157" src="ddd 618_494.png"></img>
  </div>
  <img className="absolute left-[1064px] top-[13px]" width="36" height="36" src="bell42_217.png"></img>
</div>)
}

export default 마이페이지