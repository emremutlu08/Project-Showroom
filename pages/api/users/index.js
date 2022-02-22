/** USER */
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

/* DATABASE */
import dbConnect from '../../../lib/dbConnect';
import Users from '../../../models/Users';

/* MESSAGES */
import {
  FILL_AREAS,
  WRONG_METHOD,
  UNAUTHORIZED,
} from '../../../lib/general/messages';
import {
  USER_CREATED,
  USER_CREATED_ERROR,
} from '../../../lib/api/users/messages';

/** ENVIRONMENT */
const secret = process.env.JWT_SECRET;

/* MAIN FUNCTION */
export default async function handler(req, res) {
  const { method, body } = req;
  await dbConnect();
  const session = await getSession({ req });
  const token = await getToken({ req, secret });
  const isModified =
    token?.accessToken !== session?.accessToken ||
    token?.email !== session?.user?.email;

  if (isModified || !token?.isNewUser) {
    return res.status(401).json({
      success: false,
      message: UNAUTHORIZED,
      loading: false,
    });
  }

  const createUserBody = {
    ...body,
  };

  const filter = {
    email: session?.user?.email,
  };

  // Only PUT method is allowed
  if (method === 'PUT') {
    if (!createUserBody?.username) {
      return res.status(406).json({
        success: false,
        message: FILL_AREAS,
        loading: false,
      });
    }
  }

  switch (method) {
    case 'PUT':
      try {
        body.createdAt = Date.now();
        const user = await Users.findOneAndUpdate(
          createUserBody,
          filter,
        ); /* create a new model in the database */
        res.status(201).json({
          success: true,
          data: user,
          message: USER_CREATED,
          loading: false,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error,
          message: USER_CREATED_ERROR,
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
