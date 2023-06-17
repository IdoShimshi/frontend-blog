import handlePost from "../../../../pages/api/post";

jest.mock("../../../../lib/prisma", () => ({
  post: {
    create: jest.fn(),
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

describe('handlePost', () => {
  let req: any;
  let res: any;
  let prismaMock: any;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        title: 'Test Title',
        content: 'Test Content',
        loginDetails: {
          email: 'test@example.com',
        },
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

  test('should create a new post when login details are provided', async () => {
    const mockResult = {
      id: 123,
      title: 'Test Title',
      content: 'Test Content',
      author: {
        email: 'test@example.com',
      },
    };

    prismaMock.post.create.mockResolvedValue(mockResult);

    await handlePost(req, res);

    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Title',
        content: 'Test Content',
        author: { connect: { email: 'test@example.com' } },
      },
    });
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  test('should return an unauthorized message if login details are not provided', async () => {
    req.body.loginDetails = undefined;

    await handlePost(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});
