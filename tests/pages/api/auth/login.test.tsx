import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import handleLogin from '../../../../pages/api/auth/login';
jest.mock('bcrypt');
jest.mock('jose');

// Mock the dependencies
jest.mock("../../../../lib/prisma", () => ({
  user: {
    findFirst: jest.fn(),
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

describe('handleLogin', () => {
  let req: any;
  let res: any;
  let prismaMock: any;
  let bcryptCompareMock: jest.Mock;
  let signJWTMock: jest.Mock;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    };
    res = {
      statusCode: 0,
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    prismaMock = require("../../../../lib/prisma");
    bcryptCompareMock = bcrypt.compare as jest.Mock;
    signJWTMock = SignJWT as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return user details and token on successful login', async () => {
    const mockUser = {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      id: 123,
      passwordHash: 'hashedpassword',
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    bcryptCompareMock.mockResolvedValue(true);
    signJWTMock.mockReturnValue({
      setProtectedHeader: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue('mockedtoken'),
    });

    await handleLogin(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(bcryptCompareMock).toHaveBeenCalledWith(
      'testpassword',
      'hashedpassword'
    );
    const { passwordHash, ...userWithoutPassword } = mockUser;
    expect(signJWTMock).toHaveBeenCalledWith({ ...userWithoutPassword });
    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    );
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ ...userWithoutPassword, token: 'mockedtoken' })
    );
  });

  test('should return error message on non existant username', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);
    bcryptCompareMock.mockResolvedValue(false);

    await handleLogin(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(bcryptCompareMock).toBeCalledTimes(0);
    expect(res.statusCode).toBe(401);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: 'invalid username or password' })
    );
  });

  test('should return error message on wrong password', async () => {
    const mockUser = {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      id: 123,
      passwordHash: 'hashedpassword',
    };

    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    bcryptCompareMock.mockResolvedValue(false);

    await handleLogin(req, res);

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(bcryptCompareMock).toHaveBeenCalledWith(
      'testpassword','hashedpassword');
    expect(res.statusCode).toBe(401);
    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: 'invalid username or password' })
    );
  });
});
