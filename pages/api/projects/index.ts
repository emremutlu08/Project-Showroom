/* DATABASE */
import dbConnect from '../../../lib/dbConnect';
import Projects from '../../../models/Projects';

/* NEXTJS */
import type { NextApiRequest, NextApiResponse } from 'next';

/* MESSAGES */
import {
  PROVIDE_PW,
  GALLERY_LISTED,
  GALLERY_LISTED_ERROR,
  PROJECT_ADDED,
  PROJECT_ADDED_ERROR,
  WRONG_METHOD,
  FILL_AREAS,
} from '../../../lib/api/projects/messages';

/* MAIN FUNCTION */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  let { body } = req;
  await dbConnect();

  if (method === 'POST') {
    const FormSecretPassword = process.env.NEXT_PUBLIC_SECRET_PW;
    let { pw } = body;
    pw = pw && pw.toString();
    if (pw !== FormSecretPassword) {
      return res.status(401).json({
        success: false,
        message: PROVIDE_PW,
        loading: false,
      });
    }

    if (!body.projectTitle || !body.thumbnailUrl) {
      return res.status(406).json({
        success: false,
        message: FILL_AREAS,
        loading: false,
      });
    }

    delete body.pw;
    const bodyArr = [body];
    const filteredBody = bodyArr.map(
      ({
        projectTitle,
        thumbnailUrl,
        description,
        skillTags,
        leftButtonTitle,
        leftButtonUrl,
        rightButtonTitle,
        rightButtonUrl,
      }) => ({
        projectTitle,
        thumbnailUrl,
        description,
        skillTags,
        leftButtonTitle,
        leftButtonUrl,
        rightButtonTitle,
        rightButtonUrl,
      }),
    );
    body = filteredBody[0];
  }

  switch (method) {
    case 'GET':
      try {
        const projectList = await Projects.find({});
        res.status(200).json({
          success: true,
          data: projectList,
          message: GALLERY_LISTED,
          loading: false,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: GALLERY_LISTED_ERROR,
          error,
          loading: false,
        });
      }
      break;
    case 'POST':
      try {
        body.createdAt = Date.now();
        const project = await Projects.create(
          req.body,
        ); /* create a new model in the database */
        res.status(201).json({
          success: true,
          data: project,
          message: PROJECT_ADDED,
          loading: false,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: PROJECT_ADDED_ERROR,
          error,
          loading: false,
        });
      }
      break;
    default:
      res
        .status(400)
        .json({ success: false, message: WRONG_METHOD, loading: false });
      break;
  }
}