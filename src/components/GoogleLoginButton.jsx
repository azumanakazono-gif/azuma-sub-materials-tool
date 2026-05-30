import { useGoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({ onSuccess, onError }) {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    onSuccess,
    onError,
  });
  return (
    <button className="btn-google-login" onClick={() => login()}>
      Googleでログイン
    </button>
  );
}
