import prisma from "../../../../lib/prisma";
import handlePublish from "../../../../pages/api/publish/[id]";

jest.mock("../../../../lib/prisma", () => ({
  post: {
    updateMany: jest.fn(),
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

describe('handlePublish', () => {
  let req: any;
  let res: any;
  let prismaMock: any;

  beforeEach(() => {
    req = {
      query: {
        id: '123',
      },
      cookies: {
        loginDetails: JSON.stringify({
          userId: 456,
        }),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    prismaMock = require("../../../../lib/prisma");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should publish the post if the logged-in user is the author', async () => {
    prismaMock.post.updateMany.mockResolvedValue({ count: 1 });

    await handlePublish(req, res);

    expect(prismaMock.post.updateMany).toHaveBeenCalledWith({
      where: { id: 123, authorId: 456 },
      data: { published: true },
    });
    expect(res.json).toHaveBeenCalledWith({ count: 1 });
  });

  test('should return an error if the user is unauthorized', async () => {
    req.cookies.loginDetails = null;

    await handlePublish(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  test('should return an error if the logged-in user is not the author', async () => {
    prismaMock.post.updateMany.mockResolvedValue({ count: 0 });

    await handlePublish(req, res);

    expect(prismaMock.post.updateMany).toHaveBeenCalledWith({
      where: { id: 123, authorId: 456 },
      data: { published: true },
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Post not found' });
  });
});
