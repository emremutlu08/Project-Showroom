/* COMPONENTS */
const { DataStore } = require('notarealdb');
const path = require('path');
const fs = require('fs');

/* NEXTJS */
import type { NextApiRequest, NextApiResponse } from 'next';

/* DATABASE */
const base = path.join('./');
const localDbPath = path.join(base, 'localDb');

const m1 = path.join('./', '..');
const m2 = path.join('./', '..', '..');
const m3 = path.join('./', '..', '..', '..');
const m4 = path.join('./', '..', '..', '..', '..');
const m5 = path.join('./', '..', '..', '..', '..', '..');

const path1 = path.resolve(base);
console.log(path1, ':13');
fs.readdirSync(base).forEach((file: any) => {
  console.log(file, '=>base:16');
});
fs.readdirSync(localDbPath).forEach((file: any) => {
  console.log(file, '=>localDbPath:19');
});

/* */
fs.readdirSync(m1).forEach((file: any) => {
  console.log(file, '=>m1:16');
});
fs.readdirSync(m2).forEach((file: any) => {
  console.log(file, '=>m2:16');
});
fs.readdirSync(m3).forEach((file: any) => {
  console.log(file, '=>m3:16');
});
fs.readdirSync(m4).forEach((file: any) => {
  console.log(file, '=>m4:16');
});
fs.readdirSync(m5).forEach((file: any) => {
  console.log(file, '=>m5:16');
});

const store = new DataStore(localDbPath);
const projects = store.collection('projects');

/* MESSAGES */
import {
  PROVIDE_PW,
  GALLERY_LISTED,
  GALLERY_LISTED_ERROR,
  PROJECT_ADDED,
  PROJECT_ADDED_ERROR,
  WRONG_METHOD,
  FILL_AREAS,
} from '../../../../lib/api/projects/messages';

/* MAIN FUNCTION */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let { method, body } = req;

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

    if (!!!body.projectTitle || !!!body.thumbnailUrl) {
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
        const projectList = projects.list();
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
        const id = projects.create(body);
        const createdData = { id, ...body };
        res.status(201).json({
          success: true,
          data: createdData,
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
