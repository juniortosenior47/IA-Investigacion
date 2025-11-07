import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import { IdcsService } from '../src/idcs/idcs.service';
import { RedisService } from '../src/redis/redis.service';

describe('IdcsService', () => {
  let redisStub: Partial<RedisService>;
  let svc: IdcsService;

  beforeEach(() => {
    redisStub = {
      getToken: sinon.stub().resolves(null),
      setToken: sinon.stub().resolves(null)
    } as any;
    svc = new IdcsService(redisStub as RedisService);
  });

  it('should fetch client token and store in redis', async () => {
    const axiosPost = sinon.stub(axios, 'post').resolves({ data: { access_token: 'abc', expires_in: 3600 } });
    const res = await svc.fetchClientToken('my-app');
    expect(res.access_token).to.equal('abc');
    axiosPost.restore();
  });
});