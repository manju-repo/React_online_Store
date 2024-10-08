import { useRouteError } from 'react-router-dom';
import MainNavigation from '../layout/MainNavigation';
import MainMenu from '../layout/mainmenu';
import { category } from '../components/category';

function ErrorPage() {
  const error = useRouteError();

  let title = 'An error occurred!';
  let message = 'Something went wrong!';

  if (error) {
    if (error.status === 403) {
      title = 'Unauthorized';
      message = 'You do not have the necessary permissions to view this page.';
    } else if (error.status === 404) {
      title = 'Not found!';
      message = 'Could not find resource or page.';
    } else if (error.status === 500) {
      message = error.data?.message || 'Internal Server Error';
    } else if (error.message) {
      message = error.message;
    }
  }

  return (
    <>
      <MainNavigation />
      <MainMenu items={category} />
      <h1>{title}</h1>
      <p>{message}</p>
    </>
  );
}

export default ErrorPage;
