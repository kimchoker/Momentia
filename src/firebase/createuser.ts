import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const createUser = (email :string, password :string) => {
	const auth = getAuth();
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

		});
}


export default createUser;