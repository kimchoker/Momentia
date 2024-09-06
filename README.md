# Momentia
이미지 들어갈 자리

#### 프로젝트 소개

하루에 단 한번! 당신의 하루를 소개하세요
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
#### <details><summary>로그인 / 회원가입</summary> <br/> <p>로그인</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/f12d75ce-d43a-4d36-9179-8dcee4e89a9f" width="600" /> <br/> <br/> <p>회원가입</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/6f1fd225-d95f-4ba6-9c1a-2fffdd57cdae" width="600" /> <br/></details>
- 폼 유효성 검증
- 로그인 후 전역상태로 회원정보 관리
#### <details><summary>전체 상품 조회</summary> <br/> <p>전체상품 - 결과 필터링</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/e9c5366a-fcf0-4115-b274-e91dd7707802" width="600" /> <br/> <br/> <p>전체상품 - 무한스크롤</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/a6697ac9-49fc-4461-96aa-1cb8d1b92e12" width="600" /> <br/></details>
- 카테고리, 검색어, 정렬옵션에 따른 조회 결과 필터링 기능
- 무한스크롤을 활용한 페이지네이션
#### <details><summary>상품 상세 조회</summary><br/> <p>상품 상세정보</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/4e13159e-d267-43e9-b28e-f9bad1d0ddb4" width="600" /><br/></details>
- 상품 수량 선택 -> 장바구니 추가 혹은 상품 주문
- 이미지 캐러셀을 통한 다량의 상품 이미지 자동 전환
#### <details><summary>[구매자] 장바구니</summary><br/> <p>장바구니 - 상품선택,수량변경</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/ab88a2c2-2a66-4d6b-89e1-00f239aa64b5" width="600" /> <br/> <br/> <p>장바구니 - 부분삭제,부분결제</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/7b7b9161-5ca3-4717-be6d-74492e897a8f" width="600" /></details>
- 장바구니 상품 수량 수정 기능
- 선택한 상품 금액 및 개수 계산
- 상품 전체/부분선택 -> 부분적인 주문 및 삭제 기능

#### <details><summary>[구매자] 선택 상품 주문</summary> <br/> <p>주문-배송정보입력</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/4f5b4468-0edc-4aae-8dc1-20e5a2d4b015" width="600" />  <br/> <br/> <p>주문-결제</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/50c1c1e2-74ce-4a49-aafa-3ded7825be24" width="600" /></details>
- 카카오 우편번호 api를 활용한 배송 정보 입력 기능
- 포트원 SDK를 활용한 결제 기능
#### <details><summary>[구매자] 주문 내역 조회 및 주문 취소</summary><br/> <p>주문 정보 조회 및 주문 취소</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/953a3f66-18f7-4dd8-8aa1-da815ccf1fab" width="600" /></details>
- 날짜별 주문 내역 조회 기능
- 상품별 주문 취소 기능
#### <details><summary>[판매자] 판매상품관리</summary> <br/> <p>판매상품관리 - 상품 등록,수정</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/42e80267-58e8-494c-8e95-9d58e6035ad9" width="600" />  <br/> <br/> <p>판매상품관리 - 상품 삭제</p> <img src="https://github.com/wjstjdus96/byhand/assets/77755620/c2b12fdf-3fd1-43a6-89b0-67059eff7fa3" width="600" /></details>
- 판매 상품 조회, 등록, 수정, 삭제 기능
- 등록 시 상품 이미지 개수 5개 제한


<br/>

## 🔥 성능 최적화
- 
-
-
<br/>  

## 🔫 트러블 슈팅
- 
- 

<br/>  

## 💭 기술적 의사결정
- [패키지 매니저 pnpm 선택기](https://velog.io/@kimchoker/npm%EC%97%90%EC%84%9C-pnpm%EC%9C%BC%EB%A1%9C-%EC%98%AE%EA%B2%A8%EB%B3%B4%EC%9E%90)
- [상태관리 툴 선택하기](https://velog.io/@kimchoker/%EC%83%81%ED%83%9C%EA%B4%80%EB%A6%AC-%ED%88%B4-%EB%B9%84%EA%B5%90%ED%95%B4%EB%B3%B4%EA%B8%B0)

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
