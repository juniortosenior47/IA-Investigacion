import { expect } from 'chai';
import sinon from 'sinon';
import { AuthController } from '../../src/auth/auth.controller';
import { IdcsService } from '../../src/idcs/idcs.service';

describe('AuthController', () => {
  let controller: AuthController;
  let idcsService: sinon.SinonStubbedInstance<IdcsService>;

  beforeEach(() => {
    idcsService = sinon.createStubInstance(IdcsService);
    controller = new AuthController(idcsService as any);
  });

  afterEach(() => sinon.restore());

  it('should return cached token data when source is cache', async () => {
    const mockResult = { access_token: 'abc123', expires_in: 3600, source: 'cache' };
    idcsService.getTokenForApp.resolves(mockResult);

    const result = await controller.getToken('myApp');
    expect(result).to.deep.equal(mockResult);
    expect(idcsService.getTokenForApp.calledOnceWith('myApp')).to.be.true;
  });

  it('should return idcs token data when source is idcs', async () => {
    const mockResult = { access_token: 'def456', expires_in: 3600, source: 'idcs' };
    idcsService.getTokenForApp.resolves(mockResult);

    const result = await controller.getToken('anotherApp');
    expect(result).to.deep.equal(mockResult);
    expect(idcsService.getTokenForApp.calledOnceWith('anotherApp')).to.be.true;
  });
});
