import '../styles/globals.css';
import { AuthProvider } from '../components/AuthProvider';
import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp; 