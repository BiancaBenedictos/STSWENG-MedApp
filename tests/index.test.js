const router = require('../routes/routes');

const useSpy = jest.fn();
const listenSpy = jest.fn();

jest.doMock('express', () => {
    return () => ({
      use: useSpy,
      listen: listenSpy,
    })
});

describe('should test server configuration', () => {
    test('use router', () => {
      require('../index');
      expect(useSpy).toHaveBeenCalledWith(router);
    });
  
    test('should call listen fn', () => {
      require('../index');
      expect(listenSpy).toHaveBeenCalled();
    });
});