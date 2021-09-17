/* COMPONENTS */
import Main from '../src/components/Main';
import api from '../lib/api/api';
import { GetServerSideProps } from 'next';

/* CONTEXTS */
import { GeneratedContext } from '../src/components/Contexts';

export default function IndexPage(props: any) {
  return (
    <GeneratedContext.Provider value={props}>
      <Main />
    </GeneratedContext.Provider>
  );
}

// const notActualObject = {
//   id: 'B1XGMZMmY',
//   projectTitle: 'Mapty',
//   thumbnailUrl: '/assets/thumbnails/Mapty.png',
//   description: 'To learn OOP, Geolocation & Project planning',
//   skillTags: [''],
//   leftButtonTitle: 'View Online',
//   leftButtonUrl: 'https://mapty.netlify.app/',
//   rightButtonTitle: 'View Codes',
//   rightButtonUrl:
//     'https://github.com/emremutlu08/complete-javascript-course-master-main',
//   createdAt: 1631879690979,
// };
// const notActualProjects = {
//   success: false,
//   data: [notActualObject, notActualObject, notActualObject, notActualObject],
//   message: 'Waiting...',
//   loading: true,
// };

// IndexPage.defaultProps = {
//   notActualProjects,
// };

export const getServerSideProps: GetServerSideProps = async () => {
  const projects = await api.get('projects');
  let allProjects = projects.data;
  console.log(projects.data, ':44');
  // if (!!!allProjects) allProjects = notActualProjects;

  return {
    props: {
      projects: allProjects,
    },
  };
};
