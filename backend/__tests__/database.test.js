const mongoose = require('mongoose');
const connectDB = require('../database');

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    close: jest.fn(),
  },
}));

describe('Database Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to MongoDB successfully', async () => {
    const mockConnection = { connection: { host: 'localhost' } };
    mongoose.connect.mockResolvedValue(mockConnection);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(
      expect.stringContaining('consent-quest')
    );
  });

  it('should handle connection errors', async () => {
    const errorMessage = 'Connection failed';
    mongoose.connect.mockRejectedValue(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith('Error connecting to MongoDB:', errorMessage);
    expect(exitSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should set up connection event handlers', async () => {
    mongoose.connect.mockResolvedValue({ connection: { host: 'localhost' } });

    await connectDB();

    expect(mongoose.connection.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mongoose.connection.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
  });
});