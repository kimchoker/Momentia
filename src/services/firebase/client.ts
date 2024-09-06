// const fetchUserDataFromServer = async () => {
//   const user = auth.currentUser;
//   if (user) {
//     const idToken = await user.getIdToken();

//     const response = await fetch('/api/getUserData', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ idToken }),
//     });

//     if (response.ok) {
//       const { userData } = await response.json();
//       setUserData(userData);
//     } else {
//       console.error("Failed to fetch user data from server");
//     }
//   }
// };
