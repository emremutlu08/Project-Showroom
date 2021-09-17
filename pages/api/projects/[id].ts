/* COMPONENTS */
const { DataStore } = require('notarealdb');
const paths = require('path');

/* NEXTJS */
import type { NextApiRequest, NextApiResponse } from 'next';

/* DATABASE */
const localDbPath = paths.join('./', 'src', 'localDb');
console.log(localDbPath, '[id]:10');
const store = new DataStore(localDbPath);
const projects = store.collection('projects');

/* MESSAGES */
import {
  PROVIDE_PW,
  ITEM_LISTED,
  ITEM_LISTED_ERROR,
  ITEM_EDITED,
  ITEM_EDITED_ERROR,
  ITEM_DELETED,
  ITEM_DELETED_ERROR,
  WRONG_METHOD,
} from './../../../lib/api/projects/messages';

/* MAIN FUNCTION */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let {
    query: { id },
    method,
    body,
  } = req;
  const FormSecretPassword = process.env.NEXT_PUBLIC_SECRET_PW;
  const isEditableMethod = method === 'PUT' || method === 'DELETE';
  let { pw } = body;
  pw = pw && pw.toString();

  if (isEditableMethod && pw !== FormSecretPassword) {
    return res
      .status(401)
      .json({ success: false, message: PROVIDE_PW, loading: false });
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

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const galleryItem = projects.get(id);

        if (!!!galleryItem) {
          return res.status(400).json({
            success: false,
            message: ITEM_LISTED_ERROR,
            loading: false,
          });
        }

        res.status(200).json({
          success: true,
          data: galleryItem,
          message: ITEM_LISTED,
          loading: false,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: ITEM_LISTED_ERROR, loading: false });
      }
      break;

    case 'PUT' /* Edit a model by its ID */:
      try {
        const updatedData = { id, ...body };
        // update an item
        projects.update(updatedData);
        res.status(200).json({
          success: true,
          data: updatedData,
          message: ITEM_EDITED,
          loading: false,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: ITEM_EDITED_ERROR, loading: false });
      }
      break;

    case 'DELETE' /* Delete a model by its ID */:
      try {
        projects.delete(id);
        res.status(200).json({
          success: true,
          data: {},
          message: ITEM_DELETED,
          loading: false,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: ITEM_DELETED_ERROR,
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
