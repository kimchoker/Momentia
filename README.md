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
##### 토글을 열면 시연영상을 확인하실 수 있습니다
#### <details><summary>로그인 / 회원가입</summary> <br/> <p>로그인</p> <img src="" width="600" /> <br/> <br/> <p>회원가입</p> <img src="" width="600" /> <br/></details>
- 폼 유효성 검증
- 로그인 후 전역상태로 회원정보 관리

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
- 
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

## 🏗 아키텍쳐
![Momentia architecture](https://github.com/user-attachments/assets/afb7c948-fe18-4eef-bb13-c1fdfd97595e)



## 폴더구조

```
📦 src
 ┣ 📂app
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂comments
 ┃ ┃ ┣ 📂feed
 ┃ ┃ ┣ 📂post
 ┃ ┃ ┣ 📂profile
 ┃ ┃ ┗ 📂useruid
 ┃ ┣ 📂dm
 ┃ ┣ 📂login
 ┃ ┣ 📂notification
 ┃ ┣ 📂profile
 ┃ ┗ 📂signup
 ┣ 📂components
 ┃ ┣ 📂feed
 ┃ ┣ 📂notification
 ┃ ┣ 📂profile
 ┃ ┣ 📂sidebar
 ┃ ┗ 📂ui
 ┣ 📂constants
 ┣ 📂containers
 ┣ 📂hooks
 ┣ 📂lib
 ┃ ┣ 📂api
 ┃ ┗ 📂validation
 ┣ 📂services
 ┃ ┗ 📂firebase
 ┣ 📂states
 ┣ 📂stories
 ┣ 📂styles
 ┣ 📂types
 ┗ 📂utils
    ┗ 📂shadcn

```
### 폴더 설명

| 폴더 경로               | 설명                                                                                  |
|-------------------------|---------------------------------------------------------------------------------------|
| `src/app`                | 페이지 구현 관련 폴더. 각 페이지별로 폴더가 존재하며, 페이지와 관련된 컴포넌트 및 API 라우터가 정의됨. |
| `src/app/api`            | 백엔드 API 라우터를 모아둔 폴더. 게시물, 댓글, 프로필 등 다양한 API 엔드포인트 정의.               |
| `src/components`         | 각 페이지에서 사용되는 UI 컴포넌트들이 모여 있는 폴더. 재사용 가능한 컴포넌트들이 정의됨.               |
| `src/constants`          | 어플리케이션 전반에 걸쳐 사용되는 상수 값을 모아둔 폴더. (예: 색상, URL 등)                         |
| `src/containers`         | 페이지나 컴포넌트에서 사용되는 데이터 로직이 포함된 컨테이너 컴포넌트들이 위치한 폴더.                   |
| `src/hooks`              | 커스텀 훅들을 모아둔 폴더. API 호출이나 전역 상태 관리 등의 재사용 가능한 로직이 포함됨.                 |
| `src/lib`                | 클라이언트 측 API 호출과 validation에 필요한 정규식이 포함된 폴더.                               |
| `src/services`           | Firebase 등 외부 라이브러리나 서비스 설정이 포함된 폴더. Firebase 설정이 여기에 포함됨.               |
| `src/states`             | 전역 상태 관리를 위한 상태 저장소(Zustand)가 정의된 폴더.                                           |
| `src/stories`            | Storybook과 관련된 컴포넌트 테스트용 폴더.                                                         |
| `src/styles`             | 전역 스타일 또는 각종 스타일 파일을 모아둔 폴더.                                                     |
| `src/types`              | TypeScript에서 사용하는 커스텀 타입들을 정의한 폴더.                                                  |
| `src/utils`              | 유틸리티 함수들이 정의된 폴더. 샤드(ui 라이브러리)의 설정값 등이 포함됨.                                |

