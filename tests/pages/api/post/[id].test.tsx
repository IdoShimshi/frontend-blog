import prisma from "../../../../lib/prisma";
import handleDelete from "../../../../pages/api/post/[id]";
import { deletePostMetadata } from "../../../../mongoDB/videoCollection";
import { v2 as cloudinary } from 'cloudinary';

jest.mock("../../../../lib/prisma", () => ({
  post: {
    delete: jest.fn(),
  },
}));
jest.mock("../../../../mongoDB/videoCollection", () => ({
  deletePostMetadata: jest.fn(),
}));
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      destroy: jest.fn(),
    },
  },
}));
jest.mock('next', () => ({
  __esModule: true,
  NextApiRequest: {
    __esModule: true,
    default: jest.fn(),
  },
  NextApiResponse: {
    __esModule: true,
    default: jest.fn(),
  },
}));

describe('handleDelete', () => {
  let req: any;
  let res: any;
  let prismaMock: any;
  let deletePostMetadataMock: jest.Mock;
  let cloudinaryDestroyMock: jest.Mock;

  beforeEach(() => {
    req = {
      method: 'DELETE',
      query: {
        id: '123',
      },
      cookies: {
        loginDetails: 'mockedLoginDetails',
      },
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    prismaMock = require("../../../../lib/prisma");
    deletePostMetadataMock = deletePostMetadata as jest.Mock;
    cloudinaryDestroyMock = cloudinary.uploader.destroy as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should delete a post and associated metadata', async () => {
    prismaMock.post.delete.mockResolvedValue({ id: 123 });

    deletePostMetadataMock.mockResolvedValue('mockedPublicId');
    cloudinaryDestroyMock.mockResolvedValue({ result: 'ok' });

    await handleDelete(req, res);

    expect(prismaMock.post.delete).toHaveBeenCalledWith({
      where: { id: 123 },
    });
    expect(res.json).toHaveBeenCalledWith({ id: 123 });
    expect(deletePostMetadataMock).toHaveBeenCalledWith(123);
    expect(cloudinaryDestroyMock).toHaveBeenCalledWith('mockedPublicId', {
      resource_type: 'video',
    });
  });

  test('should return Unauthorized if user is not logged in', async () => {
    req.cookies.loginDetails = undefined;

    await handleDelete(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(prismaMock.post.delete).not.toHaveBeenCalled();
    expect(deletePostMetadataMock).not.toHaveBeenCalled();
    expect(cloudinaryDestroyMock).not.toHaveBeenCalled();
  });
});
