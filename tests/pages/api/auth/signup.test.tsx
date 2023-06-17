import bcrypt from 'bcrypt';
import handleSignup from '../../../../pages/api/auth/signup';

jest.mock('bcrypt');
jest.mock("../../../../lib/prisma", () => ({
  user: {
    findFirst: jest.fn(),
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

describe('handleSignup', () => {
  let req: any;
  let res: any;
  let prismaMock: any;
  let bcryptHashMock: jest.Mock;
  let bcryptCompareMock: jest.Mock;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        name: 'Test User',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    prismaMock = require("../../../../lib/prisma");
    bcryptHashMock = bcrypt.hash as jest.Mock;
    bcryptCompareMock = bcrypt.compare as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should create a new user on successful signup', async () => {
    prismaMock.user.findFirst
      .mockResolvedValueOnce(null) // No user with the same username
      .mockResolvedValueOnce(null); // No user with the same email

    bcryptHashMock.mockResolvedValue('hashedpassword');
    bcryptCompareMock.mockResolvedValue(true);

    prismaMock.user.create.mockResolvedValue({
      id: 123,
      passwordHash: 'hashedpassword',
    });

    await handleSignup(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(2);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(bcryptHashMock).toHaveBeenCalledWith('testpassword', 10);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({});
  });

  test('should return an error if user with the same username already exists', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: 456,
      username: 'testuser',
    });

    await handleSignup(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User with this username already exists',
    });
  });

  test('should return an error if user with the same email already exists', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: 789,
      email: 'test@example.com',
    });

    await handleSignup(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(2);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User with this email already exists',
    });
  });

  test('should return an error if signup fails', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null);
    prismaMock.user.findFirst.mockResolvedValueOnce(null);
    bcryptHashMock.mockResolvedValue('hashedpassword');

    prismaMock.user.create.mockResolvedValue({
      id: 123,
      passwordHash: 'wronghash',
    });

    await handleSignup(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledTimes(2);
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
    expect(bcryptHashMock).toHaveBeenCalledWith('testpassword', 10);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        passwordHash: 'hashedpassword',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Sign up failed',
    });
  });
});
