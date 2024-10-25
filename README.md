# Momentia
이미지 들어갈 자리

#### 프로젝트 소개

하루에 단 한번! <br/>
당신의 하루를 소개하세요 <br/>
서로의 일상을 공유하는 마이크로 일상 공유 SNS

#### 프로젝트 진행기간

2024.08 ~ 2024.09 (4주)

#### 프로젝트 배포링크
[Momentia 배포링크](https://monentia.vercel.app/)


##### 테스트 계정 
> ID: test@test.com
> PW: testId!234

<br/>

## 📋 실행방법
1. 레포지토리 복제 후 의존성 설치
```
$ git clone [https://github.com/wjstjdus96/byhand.git](https://github.com/kimchoker/Momentia.git)
$ cd Monentia
$ pnpm install
```
2. 개발 서버 가동
```
$ pnpm run dev
```
3. 브라우저에서 실행
```
http://localhost:3000/
```



## 🛠 기술스택

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/Tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">

<img src="https://img.shields.io/badge/Zustand-1E4CC9?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/React Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> 
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white">
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=netlify&logoColor=white">

<br/>


## 📌 주요기능

#### <details><summary>로그인 / 회원가입</summary> <br/> <p>로그인</p> <img src="" width="600" /> <br/> <br/> <p>회원가입</p> <img src="" width="600" /> <br/></details>
- 폼 유효성 검증
- 로그인 후 sessionStorage로 회원정보 관리

#### <details><summary>전체 피드 조회 및 친구 피드</summary> <br/> <p>친구 피드 조회 기능</p> <img src="" width="600" /> <br/> <br/> <p>피드 - 무한스크롤</p> <img src="" width="600" /> <br/></details>
- 전체 피드와 친구 피드를 탭으로 구현
- 무한스크롤을 활용한 페이지네이션
- 글마다 댓글과 좋아요 갯수 확인 기능

#### <details><summary>상세 글 페이지 및 댓글</summary><br/> <p>상세 글 페이지</p> <img src="" width="600" /></details>
- 좋아요 클릭 시 낙관적 업데이트를 통한 반영
- 작성자인 경우 글 or 댓글 삭제 기능
- 작성자 프로필 클릭하는 경우 작성자 프로필 페이지로 이동

#### <details><summary>팔로우/팔로잉</summary><br/> <p>팔로우 및 팔로잉 탭탭</p> <img src="" width="600" /> <br/> <br/> <p>팔로우 창에서 바로 회원 프로필로 가는 기능</p> <img src="" width="600" /></details>
- 팔로우/팔로잉 탭 구현
- 타 회원의 팔로우나 팔로잉 탭에서 팔로우/언팔로우 기능

#### <details><summary>알림</summary> <br/> <p>알림 페이지</p> <img src="" width="600" />  <br/> <br/> <p>알림 클릭 시 알림 온 글로 이동</p> <img src="" width="600" /></details>
- firebase의 FCM을 이용한 알림 기능
- 알림 올 시 사이드바 or 하단바에 알림이 표시됨
- 데스크탑 버전일 경우 토스트로 우측 하단에 알림 생성
  



<br/>

## 🔥 성능 최적화
- 이미지 업로드 시 확장자를 .webp로 변환하고 이미지 크기를 원본의 80%로 줄여 로딩 속도 향상
-
-
<br/>  

## 🔫 트러블 슈팅
- 무한스크롤 작동 시 마지막 글에 도달했음에도 계속 데이터 요청을 보내는 문제
- 

<br/>  

## 💭 기술적 의사결정
- [패키지 매니저 pnpm 선택기](https://velog.io/@kimchoker/npm%EC%97%90%EC%84%9C-pnpm%EC%9C%BC%EB%A1%9C-%EC%98%AE%EA%B2%A8%EB%B3%B4%EC%9E%90)
- [상태관리 툴 선택하기](https://velog.io/@kimchoker/%EC%83%81%ED%83%9C%EA%B4%80%EB%A6%AC-%ED%88%B4-%EB%B9%84%EA%B5%90%ED%95%B4%EB%B3%B4%EA%B8%B0)
- 낙관적 업데이트를 이용한 좋아요 기능 구현하기

<br/>


## 폴더구조 및 설명

```
src
┣ 📂app                    // 페이지 구현 관련 폴더. 각 페이지별로 폴더가 존재하며, 페이지와 관련된 컴포넌트 및 API 라우터가 정의됨.
┃ ┣ 📂api                 // 백엔드 API 라우터를 모아둔 폴더. 게시물, 댓글, 프로필 등 다양한 API 엔드포인트 정의.
┃ ┣ 📂login               // 로그인 페이지 관련 폴더 (예시).
┃ ┣ ...                  // 그 외 페이지 관련 폴더들 (DM, 알림, 프로필, 회원가입 등).
┣ 📂components             // 각 페이지에서 사용되는 UI 컴포넌트들이 모여 있는 폴더.
┃ ┣ 📂common              // 페이지에서 사용되는 재사용 가능한 컴포넌트들을 모은 폴더.
┃ ┗ 📂ui                  // Shadcn UI 컴포넌트를 모아둔 폴더.
┣ 📂config                 // 외부 서비스 또는 라이브러리 관련 설정을 모아둔 폴더.
┃ ┣ 📂firebase            // Firebase 설정 관련 파일.
┃ ┗ 📂shadcn              // Shadcn UI 라이브러리 설정 관련 파일.
┣ 📂lib                    // 클라이언트 측 API 호출과 validation에 필요한 정규식 및 라이브러리 관련 파일들을 포함하는 폴더.
┃ ┣ 📂api                 // 클라이언트 측 API 호출 관련 파일.
┃ ┗ 📂validation          // 유효성 검사를 위한 정규식 또는 검증 로직이 포함된 파일들.
┣ 📂store                  // 전역 상태 관리를 위한 상태 저장소 폴더.
┣ 📂stories                // Storybook과 관련된 컴포넌트 테스트용 폴더.
┣ 📂types                  // TypeScript에서 사용하는 커스텀 타입들을 정의한 폴더.
```

